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
function add_zero(val) {
    if (val < 10) {
        val = `0${val}`;
    }
    return val;
}