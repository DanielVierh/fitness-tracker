import { classify_training_for_comparison } from "./training_classification.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 7;
const CARDIO_WEEKLY_TARGET_MINUTES = 150;
const STRENGTH_WEEKLY_TARGET_SESSIONS = 2;
const FOCUS_THRESHOLD = 15;

const numberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 0,
});

function parse_training_date(value) {
  const parts = String(value || "")
    .split(".")
    .map(Number);
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  if (![day, month, year].every(Number.isInteger)) return null;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parse_duration_minutes(duration) {
  if (typeof duration !== "string") return 0;
  const parts = duration.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return 0;

  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function build_category_result(stats, weeklyTarget) {
  const recency =
    stats.daysSince === null
      ? 0
      : clamp(1 - stats.daysSince / WINDOW_DAYS, 0, 1);
  const volume = clamp(stats.weekValue / weeklyTarget, 0, 1);

  return {
    score: Math.round(((recency + volume) / 2) * 100),
    daysSince: stats.daysSince,
    weekValue: stats.weekValue,
    weeklyTarget,
    isFocus: false,
  };
}

//* ANCHOR - Balance between Cardio and Strength
//* Score = Mittel aus Aktualität (Tage seit dem letzten Training) und
//* Wochenumfang (Cardio-Minuten bzw. Krafteinheiten der letzten 7 Tage).
export function compute_training_balance(trainings, today = new Date()) {
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const stats = {
    cardio: { daysSince: null, weekValue: 0 },
    strength: { daysSince: null, weekValue: 0 },
  };

  (Array.isArray(trainings) ? trainings : []).forEach((training) => {
    const trainingType = classify_training_for_comparison(training);
    const category =
      trainingType === "cardio"
        ? "cardio"
        : trainingType === "strength" || trainingType === "mixed"
          ? "strength"
          : null;
    if (!category) return;

    const trainingDate = parse_training_date(training.training_date);
    if (!trainingDate) return;

    const daysSince = Math.round((todayStart - trainingDate) / DAY_MS);
    if (daysSince < 0) return;

    const entry = stats[category];
    if (entry.daysSince === null || daysSince < entry.daysSince) {
      entry.daysSince = daysSince;
    }
    if (daysSince < WINDOW_DAYS) {
      entry.weekValue +=
        category === "cardio" ? parse_duration_minutes(training.duration) : 1;
    }
  });

  const result = {
    cardio: build_category_result(stats.cardio, CARDIO_WEEKLY_TARGET_MINUTES),
    strength: build_category_result(
      stats.strength,
      STRENGTH_WEEKLY_TARGET_SESSIONS,
    ),
  };

  const scoreDiff = result.strength.score - result.cardio.score;
  if (scoreDiff >= FOCUS_THRESHOLD) result.cardio.isFocus = true;
  if (scoreDiff <= -FOCUS_THRESHOLD) result.strength.isFocus = true;

  return result;
}

function format_days_since(daysSince) {
  if (daysSince === 0) return "heute";
  if (daysSince === 1) return "gestern";
  return `vor ${daysSince} Tagen`;
}

function build_hint(category, data) {
  if (data.daysSince === null) {
    return `Noch kein ${category.label} erfasst.`;
  }

  const weekValue = numberFormatter.format(Math.round(data.weekValue));
  const weekText = `${weekValue} von ${data.weeklyTarget} ${category.unit} diese Woche`;
  const lead = data.isFocus
    ? "Hier liegt dein Fokus"
    : "Im Rhythmus";
  return `${lead}: zuletzt ${format_days_since(data.daysSince)}, ${weekText}.`;
}

//* ANCHOR - Ampelfarben: ab 70 % grün, ab 40 % gelb, darunter rot
function traffic_light_level(score) {
  if (score >= 70) return "good";
  if (score >= 40) return "warning";
  return "danger";
}

function build_card_markup(title, score, hint, isFocus) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const level = traffic_light_level(score);

  return `
    <h3 class="training-dashboard__title">${title}</h3>
    <div class="training-dashboard__ring training-dashboard__ring--${level}">
      <svg viewBox="0 0 120 120" role="img" aria-label="${title}: ${score} Prozent">
        <circle class="training-dashboard__track" cx="60" cy="60" r="${radius}" />
        <circle
          class="training-dashboard__progress"
          cx="60"
          cy="60"
          r="${radius}"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${offset.toFixed(2)}"
        />
      </svg>
      <span class="training-dashboard__value"><span class="training-dashboard__number">${score}</span><small>%</small></span>
    </div>
    <p class="training-dashboard__hint${isFocus ? " is-focus" : ""}">${hint}</p>
  `;
}

//* ANCHOR - Zahl zählt von 0 auf den Score hoch (bei reduzierter Bewegung sofort)
function animate_count_up(element, target) {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!element || reduceMotion || target === 0) return;

  const duration = 1000;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  element.textContent = 0;
  requestAnimationFrame(step);
}

export function render_training_dashboard(save_Object, today = new Date()) {
  const cardioContainer = document.getElementById("dashboard_cardio");
  const strengthContainer = document.getElementById("dashboard_strength");
  if (!cardioContainer || !strengthContainer) return;

  const balance = compute_training_balance(save_Object?.trainings, today);

  const cardioCategory = { label: "Cardio-Training", unit: "Min" };
  const strengthCategory = { label: "Krafttraining", unit: "Einheiten" };

  cardioContainer.innerHTML = build_card_markup(
    "Cardio-Stand",
    balance.cardio.score,
    build_hint(cardioCategory, balance.cardio),
    balance.cardio.isFocus,
  );
  strengthContainer.innerHTML = build_card_markup(
    "Kraft-Stand",
    balance.strength.score,
    build_hint(strengthCategory, balance.strength),
    balance.strength.isFocus,
  );

  animate_count_up(
    cardioContainer.querySelector(".training-dashboard__number"),
    balance.cardio.score,
  );
  animate_count_up(
    strengthContainer.querySelector(".training-dashboard__number"),
    balance.strength.score,
  );
}
