import { add_zero } from "./functions.js";

export function calendar(save_obj) {
  console.log("calendar: ", save_obj);
  const calendar = document.getElementById("calendar");
  draw_calendar(calendar, save_obj, 2025);
}

//* Function to render every Month
function draw_calendar(calendar, save_obj, ref_year) {
  for (let i = 1; i <= 12; i++) {
    if (i === 2) {
      draw_month(calendar, save_obj, 28, i, ref_year);
    } else if (i === 4 || i === 6 || i === 9 || i === 11) {
      draw_month(calendar, save_obj, 30, i, ref_year);
    } else {
      draw_month(calendar, save_obj, 31, i, ref_year);
    }
  }
}

//* Function to render the days per Month
function draw_month(calendar, save_obj, max_day, month_index, ref_year) {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  let month = document.createElement("div");
  month.classList.add("month-wrapper");
  let month_title = document.createElement("h3");
  month_title.innerHTML = months[month_index - 1];

  //* Loop for days
  for (let i = 1; i <= max_day; i++) {
    let calendar_day = document.createElement("div");
    calendar_day.innerHTML = `${i}`;
    calendar_day.classList.add("calendar-day");
    const current_day = `${add_zero(i)}.${add_zero(month_index)}.${ref_year}`;

    //* Loop to Match Training Days and nark them
    for (let j = 0; j < save_obj.trainings.length; j++) {
      const current_training_date = save_obj.trainings[j].training_date;

      if (current_day === current_training_date) {
        let training_day = document.createElement("div");
        training_day.classList.add("calendar-training-day");
        calendar_day.appendChild(training_day);
        calendar_day.classList.add('sport-day')
        break;
      }
    }

    calendar.appendChild(month_title);
    month.appendChild(calendar_day);
    calendar.appendChild(month);
  }
}
