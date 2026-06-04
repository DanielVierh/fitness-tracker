import { backup } from "./backup.js";
import { restTimer } from "./rest_timer.js";
import { splitVal } from "./functions.js";
import { rnd_id } from "./functions.js";
import { add_zero } from "./functions.js";
import { numberWithCommas } from "./functions.js";
import { minutesDiff } from "./functions.js";
import { daysDiff } from "./functions.js";
import { calendar } from "./calendar.js";
import { Exercise } from "./Classes/Exercise.js";
import { Training } from "./Classes/Training.js";
import { Modal } from "./Classes/Modal.js";
import { Message } from "./Classes/Message.js";
import { addendum } from "./addendum.js";
import { render_trainings } from "./render_trainings.js";
import { sum_of_weight } from "./sum_of_weight.js";
import { time_between_dates } from "./time_between_days.js";
import { identify_trainingsplace } from "./functions.js";
import { createTable } from "./create_table.js";
import { save_into_storage } from "./functions.js";
import { Mini_Modal } from "./Classes/MiniModal.js";

restTimer();
/////////////////////////////////////
// * Variablen
/////////////////////////////////////
//* ANCHOR - Elemente

const exercise_container = document.getElementById("exercise_container");
const btn_add = document.getElementById("btn_add");
const btn_saveExercise = document.getElementById("btn_saveExercise");
const modal_edit = document.getElementById("modal_edit");
const modal_exercise = document.getElementById("modal_exercise");
const modal_settings = document.getElementById("modal_settings");
const btn_home = document.getElementById("btn_home");
const btn_settings = document.getElementById("btn_settings");
const btn_open_edit = document.getElementById("btn_open_edit");
const modal_close_btn = document.querySelectorAll(".modal_close_btn");
const lbl_trainingsname = document.getElementById("lbl_trainingsname");
const lbl_weight = document.getElementById("lbl_weight");
const lbl_sets = document.getElementById("lbl_sets");
const lbl_repeats = document.getElementById("lbl_repeats");
const lbl_number = document.getElementById("lbl_number");
const lbl_seatsettings = document.getElementById("lbl_seatsettings");
const lbl_muscleselect = document.getElementById("lbl_muscleselect");
const lbl_donesets = document.getElementById("lbl_donesets");
const btn_trackSport = document.getElementById("btn_trackSport");
const lbl_trainingsarea = document.getElementById("lbl_trainingsarea");
const bdy = document.getElementById("bdy");
const btn_finish = document.getElementById("btn_finish");
const btn_show_trainings = document.getElementById("btn_show_trainings");
const modal_trainings = document.getElementById("modal_trainings");
const last_training = document.getElementById("last_training");
const btn_edit = document.getElementById("btn_edit");
const exercise_table = document.getElementById("exercise_table");
const lbl_exerciseRepeats = document.getElementById("lbl_exerciseRepeats");
const lbl_exerciseSets = document.getElementById("lbl_exerciseSets");
const btn_gotoSolvedTrainings = document.getElementById(
  "btn_gotoSolvedTrainings",
);
const change_StatisticYear = document.getElementById("statisticYear_select");
let inpExercise_Name = document.getElementById("inpExercise_Name");
let inpExercise_Weight = document.getElementById("inpExercise_Weight");
let inpExercise_Sets = document.getElementById("inpExercise_Sets");
let inpExercise_Repeats = document.getElementById("inpExercise_Repeats");
let inpExercise_number = document.getElementById("inpExercise_number");
let inpExercise_seatSettings = document.getElementById(
  "inpExercise_seatSettings",
);
let muscle_select = document.getElementById("muscle_select");
let training_Area = document.getElementById("training_Area");
const active_training_sect = document.getElementById("active_training_sect");
const statistics_table = document.getElementById("statistics_table");
const btn_delete_exercise = document.getElementById("btn_delete_exercise");
const btn_open_calendar = document.getElementById("btn_open_calendar");
const modal_calendar = document.getElementById("modal_calendar");
const lbl_solved_sum = document.getElementById("lbl_solved_sum");
const exercise_detail_achievement = document.getElementById(
  "exercise_detail_achievement",
);
const exercise_progress_chart = document.getElementById(
  "exercise_progress_chart",
);

/////////////////////////////////////
//* ANCHOR -  Variablen
/////////////////////////////////////
let training_running = false;
let selected_Exercise;
let is_edit = false;
let calendar_year = undefined;
let advanced_stats_mode = "week";
let challenges_need_save = false;

/////////////////////////////////////
//*  Saveobj
/////////////////////////////////////
let save_Object = {
  training_is_running: false,
  training_start: "",
  exercises: [],
  trainings: [],
  current_training: [],
  training_place_filter: "",
  challenges: [],
};

/////////////////////////////////////
// * ANCHOR - Init
/////////////////////////////////////
window.onload = () => {
  load_local_storage();
  add_years_to_select();
  init_advanced_statistics_controls();
  init_challenge_controls();
  render_challenges();

  setInterval(() => {
    observer();
  }, 1000);
};

/////////////////////////////////////
//* ANCHOR - Load Local Storage
/////////////////////////////////////
function load_local_storage() {
  if (localStorage.getItem("stored_fitness_saveobj") != "") {
    try {
      save_Object = JSON.parse(localStorage.getItem("stored_fitness_saveobj"));
      backup(save_Object);
      addendum(save_Object);
    } catch (error) {
      console.log("Main Error", error);
      save_Object = {
        training_is_running: false,
        training_start: "",
        exercises: [],
        trainings: [],
        current_training: [],
        training_place_filter: "",
        challenges: [],
      };
      backup(save_Object);
      save_into_storage(save_Object);
    }

    ensure_challenge_data_structure();

    try {
      training_running = save_Object.training_is_running;
    } catch (error) {
      console.log("training_running", error);
    }

    try {
      training_place_filter = save_Object.training_place_filter;
    } catch (error) {
      console.log("training_place_filter", error);
    }

    try {
      const last = save_Object.trainings.length - 1;

      const today = new Date();
      const last_trainingsdate_Raw = save_Object.trainings[last].training_date;
      const lastTrainingDay = splitVal(last_trainingsdate_Raw, ".", 0);
      const lastTrainingMonth = splitVal(last_trainingsdate_Raw, ".", 1);
      const lastTrainingYear = splitVal(last_trainingsdate_Raw, ".", 2);
      const lastTrainingDate = new Date(
        `${lastTrainingYear}-${lastTrainingMonth}-${lastTrainingDay}`,
      );
      const time_to_last_training = daysDiff(today, lastTrainingDate);

      if (time_to_last_training > 1) {
        last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration} <br> Zuletzt vor ${time_to_last_training}. Tagen`;
      } else if (time_to_last_training === 0) {
        last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration} <br> Zuletzt: heute`;
      } else {
        last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration} <br> Zuletzt vor ${time_to_last_training}. Tag`;
      }

      //* Colorize day diff to last training
      if (time_to_last_training >= 7) {
        last_training.style.color = "red";
      } else if (time_to_last_training >= 5) {
        last_training.style.color = "orange";
      } else if (time_to_last_training >= 3) {
        last_training.style.color = "yellow";
      } else if (time_to_last_training >= 0) {
        last_training.style.color = "green";
      }
    } catch (error) {
      console.log("last_training", error);
    }

    setTimeout(() => {
      //* Render func
      prepare_render_exercise();
    }, 500);

    try {
      fill_chart();
      render_advanced_statistics();
      render_challenges();
    } catch (error) {
      console.log(error);
    }
  }
  if (save_Object === null) {
    save_Object = {
      training_is_running: false,
      training_start: "",
      exercises: [],
      trainings: [],
      current_training: [],
      training_place_filter: "",
      challenges: [],
    };
    save_into_storage(save_Object);
  }
  console.log("saveobj", save_Object);
}

/////////////////////////////////////
//* ANCHOR - Show selected Trainingsyear
//TODO - The years are currently hard coded in html
/////////////////////////////////////
change_StatisticYear.addEventListener("change", () => {
  const selected_year = change_StatisticYear.value;
  fill_chart(selected_year);
  render_advanced_statistics(selected_year);

  //* Set Data-attr for calendar
  calendar_year = selected_year;
});

/////////////////////////////////////
//* Add dynamic years, wich contains real trainingdata and not just 2023 and 2024
/////////////////////////////////////
function add_years_to_select() {
  const current_time_stamp = new Date();
  const current_Year = current_time_stamp.getFullYear();
  const select = document.getElementById("statisticYear_select");
  let oldest_year = current_Year;
  let latest_year = current_Year;
  try {
    save_Object.trainings.forEach((training) => {
      const year = splitVal(training.training_date, ".", 2);
      if (year < oldest_year) {
        oldest_year = year;
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
  select.innerHTML = "";
  for (let i = oldest_year; i <= current_Year; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    latest_year = i;
    select.appendChild(option);
  }
  change_StatisticYear.value = latest_year;
  fill_chart(latest_year);
  render_advanced_statistics(latest_year);
}

/////////////////////////////////////
//* ANCHOR - Render Chart
/////////////////////////////////////
function fill_chart(selct_year) {
  let current_time_stamp = new Date();
  let current_Year = current_time_stamp.getFullYear();
  const training_counter = document.getElementById("training_counter");
  const chart_legend = document.getElementById("chart_legend");

  if (selct_year !== undefined) {
    current_time_stamp = new Date(`${selct_year}-01-01`);
    current_Year = current_time_stamp.getFullYear();
  }

  const totals = Array(12).fill(0);
  const cardio = Array(12).fill(0);
  const strengthFitti = Array(12).fill(0);
  const strengthHome = Array(12).fill(0);
  const strengthOther = Array(12).fill(0);

  // Gruppiere Trainings nach Datum (Trainingstag) und aggregiere Exercises,
  // damit pro Tag genau 1 Kategorie gezählt wird.
  const byDay = new Map();
  for (let i = 0; i < save_Object.trainings.length; i++) {
    const training = save_Object.trainings[i];
    const solved_Date = training.training_date;
    const solved_year = splitVal(solved_Date, ".", 2);
    if (String(solved_year) !== String(current_Year)) continue;

    if (!byDay.has(solved_Date)) {
      byDay.set(solved_Date, []);
    }
    const existing = byDay.get(solved_Date);
    existing.push(...(training.exercises || []));
  }

  // Klassifiziere Trainingstag → Cardio / Kraft (Fitti/Home)
  byDay.forEach((exercises, dateStr) => {
    const monthStr = splitVal(dateStr, ".", 1);
    const monthIndex = Number(monthStr) - 1;
    if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return;

    totals[monthIndex] += 1;

    // Sonderfall: Kraft-Nachträge (z.B. "Krafttraining (Nachtrag)" oder "Nachtrag - Kraft")
    // haben häufig Gewicht 0, sollen aber je nach Trainingsort als Kraft Home/Fitti gezählt werden.
    const hasStrengthAddendum = exercises.some((e) => {
      if (typeof e?.name !== "string") return false;
      const n = e.name.trim().toLowerCase();
      return n.includes("nachtrag") && n.includes("kraft");
    });
    if (hasStrengthAddendum) {
      // Trainingsort aus den Exercises ableiten
      const place = identify_trainingsplace(exercises);
      if (place === "Fitti") {
        strengthFitti[monthIndex] += 1;
      } else if (place === "Home") {
        strengthHome[monthIndex] += 1;
      } else {
        // Fallback, falls uneindeutig
        const hasFitti = exercises.some(
          (e) => e.trainingsplace === "Fitnessstudio",
        );
        const hasHome = exercises.some(
          (e) => e.trainingsplace === "Heimtraining",
        );
        if (hasFitti && !hasHome) {
          strengthFitti[monthIndex] += 1;
        } else if (hasHome && !hasFitti) {
          strengthHome[monthIndex] += 1;
        } else {
          strengthOther[monthIndex] += 1;
        }
      }
      return;
    }

    const movedWeightInt = sum_of_weight(exercises).weight;
    if (movedWeightInt <= 0) {
      cardio[monthIndex] += 1;
      return;
    }

    const place = identify_trainingsplace(exercises);
    if (place === "Fitti") {
      strengthFitti[monthIndex] += 1;
      return;
    }
    if (place === "Home") {
      strengthHome[monthIndex] += 1;
      return;
    }

    // Fallback falls place undef/sonstiges
    const hasFitti = exercises.some(
      (e) => e.trainingsplace === "Fitnessstudio",
    );
    const hasHome = exercises.some((e) => e.trainingsplace === "Heimtraining");
    if (hasFitti && !hasHome) {
      strengthFitti[monthIndex] += 1;
    } else if (hasHome && !hasFitti) {
      strengthHome[monthIndex] += 1;
    } else {
      strengthOther[monthIndex] += 1;
    }
  });

  const month_arr = totals;
  const month_Descr_arr = [
    "Jan",
    "Feb",
    "Mrz",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];

  //* find max val;
  let max_per_month = 0;
  month_arr.forEach((month) => {
    if (month > max_per_month) {
      max_per_month = month;
    }
  });
  if (max_per_month === 0) {
    max_per_month = 1;
  }

  //* Render Col
  // max = 100% aka 350px
  let left = 2;
  month_arr.forEach((month, index) => {
    const value_in_pixel = (month * 350) / max_per_month;
    const col = `chart_col_${index + 1}`;
    const colEl = document.getElementById(col);
    colEl.style.height = `${value_in_pixel}px`;
    colEl.style.left = `${left}%`;

    colEl.innerHTML = "";
    const label = document.createElement("div");
    label.classList.add("chart__label");
    label.innerHTML = `${month_Descr_arr[index]}<br>${month}`;

    const stack = document.createElement("div");
    stack.classList.add("chart__stack");

    const total = month;
    const segs = [
      { key: "cardio", val: cardio[index], cls: "chart__segment--cardio" },
      {
        key: "home",
        val: strengthHome[index],
        cls: "chart__segment--home",
      },
      {
        key: "fitti",
        val: strengthFitti[index],
        cls: "chart__segment--fitti",
      },
      {
        key: "other",
        val: strengthOther[index],
        cls: "chart__segment--other",
      },
    ];
    if (total > 0) {
      segs.forEach((seg) => {
        if (seg.val <= 0) return;
        const div = document.createElement("div");
        div.classList.add("chart__segment");
        div.classList.add(seg.cls);
        div.style.height = `${(seg.val / total) * 100}%`;
        div.textContent = seg.val;
        stack.appendChild(div);
      });
      colEl.title = `Gesamt: ${total}\nCardio: ${cardio[index]}\nKraft Home: ${strengthHome[index]}\nKraft Fitti: ${strengthFitti[index]}\nKraft Sonstiges: ${strengthOther[index]}`;
    } else {
      colEl.title = `Gesamt: 0`;
    }

    colEl.appendChild(label);
    colEl.appendChild(stack);
    left = left += 8;
  });

  const sum = totals.reduce((acc, v) => acc + v, 0);
  const sumCardio = cardio.reduce((acc, v) => acc + v, 0);
  const sumStrengthFitti = strengthFitti.reduce((acc, v) => acc + v, 0);
  const sumStrengthHome = strengthHome.reduce((acc, v) => acc + v, 0);

  training_counter.innerHTML = `Bereits <span class="training-sum-number">${sum}</span> Trainingstag(e) im Jahr ${current_Year}<br>
    Cardio: <span class="training-sum-number">${sumCardio}</span> &nbsp;|&nbsp;
    Kraft Fitti: <span class="training-sum-number">${sumStrengthFitti}</span> &nbsp;|&nbsp;
    Kraft Home: <span class="training-sum-number">${sumStrengthHome}</span>`;

  if (chart_legend) {
    chart_legend.innerHTML = `
      <div class="chart-legend__item"><span class="chart-legend__swatch chart-legend__swatch--cardio"></span>Cardio</div>
      <div class="chart-legend__item"><span class="chart-legend__swatch chart-legend__swatch--fitti"></span>Kraft Fitti</div>
      <div class="chart-legend__item"><span class="chart-legend__swatch chart-legend__swatch--home"></span>Kraft Home</div>
      <div class="chart-legend__item"><span class="chart-legend__swatch chart-legend__swatch--other"></span>Sonstiges</div>
    `;
  }
}

/////////////////////////////////////
//* ANCHOR - Advanced Statistics
/////////////////////////////////////

function init_advanced_statistics_controls() {
  const toggle = document.getElementById("advanced_stats_toggle");
  if (!toggle || toggle.dataset.bound === "true") return;

  toggle.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-mode]");
    if (!button) return;

    const mode = button.dataset.mode;
    advanced_stats_mode = mode === "month" ? "month" : "week";
    set_advanced_stats_toggle_state();
    render_advanced_statistics(change_StatisticYear.value);
  });

  toggle.dataset.bound = "true";
  set_advanced_stats_toggle_state();
}

function set_advanced_stats_toggle_state() {
  const buttons = document.querySelectorAll(".advanced-stats__toggle-btn");
  buttons.forEach((button) => {
    if (!(button instanceof HTMLElement)) return;
    if (button.dataset.mode === advanced_stats_mode) {
      button.classList.add("is-active");
    } else {
      button.classList.remove("is-active");
    }
  });
}

function render_advanced_statistics(selected_year) {
  const section = document.getElementById("advanced_stats");
  if (!section) return;

  const nowYear = new Date().getFullYear();
  const parsed = Number(selected_year || change_StatisticYear.value || nowYear);
  const targetYear = Number.isFinite(parsed) ? parsed : nowYear;

  const data = collect_advanced_statistics_data(targetYear);
  set_advanced_stats_toggle_state();

  const yearLabel = document.getElementById("advanced_stats_year");
  if (yearLabel) {
    yearLabel.textContent = `(${targetYear})`;
  }

  const avgGapLabel = document.getElementById("stat_avg_gap");
  const maxGapLabel = document.getElementById("stat_max_gap");
  const weekAvgLabel = document.getElementById("stat_week_avg");
  const consistencyLabel = document.getElementById("stat_consistency");
  const trendDirectionLabel = document.getElementById("stat_trend_direction");
  const trendDeltaLabel = document.getElementById("stat_trend_delta");
  const avgGapDaysLabel = document.getElementById("stat_avg_gap_days");
  const maxGapDaysLabel = document.getElementById("stat_max_gap_days");
  const trainingsWeekLabel = document.getElementById("stat_trainings_week");
  const consistencyScoreLabel = document.getElementById(
    "stat_consistency_score",
  );
  const emptyLabel = document.getElementById("advanced_stats_empty");

  if (avgGapLabel) {
    avgGapLabel.textContent = `${data.dominantWeekday} ${format_number(data.dominantWeekdayShare, 1)} %`;
  }
  if (maxGapLabel) {
    maxGapLabel.textContent = `${format_number(data.weekendShare, 1)} % / ${format_number(data.weekdayShare, 1)} %`;
  }
  if (weekAvgLabel) {
    weekAvgLabel.textContent = `${numberWithCommas(Math.round(data.latestRolling4WeekVolume))} kg`;
  }
  if (consistencyLabel) {
    consistencyLabel.textContent = `${data.overRepresentedMuscleLabel} | ${data.underRepresentedMuscleLabel}`;
  }
  if (trendDirectionLabel) {
    trendDirectionLabel.textContent = `${format_number(data.cardioMinutesPerWeek, 1)} Min`;
  }
  if (trendDeltaLabel) {
    trendDeltaLabel.textContent = format_number(data.sessionsPer30Days, 1);
  }
  if (avgGapDaysLabel) {
    avgGapDaysLabel.textContent = `${format_number(data.avgGapDays, 1)} Tage`;
  }
  if (maxGapDaysLabel) {
    maxGapDaysLabel.textContent = `${data.maxGapDays} Tage`;
  }
  if (trainingsWeekLabel) {
    trainingsWeekLabel.textContent = format_number(data.avgTrainingsPerWeek, 2);
  }
  if (consistencyScoreLabel) {
    consistencyScoreLabel.textContent = `${format_number(data.consistencyScore, 1)} %`;
  }

  const activeSeries =
    advanced_stats_mode === "month"
      ? data.monthlyWeightSeries
      : data.weeklyWeightSeries;

  const trendChart = document.getElementById("advanced_trend_chart");
  const gapChart = document.getElementById("advanced_gap_chart");
  const rollingChart = document.getElementById("advanced_rolling_chart");
  const muscleChart = document.getElementById("advanced_muscle_chart");

  if (data.trainingDays < 2) {
    if (emptyLabel) emptyLabel.hidden = false;
  } else if (emptyLabel) {
    emptyLabel.hidden = true;
  }

  render_weight_trend_chart(trendChart, activeSeries, advanced_stats_mode);
  render_gap_distribution_chart(gapChart, data.gapBuckets);
  render_rolling_average_chart(rollingChart, data.rolling4WeekSeries);
  render_muscle_balance_chart(
    muscleChart,
    data.muscleDistribution,
    data.muscleTargetShare,
  );
}

function collect_advanced_statistics_data(targetYear) {
  const dayMap = new Map();
  let totalTrainingSessions = 0;
  const weekdaySessionCounts = Array(7).fill(0);
  let weekendSessions = 0;
  let weekdaySessions = 0;
  const cardioMinutesByWeekKey = new Map();
  const muscleLoadMap = new Map();
  let observedMinDate = null;
  let observedMaxDate = null;

  for (let i = 0; i < save_Object.trainings.length; i++) {
    const training = save_Object.trainings[i];
    if (!training || typeof training.training_date !== "string") continue;

    const year = Number(splitVal(training.training_date, ".", 2));
    if (year !== Number(targetYear)) continue;

    const dateObj = parse_training_date(training.training_date);
    if (!dateObj) continue;

    if (observedMinDate === null || dateObj < observedMinDate) {
      observedMinDate = dateObj;
    }
    if (observedMaxDate === null || dateObj > observedMaxDate) {
      observedMaxDate = dateObj;
    }

    const dayKey = to_day_key(dateObj);
    if (!dayMap.has(dayKey)) {
      dayMap.set(dayKey, {
        date: dateObj,
        exercises: [],
        weight: 0,
        trainingCount: 0,
      });
    }

    const entry = dayMap.get(dayKey);
    const exercises = Array.isArray(training.exercises)
      ? training.exercises
      : [];
    const sessionDurationMinutes = parse_duration_to_minutes(training.duration);
    const weekdayIndex = get_weekday_index(dateObj);

    entry.exercises.push(...exercises);
    entry.weight += safe_sum_of_weight(exercises);
    entry.trainingCount += 1;
    totalTrainingSessions += 1;

    weekdaySessionCounts[weekdayIndex] += 1;
    if (is_weekend(dateObj)) {
      weekendSessions += 1;
    } else {
      weekdaySessions += 1;
    }

    if (is_cardio_session(training) && sessionDurationMinutes > 0) {
      const isoInfo = get_iso_week_info(dateObj);
      if (isoInfo.year === Number(targetYear)) {
        const key = `W${add_zero(isoInfo.week)}`;
        const currentCardio = cardioMinutesByWeekKey.get(key) || 0;
        cardioMinutesByWeekKey.set(key, currentCardio + sessionDurationMinutes);
      }
    }

    exercises.forEach((exercise) => {
      const muscle =
        typeof exercise?.musclegroup === "string"
          ? exercise.musclegroup.trim()
          : "";
      if (!muscle || muscle === "-") return;

      const load = safe_exercise_load(exercise);
      if (load <= 0) return;

      const currentLoad = muscleLoadMap.get(muscle) || 0;
      muscleLoadMap.set(muscle, currentLoad + load);
    });
  }

  const days = Array.from(dayMap.values()).sort((a, b) => a.date - b.date);
  const gaps = [];
  for (let i = 1; i < days.length; i++) {
    gaps.push(daysDiff(days[i].date, days[i - 1].date));
  }

  const avgGapDays =
    gaps.length > 0 ? gaps.reduce((acc, val) => acc + val, 0) / gaps.length : 0;
  const maxGapDays = gaps.length > 0 ? Math.max(...gaps) : 0;

  const weeksInYear = get_iso_weeks_in_year(targetYear);
  const weekSeries = [];
  const weekKeyToIndex = new Map();
  for (let week = 1; week <= weeksInYear; week++) {
    const key = `W${add_zero(week)}`;
    weekKeyToIndex.set(key, week - 1);
    weekSeries.push({
      label: `KW ${week}`,
      shortLabel: `${week}`,
      value: 0,
    });
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mrz",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];
  const monthSeries = monthNames.map((name) => ({
    label: name,
    shortLabel: name,
    value: 0,
  }));

  const activeWeekKeys = new Set();
  days.forEach((day) => {
    const isoInfo = get_iso_week_info(day.date);
    if (isoInfo.year === Number(targetYear)) {
      const key = `W${add_zero(isoInfo.week)}`;
      const index = weekKeyToIndex.get(key);
      if (index !== undefined) {
        weekSeries[index].value += day.weight;
        activeWeekKeys.add(key);
      }
    }

    const monthIndex = day.date.getMonth();
    monthSeries[monthIndex].value += day.weight;
  });

  const observedWeeks = get_observed_span_weeks(days, targetYear);
  const avgTrainingsPerWeek =
    observedWeeks > 0 ? totalTrainingSessions / observedWeeks : 0;
  const consistencyScore =
    weeksInYear > 0 ? (activeWeekKeys.size / weeksInYear) * 100 : 0;
  const totalCardioMinutes = Array.from(cardioMinutesByWeekKey.values()).reduce(
    (acc, val) => acc + val,
    0,
  );
  const cardioMinutesPerWeek =
    observedWeeks > 0 ? totalCardioMinutes / observedWeeks : 0;

  let observedDays = 0;
  if (observedMinDate && observedMaxDate) {
    observedDays = daysDiff(observedMaxDate, observedMinDate) + 1;
  }
  const sessionsPer30Days =
    observedDays > 0 ? (totalTrainingSessions / observedDays) * 30 : 0;

  const dominantWeekdayCount = Math.max(...weekdaySessionCounts, 0);
  const dominantWeekdayIndex = weekdaySessionCounts.findIndex(
    (count) => count === dominantWeekdayCount,
  );
  const dominantWeekday = get_weekday_name(dominantWeekdayIndex);
  const dominantWeekdayShare =
    totalTrainingSessions > 0
      ? (dominantWeekdayCount / totalTrainingSessions) * 100
      : 0;

  const weekendShare =
    totalTrainingSessions > 0
      ? (weekendSessions / totalTrainingSessions) * 100
      : 0;
  const weekdayShare =
    totalTrainingSessions > 0
      ? (weekdaySessions / totalTrainingSessions) * 100
      : 0;

  const rolling4WeekSeries = build_rolling_average_series(weekSeries, 4);
  const rollingReferenceIndex = get_rolling_reference_index(
    targetYear,
    rolling4WeekSeries,
    activeWeekKeys,
    weekKeyToIndex,
  );
  const latestRolling4WeekVolume =
    rollingReferenceIndex >= 0
      ? rolling4WeekSeries[rollingReferenceIndex].value
      : 0;

  const muscleDistribution = build_muscle_distribution(muscleLoadMap);
  const muscleTargetShare =
    muscleDistribution.length > 0 ? 100 / muscleDistribution.length : 0;
  const overRepresentedMuscle = muscleDistribution.reduce(
    (acc, item) =>
      item.share - muscleTargetShare > acc.delta
        ? { label: item.label, delta: item.share - muscleTargetShare }
        : acc,
    { label: "-", delta: 0 },
  );
  const underRepresentedMuscle = muscleDistribution.reduce(
    (acc, item) =>
      muscleTargetShare - item.share > acc.delta
        ? { label: item.label, delta: muscleTargetShare - item.share }
        : acc,
    { label: "-", delta: 0 },
  );

  const overRepresentedMuscleLabel =
    overRepresentedMuscle.label === "-"
      ? "Ausgeglichen"
      : `+ ${overRepresentedMuscle.label}`;
  const underRepresentedMuscleLabel =
    underRepresentedMuscle.label === "-"
      ? "Ausgeglichen"
      : `- ${underRepresentedMuscle.label}`;

  return {
    trainingDays: days.length,
    avgGapDays,
    maxGapDays,
    avgTrainingsPerWeek,
    consistencyScore,
    weeklyWeightSeries: weekSeries,
    monthlyWeightSeries: monthSeries,
    gapBuckets: build_gap_buckets(gaps),
    dominantWeekday,
    dominantWeekdayShare,
    weekendShare,
    weekdayShare,
    rolling4WeekSeries,
    latestRolling4WeekVolume,
    muscleDistribution,
    muscleTargetShare,
    overRepresentedMuscleLabel,
    underRepresentedMuscleLabel,
    cardioMinutesPerWeek,
    sessionsPer30Days,
  };
}

function safe_sum_of_weight(exercises) {
  if (!Array.isArray(exercises) || exercises.length === 0) return 0;

  const utilityVal = Number(sum_of_weight(exercises).weight);
  if (Number.isFinite(utilityVal)) return utilityVal;

  let weight = 0;
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i] || {};
    const exWeight = Number(exercise.weight) || 0;
    const solvedSets = Number(exercise.solved_sets) || 0;
    const repeats = Number(exercise.repeats) || 0;
    weight += exWeight * solvedSets * repeats;
  }
  return Number.isFinite(weight) ? weight : 0;
}

function parse_training_date(dateStr) {
  const day = Number(splitVal(dateStr, ".", 0));
  const month = Number(splitVal(dateStr, ".", 1));
  const year = Number(splitVal(dateStr, ".", 2));
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function to_day_key(dateObj) {
  return `${dateObj.getFullYear()}-${add_zero(dateObj.getMonth() + 1)}-${add_zero(dateObj.getDate())}`;
}

function get_iso_week_info(date) {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const weekday = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - weekday);
  const isoYear = utcDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);
  return { year: isoYear, week };
}

function get_iso_weeks_in_year(year) {
  const dec28 = new Date(Date.UTC(year, 11, 28));
  return get_iso_week_info(dec28).week;
}

function get_observed_span_weeks(days, targetYear) {
  if (!Array.isArray(days) || days.length === 0) {
    return 0;
  }

  const sortedDays = [...days].sort((a, b) => a.date - b.date);
  const first = sortedDays[0].date;
  const last = sortedDays[sortedDays.length - 1].date;
  const millisDiff = Math.max(0, last.getTime() - first.getTime());
  const daysSpan = Math.floor(millisDiff / (1000 * 60 * 60 * 24)) + 1;
  const spanWeeks = Math.max(1, Math.ceil(daysSpan / 7));

  const now = new Date();
  if (Number(targetYear) === now.getFullYear()) {
    const elapsedWeeksThisYear = Math.max(1, get_iso_week_info(now).week);
    return Math.min(spanWeeks, elapsedWeeksThisYear);
  }

  return spanWeeks;
}

function get_weekday_index(dateObj) {
  const day = dateObj.getDay();
  return day === 0 ? 6 : day - 1;
}

function get_weekday_name(weekdayIndex) {
  const names = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];
  return names[weekdayIndex] || "-";
}

function is_weekend(dateObj) {
  const day = dateObj.getDay();
  return day === 0 || day === 6;
}

function parse_duration_to_minutes(duration) {
  if (typeof duration !== "string") return 0;
  const parts = duration.split(":");
  if (parts.length < 2) return 0;

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return Math.max(0, hours * 60 + minutes);
}

function is_cardio_session(training) {
  const exercises = Array.isArray(training?.exercises)
    ? training.exercises
    : [];
  if (exercises.length === 0) return false;

  const hasStrengthAddendum = exercises.some((exercise) => {
    if (typeof exercise?.name !== "string") return false;
    const name = exercise.name.trim().toLowerCase();
    return name.includes("nachtrag") && name.includes("kraft");
  });
  if (hasStrengthAddendum) return false;

  const cardioNamePatterns = [
    /\bcardio\b/i,
    /\bausdauer\b/i,
    /\bjoggen\b/i,
    /\bjogging\b/i,
    /\blaufband\b/i,
    /\bwalking\b/i,
    /\bspinning\b/i,
    /\bergometer\b/i,
    /\bcrosstrainer\b/i,
    /\bstepper\b/i,
    /\bschwimmen\b/i,
    /\bzumba\b/i,
    /\bhiit\b/i,
  ];

  const isExplicitCardioExercise = (exercise) => {
    const name = String(exercise?.name || "").trim();
    if (!name) return false;
    return cardioNamePatterns.some((pattern) => pattern.test(name));
  };

  const hasExplicitCardioExercise = exercises.some((exercise) =>
    isExplicitCardioExercise(exercise),
  );
  const allExercisesExplicitCardio = exercises.every((exercise) =>
    isExplicitCardioExercise(exercise),
  );

  const movedWeight = safe_sum_of_weight(exercises);
  if (movedWeight > 0) {
    // Bei bewegtem Gewicht nur dann Cardio, wenn die Session rein aus
    // expliziten Cardio-Übungen besteht.
    return hasExplicitCardioExercise && allExercisesExplicitCardio;
  }

  if (hasExplicitCardioExercise) return true;

  // Gleiche Grundlogik wie im Jahres-Chart: nur Sessions ohne bewegtes Gewicht
  // gelten als Cardio-Session.
  return movedWeight <= 0;
}

function safe_exercise_load(exercise) {
  const weight = Number(exercise?.weight) || 0;
  const solvedSets = Number(exercise?.solved_sets) || 0;
  const repeats = Number(exercise?.repeats) || 0;
  const weightedLoad = weight * solvedSets * repeats;
  if (weightedLoad > 0) return weightedLoad;
  return solvedSets * repeats;
}

function build_rolling_average_series(series, windowSize) {
  if (!Array.isArray(series) || series.length === 0) return [];

  const result = [];
  for (let i = 0; i < series.length; i++) {
    const from = Math.max(0, i - (windowSize - 1));
    const chunk = series.slice(from, i + 1);
    const sum = chunk.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    result.push({
      label: series[i].label,
      shortLabel: series[i].shortLabel,
      value: chunk.length > 0 ? sum / chunk.length : 0,
    });
  }

  return result;
}

function get_rolling_reference_index(
  targetYear,
  rollingSeries,
  activeWeekKeys,
  weekKeyToIndex,
) {
  if (!Array.isArray(rollingSeries) || rollingSeries.length === 0) {
    return -1;
  }

  const now = new Date();
  if (Number(targetYear) === now.getFullYear()) {
    const currentIsoWeek = Math.max(1, get_iso_week_info(now).week);
    return Math.min(currentIsoWeek, rollingSeries.length) - 1;
  }

  const activeIndexes = Array.from(activeWeekKeys || [])
    .map((key) => weekKeyToIndex.get(key))
    .filter((index) => Number.isInteger(index) && index >= 0);

  if (activeIndexes.length > 0) {
    return Math.max(...activeIndexes);
  }

  return rollingSeries.length - 1;
}

function build_muscle_distribution(muscleLoadMap) {
  const entries = Array.from(muscleLoadMap.entries());
  const totalLoad = entries.reduce((acc, [, value]) => acc + value, 0);
  if (totalLoad <= 0) return [];

  return entries
    .map(([label, value]) => ({
      label,
      value,
      share: (value / totalLoad) * 100,
    }))
    .sort((a, b) => b.share - a.share);
}

function build_gap_buckets(gaps) {
  const buckets = [
    { label: "0-1 Tage", value: 0 },
    { label: "2-3 Tage", value: 0 },
    { label: "4-6 Tage", value: 0 },
    { label: "7+ Tage", value: 0 },
  ];

  gaps.forEach((gap) => {
    if (gap <= 1) {
      buckets[0].value += 1;
    } else if (gap <= 3) {
      buckets[1].value += 1;
    } else if (gap <= 6) {
      buckets[2].value += 1;
    } else {
      buckets[3].value += 1;
    }
  });

  return buckets;
}

function calculate_series_trend(series) {
  if (!Array.isArray(series) || series.length === 0) {
    return {
      directionLabel: "Keine Daten",
      deltaLabel: "-",
    };
  }

  const windowSize = Math.min(3, Math.max(1, Math.floor(series.length / 3)));
  const firstValues = series
    .slice(0, windowSize)
    .map((item) => Number(item.value) || 0);
  const lastValues = series
    .slice(series.length - windowSize)
    .map((item) => Number(item.value) || 0);
  const start =
    firstValues.reduce((acc, val) => acc + val, 0) / firstValues.length;
  const end = lastValues.reduce((acc, val) => acc + val, 0) / lastValues.length;
  const diff = end - start;

  let directionLabel = "Stabil";
  if (diff > 0) directionLabel = "Steigend";
  if (diff < 0) directionLabel = "Fallend";

  if (start <= 0 && end > 0) {
    return {
      directionLabel,
      deltaLabel: `+${format_number(end, 0)} kg Volumen`,
    };
  }

  if (start === 0 && end === 0) {
    return {
      directionLabel,
      deltaLabel: "0 %",
    };
  }

  const percent = (diff / start) * 100;
  const prefix = percent > 0 ? "+" : "";
  return {
    directionLabel,
    deltaLabel: `${prefix}${format_number(percent, 1)} %`,
  };
}

function format_number(value, decimals) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return number.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function render_weight_trend_chart(svgElement, series, mode) {
  if (!(svgElement instanceof SVGElement)) return;
  svgElement.innerHTML = "";

  const width = 960;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 46, left: 48 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const values = series.map((item) => Number(item.value) || 0);
  const maxVal = Math.max(...values, 0);
  const safeMax = maxVal <= 0 ? 1 : maxVal;

  const ns = "http://www.w3.org/2000/svg";

  const defs = document.createElementNS(ns, "defs");
  const gradient = document.createElementNS(ns, "linearGradient");
  gradient.setAttribute("id", "trendGradient");
  gradient.setAttribute("x1", "0%");
  gradient.setAttribute("x2", "0%");
  gradient.setAttribute("y1", "0%");
  gradient.setAttribute("y2", "100%");

  const stopTop = document.createElementNS(ns, "stop");
  stopTop.setAttribute("offset", "0%");
  stopTop.setAttribute("stop-color", "#21f3ff");
  stopTop.setAttribute("stop-opacity", "0.55");

  const stopBottom = document.createElementNS(ns, "stop");
  stopBottom.setAttribute("offset", "100%");
  stopBottom.setAttribute("stop-color", "#21f3ff");
  stopBottom.setAttribute("stop-opacity", "0.05");

  gradient.appendChild(stopTop);
  gradient.appendChild(stopBottom);
  defs.appendChild(gradient);
  svgElement.appendChild(defs);

  const horizontalLines = 4;
  for (let i = 0; i <= horizontalLines; i++) {
    const y = padding.top + (plotHeight / horizontalLines) * i;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", String(padding.left));
    line.setAttribute("x2", String(width - padding.right));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "rgba(255,255,255,0.12)");
    line.setAttribute("stroke-width", "1");
    svgElement.appendChild(line);
  }

  const points = series.map((item, index) => {
    const x =
      padding.left + (index / Math.max(1, series.length - 1)) * plotWidth;
    const normalized = (Number(item.value) || 0) / safeMax;
    const y = padding.top + (1 - normalized) * plotHeight;
    return {
      x,
      y,
      value: Number(item.value) || 0,
      label: item.label,
      shortLabel: item.shortLabel,
    };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L${padding.left + plotWidth},${padding.top + plotHeight} L${padding.left},${padding.top + plotHeight} Z`;

  const area = document.createElementNS(ns, "path");
  area.setAttribute("d", areaPath);
  area.setAttribute("fill", "url(#trendGradient)");
  svgElement.appendChild(area);

  const line = document.createElementNS(ns, "path");
  line.setAttribute("d", linePath);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", "#21f3ff");
  line.setAttribute("stroke-width", "3");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("stroke-linejoin", "round");
  svgElement.appendChild(line);

  const targetPoints =
    points.length > 16
      ? points.filter((_, index) => index % Math.ceil(points.length / 16) === 0)
      : points;

  targetPoints.forEach((point) => {
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", String(point.x));
    dot.setAttribute("cy", String(point.y));
    dot.setAttribute("r", "3.5");
    dot.setAttribute("fill", "#ffffff");
    dot.setAttribute("stroke", "#21f3ff");
    dot.setAttribute("stroke-width", "2");

    const title = document.createElementNS(ns, "title");
    const metric = mode === "month" ? "Monat" : "Woche";
    title.textContent = `${metric}: ${point.label} | Volumen: ${numberWithCommas(Math.round(point.value))}`;
    dot.appendChild(title);
    svgElement.appendChild(dot);

    const xLabel = document.createElementNS(ns, "text");
    xLabel.setAttribute("x", String(point.x));
    xLabel.setAttribute("y", String(height - 16));
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("fill", "rgba(255,255,255,0.78)");
    xLabel.setAttribute("font-size", "18.7");
    xLabel.textContent = point.shortLabel;
    svgElement.appendChild(xLabel);
  });

  const maxLabel = document.createElementNS(ns, "text");
  maxLabel.setAttribute("x", String(padding.left));
  maxLabel.setAttribute("y", String(padding.top - 6));
  maxLabel.setAttribute("fill", "rgba(255,255,255,0.75)");
  maxLabel.setAttribute("font-size", "18.7");
  maxLabel.textContent = `Max: ${numberWithCommas(Math.round(maxVal))}`;
  svgElement.appendChild(maxLabel);
}

function render_gap_distribution_chart(svgElement, buckets) {
  if (!(svgElement instanceof SVGElement)) return;
  svgElement.innerHTML = "";

  const safeBuckets = Array.isArray(buckets)
    ? buckets
    : [
        { label: "0-1 Tage", value: 0 },
        { label: "2-3 Tage", value: 0 },
        { label: "4-6 Tage", value: 0 },
        { label: "7+ Tage", value: 0 },
      ];

  const width = 960;
  const height = 220;
  const padding = { top: 20, right: 28, bottom: 48, left: 42 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxVal = Math.max(...safeBuckets.map((bucket) => bucket.value), 1);
  const barWidth = plotWidth / Math.max(1, safeBuckets.length) - 20;
  const ns = "http://www.w3.org/2000/svg";
  const totalPauses = safeBuckets.reduce(
    (acc, bucket) => acc + (Number(bucket.value) || 0),
    0,
  );

  const defs = document.createElementNS(ns, "defs");
  const gradient = document.createElementNS(ns, "linearGradient");
  gradient.setAttribute("id", "gapBarGradient");
  gradient.setAttribute("x1", "0%");
  gradient.setAttribute("x2", "0%");
  gradient.setAttribute("y1", "0%");
  gradient.setAttribute("y2", "100%");

  const stopOne = document.createElementNS(ns, "stop");
  stopOne.setAttribute("offset", "0%");
  stopOne.setAttribute("stop-color", "#ffd166");

  const stopTwo = document.createElementNS(ns, "stop");
  stopTwo.setAttribute("offset", "100%");
  stopTwo.setAttribute("stop-color", "#ff8f3f");

  gradient.appendChild(stopOne);
  gradient.appendChild(stopTwo);
  defs.appendChild(gradient);
  svgElement.appendChild(defs);

  for (let i = 0; i <= 3; i++) {
    const y = padding.top + (plotHeight / 3) * i;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", String(padding.left));
    line.setAttribute("x2", String(width - padding.right));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "rgba(255,255,255,0.12)");
    line.setAttribute("stroke-width", "1");
    svgElement.appendChild(line);
  }

  safeBuckets.forEach((bucket, index) => {
    const x = padding.left + index * (barWidth + 20) + 10;
    const rawHeight = ((Number(bucket.value) || 0) / maxVal) * plotHeight;
    const barHeight = totalPauses === 0 ? 8 : Math.max(rawHeight, 6);
    const y = padding.top + plotHeight - barHeight;

    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(barWidth));
    rect.setAttribute("height", String(barHeight));
    rect.setAttribute("rx", "8");
    rect.setAttribute("fill", "url(#gapBarGradient)");

    const title = document.createElementNS(ns, "title");
    title.textContent = `${bucket.label}: ${bucket.value}`;
    rect.appendChild(title);
    svgElement.appendChild(rect);

    const valueLabel = document.createElementNS(ns, "text");
    valueLabel.setAttribute("x", String(x + barWidth / 2));
    valueLabel.setAttribute("y", String(y - 8));
    valueLabel.setAttribute("text-anchor", "middle");
    valueLabel.setAttribute("fill", "#ffffff");
    valueLabel.setAttribute("font-size", "20.4");
    valueLabel.textContent = String(bucket.value);
    svgElement.appendChild(valueLabel);

    const xLabel = document.createElementNS(ns, "text");
    xLabel.setAttribute("x", String(x + barWidth / 2));
    xLabel.setAttribute("y", String(height - 18));
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("fill", "rgba(255,255,255,0.78)");
    xLabel.setAttribute("font-size", "18.7");
    xLabel.textContent = bucket.label;
    svgElement.appendChild(xLabel);
  });

  if (totalPauses === 0) {
    const info = document.createElementNS(ns, "text");
    info.setAttribute("x", String(width / 2));
    info.setAttribute("y", String(padding.top + 18));
    info.setAttribute("text-anchor", "middle");
    info.setAttribute("fill", "rgba(255,255,255,0.82)");
    info.setAttribute("font-size", "20.4");
    info.textContent =
      "Noch keine Pausenwerte verfuegbar (mindestens 2 Trainingstage noetig)";
    svgElement.appendChild(info);
  }
}

function render_rolling_average_chart(svgElement, rollingSeries) {
  if (!(svgElement instanceof SVGElement)) return;
  svgElement.innerHTML = "";

  const series = Array.isArray(rollingSeries) ? rollingSeries : [];
  const ns = "http://www.w3.org/2000/svg";
  const width = 960;
  const height = 220;
  const padding = { top: 20, right: 24, bottom: 42, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  if (series.length === 0) {
    const info = document.createElementNS(ns, "text");
    info.setAttribute("x", String(width / 2));
    info.setAttribute("y", String(height / 2));
    info.setAttribute("text-anchor", "middle");
    info.setAttribute("fill", "rgba(255,255,255,0.8)");
    info.setAttribute("font-size", "20.4");
    info.textContent = "Noch keine Wochenwerte fuer Rolling Average";
    svgElement.appendChild(info);
    return;
  }

  const values = series.map((item) => Number(item.value) || 0);
  const maxVal = Math.max(...values, 1);

  for (let i = 0; i <= 3; i++) {
    const y = padding.top + (plotHeight / 3) * i;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", String(padding.left));
    line.setAttribute("x2", String(width - padding.right));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "rgba(255,255,255,0.12)");
    line.setAttribute("stroke-width", "1");
    svgElement.appendChild(line);
  }

  const points = series.map((item, index) => {
    const x =
      padding.left + (index / Math.max(1, series.length - 1)) * plotWidth;
    const y =
      padding.top + (1 - (Number(item.value) || 0) / maxVal) * plotHeight;
    return {
      x,
      y,
      value: Number(item.value) || 0,
      label: item.label,
      shortLabel: item.shortLabel,
    };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#ffd166");
  path.setAttribute("stroke-width", "3");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svgElement.appendChild(path);

  const pointSample =
    points.length > 16
      ? points.filter((_, index) => index % Math.ceil(points.length / 16) === 0)
      : points;

  pointSample.forEach((point) => {
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", String(point.x));
    dot.setAttribute("cy", String(point.y));
    dot.setAttribute("r", "3");
    dot.setAttribute("fill", "#ffd166");
    const title = document.createElementNS(ns, "title");
    title.textContent = `${point.label}: ${numberWithCommas(Math.round(point.value))} kg`;
    dot.appendChild(title);
    svgElement.appendChild(dot);

    const xLabel = document.createElementNS(ns, "text");
    xLabel.setAttribute("x", String(point.x));
    xLabel.setAttribute("y", String(height - 14));
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("fill", "rgba(255,255,255,0.78)");
    xLabel.setAttribute("font-size", "18.7");
    xLabel.textContent = point.shortLabel;
    svgElement.appendChild(xLabel);
  });
}

function render_muscle_balance_chart(
  svgElement,
  muscleDistribution,
  targetShare,
) {
  if (!(svgElement instanceof SVGElement)) return;
  svgElement.innerHTML = "";

  const entries = Array.isArray(muscleDistribution) ? muscleDistribution : [];
  const ns = "http://www.w3.org/2000/svg";
  const width = 960;
  const height = 220;
  const padding = { top: 20, right: 24, bottom: 50, left: 42 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  if (entries.length === 0) {
    const info = document.createElementNS(ns, "text");
    info.setAttribute("x", String(width / 2));
    info.setAttribute("y", String(height / 2));
    info.setAttribute("text-anchor", "middle");
    info.setAttribute("fill", "rgba(255,255,255,0.8)");
    info.setAttribute("font-size", "20.4");
    info.textContent = "Noch keine Muskelgruppenwerte verfuegbar";
    svgElement.appendChild(info);
    return;
  }

  const maxShare = Math.max(
    ...entries.map((item) => item.share),
    targetShare || 0,
    1,
  );
  const barWidth = plotWidth / entries.length - 12;

  for (let i = 0; i <= 3; i++) {
    const y = padding.top + (plotHeight / 3) * i;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", String(padding.left));
    line.setAttribute("x2", String(width - padding.right));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "rgba(255,255,255,0.12)");
    line.setAttribute("stroke-width", "1");
    svgElement.appendChild(line);
  }

  if (targetShare > 0) {
    const targetY = padding.top + (1 - targetShare / maxShare) * plotHeight;
    const targetLine = document.createElementNS(ns, "line");
    targetLine.setAttribute("x1", String(padding.left));
    targetLine.setAttribute("x2", String(width - padding.right));
    targetLine.setAttribute("y1", String(targetY));
    targetLine.setAttribute("y2", String(targetY));
    targetLine.setAttribute("stroke", "rgba(255, 209, 102, 0.9)");
    targetLine.setAttribute("stroke-width", "1.5");
    targetLine.setAttribute("stroke-dasharray", "6 4");
    svgElement.appendChild(targetLine);
  }

  entries.forEach((entry, index) => {
    const x = padding.left + index * (barWidth + 12) + 6;
    const barHeight = Math.max((entry.share / maxShare) * plotHeight, 4);
    const y = padding.top + plotHeight - barHeight;
    const isAboveTarget = entry.share >= targetShare;

    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(barWidth));
    rect.setAttribute("height", String(barHeight));
    rect.setAttribute("rx", "7");
    rect.setAttribute("fill", isAboveTarget ? "#21f3ff" : "#8f8bff");
    const title = document.createElementNS(ns, "title");
    title.textContent = `${entry.label}: ${format_number(entry.share, 1)} %`;
    rect.appendChild(title);
    svgElement.appendChild(rect);

    const valueLabel = document.createElementNS(ns, "text");
    valueLabel.setAttribute("x", String(x + barWidth / 2));
    valueLabel.setAttribute("y", String(y - 7));
    valueLabel.setAttribute("text-anchor", "middle");
    valueLabel.setAttribute("fill", "#ffffff");
    valueLabel.setAttribute("font-size", "18.7");
    valueLabel.textContent = `${format_number(entry.share, 0)}%`;
    svgElement.appendChild(valueLabel);

    const xLabel = document.createElementNS(ns, "text");
    xLabel.setAttribute("x", String(x + barWidth / 2));
    xLabel.setAttribute("y", String(height - 18));
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("fill", "rgba(255,255,255,0.78)");
    xLabel.setAttribute("font-size", "17");
    xLabel.textContent =
      entry.label.length > 10 ? `${entry.label.slice(0, 10)}.` : entry.label;
    svgElement.appendChild(xLabel);
  });
}

/////////////////////////////////////
//* ANCHOR - Challenges
/////////////////////////////////////

function ensure_challenge_data_structure() {
  if (!Array.isArray(save_Object.challenges)) {
    save_Object.challenges = [];
    challenges_need_save = true;
  }

  save_Object.challenges = save_Object.challenges
    .map((challenge) => normalize_challenge(challenge))
    .filter((challenge) => challenge !== null);

  if (challenges_need_save) {
    save_into_storage(save_Object);
    challenges_need_save = false;
  }
}

function normalize_challenge(raw) {
  if (!raw || typeof raw !== "object") {
    challenges_need_save = true;
    return null;
  }

  const type = [
    "sessions_goal",
    "volume_goal",
    "cardio_minutes_goal",
    "streak_goal",
  ].includes(raw.type)
    ? raw.type
    : "sessions_goal";

  const periodType = ["deadline", "weekly", "monthly"].includes(raw.periodType)
    ? raw.periodType
    : "deadline";

  const normalized = {
    id: raw.id || rnd_id(),
    title: String(raw.title || "").trim() || get_default_challenge_title(type),
    type,
    targetValue: Math.max(1, Number(raw.targetValue) || 1),
    unit: raw.unit || get_challenge_unit(type),
    periodType,
    startDate: raw.startDate || challenge_to_iso_date(new Date()),
    endDate: raw.endDate || "",
    status: raw.status || "active",
    createdAt: raw.createdAt || challenge_to_iso_date(new Date()),
    archivedAt: raw.archivedAt || "",
    completionHistory: normalize_challenge_completion_history(
      raw.completionHistory,
    ),
    completionCount: Math.max(0, Number(raw.completionCount) || 0),
    bestValue: Math.max(0, Number(raw.bestValue) || 0),
    lastCompletedAt: raw.lastCompletedAt || "",
  };

  const historyCount = normalized.completionHistory.length;
  if (normalized.completionCount !== historyCount) {
    normalized.completionCount = historyCount;
    challenges_need_save = true;
  }

  if (historyCount > 0 && !normalized.lastCompletedAt) {
    normalized.lastCompletedAt =
      normalized.completionHistory[historyCount - 1].completedAt;
    challenges_need_save = true;
  }

  if (historyCount > 0) {
    const bestFromHistory = normalized.completionHistory.reduce(
      (acc, item) => Math.max(acc, Number(item.achievedValue) || 0),
      0,
    );
    if (normalized.bestValue !== bestFromHistory) {
      normalized.bestValue = bestFromHistory;
      challenges_need_save = true;
    }
  }

  if (!raw.id || !raw.type || !raw.periodType || !raw.targetValue) {
    challenges_need_save = true;
  }

  return normalized;
}

function normalize_challenge_completion_history(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];

  const normalized = rawHistory
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const completedAt = String(entry.completedAt || "").trim();
      const achievedValue = Number(entry.achievedValue);
      const targetValue = Number(entry.targetValue);
      const periodType = String(entry.periodType || "").trim();
      const windowStart = String(entry.windowStart || "").trim();
      const windowEnd = String(entry.windowEnd || "").trim();

      if (
        !completedAt ||
        !Number.isFinite(achievedValue) ||
        !Number.isFinite(targetValue)
      ) {
        return null;
      }

      return {
        completedAt,
        achievedValue,
        targetValue,
        periodType,
        windowStart,
        windowEnd,
      };
    })
    .filter((entry) => entry !== null);

  normalized.sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  return normalized;
}

function init_challenge_controls() {
  const form = document.getElementById("challenge_form");
  const list = document.getElementById("challenge_list");
  const filter = document.getElementById("challenge_status_filter");
  const period = document.getElementById("challenge_period");
  const deadlineInput = document.getElementById("challenge_deadline");

  if (deadlineInput) {
    deadlineInput.min = challenge_to_iso_date(new Date());
  }

  if (period && period.dataset.bound !== "true") {
    period.addEventListener("change", () => {
      update_deadline_field_state();
    });
    period.dataset.bound = "true";
  }

  if (filter && filter.dataset.bound !== "true") {
    filter.addEventListener("change", () => {
      render_challenges();
    });
    filter.dataset.bound = "true";
  }

  if (list && list.dataset.bound !== "true") {
    list.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest("button[data-action][data-challenge-id]");
      if (!button) return;

      const challengeId = button.dataset.challengeId;
      const action = button.dataset.action;
      if (!challengeId || !action) return;

      handle_challenge_action(action, challengeId);
    });
    list.dataset.bound = "true";
  }

  if (form && form.dataset.bound !== "true") {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      create_challenge_from_form();
    });
    form.dataset.bound = "true";
  }

  update_deadline_field_state();
}

function update_deadline_field_state() {
  const period = document.getElementById("challenge_period");
  const wrap = document.getElementById("challenge_deadline_wrap");
  const deadlineInput = document.getElementById("challenge_deadline");
  if (!period || !wrap || !deadlineInput) return;

  const useDeadline = period.value === "deadline";
  wrap.style.display = useDeadline ? "block" : "none";
  deadlineInput.required = useDeadline;
}

function create_challenge_from_form() {
  const titleInput = document.getElementById("challenge_title");
  const typeInput = document.getElementById("challenge_type");
  const targetInput = document.getElementById("challenge_target");
  const periodInput = document.getElementById("challenge_period");
  const deadlineInput = document.getElementById("challenge_deadline");

  if (!typeInput || !targetInput || !periodInput) return;

  const type = typeInput.value;
  const periodType = periodInput.value;
  const targetValue = Math.max(1, Number(targetInput.value) || 0);
  const title =
    (titleInput?.value || "").trim() || get_default_challenge_title(type);
  const today = challenge_to_iso_date(new Date());
  const deadline = deadlineInput?.value || "";

  if (targetValue <= 0) {
    new Message(
      "Challenge",
      "Bitte einen gueltigen Zielwert setzen.",
      "warning",
      2400,
    ).showMessage();
    return;
  }

  if (periodType === "deadline" && !deadline) {
    new Message(
      "Challenge",
      "Bitte Deadline waehlen.",
      "warning",
      2400,
    ).showMessage();
    return;
  }

  const challenge = normalize_challenge({
    id: rnd_id(),
    title,
    type,
    targetValue,
    unit: get_challenge_unit(type),
    periodType,
    startDate: today,
    endDate: periodType === "deadline" ? deadline : "",
    status: "active",
    createdAt: today,
    archivedAt: "",
  });

  if (!challenge) return;

  save_Object.challenges.push(challenge);
  save_into_storage(save_Object);
  render_challenges();

  const form = document.getElementById("challenge_form");
  if (form) form.reset();
  update_deadline_field_state();

  new Message(
    "Challenge",
    "Challenge erstellt.",
    "success",
    2200,
  ).showMessage();
}

function handle_challenge_action(action, challengeId) {
  const index = save_Object.challenges.findIndex(
    (item) => item.id === challengeId,
  );
  if (index < 0) return;

  const challenge = save_Object.challenges[index];
  if (action === "archive") {
    challenge.status = "archived";
    challenge.archivedAt = challenge_to_iso_date(new Date());
  }
  if (action === "activate") {
    challenge.status = "active";
    challenge.archivedAt = "";
  }
  if (action === "delete") {
    save_Object.challenges.splice(index, 1);
  }

  save_into_storage(save_Object);
  render_challenges();
}

function render_challenges() {
  ensure_challenge_data_structure();

  const list = document.getElementById("challenge_list");
  const summary = document.getElementById("challenge_summary");
  const filter = document.getElementById("challenge_status_filter");
  if (!list) return;

  const today = challenge_strip_time(new Date());
  const selectedFilter = filter?.value || "active";

  const computed = save_Object.challenges.map((challenge) => {
    const progress = compute_challenge_progress(challenge, today);
    if (track_challenge_completion(challenge, progress, today)) {
      challenges_need_save = true;
    }
    const status = derive_challenge_status(challenge, progress, today);

    return {
      challenge,
      progress,
      status,
    };
  });

  if (challenges_need_save) {
    save_into_storage(save_Object);
    challenges_need_save = false;
  }

  const visible = computed.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "successes") {
      return (item.challenge.completionCount || 0) > 0;
    }
    if (selectedFilter === "completed") return item.status === "completed";
    return item.status === "active";
  });

  if (summary) {
    const activeCount = computed.filter(
      (item) => item.status === "active",
    ).length;
    const doneCount = computed.filter(
      (item) => item.status === "completed",
    ).length;
    const failedCount = computed.filter(
      (item) => item.status === "failed",
    ).length;
    const successCount = computed.filter(
      (item) => (item.challenge.completionCount || 0) > 0,
    ).length;
    summary.textContent = `Aktiv: ${activeCount} | Erledigt: ${doneCount} | Verpasst: ${failedCount} | Erfolge: ${successCount}`;
  }

  list.innerHTML = "";
  if (visible.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("challenge-list__empty");
    empty.textContent = "Keine Challenges in dieser Ansicht.";
    list.appendChild(empty);
    return;
  }

  visible.forEach((item) => {
    list.appendChild(
      render_challenge_card(item.challenge, item.progress, item.status),
    );
  });
}

function render_challenge_card(challenge, progress, status) {
  const card = document.createElement("article");
  card.classList.add("challenge-card");
  card.classList.add(`challenge-card--${status}`);

  const percent = Math.max(0, Math.min(100, progress.percent));
  const unit = challenge.unit || "";

  if (
    challenge.type === "cardio_minutes_goal" &&
    challenge.periodType === "weekly"
  ) {
    console.log("[Cardio Debug][Render] weekly challenge output", {
      challengeId: challenge.id,
      title: challenge.title,
      shownValue: progress.value,
      shownTarget: challenge.targetValue,
      shownUnit: unit,
      shownWindow: progress.windowLabel,
      shownPercent: percent,
      status,
    });
  }

  const actionButton =
    status === "archived"
      ? `<button data-action="activate" data-challenge-id="${challenge.id}">Reaktivieren</button>`
      : `<button data-action="archive" data-challenge-id="${challenge.id}">Archivieren</button>`;

  const completionHistory = Array.isArray(challenge.completionHistory)
    ? challenge.completionHistory
    : [];
  const recentCompletions = completionHistory.slice(-5).reverse();
  const completionSummary =
    challenge.completionCount > 0
      ? `<div class="challenge-card__achievements">
          <span class="challenge-achievement-badge">${challenge.completionCount}x geschafft</span>
          <span>Zuletzt: ${format_challenge_display_date(challenge.lastCompletedAt)}</span>
          <span>Bestwert: ${format_number(challenge.bestValue || 0, 1)} ${unit}</span>
        </div>`
      : "";

  const completionTimeline =
    challenge.completionCount > 0
      ? `<div class="challenge-card__history">
          <p class="challenge-card__history-title">Verlauf</p>
          <ul>
            ${recentCompletions
              .map(
                (entry) =>
                  `<li><span>${format_challenge_display_date(entry.completedAt)}</span><strong>${format_number(entry.achievedValue, 1)} ${unit}</strong></li>`,
              )
              .join("")}
          </ul>
          ${completionHistory.length > recentCompletions.length ? `<p class="challenge-card__history-more">+${completionHistory.length - recentCompletions.length} weitere Erfolge</p>` : ""}
        </div>`
      : "";

  card.innerHTML = `
    <div class="challenge-card__head">
      <h4>${challenge.title}</h4>
      <span class="challenge-card__status">${get_status_label(status)}</span>
    </div>
    <p class="challenge-card__meta">${get_type_label(challenge.type)} | ${progress.windowLabel}</p>
    <div class="challenge-card__bar">
      <div class="challenge-card__bar-fill" style="width:${percent}%"></div>
    </div>
    <div class="challenge-card__numbers">${format_number(progress.value, 1)} / ${format_number(challenge.targetValue, 1)} ${unit}</div>
    ${completionSummary}
    ${completionTimeline}
    <div class="challenge-card__actions">
      ${actionButton}
      <button data-action="delete" data-challenge-id="${challenge.id}">Loeschen</button>
    </div>
  `;

  return card;
}

function derive_challenge_status(challenge, progress, now) {
  if (challenge.status === "archived") return "archived";

  if (challenge.periodType === "weekly" || challenge.periodType === "monthly") {
    return "active";
  }

  if (progress.isCompleted) return "completed";

  if (
    challenge.periodType === "deadline" &&
    challenge.endDate &&
    challenge_strip_time(new Date(challenge.endDate)) < now
  ) {
    return "failed";
  }

  return "active";
}

function track_challenge_completion(challenge, progress, nowDate) {
  if (!progress.isCompleted) return false;

  if (!Array.isArray(challenge.completionHistory)) {
    challenge.completionHistory = [];
  }

  const nowIso = challenge_to_iso_date(nowDate);
  const window = get_challenge_window(challenge, nowDate);
  const windowStart = challenge_to_iso_date(window.start);
  const windowEnd = challenge_to_iso_date(window.end);

  let alreadyRecorded = false;
  if (challenge.periodType === "weekly" || challenge.periodType === "monthly") {
    alreadyRecorded = challenge.completionHistory.some(
      (entry) =>
        entry.periodType === challenge.periodType &&
        entry.windowStart === windowStart &&
        entry.windowEnd === windowEnd,
    );
  } else {
    alreadyRecorded = challenge.completionHistory.some(
      (entry) =>
        entry.periodType === "deadline" &&
        entry.windowStart === windowStart &&
        entry.windowEnd === windowEnd,
    );
  }

  if (alreadyRecorded) return false;

  challenge.completionHistory.push({
    completedAt: nowIso,
    achievedValue: Number(progress.value) || 0,
    targetValue: Number(challenge.targetValue) || 0,
    periodType: challenge.periodType,
    windowStart,
    windowEnd,
  });

  challenge.completionHistory.sort((a, b) =>
    a.completedAt.localeCompare(b.completedAt),
  );

  challenge.completionCount = challenge.completionHistory.length;
  challenge.lastCompletedAt = nowIso;
  challenge.bestValue = challenge.completionHistory.reduce(
    (acc, entry) => Math.max(acc, Number(entry.achievedValue) || 0),
    0,
  );

  return true;
}

function format_challenge_display_date(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return "-";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function compute_challenge_progress(challenge, nowDate) {
  const window = get_challenge_window(challenge, nowDate);
  const trainingsInWindow = get_trainings_in_window(window.start, window.end);
  let value = 0;

  if (challenge.type === "sessions_goal") {
    value = trainingsInWindow.length;
  }

  if (challenge.type === "volume_goal") {
    value = trainingsInWindow.reduce(
      (acc, training) => acc + safe_sum_of_weight(training.exercises || []),
      0,
    );
  }

  if (challenge.type === "cardio_minutes_goal") {
    const cardioDebugRows = [];
    value = trainingsInWindow.reduce((acc, training) => {
      const isCardio = is_cardio_session(training);
      const minutes = parse_duration_to_minutes(training.duration);

      cardioDebugRows.push({
        date: training.training_date,
        duration: training.duration,
        isCardio,
        countedMinutes: isCardio ? minutes : 0,
        exerciseNames: (training.exercises || []).map((exercise) =>
          String(exercise?.name || "-"),
        ),
      });

      if (!isCardio) return acc;
      return acc + minutes;
    }, 0);

    if (challenge.periodType === "weekly") {
      console.groupCollapsed(
        `[Cardio Debug][Challenge] ${challenge.title} | ${window.label}`,
      );
      console.log("window", {
        start: challenge_to_iso_date(window.start),
        end: challenge_to_iso_date(window.end),
      });
      console.table(cardioDebugRows);
      console.log("result", {
        challengeId: challenge.id,
        targetMinutes: challenge.targetValue,
        calculatedMinutes: value,
      });
      console.groupEnd();
    }
  }

  if (challenge.type === "streak_goal") {
    value = calculate_week_streak(trainingsInWindow);
  }

  const percent =
    challenge.targetValue > 0 ? (value / challenge.targetValue) * 100 : 0;
  return {
    value,
    percent,
    isCompleted: value >= challenge.targetValue,
    windowLabel: window.label,
  };
}

function get_challenge_window(challenge, nowDate) {
  const now = challenge_strip_time(nowDate);
  if (challenge.periodType === "weekly") {
    const start = challenge_start_of_week(now);
    const end = challenge_end_of_week(now);
    return { start, end, label: "Diese Woche" };
  }

  if (challenge.periodType === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end, label: "Dieser Monat" };
  }

  const start = challenge.startDate
    ? challenge_strip_time(new Date(challenge.startDate))
    : now;
  const end = challenge.endDate
    ? challenge_strip_time(new Date(challenge.endDate))
    : now;
  return {
    start,
    end,
    label: challenge.endDate ? `Bis ${challenge.endDate}` : "Offen",
  };
}

function get_trainings_in_window(startDate, endDate) {
  return (save_Object.trainings || []).filter((training) => {
    const dateObj = parse_training_date(training.training_date);
    if (!dateObj) return false;
    return dateObj >= startDate && dateObj <= endDate;
  });
}

function calculate_week_streak(trainings) {
  if (!Array.isArray(trainings) || trainings.length === 0) return 0;

  const weekKeys = Array.from(
    new Set(
      trainings
        .map((training) => parse_training_date(training.training_date))
        .filter((date) => date)
        .map((date) => {
          const info = get_iso_week_info(date);
          return `${info.year}-${add_zero(info.week)}`;
        }),
    ),
  ).sort();

  if (weekKeys.length === 0) return 0;

  let streak = 1;
  for (let i = weekKeys.length - 1; i > 0; i--) {
    const current = challenge_week_key_to_sort_number(weekKeys[i]);
    const prev = challenge_week_key_to_sort_number(weekKeys[i - 1]);
    if (current - prev === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function challenge_week_key_to_sort_number(weekKey) {
  const parts = String(weekKey).split("-");
  const year = Number(parts[0]) || 0;
  const week = Number(parts[1]) || 0;
  return year * 60 + week;
}

function challenge_start_of_week(date) {
  const d = new Date(date);
  const day = d.getDay();
  const shift = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + shift);
  return challenge_strip_time(d);
}

function challenge_end_of_week(date) {
  const start = challenge_start_of_week(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return challenge_strip_time(end);
}

function challenge_strip_time(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function challenge_to_iso_date(date) {
  return `${date.getFullYear()}-${add_zero(date.getMonth() + 1)}-${add_zero(date.getDate())}`;
}

function get_challenge_unit(type) {
  if (type === "volume_goal") return "kg";
  if (type === "cardio_minutes_goal") return "Min";
  if (type === "streak_goal") return "Wochen";
  return "Sessions";
}

function get_default_challenge_title(type) {
  if (type === "volume_goal") return "Volumen-Challenge";
  if (type === "cardio_minutes_goal") return "Cardio-Challenge";
  if (type === "streak_goal") return "Streak-Challenge";
  return "Sessions-Challenge";
}

function get_type_label(type) {
  if (type === "volume_goal") return "Volumen";
  if (type === "cardio_minutes_goal") return "Cardio-Minuten";
  if (type === "streak_goal") return "Streak";
  return "Sessions";
}

function get_status_label(status) {
  if (status === "completed") return "Erledigt";
  if (status === "failed") return "Verpasst";
  if (status === "archived") return "Archiv";
  return "Aktiv";
}

/////////////////////////////////////
//* ANCHOR - Render exercises
/////////////////////////////////////

function prepare_render_exercise() {
  let home_array = [];
  let fitti_array = [];
  let combo_array = [];
  const srcArray = save_Object.exercises;

  srcArray.forEach((exercise) => {
    if (exercise.trainingsplace === "Heimtraining") {
      home_array.push(exercise);
    }
    if (exercise.trainingsplace === "Kombo" || exercise.trainingsplace === "") {
      combo_array.push(exercise);
    }
    if (exercise.trainingsplace === "Fitnessstudio") {
      fitti_array.push(exercise);
    }
  });

  render_exercises(home_array, "Heimtraining");
  render_exercises(combo_array, "");
  render_exercises(fitti_array, "Fitnessstudio");
}

function get_cumulative_sets_by_exercise() {
  const setMap = new Map();

  for (let i = 0; i < (save_Object.trainings || []).length; i++) {
    const training = save_Object.trainings[i];
    const exercises = Array.isArray(training?.exercises)
      ? training.exercises
      : [];

    for (let j = 0; j < exercises.length; j++) {
      const exercise = exercises[j] || {};
      const key =
        String(exercise.exercise_id || "").trim() ||
        String(exercise.name || "").trim();
      if (!key) continue;

      const solvedSets = Math.max(
        0,
        Number(exercise.solved_sets) || Number(exercise.sets) || 0,
      );
      const current = setMap.get(key) || 0;
      setMap.set(key, current + solvedSets);
    }
  }

  return setMap;
}

function get_exercise_achievement_state(exercise, setsByExercise) {
  const key =
    String(exercise?.exercise_id || "").trim() ||
    String(exercise?.name || "").trim();
  const totalSets = setsByExercise.get(key) || 0;

  const tiers = [
    { id: "bronze", title: "Bronze", threshold: 25 },
    { id: "silver", title: "Silber", threshold: 50 },
    { id: "gold", title: "Gold", threshold: 100 },
    { id: "platinum", title: "Platin", threshold: 200 },
    { id: "diamond", title: "Diamant", threshold: 400 },
    { id: "legend", title: "Legende", threshold: 800 },
  ];

  let achievedTier = null;
  for (let i = 0; i < tiers.length; i++) {
    if (totalSets >= tiers[i].threshold) {
      achievedTier = tiers[i];
    }
  }

  if (!achievedTier) {
    return {
      title: "Bronze",
      target: tiers[0].threshold,
      totalSets,
      unlocked: false,
      tierId: "bronze",
    };
  }

  const nextTier = tiers.find((tier) => tier.threshold > totalSets);
  return {
    title: achievedTier.title,
    target: nextTier ? nextTier.threshold : achievedTier.threshold,
    totalSets,
    unlocked: true,
    tierId: achievedTier.id,
  };
}

/////////////////////////////////////
//* ANCHOR - Render exercises
/////////////////////////////////////

function render_exercises(exerc_array, label) {
  try {
    if (label.length > 1) {
      let exercise_place_label = document.createElement("h3");
      exercise_place_label.innerHTML = label;
      exercise_place_label.classList.add("exercise-place-label");
      exercise_container.appendChild(exercise_place_label);
    }

    for (let i = 0; i < exerc_array.length; i++) {
      let exercisebtn = document.createElement("div");
      exercisebtn.classList.add("exercise");
      let exerciseName = exerc_array[i].name;
      if (exerc_array[i].trainingsplace == "Fitnessstudio") {
        exerciseName =
          `Nr.${exerc_array[i].machineNumber} - ` + exerc_array[i].name;
      }
      try {
        const currentSet =
          save_Object.current_training[
            `${indexOfExercise(exerc_array[i], save_Object.current_training)}`
          ].solved_sets;
        exerciseName = `${exerciseName} (${currentSet}/${exerc_array[i].sets}) <span style="margin: 0 10px"> </span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
              </svg>`;
        if (currentSet >= exerc_array[i].sets) {
          exercisebtn.classList.add("solved");
        } else {
          exercisebtn.classList.add("half-solved");
        }
      } catch (error) {
        console.log(error);
      }
      exercisebtn.innerHTML = exerciseName;
      exercisebtn.id = exerc_array[i].exercise_id;
      exercisebtn.addEventListener("click", () => {
        selected_Exercise = exerc_array[i];
        open_exercise();
      });

      exercise_container.appendChild(exercisebtn);
    }
  } catch (error) {
    console.log(error);
  }
}

/////////////////////////////////////
//* ANCHOR - Save new Exercise
/////////////////////////////////////
btn_saveExercise.addEventListener("click", () => {
  if (inpExercise_Name.value === "") {
    return;
  }
  if (inpExercise_Weight.value === "") {
    inpExercise_Weight.value = 0;
  }
  if (inpExercise_Sets.value === "") {
    inpExercise_Sets.value = 0;
  }
  if (inpExercise_Repeats.value === "") {
    inpExercise_Repeats.value = 0;
  }
  if (inpExercise_number.value === "") {
    inpExercise_number.value = "-";
  }
  if (inpExercise_seatSettings.value === "") {
    inpExercise_seatSettings.value = "-";
  }
  if (muscle_select.value === "") {
    muscle_select.value = "-";
  }
  if (training_Area.value === "") {
    training_Area.value = "-";
  }

  if (is_edit) {
    selected_Exercise.name = inpExercise_Name.value;
    selected_Exercise.weight = inpExercise_Weight.value;
    selected_Exercise.sets = inpExercise_Sets.value;
    selected_Exercise.repeats = inpExercise_Repeats.value;
    selected_Exercise.machineNumber = inpExercise_number.value;
    selected_Exercise.machine_seat_settings = inpExercise_seatSettings.value;
    selected_Exercise.musclegroup = muscle_select.value;
    selected_Exercise.trainingsplace = training_Area.value;
    const msg = new Message(
      "Gespeichert",
      "Änderungen wurden gespeichert",
      "success",
      3000,
    );
    msg.showMessage();
  } else {
    const newExercise = new Exercise(
      rnd_id(),
      inpExercise_Name.value,
      inpExercise_Weight.value,
      inpExercise_Sets.value,
      inpExercise_Repeats.value,
      inpExercise_number.value,
      inpExercise_seatSettings.value,
      muscle_select.value,
      training_Area.value,
      0,
    );
    save_Object.exercises.push(newExercise);
    const msg = new Message(
      "Gespeichert",
      "Eine neue Übung wurde hinzugefügt",
      "success",
      3000,
    );
    msg.showMessage();
  }

  save_into_storage(save_Object);

  setTimeout(() => {
    location.reload();
  }, 3000);
});

/////////////////////////////////////
//* ANCHOR - open Exercise
/////////////////////////////////////
function open_exercise() {
  Modal.open_modal(modal_exercise);
  lbl_trainingsname.innerHTML = selected_Exercise.name;
  //* Scroll to top
  btn_edit.scrollIntoView({ behavior: "smooth" });
  //* save last opened id to scroll to the last btn
  save_Object.last_exercise_id = selected_Exercise.exercise_id;
  save_into_storage(save_Object);

  lbl_weight.innerHTML = `${selected_Exercise.weight} Kg`;
  lbl_sets.innerHTML = `${selected_Exercise.sets}`;
  lbl_repeats.innerHTML = `${selected_Exercise.repeats}`;
  lbl_number.innerHTML = `Nr.${selected_Exercise.machineNumber}`;
  lbl_seatsettings.innerHTML = `${selected_Exercise.machine_seat_settings}`;
  lbl_muscleselect.innerHTML = `${selected_Exercise.musclegroup}`;
  lbl_donesets.innerHTML = `0`;
  let is_never_trained = true; //* to show if the exercise has not been performed before

  try {
    const currentSet =
      save_Object.current_training[
        `${indexOfExercise(selected_Exercise, save_Object.current_training)}`
      ].solved_sets;
    lbl_donesets.innerHTML = `${currentSet}`;
  } catch (error) {}

  lbl_trainingsarea.innerHTML = `${selected_Exercise.trainingsplace}`;
  const trainingamount = save_Object.trainings.length - 1;
  const setsByExercise = get_cumulative_sets_by_exercise();
  const achievementState = get_exercise_achievement_state(
    selected_Exercise,
    setsByExercise,
  );

  exercise_table.innerHTML = "";
  let last_training_date = null;
  const exerciseProgressHistory = [];

  //* Iterate all trainings and decrement index to show the newest trainings at first
  let solved_exercise_amount = 0;
  let solved_set_sum = 0;
  for (let i = trainingamount; i > -1; i--) {
    const trainings_date = save_Object.trainings[i].training_date;
    const duration = save_Object.trainings[i].duration;
    const exc = save_Object.trainings[i].exercises;
    let only_ecercise;
    let is_in = false;

    //* Check if selected exercise == training exercise
    for (let j = 0; j < exc.length; j++) {
      is_in = false;
      if (exc[j].exercise_id === selected_Exercise.exercise_id) {
        is_in = true;
        is_never_trained = false;
        only_ecercise = exc[j];
        solved_set_sum += exc[j].solved_sets;
        break;
      }
    }
    //* if exercise == training
    if (is_in === true) {
      const historyWeight = Number(only_ecercise.weight) || 0;
      const historySets = Number(only_ecercise.solved_sets) || 0;
      const historyRepeats = Number(only_ecercise.repeats) || 0;
      exerciseProgressHistory.push({
        date: trainings_date,
        weight: historyWeight,
        volume: historyWeight * historySets * historyRepeats,
      });

      //* Show label with time between trainings
      let lbl_time_to_last_training = document.createElement("p");
      lbl_time_to_last_training.classList.add("between-trainings");
      solved_exercise_amount++;
      try {
        if (i - 1 !== -1) {
          const duration_to_last_training = time_between_dates(
            trainings_date,
            last_training_date,
          );
          if (duration_to_last_training > 1) {
            lbl_time_to_last_training.innerHTML = `${duration_to_last_training}. Tage seit dem letzten Training`;
            exercise_table.appendChild(lbl_time_to_last_training);
          } else if (duration_to_last_training === 1) {
            lbl_time_to_last_training.innerHTML = `${duration_to_last_training}. Tag seit dem letzten Training`;
            exercise_table.appendChild(lbl_time_to_last_training);
          }
        }
      } catch (error) {
        console.log(error);
      }
      //************************************* */
      const tableContainer = createTable(
        `${trainings_date} - ${duration}`,
        only_ecercise,
        true,
        i,
        save_Object,
      );
      exercise_table.appendChild(tableContainer);
      last_training_date = trainings_date;
    }
    lbl_solved_sum.innerHTML = `
      <div class="exercise-detail-summary__item">
        <span class="exercise-detail-summary__label">Trainings</span>
        <strong class="exercise-detail-summary__value">${solved_exercise_amount}</strong>
      </div>
      <div class="exercise-detail-summary__item">
        <span class="exercise-detail-summary__label">Sätze gesamt</span>
        <strong class="exercise-detail-summary__value">${solved_set_sum}</strong>
      </div>
    `;
  }

  if (exercise_detail_achievement) {
    const stateLabel = achievementState.unlocked
      ? `${achievementState.title} freigeschaltet`
      : `${achievementState.title} in Arbeit`;

    const tierClass = achievementState.tierId
      ? `is-${achievementState.tierId}`
      : "";
    const modClass = achievementState.unlocked
      ? `exercise-detail-achievement__badge is-unlocked ${tierClass}`
      : `exercise-detail-achievement__badge ${tierClass}`;

    const progressLabel = achievementState.unlocked
      ? achievementState.target > achievementState.totalSets
        ? `${achievementState.totalSets}/${achievementState.target} Sätze bis naechster Rang`
        : `${achievementState.totalSets} Sätze Gesamt`
      : `${achievementState.totalSets}/${achievementState.target} Sätze`;

    exercise_detail_achievement.innerHTML = `
      <span class="${modClass}">${stateLabel}</span>
      <span class="exercise-detail-achievement__progress">${progressLabel}</span>
    `;
  }

  //* show if the exercise has not been performed before
  if (is_never_trained) {
    let lbl = document.createElement("div");
    lbl.innerHTML = "Noch keine Übung absolviert";
    lbl.style.color = "yellow";
    exercise_table.appendChild(lbl);
  }

  if (solved_exercise_amount === 0) {
    lbl_solved_sum.innerHTML = `
      <div class="exercise-detail-summary__item">
        <span class="exercise-detail-summary__label">Trainings</span>
        <strong class="exercise-detail-summary__value">0</strong>
      </div>
      <div class="exercise-detail-summary__item">
        <span class="exercise-detail-summary__label">Sätze gesamt</span>
        <strong class="exercise-detail-summary__value">0</strong>
      </div>
    `;
  }

  render_exercise_progress_chart(exerciseProgressHistory);
}

function render_exercise_progress_chart(history) {
  if (!exercise_progress_chart) return;

  if (!Array.isArray(history) || history.length === 0) {
    exercise_progress_chart.innerHTML = `
      <div class="exercise-progress__empty">Noch keine Verlaufsdaten vorhanden.</div>
    `;
    return;
  }

  const orderedHistory = [...history].reverse();
  const weightSeries = orderedHistory.map((entry) => Number(entry.weight) || 0);
  const volumeSeries = orderedHistory.map((entry) => Number(entry.volume) || 0);

  const latestWeight = weightSeries[weightSeries.length - 1] || 0;
  const maxWeight = Math.max(...weightSeries, 0);
  const latestVolume = volumeSeries[volumeSeries.length - 1] || 0;
  const maxVolume = Math.max(...volumeSeries, 0);

  const weightSvg = build_exercise_progress_svg(orderedHistory, weightSeries, {
    chartClass: "is-weight",
    unit: "kg",
    axisLabel: "Gew",
  });

  const volumeSvg = build_exercise_progress_svg(orderedHistory, volumeSeries, {
    chartClass: "is-volume",
    unit: "kg",
    axisLabel: "Sum",
  });

  exercise_progress_chart.innerHTML = `
    <section class="exercise-progress">
      <div class="exercise-progress__head">
        <h4>Verlauf</h4>
        <span>${orderedHistory.length} Eintrag(e)</span>
      </div>

      <div class="exercise-progress__grid">
        <article class="exercise-progress__card">
          <div class="exercise-progress__metric-head">
            <strong>Gew</strong>
            <span>Aktuell ${format_exercise_metric_value(latestWeight)} kg | Max ${format_exercise_metric_value(maxWeight)} kg</span>
          </div>
          ${weightSvg}
        </article>

        <article class="exercise-progress__card">
          <div class="exercise-progress__metric-head">
            <strong>Sum</strong>
            <span>Aktuell ${format_exercise_metric_value(latestVolume)} kg | Max ${format_exercise_metric_value(maxVolume)} kg</span>
          </div>
          ${volumeSvg}
        </article>
      </div>
    </section>
  `;
}

function build_exercise_progress_svg(history, values, options = {}) {
  const points = Array.isArray(values) ? values : [];
  if (points.length === 0) return "";

  const width = 680;
  const height = 220;
  const padTop = 16;
  const padRight = 12;
  const padBottom = 28;
  const padLeft = 44;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  let yMax = Math.max(...points, 0);
  if (yMax <= 0) yMax = 1;

  const xAt = (index) => {
    if (points.length <= 1) return padLeft + chartWidth / 2;
    return padLeft + (index / (points.length - 1)) * chartWidth;
  };
  const yAt = (value) => {
    const scaled = Math.max(0, Number(value) || 0) / yMax;
    return padTop + chartHeight - scaled * chartHeight;
  };

  const pathData = points
    .map(
      (value, index) =>
        `${index === 0 ? "M" : "L"}${xAt(index).toFixed(2)} ${yAt(value).toFixed(2)}`,
    )
    .join(" ");

  const gridLines = [];
  for (let step = 0; step <= 4; step++) {
    const ratio = step / 4;
    const yPos = padTop + ratio * chartHeight;
    const axisValue = yMax * (1 - ratio);
    gridLines.push(`
      <line x1="${padLeft}" y1="${yPos.toFixed(2)}" x2="${width - padRight}" y2="${yPos.toFixed(2)}" class="exercise-progress__grid-line" />
      <text x="${padLeft - 8}" y="${(yPos + 4).toFixed(2)}" class="exercise-progress__axis-label" text-anchor="end">${format_exercise_metric_value(axisValue)}</text>
    `);
  }

  const maxTicks = 6;
  const interval =
    points.length <= maxTicks
      ? 1
      : Math.ceil((points.length - 1) / (maxTicks - 1));
  const xTicks = new Set([0, points.length - 1]);
  for (let idx = 0; idx < points.length; idx += interval) {
    xTicks.add(idx);
  }

  const xTickLabels = Array.from(xTicks)
    .sort((a, b) => a - b)
    .map((idx) => {
      const fullDate = String(history[idx]?.date || "");
      const parts = fullDate.split(".");
      const shortDate =
        parts.length >= 2 ? `${parts[0]}.${parts[1]}.` : fullDate;
      return `<text x="${xAt(idx).toFixed(2)}" y="${height - 8}" class="exercise-progress__x-label" text-anchor="middle">${shortDate}</text>`;
    })
    .join("");

  const circles = points
    .map((value, index) => {
      const date = history[index]?.date || "";
      const text =
        `${date}: ${format_exercise_metric_value(value)} ${options.unit || ""}`.trim();
      return `
        <circle cx="${xAt(index).toFixed(2)}" cy="${yAt(value).toFixed(2)}" r="4" class="exercise-progress__point ${options.chartClass || ""}">
          <title>${text}</title>
        </circle>
      `;
    })
    .join("");

  return `
    <svg class="exercise-progress__svg ${options.chartClass || ""}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${options.axisLabel || "Verlauf"} Verlauf">
      <text x="${padLeft}" y="12" class="exercise-progress__axis-title">${options.axisLabel || ""}</text>
      ${gridLines.join("")}
      <path d="${pathData}" class="exercise-progress__line ${options.chartClass || ""}" fill="none" />
      ${circles}
      ${xTickLabels}
    </svg>
  `;
}

function format_exercise_metric_value(value) {
  const numericValue = Number(value) || 0;
  if (Math.abs(numericValue) >= 1000) {
    return numberWithCommas(Math.round(numericValue));
  }

  if (Math.abs(numericValue % 1) > 0.001) {
    return numericValue.toFixed(1);
  }

  return String(Math.round(numericValue));
}

/////////////////////////////////////
//* ANCHOR - Tracking
/////////////////////////////////////
btn_trackSport.addEventListener("click", () => {
  if (training_running === false) {
    const decision = window.confirm("Soll ein Training gestartet werden?");
    if (decision) {
      training_running = true;
      //* Training boolean speichern
      save_Object.training_is_running = true;
      //* Training Startzeit ermitteln und speichern
      const training_start_stamp = new Date();
      save_Object.training_start = training_start_stamp;
      //* Set in Training Array speichern
      add_solved_set();

      // * persistent speichern
      save_into_storage(save_Object);

      //TODO -  replace alert
      const message = new Message(
        "Training gestartet",
        "Ein neues Training wurde gestartet. 1 Satz wurde hinzugefügt",
        "success",
        2500,
      );
      message.showMessage();
      // alert("Ein weiterer Satz wurde hinzugefügt");
      setTimeout(() => {
        location.reload();
      }, 2500);
    }
  } else {
    //* Set in Training Array speichern
    add_solved_set();

    // * persistent speichern
    save_into_storage(save_Object);

    //TODO -  replace alert
    const message = new Message(
      "Satz getrackt",
      "Ein weiterer Satz wurde hinzugefügt",
      "success",
      2500,
    );
    message.showMessage();

    setTimeout(() => {
      location.reload();
    }, 2500);
    // alert("Ein weiterer Satz wurde hinzugefügt");
    // location.reload();
  }
});

/////////////////////////////////////
//* ANCHOR - Add Solved Set
/////////////////////////////////////

function add_solved_set() {
  //* Übung in Training Array speichern
  //* Abgleichen ob bereits vorhanden per id match,
  //* wenn vorhanden eins hochzählen
  if (check_exercise_in_currentTraining(selected_Exercise)) {
    let currentSet =
      save_Object.current_training[
        `${indexOfExercise(selected_Exercise, save_Object.current_training)}`
      ].solved_sets;
    let new_set_amount = (currentSet += 1);
    save_Object.current_training[
      `${indexOfExercise(selected_Exercise, save_Object.current_training)}`
    ].solved_sets = new_set_amount;
    lbl_donesets.innerHTML = `${new_set_amount}`;
  } else {
    //* wenn nein, in das Array übertragen und eins hochzählen
    let cloned_exercise = Object.assign({}, selected_Exercise);
    cloned_exercise.solved_sets = cloned_exercise.solved_sets += 1;
    save_Object.current_training.push(cloned_exercise);
    lbl_donesets.innerHTML = `${cloned_exercise.solved_sets}`;
  }
}

/////////////////////////////////////
//* ANCHOR - check Exercise in current Training
/////////////////////////////////////

function check_exercise_in_currentTraining(exercise) {
  const exerciseId = exercise.exercise_id;
  let is_in_currentTraining = false;

  for (let i = 0; i < save_Object.current_training.length; i++) {
    if (save_Object.current_training[i].exercise_id === exerciseId) {
      is_in_currentTraining = true;
      break;
    }
  }

  return is_in_currentTraining;
}

/////////////////////////////////////
//* ANCHOR - Index of Exercise
/////////////////////////////////////

function indexOfExercise(exercise, arr) {
  const exerciseId = exercise.exercise_id;
  let index = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].exercise_id === exerciseId) {
      index = i;
      break;
    }
  }

  return index;
}

/////////////////////////////////////
//* ANCHOR - Modals
/////////////////////////////////////

btn_open_edit.addEventListener("click", () => {
  Modal.open_modal(modal_edit);
  is_edit = false;
  btn_delete_exercise.classList.remove("active");
});

btn_edit.addEventListener("click", () => {
  is_edit = true;
  btn_delete_exercise.classList.add("active");
  Modal.open_modal(modal_edit);
  load_exercise_into_edit();
});

btn_add.addEventListener("click", () => {
  Modal.open_modal(modal_edit);
  is_edit = false;
  btn_delete_exercise.classList.remove("active");
});

btn_open_calendar.addEventListener("click", () => {
  Modal.open_modal(modal_calendar);
  calendar(save_Object, calendar_year);
});

btn_show_trainings.addEventListener("click", () => {
  Modal.open_modal(modal_trainings);
  render_trainings(save_Object);
});

btn_gotoSolvedTrainings.addEventListener("click", () => {
  Modal.open_modal(modal_trainings);
  render_trainings(save_Object);
  statistic();
  console.log("%c Feffe", `color: green; font-weight: bold; font-size: 20px;`);
});

btn_home.addEventListener("click", () => {
  Modal.close_all_modals();
});

btn_settings.addEventListener("click", () => {
  Modal.open_modal(modal_settings);
});

modal_close_btn.forEach((c_btn) => {
  c_btn.addEventListener("click", () => {
    Modal.close_all_modals();
  });
});

/////////////////////////////////////
//* ANCHOR - Observer
/////////////////////////////////////
function observer() {
  //* Schaue ob trainin aktiv
  if (training_running) {
    if (save_Object.last_exercise_id) {
      const lastExerciseElement = document.getElementById(
        save_Object.last_exercise_id,
      );
      if (lastExerciseElement) {
        setTimeout(() => {
          lastExerciseElement.scrollIntoView({ behavior: "smooth" });
          delete save_Object.last_exercise_id;
        }, 1100);
        save_into_storage(save_Object);
      }
    }
    bdy.classList.add("active-training");
    btn_finish.classList.add("active-training");
    //* Show Active Training section
    active_training_sect.classList.add("active");
    //* Update Time Label
    const trainingsdate = new Date(save_Object.training_start);
    const trainingsEnd_timestamp = new Date();
    const duration = minutesDiff(trainingsEnd_timestamp, trainingsdate);
    document.getElementById("lbl_time").innerHTML = `Zeit: ${duration}`;
    //*Update solved sets
    document.getElementById("lbl_overview_sets").innerHTML =
      `Absolvierte Sätze: ${sum_of_sets()}`;
    //*Update moved Weight
    document.getElementById("lbl_overview_weight").innerHTML =
      `Bewegtes Gewicht: ${sum_of_weight(save_Object.current_training).weightWithCommas} Kg`;

    render_active_training_muscle_summary();
  } else {
    bdy.classList.remove("active-training");
    btn_finish.classList.remove("active-training");
    active_training_sect.classList.remove("active");
    clear_active_training_muscle_summary();
  }
}

function clear_active_training_muscle_summary() {
  const container = document.getElementById("active_training_muscle_summary");
  if (!container) return;
  container.innerHTML = "";
}

function render_active_training_muscle_summary() {
  const container = document.getElementById("active_training_muscle_summary");
  if (!container) return;

  const currentTraining = save_Object.current_training || [];
  if (currentTraining.length === 0) {
    container.innerHTML =
      '<p class="muscle-summary-empty">Noch keine Sätze getrackt.</p>';
    return;
  }

  const summaryByMuscle = new Map();
  for (let i = 0; i < currentTraining.length; i++) {
    const entry = currentTraining[i];
    const musclegroup = entry.musclegroup || "-";
    const solvedSets = Number(entry.solved_sets) || 0;
    const weight = Number(entry.weight) || 0;
    const repeats = Number(entry.repeats) || 0;
    const movedWeight = solvedSets * repeats * weight;

    if (!summaryByMuscle.has(musclegroup)) {
      summaryByMuscle.set(musclegroup, { sets: 0, weight: 0 });
    }
    const agg = summaryByMuscle.get(musclegroup);
    agg.sets += solvedSets;
    agg.weight += movedWeight;
  }

  const rows = Array.from(summaryByMuscle.entries())
    .map(([musclegroup, agg]) => ({
      musclegroup,
      sets: agg.sets,
      weight: agg.weight,
    }))
    .sort(
      (a, b) =>
        b.sets - a.sets ||
        b.weight - a.weight ||
        a.musclegroup.localeCompare(b.musclegroup),
    );

  const fmt = new Intl.NumberFormat("de-DE");

  const table = document.createElement("table");
  table.classList.add("muscle-summary-table");

  const headerRow = document.createElement("tr");
  const thMuscle = document.createElement("th");
  const thSets = document.createElement("th");
  const thWeight = document.createElement("th");
  thMuscle.textContent = "Muskelgruppe";
  thSets.textContent = "Sätze";
  thWeight.textContent = "Gewicht (Kg)";
  headerRow.appendChild(thMuscle);
  headerRow.appendChild(thSets);
  headerRow.appendChild(thWeight);
  table.appendChild(headerRow);

  let totalSets = 0;
  let totalWeight = 0;
  for (let i = 0; i < rows.length; i++) {
    totalSets += rows[i].sets;
    totalWeight += rows[i].weight;

    const row = document.createElement("tr");
    const tdMuscle = document.createElement("td");
    const tdSets = document.createElement("td");
    const tdWeight = document.createElement("td");
    tdMuscle.textContent = rows[i].musclegroup;
    tdSets.textContent = String(rows[i].sets);
    tdWeight.textContent = fmt.format(Math.round(rows[i].weight));
    row.appendChild(tdMuscle);
    row.appendChild(tdSets);
    row.appendChild(tdWeight);
    table.appendChild(row);
  }

  const totalRow = document.createElement("tr");
  totalRow.classList.add("muscle-summary-total");
  const tdTotalLabel = document.createElement("td");
  const tdTotalSets = document.createElement("td");
  const tdTotalWeight = document.createElement("td");
  tdTotalLabel.textContent = "Gesamt";
  tdTotalSets.textContent = String(totalSets);
  tdTotalWeight.textContent = fmt.format(Math.round(totalWeight));
  totalRow.appendChild(tdTotalLabel);
  totalRow.appendChild(tdTotalSets);
  totalRow.appendChild(tdTotalWeight);
  table.appendChild(totalRow);

  container.innerHTML = "";
  container.appendChild(table);
}

//* ANCHOR - Sum of Sets
function sum_of_sets() {
  let solvedSets = 0;
  for (let i = 0; i < save_Object.current_training.length; i++) {
    solvedSets = solvedSets += save_Object.current_training[i].solved_sets;
  }
  return solvedSets;
}

//* Slider

inpExercise_Repeats.addEventListener("input", () => {
  lbl_exerciseRepeats.innerHTML = inpExercise_Repeats.value;
});
inpExercise_Sets.addEventListener("input", () => {
  lbl_exerciseSets.innerHTML = inpExercise_Sets.value;
});

/////////////////////////////////////
//* ANCHOR - finish training
/////////////////////////////////////
btn_finish.addEventListener("click", () => {
  finish_training();
});
function finish_training() {
  const decision = window.confirm("Soll das Training beendet werden?");
  if (decision) {
    delete save_Object.last_exercise_id; //* remove last exercise id from save obj
    const trainingsdate = new Date(save_Object.training_start);
    const day = trainingsdate.getDate();
    const month = trainingsdate.getMonth() + 1;
    const year = trainingsdate.getFullYear();
    const datum = `${add_zero(day)}.${add_zero(month)}.${year}`;

    const trainingsEnd_timestamp = new Date();
    const duration = minutesDiff(trainingsEnd_timestamp, trainingsdate);

    //* Trainingsobject erstellen und abspeichern
    const new_solved_training = new Training(
      datum,
      duration,
      save_Object.current_training,
    );

    save_Object.trainings.push(new_solved_training);

    //* alle sets zurücksetzen
    for (let i = 0; i < save_Object.exercises.length; i++) {
      save_Object.exercises[i].solved_sets = 0;
    }

    //*Reset current training
    save_Object.current_training = [];

    //* trainingsstart reset
    save_Object.training_start = "";

    //* set training is running to false
    training_running = false;
    save_Object.training_is_running = false;

    // * Save into storage
    save_into_storage(save_Object);

    const exercArr = new_solved_training.exercises;
    let exerciseInfoArr = "";
    for (let j = 0; j < exercArr.length; j++) {
      const newRow = `\n ${exercArr[j].name} - ${exercArr[j].solved_sets} x `;
      exerciseInfoArr = exerciseInfoArr + newRow;
    }
    //TODO -  replace alert
    alert(`Training beendet \n Datum: ${datum} \n
        Zeit: ${duration} \n
        Übungen: ${exerciseInfoArr}`);

    //* reload page
    location.reload();
  }
}

/////////////////////////////////////
//* ANCHOR - Edit Exercise
/////////////////////////////////////
function load_exercise_into_edit() {
  inpExercise_Name.value = selected_Exercise.name;
  inpExercise_Weight.value = selected_Exercise.weight;
  inpExercise_Sets.value = selected_Exercise.sets;
  inpExercise_Repeats.value = selected_Exercise.repeats;
  inpExercise_number.value = selected_Exercise.machineNumber;
  inpExercise_seatSettings.value = selected_Exercise.machine_seat_settings;
  muscle_select.value = selected_Exercise.musclegroup;
  training_Area.value = selected_Exercise.trainingsplace;
  lbl_exerciseRepeats.innerHTML = inpExercise_Repeats.value;
  lbl_exerciseSets.innerHTML = inpExercise_Sets.value;
}

/////////////////////////////////////
//* ANCHOR - Statistic
/////////////////////////////////////
function statistic() {
  const trainingsByYear = {};

  // Gruppiere Trainings nach Jahr
  save_Object.trainings.forEach((training) => {
    const year = splitVal(training.training_date, ".", 2);
    if (!trainingsByYear[year]) {
      trainingsByYear[year] = [];
    }
    trainingsByYear[year].push(training);
  });

  statistics_table.innerHTML = "";
  let headline = document.createElement("h3");
  headline.innerHTML = "Statistik für alle Jahre";
  statistics_table.appendChild(headline);

  // Sortiere die Jahre in absteigender Reihenfolge
  const sortedYears = Object.keys(trainingsByYear).sort((a, b) => b - a);

  sortedYears.forEach((year) => {
    let fitti_trainings = 0;
    let home_trainings = 0;
    let total_trainings = 0;

    const trainingsByDate = {};

    // Gruppiere Trainings nach Datum
    trainingsByYear[year].forEach((training) => {
      const date = training.training_date;
      if (!trainingsByDate[date]) {
        trainingsByDate[date] = [];
      }
      trainingsByDate[date].push(training);
    });

    Object.keys(trainingsByDate).forEach((date) => {
      const trainings = trainingsByDate[date];
      let maxExercisesTraining = trainings[0];

      // Finde das Training mit den meisten Übungen
      trainings.forEach((training) => {
        if (training.exercises.length > maxExercisesTraining.exercises.length) {
          maxExercisesTraining = training;
        }
      });

      total_trainings++;

      const trainingsplace = identify_trainingsplace(
        maxExercisesTraining.exercises,
      );

      if (trainingsplace === "Fitti") {
        fitti_trainings++;
      } else if (trainingsplace === "Home") {
        home_trainings++;
      }
    });

    // Create table for each year
    const table = document.createElement("table");
    const header = document.createElement("tr");
    const placeHeaderCell = document.createElement("th");
    const countHeaderCell = document.createElement("th");
    placeHeaderCell.appendChild(document.createTextNode("Trainingsort"));
    countHeaderCell.appendChild(document.createTextNode("Anzahl"));
    header.appendChild(placeHeaderCell);
    header.appendChild(countHeaderCell);
    table.appendChild(header);

    // Add rows
    const fittiRow = document.createElement("tr");
    const fittiPlaceCell = document.createElement("td");
    const fittiCountCell = document.createElement("td");
    fittiPlaceCell.appendChild(document.createTextNode("Fitnessstudio"));
    fittiCountCell.appendChild(document.createTextNode(fitti_trainings));
    fittiRow.appendChild(fittiPlaceCell);
    fittiRow.appendChild(fittiCountCell);
    table.appendChild(fittiRow);

    const homeRow = document.createElement("tr");
    const homePlaceCell = document.createElement("td");
    const homeCountCell = document.createElement("td");
    homePlaceCell.appendChild(document.createTextNode("Heimtraining"));
    homeCountCell.appendChild(document.createTextNode(home_trainings));
    homeRow.appendChild(homePlaceCell);
    homeRow.appendChild(homeCountCell);
    table.appendChild(homeRow);

    const totalRow = document.createElement("tr");
    const totalPlaceCell = document.createElement("td");
    const totalCountCell = document.createElement("td");
    totalPlaceCell.appendChild(document.createTextNode("Gesamt"));
    totalCountCell.appendChild(document.createTextNode(total_trainings));
    totalRow.appendChild(totalPlaceCell);
    totalRow.appendChild(totalCountCell);
    table.appendChild(totalRow);

    // Append table to statistics_table div
    let yearHeadline = document.createElement("h4");
    yearHeadline.innerHTML = `Statistik für das Jahr ${year}`;
    statistics_table.appendChild(yearHeadline);
    statistics_table.appendChild(table);
  });
}

/////////////////////////////////////
//* ANCHOR - Delete Exercise
/////////////////////////////////////

btn_delete_exercise.addEventListener("click", () => {
  const decision = window.confirm("Soll die Übung gelöscht werden?");
  if (decision) {
    save_Object.exercises.splice(
      indexOfExercise(selected_Exercise, save_Object.exercises),
      1,
    );
    save_into_storage(save_Object);
    location.reload();
  }
});

const mini_modal_close_btns = document.querySelectorAll(
  ".mini_modal_close_btn",
);
mini_modal_close_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    Mini_Modal.close_all_modals();
  });
});
