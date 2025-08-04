import { splitVal } from "./functions";

export async function addendum(save_Object) {
    const btn_submit_training = document.getElementById('btn_submit_training');
    
    //*ANCHOR - Addendum
    btn_submit_training.addEventListener('click', (e)=> {
        e.preventDefault();
    
        const trainingsname = inp_add_training_name.value;
        const trainings_date = inp_add_training_date.value;
        const trainingsduration = inp_add_training_time.value;
        const trainings_place = training_place.value;

        const day = splitVal(trainings_date, '-',2);
        const month = splitVal(trainings_date, '-',1);
        const year = splitVal(trainings_date, '-',0);
        const date = `${day}.${month}.${year}`;

        console.log('date', date);
        console.log('trainings length',save_Object.trainings.length);
        
        
        for(let i = 0; save_Object.trainings.length; i++) {
            console.info('save_Object.trainings[i].training_date', save_Object.trainings[i].training_date);
            
            if(save_Object.trainings[i].training_date === date) {
                console.info('Gleicher Tag')
            }
        }
    
        console.log(`trainingsname: ${trainingsname} trainings_date: ${trainings_date}  trainingsduration: ${trainingsduration} trainings_place ${trainings_place}..       `);
    })
    
}