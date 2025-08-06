/////////////////////////////////////
//* ANCHOR - Split Function
/////////////////////////////////////

export function splitVal(val, marker, pos) {
    const elem = val.split(marker);
    const retVal = elem[pos];
    return retVal;
}

/////////////////////////////////////
//* ANCHOR - Random ID Generator
/////////////////////////////////////

export function rnd_id() {
    const rndStuff = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '$', '?', '1', '2', '3', '4', '8', '7',
        '6', '5', '9', '0', '#',
    ];
    let key = '';
    for (let i = 1; i <= 16; i++) {
        key += rndStuff[parseInt(Math.random() * rndStuff.length)];
    }
    return key;
}

/////////////////////////////////////
//* ANCHOR - Add Zero
/////////////////////////////////////
export function add_zero(val) {
    if (val < 10) {
        val = `0${val}`;
    }
    return val;
}

/////////////////////////////////////
//* ANCHOR - MinutesDiff
/////////////////////////////////////
export function minutesDiff(dateTimeValue2, dateTimeValue1) {
    let differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
    differenceValue /= 60;
    const rawMinuteTime = Math.abs(Math.round(differenceValue))
    const hour = Math.floor(rawMinuteTime / 60);
    const minutes = Math.floor(rawMinuteTime % 60);
    const time = `${add_zero(hour)}:${add_zero(minutes)}`;
    return time;
}

/////////////////////////////////////
//* ANCHOR - Time between Dates
/////////////////////////////////////
export function daysDiff(dateTimeValue2, dateTimeValue1) {
    let differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / (1000 * 60 * 60 * 24);
    const days = Math.floor(Math.abs(differenceValue));
    return days;
}

/////////////////////////////////////
//* ANCHOR - Return number with point, if over 999
/////////////////////////////////////
export function numberWithCommas(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export /////////////////////////////////////
//* ANCHOR - Identify Trainingsplace
//TODO - Show other Trainingsplace
/////////////////////////////////////
function identify_trainingsplace(training) {

    let fitnessstudio = 0;
    let otherTrainingsplace = 0;
    let heimtraining = 0;

    for (let i = 0; i < training.length; i++) {
        if (training[i].trainingsplace === 'Fitnessstudio') {
            fitnessstudio++
        } else if (training[i].trainingsplace === 'Heimtraining') {
            heimtraining++;
        } else {
            otherTrainingsplace++;
        }
    }
    if (fitnessstudio > otherTrainingsplace && fitnessstudio > heimtraining) {
        return 'Fitti';
    }

    if (otherTrainingsplace > fitnessstudio && otherTrainingsplace > heimtraining) {
        return 'Sonstiges';
    }

    if (heimtraining > fitnessstudio && heimtraining > otherTrainingsplace) {
        return 'Home';
    }
}

/////////////////////////////////////
//* ANCHOR - Save to local Storage
/////////////////////////////////////
export function save_into_storage(save_Object) {
    localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));
}
