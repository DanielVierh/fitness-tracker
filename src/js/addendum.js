import { splitVal } from "./functions";
import { Training } from './Classes/Training.js';

export async function addendum(save_Object) {
    const btn_submit_training = document.getElementById('btn_submit_training');
    
    //*ANCHOR - Addendum
    btn_submit_training.addEventListener('click', (e)=> {
        e.preventDefault();
    
        const addendum_trainingsname = inp_add_training_name.value;
        const addendum_trainings_date = inp_add_training_date.value;
        const addendum_trainingsduration = inp_add_training_time.value;
        const addendum_trainings_place = training_place.value;

        const day = splitVal(addendum_trainings_date, '-',2);
        const month = splitVal(addendum_trainings_date, '-',1);
        const year = splitVal(addendum_trainings_date, '-',0);
        const date = `${day}.${month}.${year}`;
        
        //* Loop through trainings to detect date
        for(let i = 0; i < save_Object.trainings.length; i++) {
            const i_date = save_Object.trainings[i].training_date;
            
            if(i_date <= date) {
                const new_index = i - 1;
                const new_addendum_training = new Training(date, addendum_trainingsduration, addendum_trainingsname);
                new_addendum_training.training_place = addendum_trainings_place;
                new_addendum_training.training_date = date;
                save_Object.trainings.splice(new_index, 0, new_addendum_training);
                localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));
                break;

            }
        }
    
        console.log(`
            addendum_trainingsname: ${addendum_trainingsname} 
            trainings_date: ${date}  
            trainingsduration: ${addendum_trainingsduration} 
            trainings_place ${addendum_trainings_place}..       `);
    })
    
}