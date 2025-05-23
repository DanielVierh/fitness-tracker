import { add_zero } from "./functions.js";

export function calendar(save_obj, _calendar_year) {
  const calendar = document.getElementById("calendar");
  const calendar_top = document.getElementById("calendar_top");
  calendar.innerHTML = '';
  //* check and set year
  const today = new Date();
  let ref_year = undefined;
  const this_year = today.getFullYear();
  if(_calendar_year === undefined) {
     ref_year = this_year;
  }else {
    ref_year = _calendar_year
  }
  //* Create year label
  let year_label = document.createElement('h2');
  year_label.innerHTML = ref_year;
  year_label.classList.add('calendar-year-label')
  calendar.appendChild(year_label);

  draw_calendar(calendar, save_obj, ref_year);
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
  const today = new Date();
  const today_date = `${add_zero(today.getDate())}.${add_zero(today.getMonth() + 1)}.${today.getFullYear()}`;

  //* Loop for days
  for (let i = 1; i <= max_day; i++) {
    let calendar_day = document.createElement("div");
    // calendar_day.innerHTML = `${i}`;
    calendar_day.classList.add("calendar-day");
    const current_day = `${add_zero(i)}.${add_zero(month_index)}.${ref_year}`;
    const date = new Date(ref_year, month_index - 1, i);
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const weekday = days[date.getDay()];
    calendar_day.innerHTML = `${add_zero(i)} <br> ${weekday}`;

    if(current_day === today_date) {
      calendar_day.classList.add('current-day')
    }

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
    
    document.getElementById('calendar_top').scrollIntoView();
  }
}
