export function calendar(save_obj) {
    console.log('calendar: ',save_obj);
    const calendar = document.getElementById('calendar');
    draw_calendar(calendar, save_obj, 2025);
}


function draw_calendar(calendar, save_obj, ref_year) {

    for(let i = 1; i <= 12; i++) {
        if(i === 2) {
            draw_month(calendar, save_obj, 28, i);
        }else if(i === 4 || i === 6 || i === 9 || i === 11) {
            draw_month(calendar, save_obj, 30, i);
        }else {
            draw_month(calendar, save_obj, 31, i);
        }
    }

}

function draw_month(calendar, save_obj, max_day, month_index) {
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    let month = document.createElement('div');
    month.classList.add('month-wrapper');
    let month_title = document.createElement('h3');
    month_title.innerHTML = months[month_index - 1];

    for(let i = 1; i <= max_day; i++) {
        let calendar_day = document.createElement('div');
        calendar_day.innerHTML = `${i}`;
        calendar_day.classList.add('calendar-day');

        
        if(i % 2 === 0) {
            let training_day = document.createElement('div');
            training_day.classList.add('calendar-training-day');
            calendar_day.appendChild(training_day);
        }
        calendar.appendChild(month_title)
        month.appendChild(calendar_day)
        calendar.appendChild(month)
        
    }
}