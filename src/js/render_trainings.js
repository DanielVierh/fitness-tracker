import { sum_of_weight } from "./sum_of_weight";
import { createTable } from "./create_table.js";
import { time_between_dates } from "./time_between_days.js";
import { identify_trainingsplace } from "./functions.js";

export function render_trainings(save_Object, spezific_date, options = {}) {
  const {
    targetWrapperId = "trainings_wrapper",
    collapsed = true,
    showMaxWeightLabel = true,
    month,
    year,
  } = options;

  const trainings_wrapper = document.getElementById(targetWrapperId);
  const trainingamount = save_Object.trainings.length - 1;
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
    const trainingDate = save_Object.trainings[idx].training_date;
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
    const training_weight_sum_Int = sum_of_weight(
      save_Object.trainings[i].exercises,
    ).weight;
    const training_weight_sum = sum_of_weight(
      save_Object.trainings[i].exercises,
    ).weightWithCommas;
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

        const trainingEntry = document.createElement("div");
        trainingEntry.classList.add("training-entry");

        const header = document.createElement("div");
        header.classList.add("training-entry__header");

        const details = document.createElement("div");
        details.classList.add("training-entry__details");
        details.id = `training_details_${i}_${targetWrapperId}`;
        details.hidden = true;

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

        details.appendChild(deleteButton);
        details.appendChild(table);

        trainingEntry.appendChild(header);
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

  if (showMaxWeightLabel) {
    const max_weight_label = document.getElementById("max_weight_label");
    if (max_weight_label && max_weight_sum.amount > 0) {
      max_weight_label.innerHTML = `Maximal bewegtes Gewicht: <br> ${max_weight_sum.amount_with_comma} Kg am ${max_weight_sum.date}`;
    }
  }
}
