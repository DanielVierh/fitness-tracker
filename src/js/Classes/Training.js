/////////////////////////////////////
//* ANCHOR - Class for training
/////////////////////////////////////
export class Training {
    constructor(training_date, duration, exercises) {
        this.training_date = training_date;
        this.duration = duration;
        this.exercises = exercises;
    }

    showSets() {
        let sets = 0;
        this.exercises.forEach(exercise => {
            sets += exercise.sets;
        });
        return sets;
    }

    showExerciseAmount() {
        return this.exercises.length;
    }
}