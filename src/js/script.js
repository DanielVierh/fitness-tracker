import { backup } from './backup.js';
import { restTimer } from './rest_timer.js';
import { splitVal } from './functions.js';
import { rnd_id } from './functions.js';
import { add_zero } from './functions.js';
import { minutesDiff } from './functions.js';
import { daysDiff } from './functions.js';
import { Exercise } from './Classes/Exercise.js';
import { Training } from './Classes/Training.js';
import { Modal } from './Classes/Modal.js';


restTimer();
/////////////////////////////////////
// * Variablen
/////////////////////////////////////
//* ANCHOR - Elemente

const exercise_container = document.getElementById('exercise_container');
const btn_add = document.getElementById('btn_add');
const btn_saveExercise = document.getElementById('btn_saveExercise');
const modal_edit = document.getElementById("modal_edit");
const modal_exercise = document.getElementById("modal_exercise");
const modal_settings = document.getElementById("modal_settings");
const btn_home = document.getElementById("btn_home");
const btn_settings = document.getElementById("btn_settings");
const btn_open_edit = document.getElementById("btn_open_edit");
const modal_close_btn = document.querySelectorAll('.modal_close_btn');
const lbl_trainingsname = document.getElementById('lbl_trainingsname');
const lbl_weight = document.getElementById('lbl_weight');
const lbl_sets = document.getElementById('lbl_sets');
const lbl_repeats = document.getElementById('lbl_repeats');
const lbl_number = document.getElementById('lbl_number');
const lbl_seatsettings = document.getElementById('lbl_seatsettings');
const lbl_muscleselect = document.getElementById('lbl_muscleselect');
const lbl_donesets = document.getElementById('lbl_donesets');
const btn_trackSport = document.getElementById('btn_trackSport');
const lbl_trainingsarea = document.getElementById('lbl_trainingsarea');
const bdy = document.getElementById('bdy');
const btn_finish = document.getElementById('btn_finish');
const btn_show_trainings = document.getElementById('btn_show_trainings');
const modal_trainings = document.getElementById('modal_trainings');
const trainings_wrapper = document.getElementById('trainings_wrapper');
const last_training = document.getElementById('last_training');
const btn_edit = document.getElementById('btn_edit');
const exercise_table = document.getElementById('exercise_table');
const lbl_exerciseRepeats = document.getElementById('lbl_exerciseRepeats');
const lbl_exerciseSets = document.getElementById('lbl_exerciseSets');
const btn_gotoSolvedTrainings = document.getElementById('btn_gotoSolvedTrainings');
const change_StatisticYear = document.getElementById('statisticYear_select');
let inpExercise_Name = document.getElementById('inpExercise_Name');
let inpExercise_Weight = document.getElementById('inpExercise_Weight');
let inpExercise_Sets = document.getElementById('inpExercise_Sets');
let inpExercise_Repeats = document.getElementById('inpExercise_Repeats');
let inpExercise_number = document.getElementById('inpExercise_number');
let inpExercise_seatSettings = document.getElementById('inpExercise_seatSettings');
let muscle_select = document.getElementById('muscle_select');
let training_Area = document.getElementById('training_Area');
const active_training_sect = document.getElementById('active_training_sect');
const statistics_table = document.getElementById('statistics_table');
const btn_delete_exercise = document.getElementById('btn_delete_exercise');



/////////////////////////////////////
//* ANCHOR -  Variablen
/////////////////////////////////////
let training_running = false;
let training_place_filter = '';
let selected_Exercise;
let is_edit = false;

/////////////////////////////////////
//*  Saveobj
/////////////////////////////////////
let save_Object = {
    training_is_running: false,
    training_start: '',
    exercises: [],
    trainings: [],
    current_training: [],
    training_place_filter: '',
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
}


/////////////////////////////////////
//* ANCHOR - Load Local Storage
/////////////////////////////////////
function load_local_storage() {
    if (localStorage.getItem('stored_fitness_saveobj') != '') {
        try {
            save_Object = JSON.parse(localStorage.getItem('stored_fitness_saveobj'));
            backup(save_Object);
        } catch (error) {
            console.log('Main Error', error);
            save_Object = {
                training_is_running: false,
                training_start: '',
                exercises: [],
                trainings: [],
                current_training: [],
                training_place_filter: '',
            };
            backup(save_Object);
            save_into_storage();
        }

        try {
            training_running = save_Object.training_is_running;
        } catch (error) {
            console.log('training_running', error);
        }

        try {
            training_place_filter = save_Object.training_place_filter;
        } catch (error) {
            console.log('training_place_filter', error);
        }

        try {
            const last = save_Object.trainings.length - 1;

            const today = new Date();
            const last_trainingsdate_Raw = save_Object.trainings[last].training_date
            const lastTrainingDay = splitVal(last_trainingsdate_Raw, '.', 0);
            const lastTrainingMonth = splitVal(last_trainingsdate_Raw, '.', 1);
            const lastTrainingYear = splitVal(last_trainingsdate_Raw, '.', 2);
            const lastTrainingDate = new Date(`${lastTrainingYear}-${lastTrainingMonth}-${lastTrainingDay}`)
            const time_to_last_training = daysDiff(today, lastTrainingDate);

            if (time_to_last_training > 1) {
                last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration} <br> Zuletzt vor ${time_to_last_training}. Tagen`;
            } else if(time_to_last_training === 0) {
                last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration} <br> Zuletzt: heute`;
            }else {
                last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration} <br> Zuletzt vor ${time_to_last_training}. Tag`;
            }

        } catch (error) {
            console.log('last_training', error);
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
            training_start: '',
            exercises: [],
            trainings: [],
            current_training: [],
            training_place_filter: '',
        };
        save_into_storage();
    }
    console.log('saveobj', save_Object);
}


/////////////////////////////////////
//* ANCHOR - Show selected Trainingsyear
//TODO - The years are currently hard coded in html
/////////////////////////////////////
change_StatisticYear.addEventListener('change', () => {
    const selected_year = change_StatisticYear.value;
    fill_chart(selected_year);
});

/////////////////////////////////////
//* Add dynamic years, wich contains real trainingdata and not just 2023 and 2024
/////////////////////////////////////
function add_years_to_select() {

    const current_time_stamp = new Date();
    const current_Year = current_time_stamp.getFullYear();
    const select = document.getElementById('statisticYear_select');
    let oldest_year = current_Year;
    let latest_year = current_Year;
    try {
        save_Object.trainings.forEach((training) => {
            const year = splitVal(training.training_date, '.', 2);
            if (year < oldest_year) {
                oldest_year = year;
            }
        })
    } catch (error) {
        console.log('Error', error);
    }
    select.innerHTML = '';
    for (let i = oldest_year; i <= current_Year; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i;
        latest_year = i
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
    const training_counter = document.getElementById('training_counter');

    if (selct_year !== undefined) {
        current_time_stamp = new Date(`${selct_year}-01-01`);
        current_Year = current_time_stamp.getFullYear();
    }



    let jan = 0;
    let feb = 0;
    let mrz = 0;
    let apr = 0;
    let mai = 0;
    let jun = 0;
    let jul = 0;
    let aug = 0;
    let sep = 0;
    let okt = 0;
    let nov = 0;
    let dez = 0;
    let last_day = '';
    let sum = 0;

    for (let i = 0; i < save_Object.trainings.length; i++) {
        const solved_Date = save_Object.trainings[i].training_date;
        const solved_year = splitVal(solved_Date, '.', 2);
        const solved_month = splitVal(solved_Date, '.', 1);
        const solved_day = splitVal(solved_Date, '.', 0);
        const day_Month = solved_day + solved_month;

        if (solved_year == current_Year && day_Month !== last_day) {
            last_day = day_Month;
            sum++;

            switch (solved_month) {
                case '01':
                    jan++;
                    break;
                case '02':
                    feb++;
                    break;
                case '03':
                    mrz++;
                    break;
                case '04':
                    apr++;
                    break;
                case '05':
                    mai++;
                    break;
                case '06':
                    jun++;
                    break;
                case '07':
                    jul++;
                    break;
                case '08':
                    aug++;
                    break;
                case '09':
                    sep++;
                    break;
                case '10':
                    okt++;
                    break;
                case '11':
                    nov++;
                    break;
                case '12':
                    dez++;
                    break;

                default:
                    break;
            }
        }
    }

    const month_arr = [jan, feb, mrz, apr, mai, jun, jul, aug, sep, okt, nov, dez];
    const month_Descr_arr = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

    //* find max val;
    let max_per_month = 0;
    month_arr.forEach((month) => {
        if (month > max_per_month) {
            max_per_month = month;
        }
    })

    //* Render Col
    // max = 100% aka 350px
    let left = 2;
    month_arr.forEach((month, index) => {
        const value_in_pixel = ((month * 350) / max_per_month);
        const col = `chart_col_${index + 1}`;
        document.getElementById(col).style.height = `${value_in_pixel}px`;
        document.getElementById(col).style.left = `${left}%`;
        document.getElementById(col).innerHTML = month_Descr_arr[index] + `</br> ${month}`;
        left = left += 8;
    })

    training_counter.innerHTML = `Bereits <span class="training-sum-number">${sum}</span> Trainingstag(e) im Jahr ${current_Year}`;
}

/////////////////////////////////////
//* ANCHOR - Save to local Storage
/////////////////////////////////////
function save_into_storage() {
    localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));
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
        if (exercise.trainingsplace === 'Heimtraining') {
            home_array.push(exercise);
        }
        if (exercise.trainingsplace === 'Kombo' || exercise.trainingsplace === '') {
            combo_array.push(exercise);
        }
        if (exercise.trainingsplace === 'Fitnessstudio') {
            fitti_array.push(exercise);
        }
    });

    render_exercises(home_array, 'Heimtraining');
    render_exercises(combo_array, '');
    render_exercises(fitti_array, 'Fitnessstudio');
}

/////////////////////////////////////
//* ANCHOR - Render exercises
/////////////////////////////////////

function render_exercises(exerc_array, label) {
    try {
        if (label.length > 1) {
            let exercise_place_label = document.createElement('h3');
            exercise_place_label.innerHTML = label;
            exercise_place_label.classList.add('exercise-place-label')
            exercise_container.appendChild(exercise_place_label);
        }

        for (let i = 0; i < exerc_array.length; i++) {
            let exercisebtn = document.createElement('div');
            exercisebtn.classList.add('exercise');
            let exerciseName = exerc_array[i].name;
            if (exerc_array[i].trainingsplace == "Fitnessstudio") {
                exerciseName = `Nr.${exerc_array[i].machineNumber} - ` + exerc_array[i].name;
            }
            try {
                const currentSet = save_Object.current_training[`${indexOfExercise(exerc_array[i], save_Object.current_training)}`].solved_sets;
                exerciseName = `${exerciseName} (${currentSet}/${exerc_array[i].sets}) <span style="margin: 0 10px"> </span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
              </svg>`;
                if (currentSet >= exerc_array[i].sets) {
                    exercisebtn.classList.add('solved');
                } else {
                    exercisebtn.classList.add('half-solved');
                }
            } catch (error) {
                console.log(error);
            }
            exercisebtn.innerHTML = exerciseName;
            exercisebtn.id = exerc_array[i].exercise_id;
            exercisebtn.addEventListener('click', () => {
                selected_Exercise = exerc_array[i];
                open_exercise();
            })

            exercise_container.appendChild(exercisebtn);
        }
    } catch (error) {
        console.log(error);
    }

}

/////////////////////////////////////
//* ANCHOR - Save new Exercise
/////////////////////////////////////
btn_saveExercise.addEventListener('click', () => {

    if (inpExercise_Name.value === '') {
        return
    }
    if (inpExercise_Weight.value === '') {
        inpExercise_Weight.value = 0;
    }
    if (inpExercise_Sets.value === '') {
        inpExercise_Sets.value = 0;
    }
    if (inpExercise_Repeats.value === '') {
        inpExercise_Repeats.value = 0;
    }
    if (inpExercise_number.value === '') {
        inpExercise_number.value = '-'
    }
    if (inpExercise_seatSettings.value === '') {
        inpExercise_seatSettings.value = '-'
    }
    if (muscle_select.value === '') {
        muscle_select.value = '-';
    }
    if (training_Area.value === '') {
        training_Area.value = '-';
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
    } else {
        const newExercise = new Exercise(rnd_id(),
            inpExercise_Name.value,
            inpExercise_Weight.value,
            inpExercise_Sets.value,
            inpExercise_Repeats.value,
            inpExercise_number.value,
            inpExercise_seatSettings.value,
            muscle_select.value,
            training_Area.value,
            0
        );
        save_Object.exercises.push(newExercise);
    }

    save_into_storage();
    location.reload();
})


/////////////////////////////////////
//* ANCHOR - open Exercise
/////////////////////////////////////
function open_exercise() {
    Modal.open_modal(modal_exercise);
    lbl_trainingsname.innerHTML = selected_Exercise.name;
    lbl_weight.innerHTML = `${selected_Exercise.weight} Kg`;
    lbl_sets.innerHTML = `${selected_Exercise.sets}`;
    lbl_repeats.innerHTML = `${selected_Exercise.repeats}`;
    lbl_number.innerHTML = `Nr.${selected_Exercise.machineNumber}`;
    lbl_seatsettings.innerHTML = `${selected_Exercise.machine_seat_settings}`;
    lbl_muscleselect.innerHTML = `${selected_Exercise.musclegroup}`;
    lbl_donesets.innerHTML = `0`;
    try {
        const currentSet = save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets;
        lbl_donesets.innerHTML = `${currentSet}`;
    } catch (error) { }
    lbl_trainingsarea.innerHTML = `${selected_Exercise.trainingsplace}`;

    const trainingamount = save_Object.trainings.length - 1;
    exercise_table.innerHTML = '';

    for (let i = trainingamount; i > -1; i--) {
        const title = save_Object.trainings[i].training_date;
        const duration = save_Object.trainings[i].duration;
        const exc = save_Object.trainings[i].exercises;
        let only_ecercise;
        let is_in = false;


        for (let j = 0; j < exc.length; j++) {
            is_in = false;
            if (exc[j].exercise_id === selected_Exercise.exercise_id) {
                is_in = true;
                only_ecercise = exc[j];
                break;
            }
        }
        if (is_in === true) {
            const tableContainer = createTable(`${title} - ${duration}`, only_ecercise, true);
            exercise_table.appendChild(tableContainer);
        }
    }

}


/////////////////////////////////////
//* ANCHOR - Tracking
/////////////////////////////////////
btn_trackSport.addEventListener('click', () => {
    if (training_running === false) {

        const decision = window.confirm('Soll ein Training gestartet werden?')
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
            save_into_storage();

            //TODO -  replace alert
            alert("Ein weiterer Satz wurde hinzugefügt");
            location.reload();
        }

    } else {
        //* Set in Training Array speichern
        add_solved_set()

        // * persistent speichern
        save_into_storage();

        //TODO -  replace alert
        alert("Ein weiterer Satz wurde hinzugefügt");
        location.reload();
    }
})

/////////////////////////////////////
//* ANCHOR - Add Solved Set
/////////////////////////////////////

function add_solved_set() {
    //* Übung in Training Array speichern
    //* Abgleichen ob bereits vorhanden per id match,
    //* wenn vorhanden eins hochzählen
    if (check_exercise_in_currentTraining(selected_Exercise)) {
        let currentSet = save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets;
        let new_set_amount = currentSet += 1;
        save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets = new_set_amount;
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

btn_open_edit.addEventListener('click', () => {
    Modal.open_modal(modal_edit);
    is_edit = false;
    btn_delete_exercise.classList.remove('active');
});

btn_edit.addEventListener('click', () => {
    is_edit = true;
    btn_delete_exercise.classList.add('active');
    Modal.open_modal(modal_edit);
    load_exercise_into_edit();
});


btn_add.addEventListener('click', () => {
    Modal.open_modal(modal_edit);
    is_edit = false;
    btn_delete_exercise.classList.remove('active');
});

btn_show_trainings.addEventListener('click', () => {
    Modal.open_modal(modal_trainings);
    render_trainings();
})

btn_gotoSolvedTrainings.addEventListener('click', () => {
    Modal.open_modal(modal_trainings);
    render_trainings();
    statistic();
    console.log('%c Feffe', `color: green; font-weight: bold; font-size: 20px;`);
})

btn_home.addEventListener('click', () => {
    Modal.close_all_modals();
});

btn_settings.addEventListener('click', () => {
    Modal.open_modal(modal_settings);
});

modal_close_btn.forEach((c_btn) => {
    c_btn.addEventListener('click', () => {
        Modal.close_all_modals();
    })
})


/////////////////////////////////////
//* ANCHOR - Observer
/////////////////////////////////////
function observer() {

    //* Schaue ob trainin aktiv
    if (training_running) {
        bdy.classList.add('active-training');
        btn_finish.classList.add('active-training');
        //* Show Active Training section
        active_training_sect.classList.add('active');
        //* Update Time Label
        const trainingsdate = new Date(save_Object.training_start)
        const trainingsEnd_timestamp = new Date();
        const duration = minutesDiff(trainingsEnd_timestamp, trainingsdate);
        document.getElementById('lbl_time').innerHTML = `Zeit: ${duration}`;
        //*Update solved sets
        document.getElementById('lbl_overview_sets').innerHTML = `Absolvierte Sätze: ${sum_of_sets()}`
        //*Update moved Weight     
        document.getElementById('lbl_overview_weight').innerHTML = `Bewegtes Gewicht: ${sum_of_weight(save_Object.current_training).weightWithCommas} Kg`


    } else {
        bdy.classList.remove('active-training');
        btn_finish.classList.remove('active-training');
    }
}

//* ANCHOR - Sum of Sets
function sum_of_sets() {
    let solvedSets = 0;
    for (let i = 0; i < save_Object.current_training.length; i++) {
        solvedSets = solvedSets += save_Object.current_training[i].solved_sets;
    }
    return solvedSets;
}

//* ANCHOR - Sum of sets
function sum_of_weight(training) {

    let weight = 0;

    for (let i = 0; i < training.length; i++) {
        const solvedSets = training[i].solved_sets;
        weight = weight += (training[i].weight * solvedSets * training[i].repeats);
    }

    const weightWithCommas = numberWithCommas(weight);
    return {
        weight: weight,
        weightWithCommas: weightWithCommas
    };
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


//* Slider

inpExercise_Repeats.addEventListener('input', () => {
    lbl_exerciseRepeats.innerHTML = inpExercise_Repeats.value;
});
inpExercise_Sets.addEventListener('input', () => {
    lbl_exerciseSets.innerHTML = inpExercise_Sets.value;
});

/////////////////////////////////////
//* ANCHOR - finish training
/////////////////////////////////////
btn_finish.addEventListener('click', () => {
    finish_training()
})
function finish_training() {
    const decision = window.confirm('Soll das Training beendet werden?');
    if (decision) {
        const trainingsdate = new Date(save_Object.training_start)
        const day = trainingsdate.getDate();
        const month = trainingsdate.getMonth() + 1;
        const year = trainingsdate.getFullYear();
        const datum = `${add_zero(day)}.${add_zero(month)}.${year}`;

        const trainingsEnd_timestamp = new Date();
        const duration = minutesDiff(trainingsEnd_timestamp, trainingsdate);


        //* Trainingsobject erstellen und abspeichern
        const new_solved_training = new Training(datum, duration, save_Object.current_training);
        save_Object.trainings.push(new_solved_training)

        //* alle sets zurücksetzen
        for (let i = 0; i < save_Object.exercises.length; i++) {
            save_Object.exercises[i].solved_sets = 0;
        }

        //*Reset current training
        save_Object.current_training = [];

        //* trainingsstart reset
        save_Object.training_start = '';

        //* set training is running to false
        training_running = false;
        save_Object.training_is_running = false;

        // * Save into storage
        save_into_storage();

        const exercArr = new_solved_training.exercises;
        let exerciseInfoArr = '';
        for (let j = 0; j < exercArr.length; j++) {
            const newRow = `\n ${exercArr[j].name} - ${exercArr[j].solved_sets} x `
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
//* ANCHOR - Render Trainings
/////////////////////////////////////

function render_trainings() {
    const trainingamount = save_Object.trainings.length - 1;
    trainings_wrapper.innerHTML = '';
    let max_weight_sum = {
        amount: 0,
        amount_with_comma: '',
        date: ''
    }
    for (let i = trainingamount; i > -1; i--) {
        const trainingsdate = save_Object.trainings[i].training_date;
        const duration = save_Object.trainings[i].duration;
        const exc = save_Object.trainings[i].exercises;
        const traintingsplace = identify_trainingsplace(exc);
        //* Trainings weight
        const training_weight_sum_Int = sum_of_weight(save_Object.trainings[i].exercises).weight;
        const training_weight_sum = sum_of_weight(save_Object.trainings[i].exercises).weightWithCommas;
        let trainings_weight_label = '';
        training_weight_sum > 0 ? trainings_weight_label = ` - Trainingsgewicht: ${training_weight_sum} Kg bewegt` : trainings_weight_label = '';

        //*emmit max weight sum
        if (training_weight_sum_Int > max_weight_sum.amount) {
            max_weight_sum.amount = training_weight_sum_Int;
            max_weight_sum.amount_with_comma = training_weight_sum;
            max_weight_sum.date = trainingsdate;
        }

        const tableContainer = createTable(`${trainingsdate} - ${duration} - ${traintingsplace} ${trainings_weight_label}`, exc);
        trainings_wrapper.appendChild(tableContainer);
        let lbl_time_to_last_training = document.createElement('p');
        lbl_time_to_last_training.classList.add('between-trainings')

        try {
            if ((i - 1) !== -1) {
                const last_training = save_Object.trainings[i - 1].training_date;
                const duration_to_last_training = time_between_dates(trainingsdate, last_training);
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

    const max_weight_label = document.getElementById('max_weight_label');
    if (max_weight_sum.amount > 0) {
        max_weight_label.innerHTML = `Maximal bewegtes Gewicht: <br> ${max_weight_sum.amount_with_comma} Kg am ${max_weight_sum.date}`
    }
}


/////////////////////////////////////
//* ANCHOR - Identify Trainingsplace
//TODO - Show other Trainingsplace
/////////////////////////////////////
function identify_trainingsplace(training) {

    let fitnessstudio = 0;
    let otherTrainingsplace = 0;
    let heimtraining = 0;

    for (let i = 0; i < training.length; i++) {
        if (training[i].trainingsplace === 'Fitnessstudio') {
            fitnessstudio++
        } else if (training[i].trainingsplace === 'Heimtraining') {
            heimtraining++;
        } else {
            otherTrainingsplace++;
        }
    }
    if (fitnessstudio > otherTrainingsplace && fitnessstudio > heimtraining) {
        return 'Fitti';
    }

    if (otherTrainingsplace > fitnessstudio && otherTrainingsplace > heimtraining) {
        return 'Sonstiges';
    }

    if (heimtraining > fitnessstudio && heimtraining > otherTrainingsplace) {
        return 'Home';
    }
}

/////////////////////////////////////
//* ANCHOR - Create Table
/////////////////////////////////////
function createTable(title, data, only_exercise) {
    const table = document.createElement("table");
    const header = document.createElement("tr");
    const nameHeaderCell = document.createElement("th");
    const weightHeaderCell = document.createElement("th");
    const repsHeaderCell = document.createElement("th");
    const setsHeaderCell = document.createElement("th");
    const muscleHeaderCell = document.createElement("th");
    nameHeaderCell.appendChild(document.createTextNode("Übung"));
    weightHeaderCell.appendChild(document.createTextNode("Gew"));
    repsHeaderCell.appendChild(document.createTextNode("Wdh"));
    setsHeaderCell.appendChild(document.createTextNode("Sätze"));
    muscleHeaderCell.appendChild(document.createTextNode("Muskel"));
    header.appendChild(nameHeaderCell);
    header.appendChild(weightHeaderCell);
    header.appendChild(repsHeaderCell);
    header.appendChild(setsHeaderCell);
    header.appendChild(muscleHeaderCell);
    table.appendChild(header);
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const weightCell = document.createElement("td");
        const repsCell = document.createElement("td");
        const setsCell = document.createElement("td");
        const muscleCell = document.createElement("td");
        nameCell.appendChild(document.createTextNode(data[i].name));
        weightCell.appendChild(document.createTextNode(data[i].weight));
        repsCell.appendChild(document.createTextNode(data[i].repeats));
        setsCell.appendChild(document.createTextNode(data[i].solved_sets));
        muscleCell.appendChild(document.createTextNode(data[i].musclegroup));
        row.appendChild(nameCell);
        row.appendChild(weightCell);
        row.appendChild(repsCell);
        row.appendChild(setsCell);
        row.appendChild(muscleCell);
        table.appendChild(row);
    }
    if (only_exercise) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const weightCell = document.createElement("td");
        const repsCell = document.createElement("td");
        const setsCell = document.createElement("td");
        const muscleCell = document.createElement("td");
        nameCell.appendChild(document.createTextNode(data.name));
        weightCell.appendChild(document.createTextNode(data.weight));
        repsCell.appendChild(document.createTextNode(data.repeats));
        setsCell.appendChild(document.createTextNode(data.solved_sets));
        muscleCell.appendChild(document.createTextNode(data.musclegroup));
        row.appendChild(nameCell);
        row.appendChild(weightCell);
        row.appendChild(repsCell);
        row.appendChild(setsCell);
        row.appendChild(muscleCell);
        table.appendChild(row);
    }
    const container = document.createElement("div");
    const heading = document.createElement("h3");
    heading.appendChild(document.createTextNode(title));
    container.appendChild(heading);
    container.appendChild(table);
    return container;
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
//* ANCHOR - Time between Dates
/////////////////////////////////////

function time_between_dates(newer_date, older_date) {
    try {
        // Die Daten müssen im Format "DD.MM.YYYY" sein
        const newerDay = splitVal(newer_date, '.', 0);
        const newerMonth = splitVal(newer_date, '.', 1);
        const newerYear = splitVal(newer_date, '.', 2);
        const newerDateObject = new Date(`${newerYear}-${newerMonth}-${newerDay}`);

        const olderDay = splitVal(older_date, '.', 0);
        const olderMonth = splitVal(older_date, '.', 1);
        const olderYear = splitVal(older_date, '.', 2);
        const olderDateObject = new Date(`${olderYear}-${olderMonth}-${olderDay}`);

        // Berechnung der Differenz in Tagen
        const time_difference_in_days = daysDiff(newerDateObject, olderDateObject);

        // Ergebnis ausgeben oder weiterverarbeiten
        return time_difference_in_days;

    } catch (error) {
        console.log('time_between_dates', error);
    }
}



/////////////////////////////////////
//* ANCHOR - Statistic
/////////////////////////////////////
function statistic() {
    const trainingsByYear = {};

    // Gruppiere Trainings nach Jahr
    save_Object.trainings.forEach((training) => {
        const year = splitVal(training.training_date, '.', 2);
        if (!trainingsByYear[year]) {
            trainingsByYear[year] = [];
        }
        trainingsByYear[year].push(training);
    });

    statistics_table.innerHTML = '';
    let headline = document.createElement('h3');
    headline.innerHTML = 'Statistik für alle Jahre';
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

            const trainingsplace = identify_trainingsplace(maxExercisesTraining.exercises);

            if (trainingsplace === 'Fitti') {
                fitti_trainings++;
            } else if (trainingsplace === 'Home') {
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
        let yearHeadline = document.createElement('h4');
        yearHeadline.innerHTML = `Statistik für das Jahr ${year}`;
        statistics_table.appendChild(yearHeadline);
        statistics_table.appendChild(table);
    });
}

/////////////////////////////////////
//* ANCHOR - Delete Exercise
/////////////////////////////////////

btn_delete_exercise.addEventListener('click', () => {
    const decision = window.confirm('Soll die Übung gelöscht werden?');
    if (decision) {
        save_Object.exercises.splice(indexOfExercise(selected_Exercise, save_Object.exercises), 1);
        save_into_storage();
        location.reload();
    }
});

