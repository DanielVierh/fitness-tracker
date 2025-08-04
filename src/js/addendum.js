import { splitVal } from "./functions";

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

        console.log('date', date);
        console.log('trainings length',save_Object.trainings.length);
        
        
        for(let i = 0; i < save_Object.trainings.length; i++) {
            const i_date = save_Object.trainings[i].training_date;
            console.log('i_date', i_date);
            
            if(i_date === date) {
                console.info('Gleicher Tag');
            }
        }
    
        console.log(`
            addendum_trainingsname: ${addendum_trainingsname} 
            trainings_date: ${date}  
            trainingsduration: ${addendum_trainingsduration} 
            trainings_place ${addendum_trainings_place}..       `);
    })
    
}