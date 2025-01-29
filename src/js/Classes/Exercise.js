/////////////////////////////////////
//* ANCHOR - Class for Exercise
/////////////////////////////////////
export class Exercise {
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

}