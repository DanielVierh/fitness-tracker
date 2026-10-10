import { sum_of_weight } from "./sum_of_weight.js";

const cardioNamePatterns = [
  /\bcardio\b/i,
  /\bausdauer\b/i,
  /\bjoggen\b/i,
  /\bjogging\b/i,
  /\blaufband\b/i,
  /\bwalking\b/i,
  /\bspinning\b/i,
  /\bergometer\b/i,
  /\bcrosstrainer\b/i,
  /\bstepper\b/i,
  /\bschwimmen\b/i,
  /\bzumba\b/i,
  /\bhiit\b/i,
];

function is_explicit_cardio_exercise(exercise) {
  const name = String(exercise?.name || "").trim();
  return (
    name.length > 0 && cardioNamePatterns.some((pattern) => pattern.test(name))
  );
}

function has_strength_addendum(exercises) {
  return exercises.some((exercise) => {
    if (typeof exercise?.name !== "string") return false;
    const name = exercise.name.trim().toLowerCase();
    return name.includes("nachtrag") && name.includes("kraft");
  });
}

export function safe_sum_of_weight(exercises) {
  if (!Array.isArray(exercises) || exercises.length === 0) return 0;

  const utilityVal = Number(sum_of_weight(exercises).weight);
  if (Number.isFinite(utilityVal)) return utilityVal;

  let weight = 0;
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i] || {};
    const exWeight = Number(exercise.weight) || 0;
    const solvedSets = Number(exercise.solved_sets) || 0;
    const repeats = Number(exercise.repeats) || 0;
    weight += exWeight * solvedSets * repeats;
  }
  return Number.isFinite(weight) ? weight : 0;
}

export function is_cardio_session(training) {
  const exercises = Array.isArray(training?.exercises)
    ? training.exercises
    : [];
  if (exercises.length === 0) return false;

  if (has_strength_addendum(exercises)) return false;

  const hasExplicitCardioExercise = exercises.some(
    is_explicit_cardio_exercise,
  );
  const allExercisesExplicitCardio = exercises.every(
    is_explicit_cardio_exercise,
  );
  const movedWeight = safe_sum_of_weight(exercises);

  if (movedWeight > 0) {
    return hasExplicitCardioExercise && allExercisesExplicitCardio;
  }

  if (hasExplicitCardioExercise) return true;
  return movedWeight <= 0;
}

export function classify_training_for_comparison(training) {
  const exercises = Array.isArray(training?.exercises)
    ? training.exercises
    : [];
  if (exercises.length === 0) return "unknown";

  const cardioExerciseCount = exercises.filter(
    is_explicit_cardio_exercise,
  ).length;
  if (has_strength_addendum(exercises)) {
    return cardioExerciseCount > 0 ? "mixed" : "strength";
  }
  if (cardioExerciseCount === exercises.length) return "cardio";
  if (cardioExerciseCount > 0) return "mixed";
  return "strength";
}
