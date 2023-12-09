








class Exercise {
    constructor(name, weight = '0', sets, repeats, number = '-', seat_settings = '-') {
        this.name = name;
        this.weight = weight;
        this.sets = sets;
        this.repeats = repeats;
        this.number = number;
        this.seat_settings = seat_settings;
    }

    show_exercise_in_console() {
        console.log(`Name=${this.name} \n Gewicht=${this.weight} \n Sätze=${this.sets} \n Wdh=${this.repeats} \n Nummer=${this.number} \n Geräteeinstellungen=${this.seat_settings} \n`);
    }

}



const liegestuetze = new Exercise('Liegestütze', '-', 3, 10, '-', '-')
console.log(liegestuetze.show_exercise_in_console());

const chesspress = new Exercise('chestpress', 45, 3, 12, '31', 'Stufe 6')
console.log(chesspress.show_exercise_in_console());