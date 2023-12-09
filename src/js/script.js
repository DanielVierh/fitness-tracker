
//?#######################################
//? Class for training
//?#######################################
class Training {
    constructor(training_id = rnd_id(),start_date, set_amount, start, end, exercises) {

    }
}

//?#######################################
//? Class for Exercise
//?#######################################
class Exercise {
    constructor(exercise_id = rnd_id(), name = 'Leere Übung', weight = '0', sets = 0, repeats = 0, machineNumber = '-', machine_seat_settings = '-') {
        this.exercise_id = exercise_id;
        this.name = name;
        this.weight = weight;
        this.sets = sets;
        this.repeats = repeats;
        this.machineNumber = machineNumber;
        this.machine_seat_settings = machine_seat_settings;
    }

    show_exercise_in_console() {
        console.log(`ID=${this.exercise_id} 
        Name=${this.name} \n 
        Gewicht=${this.weight} \n 
        Sätze=${this.sets} \n 
        Wdh=${this.repeats} \n 
        Nummer=${this.machineNumber} \n 
        Geräteeinstellungen=${this.machine_seat_settings} \n`);
    }

}

//?#######################################
//? Random ID Creator
//?#######################################
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

//?#######################################
//TODO  Delete test objects
//?#######################################
    const liegestuetze = new Exercise(rnd_id(), 'Liegestütze', '-', 3, 10, '-', '-')
    liegestuetze.show_exercise_in_console()

    const chesspress = new Exercise(rnd_id(), 'chestpress', 45, 3, 12, '31', 'Stufe 6')
    chesspress.show_exercise_in_console()

    const test = new Exercise();
    test.show_exercise_in_console();