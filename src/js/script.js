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
const btn_open_edit = document.getElementById("btn_open_edit");
const btn_settings = document.getElementById("btn_settings");
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
let inpExercise_Name = document.getElementById('inpExercise_Name');
let inpExercise_Weight = document.getElementById('inpExercise_Weight');
let inpExercise_Sets = document.getElementById('inpExercise_Sets');
let inpExercise_Repeats = document.getElementById('inpExercise_Repeats');
let inpExercise_number = document.getElementById('inpExercise_number');
let inpExercise_seatSettings = document.getElementById('inpExercise_seatSettings');
let muscle_select = document.getElementById('muscle_select');
let training_Area = document.getElementById('training_Area');





//* ANCHOR -  Variablen
let training_running = false;
let training_place_filter = '';
let selected_Exercise;
let is_edit = false;

//*  Saveobj
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

    setInterval(() => {
        observer();
    }, 1000);
}


//########################################
//* ANCHOR - Load Local Storage
//########################################
function load_local_storage() {
    if (localStorage.getItem('stored_fitness_saveobj') != '') {
        try {
            save_Object = JSON.parse(localStorage.getItem('stored_fitness_saveobj'));
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
            last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration}`;
        } catch (error) {
            console.log('last_training', error);
        }

        setTimeout(() => {
            //* Render func
            render_exercises();
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
        console.log('was null');
    }
    console.log('saveobj', save_Object);
}

//########################################
//* ANCHOR - Render Chart
//########################################
function fill_chart() {
    const current_time_stamp = new Date();
    const current_Year = current_time_stamp.getFullYear();
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

    for (let i = 0; i < save_Object.trainings.length; i++) {
        const solved_Date = save_Object.trainings[i].training_date;
        const solved_year = splitVal(solved_Date, '.', 2);
        const solved_month = splitVal(solved_Date, '.', 1);

        if (solved_year == current_Year) {
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
        document.getElementById(col).innerHTML = document.getElementById(col).innerHTML + `</br> ${month}`;
        left = left += 8;
    })

}

//########################################
//* ANCHOR - Split Function
//########################################

function splitVal(val, marker, pos) {
    const elem = val.split(marker);
    const retVal = elem[pos];
    return retVal;
}

//########################################
//* ANCHOR - Save to local Storage
//########################################
function save_into_storage() {
    localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));
}




/////////////////////////////////////
//* ANCHOR - Class for training
/////////////////////////////////////
class Training {
    constructor(training_date, duration, exercises) {
        this.training_date = training_date;
        this.duration = duration;
        this.exercises = exercises;
    }
}
/////////////////////////////////////
//* ANCHOR - Class for Exercise
/////////////////////////////////////
class Exercise {
    constructor(exercise_id = rnd_id(), name = 'Leere Übung', weight = '0', sets = 0, repeats = 0, machineNumber = '-', machine_seat_settings = '-', musclegroup = '-', trainingsplace = '-', solved_sets = 0) {
        this.exercise_id = exercise_id;
        this.name = name;
        this.weight = weight;
        this.sets = sets;
        this.repeats = repeats;
        this.machineNumber = machineNumber;
        this.machine_seat_settings = machine_seat_settings;
        this.musclegroup = musclegroup;
        this.trainingsplace = trainingsplace;
        this.solved_sets = solved_sets;
    }

    show_exercise_in_console() {
        console.log(`ID=${this.exercise_id}
        Name = ${this.name} \n
        Gewicht = ${this.weight} \n
        Sätze = ${this.sets} \n
        Wdh = ${this.repeats} \n
        Nummer = ${this.machineNumber} \n
        Geräteeinstellungen = ${this.machine_seat_settings} \n
        Muskelgruppe = ${this.musclegroup} \n
        Trainingsort = ${this.trainingsplace} \n
        SolvedSets = ${this.solved_sets}`);
    }

}

/////////////////////////////////////
//* ANCHOR - Class for Modal
/////////////////////////////////////

class Modal {

    static modal_list = [modal_edit, modal_exercise, modal_settings, modal_trainings];

    static open_modal(modal) {
        this.close_all_modals();
        modal.classList.add('active');
    }

    static close_all_modals() {
        for (let i = 0; i < this.modal_list.length; i++) {
            this.modal_list[i].classList.remove('active');
        }
    }
}

/////////////////////////////////////
//* ANCHOR - Random ID Creator
/////////////////////////////////////
function rnd_id() {
    const rndStuff = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '$', '?', '1', '2', '3', '4', '8', '7',
        '6', '5', '9', '0', '#',
    ];
    let key = '';
    for (let i = 1; i <= 16; i++) {
        key += rndStuff[parseInt(Math.random() * rndStuff.length)];
    }
    return key;
}


/////////////////////////////////////
//* ANCHOR - Render exercises
/////////////////////////////////////

function render_exercises() {
    try {
        for (let i = 0; i < save_Object.exercises.length; i++) {
            let exercisebtn = document.createElement('div');
            exercisebtn.classList.add('exercise');
            let exerciseName = save_Object.exercises[i].name;
            try {
                const currentSet = save_Object.current_training[`${indexOfExercise(save_Object.exercises[i], save_Object.current_training)}`].solved_sets;
                exerciseName = `${save_Object.exercises[i].name} (${currentSet}/${save_Object.exercises[i].sets})`;
                if (currentSet >= save_Object.exercises[i].sets) {
                    exercisebtn.classList.add('solved');
                } else {
                    exercisebtn.classList.add('half-solved');
                }
            } catch (error) {
                console.log(error);
            }
            exercisebtn.innerHTML = exerciseName;
            exercisebtn.id = save_Object.exercises[i].exercise_id;
            exercisebtn.addEventListener('click', () => {
                selected_Exercise = save_Object.exercises[i];
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
//* ANCHOR - MinutesDiff
/////////////////////////////////////
function minutesDiff(dateTimeValue2, dateTimeValue1) {
    var differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
    differenceValue /= 60;
    const rawMinuteTime = Math.abs(Math.round(differenceValue))
    const hour = Math.floor(rawMinuteTime / 60);
    const minutes = Math.floor(rawMinuteTime % 60);
    const time = `${add_zero(hour)}:${add_zero(minutes)}`;
    return time;
}

function add_zero(val) {
    if (val < 10) {
        val = `0${val}`;
    }
    return val;
}


/////////////////////////////////////
//* ANCHOR - Modals
/////////////////////////////////////

btn_open_edit.addEventListener('click', () => {
    Modal.open_modal(modal_edit);
    is_edit = false;
});

btn_edit.addEventListener('click', () => {
    is_edit = true;
    Modal.open_modal(modal_edit);
    load_exercise_into_edit();
});

btn_settings.addEventListener('click', () => {
    Modal.open_modal(modal_settings);
});

btn_add.addEventListener('click', () => {
    Modal.open_modal(modal_edit);
    is_edit = false;
});

btn_show_trainings.addEventListener('click', () => {
    // open_modal(modal_trainings);
    Modal.open_modal(modal_trainings);
    render_trainings();
})

btn_home.addEventListener('click', () => {
    Modal.close_all_modals();
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
        //TODO - Training diff hochzählen

    } else {
        bdy.classList.remove('active-training');
        btn_finish.classList.remove('active-training');
    }
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
    for (let i = trainingamount; i > -1; i--) {
        const title = save_Object.trainings[i].training_date;
        const duration = save_Object.trainings[i].duration;
        const exc = save_Object.trainings[i].exercises;
        const tableContainer = createTable(`${title} - ${duration}`, exc);
        trainings_wrapper.appendChild(tableContainer);
    }

}

function createTable(title, data, only_exercise) {
    const table = document.createElement("table");
    const header = document.createElement("tr");
    const nameHeaderCell = document.createElement("th");
    const weightHeaderCell = document.createElement("th");
    const repsHeaderCell = document.createElement("th");
    const setsHeaderCell = document.createElement("th");
    const muscleHeaderCell = document.createElement("th");
    nameHeaderCell.appendChild(document.createTextNode("Name"));
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
    const heading = document.createElement("h2");
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
