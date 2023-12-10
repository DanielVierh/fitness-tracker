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

const modal_list = [modal_edit, modal_exercise, modal_settings];


//* ANCHOR -  Variablen
let training_running = false;
let training_place_filter = '';
let selected_Exercise;

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
window.onload = ()=> {
    load_local_storage();
}


//########################################
//* ANCHOR - Load Local Storage
//########################################
function load_local_storage() {
    if (localStorage.getItem('stored_fitness_saveobj') != '') {
        try {
            save_Object = JSON.parse(
                localStorage.getItem('stored_fitness_saveobj'),
            );

            training_running = save_Object.training_is_running;
            training_place_filter = save_Object.training_place_filter;

            setTimeout(() => {
                //* Render func
                render_exercises();
            }, 500);

            try {
                weeklylist = save_Object.saved_weekly_list;
                if(weeklylist === undefined) {
                    weeklylist = [];
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
            save_Object = {
                training_is_running: false,
                training_start: '',
                exercises: [],
                trainings: [],
                current_training: [],
                training_place_filter: '',
            };
        }
    }
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
    constructor(training_date, set_amount, start, end, exercises) {
        this.training_date = training_date;
        this.set_amount = set_amount;
        this.start = start;
        this.end = end;
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
//* ANCHOR - Random ID Creator
/////////////////////////////////////
function rnd_id() {
    const rndStuff = [
        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
        'R','S','T','U','V','W','X','Y','Z','$','?','1','2','3','4','8','7',
        '6','5','9','0','#',
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

    for(let i = 0; i < save_Object.exercises.length; i++) {
        let exercisebtn = document.createElement('div');
        exercisebtn.classList.add('exercise');
        exercisebtn.innerHTML = save_Object.exercises[i].name;
        exercisebtn.id = save_Object.exercises[i].exercise_id;
        exercisebtn.addEventListener('click', ()=> {
            selected_Exercise = save_Object.exercises[i];
            console.log('selected_Exercise', selected_Exercise);
            open_exercise();
        })

        exercise_container.appendChild(exercisebtn);
    }

}

/////////////////////////////////////
//* ANCHOR - Save new Exercise
/////////////////////////////////////
btn_saveExercise.addEventListener('click', ()=> {
    let inpExercise_Name = document.getElementById('inpExercise_Name');
    let inpExercise_Weight = document.getElementById('inpExercise_Weight');
    let inpExercise_Sets = document.getElementById('inpExercise_Sets');
    let inpExercise_Repeats = document.getElementById('inpExercise_Repeats');
    let inpExercise_number = document.getElementById('inpExercise_number');
    let inpExercise_seatSettings = document.getElementById('inpExercise_seatSettings');
    let muscle_select = document.getElementById('muscle_select');
    let training_Area = document.getElementById('training_Area');
    if(inpExercise_Name.value === '') {
        return
    }
    if(inpExercise_Weight.value === '') {
        inpExercise_Weight.value = 0;
    }
    if(inpExercise_Sets.value === '') {
        inpExercise_Sets.value = 0;
    }
    if(inpExercise_Repeats.value === '') {
        inpExercise_Repeats.value = 0; 
    }
    if(inpExercise_number.value === '') {
        inpExercise_number.value = '-'
    }
    if(inpExercise_seatSettings.value === '') {
        inpExercise_seatSettings.value = '-'
    }
    if(muscle_select.value === '') {
        muscle_select.value = '-';
    }
    if(training_Area.value === '') {
        training_Area.value = '-';
    }

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
    save_into_storage();
    location.reload();
})


/////////////////////////////////////
//* ANCHOR - open Exercise
/////////////////////////////////////
function open_exercise() {
    open_modal(modal_exercise);
    lbl_trainingsname.innerHTML = selected_Exercise.name;
    lbl_weight.innerHTML = `Übungsgewicht: <span>${selected_Exercise.weight}</span> Kg`;
    lbl_sets.innerHTML = `Sätze: <span>${selected_Exercise.sets}</span>`;
    lbl_repeats.innerHTML = `Wiederholungen: <span>${selected_Exercise.repeats}</span>`;
    lbl_number.innerHTML = `Gerätenummer: Nr.<span>${selected_Exercise.machineNumber}</span>`;
    lbl_seatsettings.innerHTML = `Geräteeinstellungen: <span>${selected_Exercise.machine_seat_settings}</span>`;
    lbl_muscleselect.innerHTML = `Muskelgruppe: <span>${selected_Exercise.musclegroup}</span>`;
    lbl_donesets.innerHTML = `Übungen absolviert: <span>${selected_Exercise.solved_sets}</span>`;
}




/////////////////////////////////////
//* ANCHOR - Tracking
/////////////////////////////////////
btn_trackSport.addEventListener('click', ()=> {
    if(training_running === false) {
        console.log('Training lief noch nicht, läuft jetzt');
        training_running = true;
        //* Training boolean speichern
        //save_Object.training_is_running = true;
        //* Training Startzeit ermitteln und speichern
        const training_start_time = new Date();
        
        //const timestamp = training_start_time.getTime(); 
        //console.log(minutesDiff(dateTimeValue1, training_start_time));

        //* Übung in Training Array speichern
        //* Abgleichen ob bereits vorhanden per id match, wenn vorhanden eins hochzählen

        //* wenn nein, in das Array übertragen und eins hochzählen

        // * persistent speichern
        //save_into_storage();

    }else {
        console.log('Training lief bereits');
        //* Übung in Training Array speichern
        //* Abgleichen ob bereits vorhanden per id match, wenn vorhanden eins hochzählen

        //* wenn nein, in das Array übertragen und eins hochzählen

        // * persistent speichern
        //save_into_storage();
    }
})



/////////////////////////////////////
//* ANCHOR - MinutesDiff
/////////////////////////////////////
function minutesDiff(dateTimeValue2, dateTimeValue1) {
   var differenceValue =(dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
   differenceValue /= 60;
   const rawMinuteTime = Math.abs(Math.round(differenceValue))
   const hour = Math.floor(rawMinuteTime/60);
   const minutes = Math.floor(rawMinuteTime%60);
   const time = `${add_zero(hour)}:${add_zero(minutes)}`;
   return time;
}

function add_zero(val) {
    if(val < 10) {
        val = `0${val}`;
    }
    return val;
}


/////////////////////////////////////
//* ANCHOR - Modals
/////////////////////////////////////

btn_open_edit.addEventListener('click', ()=> {
    open_modal(modal_edit);
});

btn_settings.addEventListener('click', ()=> {
    open_modal(modal_settings);
});

btn_add.addEventListener('click', ()=> {
    open_modal(modal_edit);
});

btn_home.addEventListener('click', () => {
    close_all_modals();
});

function open_modal(modal) {
    close_all_modals();
    modal.classList.add('active');
}

function close_all_modals() {
    for (let i = 0; i < modal_list.length; i++) {
        modal_list[i].classList.remove('active');
    }
}

modal_close_btn.forEach((c_btn)=> {
    c_btn.addEventListener('click', ()=> {
        close_all_modals();
    })
})