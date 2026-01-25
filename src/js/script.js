import { backup } from "./backup.js";
import { restTimer } from "./rest_timer.js";
import { splitVal } from "./functions.js";
import { rnd_id } from "./functions.js";
import { add_zero } from "./functions.js";
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

/////////////////////////////////////
//* ANCHOR -  Variablen
/////////////////////////////////////
let training_running = false;
let selected_Exercise;
let is_edit = false;
let calendar_year = undefined;

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
};

/////////////////////////////////////
// * ANCHOR - Init
/////////////////////////////////////
window.onload = () => {
  load_local_storage();
  add_years_to_select();

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
      };
      backup(save_Object);
      save_into_storage(save_Object);
    }

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
    const hasFitti = exercises.some((e) => e.trainingsplace === "Fitnessstudio");
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
  training_counter.innerHTML = `Bereits <span class="training-sum-number">${sum}</span> Trainingstag(e) im Jahr ${current_Year}`;

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
  exercise_table.innerHTML = "";
  let last_training_date = null;

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
    lbl_solved_sum.innerHTML = `Insgesamt ${solved_exercise_amount} mal absolviert mit insgesamt ${solved_set_sum} Sätzen`;
  }

  //* show if the exercise has not been performed before
  if (is_never_trained) {
    let lbl = document.createElement("div");
    lbl.innerHTML = "Noch keine Übung absolviert";
    lbl.style.color = "yellow";
    exercise_table.appendChild(lbl);
  }
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
