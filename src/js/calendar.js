export function calendar(save_obj) {
    console.log('calendar: ',save_obj);
    const calendar = document.getElementById('calendar');

    draw_calendar(calendar);
    
}


function draw_calendar(calendar) {
    for(let i = 1; i <= 31; i++) {
        
        let calendar_day = document.createElement('div');
        calendar_day.innerHTML = `${i}`;
        calendar_day.classList.add('calendar-day');

        if(i % 2 === 0) {
            let training_day = document.createElement('div');
            training_day.classList.add('calendar-training-day');
            calendar_day.appendChild(training_day);
        }

        calendar.appendChild(calendar_day)
        
    }
}