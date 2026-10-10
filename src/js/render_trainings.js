import {
  get_exercise_set_weights,
  get_exercise_total_weight,
  identify_trainingsplace,
  numberWithCommas,
} from "./functions.js";
import { sum_of_weight } from "./sum_of_weight";
import { createTable } from "./create_table.js";
import { time_between_dates } from "./time_between_days.js";
import { classify_training_for_comparison } from "./training_classification.js";

const trainingNumberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1,
});

function find_previous_cardio_training(trainings, trainingIndex) {
  for (let index = trainingIndex - 1; index >= 0; index--) {
    if (
      classify_training_for_comparison(trainings[index]) === "cardio" &&
      parse_duration_minutes(trainings[index].duration) > 0
    ) {
      return trainings[index];
    }
  }
  return null;
}

function find_previous_exercise_training(
  trainings,
  trainingIndex,
  exercise,
) {
  if (
    exercise.trainingsplace !== "Fitnessstudio" &&
    exercise.trainingsplace !== "Heimtraining"
  ) {
    return null;
  }

  for (let index = trainingIndex - 1; index >= 0; index--) {
    const training = trainings[index];
    if (classify_training_for_comparison(training) !== "strength") continue;

    const previousExercise = (training.exercises || []).find((candidate) => {
      if (candidate.trainingsplace !== exercise.trainingsplace) return false;

      const currentId = String(exercise.exercise_id || "").trim();
      const previousId = String(candidate.exercise_id || "").trim();
      if (currentId && previousId) return currentId === previousId;

      const currentName = String(exercise.name || "").trim().toLowerCase();
      const previousName = String(candidate.name || "").trim().toLowerCase();
      return currentName.length > 0 && currentName === previousName;
    });

    if (previousExercise) {
      return { exercise: previousExercise, training };
    }
  }
  return null;
}

function parse_duration_minutes(duration) {
  if (typeof duration !== "string") return 0;
  const parts = duration.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return 0;

  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function format_training_number(value) {
  return trainingNumberFormatter.format(value);
}

function format_change(previousValue, currentValue) {
  const change = currentValue - previousValue;
  if (change === 0) return "unverändert";

  const sign = change > 0 ? "+" : "−";
  const percentage =
    previousValue > 0
      ? `, ${sign}${format_training_number(Math.abs((change / previousValue) * 100))} %`
      : "";
  return `${sign}${format_training_number(Math.abs(change))}${percentage}`;
}

function create_strength_comparison(exercise, previousMatch) {
  if (!previousMatch) return null;

  const previousExercise = previousMatch.exercise;
  const currentWeights = get_exercise_set_weights(exercise);
  const previousWeights = get_exercise_set_weights(previousExercise);
  const currentMaxWeight = Math.max(...currentWeights, 0);
  const previousMaxWeight = Math.max(...previousWeights, 0);
  const currentVolume = get_exercise_total_weight(exercise);
  const previousVolume = get_exercise_total_weight(previousExercise);
  const parts = [];

  if (previousMaxWeight > 0 || currentMaxWeight > 0) {
    if (previousMaxWeight !== currentMaxWeight) {
      parts.push(
        `max. Gewicht ${format_training_number(previousMaxWeight)} → ${format_training_number(currentMaxWeight)} kg (${format_change(previousMaxWeight, currentMaxWeight)})`,
      );
    }
  } else {
    const previousSets = Number(previousExercise.solved_sets) || 0;
    const currentSets = Number(exercise.solved_sets) || 0;
    if (previousSets !== currentSets) {
      parts.push(
        `${previousSets} → ${currentSets} absolvierte Sätze (${format_change(previousSets, currentSets)})`,
      );
    }
  }

  if (previousVolume > 0 || currentVolume > 0) {
    if (previousVolume !== currentVolume) {
      parts.push(
        `Volumen ${numberWithCommas(Math.round(previousVolume))} → ${numberWithCommas(Math.round(currentVolume))} kg (${format_change(previousVolume, currentVolume)})`,
      );
    }
  } else {
    const previousRepeats = Number(previousExercise.repeats) || 0;
    const currentRepeats = Number(exercise.repeats) || 0;
    if (previousRepeats !== currentRepeats) {
      parts.push(
        `Wiederholungen/Satz ${previousRepeats} → ${currentRepeats} (${format_change(previousRepeats, currentRepeats)})`,
      );
    }
  }

  if (parts.length === 0) return null;

  const comparison = document.createElement("p");
  comparison.classList.add("training-entry__comparison");
  const label = document.createElement("strong");
  label.textContent = `${exercise.name || "Übung"}: `;
  comparison.appendChild(label);
  comparison.append(
    `Vergleich zu ${previousMatch.training.training_date || "letztem Training"}: ${parts.join(" · ")}`,
  );
  return comparison;
}

function create_training_comparison(training, trainingIndex, trainings) {
  const trainingType = classify_training_for_comparison(training);
  const details = [];

  if (trainingType === "cardio") {
    const previousTraining = find_previous_cardio_training(
      trainings,
      trainingIndex,
    );
    const currentDuration = parse_duration_minutes(training.duration);
    const previousDuration = previousTraining
      ? parse_duration_minutes(previousTraining.duration)
      : 0;
    if (
      previousTraining &&
      currentDuration > 0 &&
      currentDuration !== previousDuration
    ) {
      const detail = document.createElement("p");
      detail.classList.add("training-entry__comparison");
      detail.textContent = `Cardio-Dauer: ${format_training_number(previousDuration)} → ${format_training_number(currentDuration)} Min (${format_change(previousDuration, currentDuration)}) · ${previousTraining.training_date}`;
      details.push(detail);
    }
  } else if (trainingType === "strength") {
    training.exercises
      .filter(
        (exercise) =>
          exercise.trainingsplace === "Fitnessstudio" ||
          exercise.trainingsplace === "Heimtraining",
      )
      .forEach((exercise) => {
        const detail = create_strength_comparison(
          exercise,
          find_previous_exercise_training(trainings, trainingIndex, exercise),
        );
        if (detail) details.push(detail);
      });
  }

  if (details.length === 0) return null;

  const comparison = document.createElement("section");
  comparison.classList.add("training-entry__comparisons");
  const heading = document.createElement("h4");
  heading.textContent = "Vergleich zum letzten passenden Training";
  comparison.appendChild(heading);
  details.forEach((detail) => comparison.appendChild(detail));
  return comparison;
}

export function render_trainings(save_Object, spezific_date, options = {}) {
  const {
    targetWrapperId = "trainings_wrapper",
    collapsed = true,
    showMaxWeightLabel = true,
    month,
    year,
  } = options;

  const trainings_wrapper = document.getElementById(targetWrapperId);
  if (trainings_wrapper) {
    trainings_wrapper.innerHTML = "";
  }

  if (spezific_date !== undefined) {
    const mini_trainings_wrapper = document.getElementById(
      "mini_trainings_wrapper",
    );
    mini_trainings_wrapper.innerHTML = "";
    const training = save_Object.trainings.find(
      (training) => training.training_date === spezific_date,
    );
    if (training) {
      const tableContainer = createTable(
        `${training.training_date} - ${training.duration} - ${identify_trainingsplace(training.exercises)}`,
        training.exercises,
        false,
        0,
        save_Object,
      );
      mini_trainings_wrapper.appendChild(tableContainer);
      const training_date_element = document.querySelector(
        `[data-trainingDate="${training_date}"]`,
      );

      setTimeout(() => {
        training_date_element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 1000);
      return;
    } else {
      const message = new Message(
        "Kein Training an diesem Datum gefunden",
        "",
        "error",
        3000,
      );
      message.showMessage();
      return;
    }
  }

  let max_weight_sum = {
    amount: 0,
    amount_with_comma: "",
    date: "",
  };

  const filteredTrainingIndexes = [];
  for (let idx = 0; idx < save_Object.trainings.length; idx++) {
    const trainingDate = save_Object.trainings[idx].training_date || "";
    const parts = trainingDate.split(".");
    const trainingMonth = parts[1];
    const trainingYear = parts[2];

    const monthMatches =
      month === undefined
        ? true
        : trainingMonth === String(month).padStart(2, "0");
    const yearMatches =
      year === undefined ? true : trainingYear === String(year);

    if (monthMatches && yearMatches) {
      filteredTrainingIndexes.push(idx);
    }
  }

  for (let pos = filteredTrainingIndexes.length - 1; pos > -1; pos--) {
    const i = filteredTrainingIndexes[pos];
    const trainingsdate = save_Object.trainings[i].training_date;

    const duration = save_Object.trainings[i].duration;
    const exc = save_Object.trainings[i].exercises;
    const traintingsplace = identify_trainingsplace(exc);
    //* Trainings weight
    const trainingWeight = sum_of_weight(exc);
    const training_weight_sum_Int = trainingWeight.weight;
    const training_weight_sum = trainingWeight.weightWithCommas;
    let trainings_weight_label = "";
    training_weight_sum > 0
      ? (trainings_weight_label = ` - Trainingsgewicht: ${training_weight_sum} Kg bewegt`)
      : (trainings_weight_label = "");

    //*emmit max weight sum
    if (training_weight_sum_Int > max_weight_sum.amount) {
      max_weight_sum.amount = training_weight_sum_Int;
      max_weight_sum.amount_with_comma = training_weight_sum;
      max_weight_sum.date = trainingsdate;
    }

    const tableContainer = createTable(
      `${trainingsdate} - ${duration} - ${traintingsplace} ${trainings_weight_label}`,
      exc,
      false,
      i,
      save_Object,
    );

    if (trainings_wrapper) {
      if (collapsed) {
        const heading = tableContainer.querySelector("h3");
        const deleteButton = tableContainer.querySelector(".delete-button");
        const table = tableContainer.querySelector("table");
        const tableHeadings = [
          ["Übung", "Name der Übung"],
          ["Sätze", "Absolvierte Sätze"],
          ["Wdh.", "Wiederholungen je Satz"],
          ["kg", "Trainingsgewicht je Satz in Kilogramm"],
          ["Vol.", "Bewegtes Volumen in Kilogramm"],
          ["Muskel", "Trainierte Muskelgruppe"],
        ];
        table.querySelectorAll("th").forEach((cell, columnIndex) => {
          const [label, description] = tableHeadings[columnIndex] || [];
          if (!label) return;
          cell.textContent = label;
          cell.title = description;
          cell.setAttribute("scope", "col");
        });
        table.classList.add("training-entry__table");

        const trainingEntry = document.createElement("div");
        trainingEntry.classList.add("training-entry");

        const header = document.createElement("div");
        header.classList.add("training-entry__header");

        const details = document.createElement("div");
        details.classList.add("training-entry__details");
        details.id = `training_details_${i}_${targetWrapperId}`;
        details.hidden = true;

        const training = save_Object.trainings[i];
        const completedSets = exc.reduce(
          (total, exercise) =>
            total + (Number(exercise?.solved_sets) || 0),
          0,
        );
        const summary = document.createElement("p");
        summary.classList.add("training-entry__summary");
        summary.textContent = `${exc.length} ${exc.length === 1 ? "Übung" : "Übungen"} · ${completedSets} ${completedSets === 1 ? "Satz" : "Sätze"} absolviert`;

        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.classList.add("training-entry__toggle");
        toggleButton.textContent = "Mehr anzeigen";
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-controls", details.id);

        toggleButton.addEventListener("click", () => {
          const willOpen = details.hidden;
          details.hidden = !willOpen;
          toggleButton.setAttribute("aria-expanded", String(willOpen));
          toggleButton.textContent = willOpen
            ? "Weniger anzeigen"
            : "Mehr anzeigen";
          trainingEntry.classList.toggle("is-open", willOpen);
        });
        header.appendChild(heading);
        header.appendChild(toggleButton);
        trainingEntry.appendChild(header);
        trainingEntry.appendChild(summary);
        const trainingComparison = create_training_comparison(
          training,
          i,
          save_Object.trainings,
        );
        if (trainingComparison) details.appendChild(trainingComparison);
        details.appendChild(deleteButton);
        details.appendChild(table);

        trainingEntry.appendChild(details);
        trainings_wrapper.appendChild(trainingEntry);
      } else {
        trainings_wrapper.appendChild(tableContainer);
      }
    }
    if (trainings_wrapper) {
      let lbl_time_to_last_training = document.createElement("p");
      lbl_time_to_last_training.classList.add("between-trainings");

      try {
        if (pos - 1 !== -1) {
          const lastIdx = filteredTrainingIndexes[pos - 1];
          const last_training = save_Object.trainings[lastIdx].training_date;
          const duration_to_last_training = time_between_dates(
            trainingsdate,
            last_training,
          );
          if (duration_to_last_training > 1) {
            lbl_time_to_last_training.innerHTML = `${duration_to_last_training}. Tage seit dem letzten Training`;
            trainings_wrapper.appendChild(lbl_time_to_last_training);
          } else if (duration_to_last_training === 1) {
            lbl_time_to_last_training.innerHTML = `${duration_to_last_training}. Tag seit dem letzten Training`;
            trainings_wrapper.appendChild(lbl_time_to_last_training);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (trainings_wrapper && collapsed && filteredTrainingIndexes.length > 0) {
    const trainingVolumeSeries = filteredTrainingIndexes
      .map((index) => {
        const training = save_Object.trainings[index];
        const dateParts = String(training.training_date || "")
          .split(".")
          .map(Number);
        const [day, trainingMonth, trainingYear] = dateParts;
        const parsedDate =
          dateParts.length === 3 &&
          Number.isInteger(day) &&
          Number.isInteger(trainingMonth) &&
          Number.isInteger(trainingYear)
            ? new Date(trainingYear, trainingMonth - 1, day)
            : null;
        const isValidDate =
          parsedDate &&
          parsedDate.getFullYear() === trainingYear &&
          parsedDate.getMonth() === trainingMonth - 1 &&
          parsedDate.getDate() === day;

        return {
          date: training.training_date || "",
          dateValue: isValidDate ? parsedDate.getTime() : index,
          index,
          volume: sum_of_weight(training.exercises || []).weight,
        };
      })
      .sort(
        (first, second) =>
          first.dateValue - second.dateValue || first.index - second.index,
      )
      .slice(-12);

    trainings_wrapper.prepend(
      create_training_volume_chart(trainingVolumeSeries),
    );
  }

  if (showMaxWeightLabel) {
    const max_weight_label = document.getElementById("max_weight_label");
    if (max_weight_label && max_weight_sum.amount > 0) {
      max_weight_label.innerHTML = `Maximal bewegtes Gewicht: <br> ${max_weight_sum.amount_with_comma} Kg am ${max_weight_sum.date}`;
    }
  }

  function create_training_volume_chart(series) {
    const section = document.createElement("section");
    section.classList.add("training-volume-trend");

    const heading = document.createElement("h4");
    heading.textContent = `Gesamtvolumen (kg) · letzte ${series.length} Trainings`;
    section.appendChild(heading);

    if (series.every((point) => point.volume <= 0)) {
      const emptyMessage = document.createElement("p");
      emptyMessage.classList.add("training-volume-trend__empty");
      emptyMessage.textContent =
        "Für diese Trainings liegen keine Gewichtsdaten vor.";
      section.appendChild(emptyMessage);
      return section;
    }

    const chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chart.classList.add("training-volume-trend__chart");
    chart.setAttribute("viewBox", "0 0 720 230");
    chart.setAttribute("role", "img");
    chart.setAttribute(
      "aria-label",
      `Bewegtes Gesamtgewicht in Kilogramm für die letzten ${series.length} Trainingseinheiten`,
    );

    const chartTitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title",
    );
    chartTitle.textContent = "Bewegtes Gesamtgewicht je Training";
    chart.appendChild(chartTitle);

    const width = 720;
    const height = 230;
    const padding = { top: 18, right: 20, bottom: 38, left: 58 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxVolume = Math.max(...series.map((point) => point.volume), 0) || 1;
    const xAt = (index) =>
      series.length === 1
        ? padding.left + chartWidth / 2
        : padding.left + (index / (series.length - 1)) * chartWidth;
    const yAt = (volume) =>
      padding.top + chartHeight - (volume / maxVolume) * chartHeight;

    for (let step = 0; step <= 4; step++) {
      const ratio = step / 4;
      const y = padding.top + ratio * chartHeight;
      const value = Math.round(maxVolume * (1 - ratio));

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.classList.add("training-volume-trend__grid-line");
      line.setAttribute("x1", String(padding.left));
      line.setAttribute("x2", String(width - padding.right));
      line.setAttribute("y1", y.toFixed(2));
      line.setAttribute("y2", y.toFixed(2));
      chart.appendChild(line);

      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      label.classList.add("training-volume-trend__axis-label");
      label.setAttribute("x", String(padding.left - 8));
      label.setAttribute("y", String(y + 4));
      label.setAttribute("text-anchor", "end");
      label.textContent = numberWithCommas(value);
      chart.appendChild(label);
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("training-volume-trend__line");
    path.setAttribute(
      "d",
      series
        .map(
          (point, index) =>
            `${index === 0 ? "M" : "L"}${xAt(index).toFixed(2)} ${yAt(point.volume).toFixed(2)}`,
        )
        .join(" "),
    );
    chart.appendChild(path);

    const maxTicks = 6;
    const tickInterval =
      series.length <= maxTicks
        ? 1
        : Math.ceil((series.length - 1) / (maxTicks - 1));
    const tickIndexes = new Set([0, series.length - 1]);
    for (let index = 0; index < series.length; index += tickInterval) {
      tickIndexes.add(index);
    }

    tickIndexes.forEach((index) => {
      const point = series[index];
      const shortDate = point.date.split(".").slice(0, 2).join(".");
      const xLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      xLabel.classList.add("training-volume-trend__date-label");
      xLabel.setAttribute("x", xAt(index).toFixed(2));
      xLabel.setAttribute("y", String(height - 10));
      xLabel.setAttribute("text-anchor", "middle");
      xLabel.textContent = shortDate;
      chart.appendChild(xLabel);
    });

    series.forEach((point, index) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.classList.add("training-volume-trend__point");
      circle.setAttribute("cx", xAt(index).toFixed(2));
      circle.setAttribute("cy", yAt(point.volume).toFixed(2));
      circle.setAttribute("r", "4");

      const tooltip = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "title",
      );
      tooltip.textContent = `${point.date}: ${numberWithCommas(Math.round(point.volume))} kg`;
      circle.appendChild(tooltip);
      chart.appendChild(circle);
    });

    section.appendChild(chart);
    return section;
  }
}
