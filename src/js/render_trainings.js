import { sum_of_weight } from "./sum_of_weight";
import { createTable } from "./create_table.js";
import { time_between_dates } from "./time_between_days.js";
import { identify_trainingsplace } from "./functions.js";

export function render_trainings(save_Object, spezific_date) {
    const trainings_wrapper = document.getElementById('trainings_wrapper');
    const trainingamount = save_Object.trainings.length - 1;
    trainings_wrapper.innerHTML = '';

    if (spezific_date !== undefined) {
        const training = save_Object.trainings.find(training => training.training_date === spezific_date);
        if (training) {
            const tableContainer = createTable(`${training.training_date} - ${training.duration} - ${identify_trainingsplace(training.exercises)}`, training.exercises, false, 0);
            trainings_wrapper.appendChild(tableContainer);
            const training_date_element = document.querySelector(`[data-trainingDate="${training_date}"]`);
            console.log('training_date_element', training_date_element);

            setTimeout(() => {
                training_date_element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
            return;
        } else {
            const message = new Message('Kein Training an diesem Datum gefunden', '', 'error', 3000);
            message.showMessage();
            return;
        }
    }



    let max_weight_sum = {
        amount: 0,
        amount_with_comma: '',
        date: ''
    }
    for (let i = trainingamount; i > -1; i--) {
        const trainingsdate = save_Object.trainings[i].training_date;

        const duration = save_Object.trainings[i].duration;
        const exc = save_Object.trainings[i].exercises;
        const traintingsplace = identify_trainingsplace(exc);
        //* Trainings weight
        const training_weight_sum_Int = sum_of_weight(save_Object.trainings[i].exercises).weight;
        const training_weight_sum = sum_of_weight(save_Object.trainings[i].exercises).weightWithCommas;
        let trainings_weight_label = '';
        training_weight_sum > 0 ? trainings_weight_label = ` - Trainingsgewicht: ${training_weight_sum} Kg bewegt` : trainings_weight_label = '';

        //*emmit max weight sum
        if (training_weight_sum_Int > max_weight_sum.amount) {
            max_weight_sum.amount = training_weight_sum_Int;
            max_weight_sum.amount_with_comma = training_weight_sum;
            max_weight_sum.date = trainingsdate;
        }

        const tableContainer = createTable(`${trainingsdate} - ${duration} - ${traintingsplace} ${trainings_weight_label}`, exc, false, i);
        trainings_wrapper.appendChild(tableContainer);
        let lbl_time_to_last_training = document.createElement('p');
        lbl_time_to_last_training.classList.add('between-trainings')

        try {
            if ((i - 1) !== -1) {
                const last_training = save_Object.trainings[i - 1].training_date;
                const duration_to_last_training = time_between_dates(trainingsdate, last_training);
                if (duration_to_last_training > 1) {
                    lbl_time_to_last_training.innerHTML = `${duration_to_last_training}. Tage seit dem letzten Training`;
                    trainings_wrapper.appendChild(lbl_time_to_last_training);
                } else if (duration_to_last_training === 1) {
                    lbl_time_to_last_training.innerHTML = `${duration_to_last_training}. Tag seit dem letzten Training`;
                    trainings_wrapper.appendChild(lbl_time_to_last_training);
                }
            }
        } catch (error) {
            console.log(error);

        }
    }

    const max_weight_label = document.getElementById('max_weight_label');
    if (max_weight_sum.amount > 0) {
        max_weight_label.innerHTML = `Maximal bewegtes Gewicht: <br> ${max_weight_sum.amount_with_comma} Kg am ${max_weight_sum.date}`
    }
}

