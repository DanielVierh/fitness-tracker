import { numberWithCommas, get_exercise_total_weight } from "./functions.js";

//* ANCHOR - Sum of sets
export function sum_of_weight(training) {
  let weight = 0;

  for (let i = 0; i < training.length; i++) {
    weight = weight += get_exercise_total_weight(training[i]);
  }

  const weightWithCommas = numberWithCommas(weight);
  return {
    weight: weight,
    weightWithCommas: weightWithCommas,
  };
}
