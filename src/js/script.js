/////////////////////////////////////
// * Variablen
/////////////////////////////////////
//* ANCHOR - Elemente

const exercise_container = document.getElementById('exercise_container');


//* ANCHOR -  Variablen


//*  Saveobj
let save_Object = {
    training_is_running: false,
    exercises: [],
    trainings: [],
    current_training: [],
    training_place_filter: '',
};



/////////////////////////////////////
// * ANCHOR - Init
/////////////////////////////////////
window.onload = ()=> {
    loadAndShow();
    
    setTimeout(() => {
        render_exercises();
    }, 500);
}




/////////////////////////////////////
//* ANCHOR - Class for training
/////////////////////////////////////
class Training {
    constructor(training_id = rnd_id(),start_date, set_amount, start, end, exercises) {

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
//*DELETE test objects
/////////////////////////////////////
function loadAndShow() {
    const liegestuetze = new Exercise(rnd_id(), 'Liegestütze', '-', 3, 10, '-', '-')
    const chesspress = new Exercise(rnd_id(), 'chestpress', 45, 3, 12, '31', 'Stufe 6', 'Brust', 'Fitnessstudio')

    save_Object.exercises.push(chesspress);
    save_Object.exercises.push(liegestuetze);

    console.log('Saveobject', save_Object);
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
        exercise_container.appendChild(exercisebtn);
    }

}

/////////////////////////////////////
//* ANCHOR -
/////////////////////////////////////

/////////////////////////////////////
//* ANCHOR -
/////////////////////////////////////

/////////////////////////////////////
//* ANCHOR -
/////////////////////////////////////

