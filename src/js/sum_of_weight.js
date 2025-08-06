 import { numberWithCommas } from './functions.js';
 
 //* ANCHOR - Sum of sets
export function sum_of_weight(training) {

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