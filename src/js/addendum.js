import { splitVal } from "./functions";
import { Training } from './Classes/Training.js';
import { Message } from './Classes/Message.js';

export async function addendum(save_Object) {
    const btn_submit_training = document.getElementById('btn_submit_training');

    btn_submit_training.addEventListener('click', (e) => {
        e.preventDefault();

        // Eingabewerte aus dem Formular
        const addendum_trainingsname = inp_add_training_name.value;
        const addendum_trainings_date = inp_add_training_date.value;
        const addendum_trainingsduration = inp_add_training_time.value;
        const addendum_trainings_place = training_place.value;

        // Datum aufteilen und Date-Objekt erstellen
        const day = splitVal(addendum_trainings_date, '-', 2);
        const month = splitVal(addendum_trainings_date, '-', 1);
        const year = splitVal(addendum_trainings_date, '-', 0);
        const date_str = `${day}.${month}.${year}`;
        const compare_Date = new Date(`${year}-${month}-${day}`);

        // Neues Training-Objekt
        const new_addendum_training = new Training(date_str, addendum_trainingsduration, [
            {
                "exercise_id": "999999999",
                "name": addendum_trainingsname,
                "weight": 0,
                "sets": 0,
                "repeats": 0,
                "machineNumber": 0,
                "machine_seat_setting": 0,
                "musclegroup": "-",
                "trainingsplace": addendum_trainings_place,
                "solved_sets": 1,
            }
        ]);

        // Wenn noch keine Trainings vorhanden sind, direkt einfügen
        if (save_Object.trainings.length === 0) {
            save_Object.trainings.push(new_addendum_training);
            localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));
            const message = new Message('Training hinzugefügt', '', 'success', 3000);
            message.showMessage();
            return;
        }

        // Trainingsliste durchgehen, um richtige Einfügestelle zu finden
        let inserted = false;
        for (let i = 0; i < save_Object.trainings.length; i++) {
            const existing = save_Object.trainings[i];
            const [ex_day, ex_month, ex_year] = existing.training_date.split('.');
            const existing_date = new Date(`${ex_year}-${ex_month}-${ex_day}`);

            if (compare_Date < existing_date) {
                save_Object.trainings.splice(i, 0, new_addendum_training);
                inserted = true;
                break;
            }
        }

        // Falls das neue Datum das neueste ist → ans Ende
        if (!inserted) {
            save_Object.trainings.push(new_addendum_training);
        }

        // Speichern und Erfolgsmeldung
        localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));
        const message = new Message('Training hinzugefügt', '', 'success', 3000);
        message.showMessage();
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    });
}
