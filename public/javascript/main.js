/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://project-template/./src/scss/style.scss?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_script_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/script.js */ \"./src/js/script.js\");\n/* harmony import */ var _js_script_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_script_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scss/style.scss */ \"./src/scss/style.scss\");\n\n\n\n\n//# sourceURL=webpack://project-template/./src/index.js?");

/***/ }),

/***/ "./src/js/script.js":
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
/***/ (() => {

eval("/////////////////////////////////////\n// * Variablen\n/////////////////////////////////////\n//* ANCHOR - Elemente\n\nconst exercise_container = document.getElementById('exercise_container');\nconst btn_add = document.getElementById('btn_add');\nconst btn_saveExercise = document.getElementById('btn_saveExercise');\nconst modal_edit = document.getElementById(\"modal_edit\");\nconst modal_exercise = document.getElementById(\"modal_exercise\");\nconst modal_settings = document.getElementById(\"modal_settings\");\nconst btn_home = document.getElementById(\"btn_home\");\nconst btn_open_edit = document.getElementById(\"btn_open_edit\");\nconst btn_settings = document.getElementById(\"btn_settings\");\nconst modal_close_btn = document.querySelectorAll('.modal_close_btn');\nconst lbl_trainingsname = document.getElementById('lbl_trainingsname');\nconst lbl_weight = document.getElementById('lbl_weight');\nconst lbl_sets = document.getElementById('lbl_sets');\nconst lbl_repeats = document.getElementById('lbl_repeats');\nconst lbl_number = document.getElementById('lbl_number');\nconst lbl_seatsettings = document.getElementById('lbl_seatsettings');\nconst lbl_muscleselect = document.getElementById('lbl_muscleselect');\nconst lbl_donesets = document.getElementById('lbl_donesets');\nconst btn_trackSport = document.getElementById('btn_trackSport');\nconst lbl_trainingsarea = document.getElementById('lbl_trainingsarea');\nconst bdy = document.getElementById('bdy');\nconst btn_finish = document.getElementById('btn_finish');\nconst btn_show_trainings = document.getElementById('btn_show_trainings');\nconst modal_trainings = document.getElementById('modal_trainings');\nconst trainings_wrapper = document.getElementById('trainings_wrapper');\nconst last_training = document.getElementById('last_training');\nconst btn_edit = document.getElementById('btn_edit');\nconst exercise_table = document.getElementById('exercise_table');\nconst lbl_exerciseRepeats = document.getElementById('lbl_exerciseRepeats');\nconst lbl_exerciseSets = document.getElementById('lbl_exerciseSets');\nlet inpExercise_Name = document.getElementById('inpExercise_Name');\nlet inpExercise_Weight = document.getElementById('inpExercise_Weight');\nlet inpExercise_Sets = document.getElementById('inpExercise_Sets');\nlet inpExercise_Repeats = document.getElementById('inpExercise_Repeats');\nlet inpExercise_number = document.getElementById('inpExercise_number');\nlet inpExercise_seatSettings = document.getElementById('inpExercise_seatSettings');\nlet muscle_select = document.getElementById('muscle_select');\nlet training_Area = document.getElementById('training_Area');\n\n\n\n\n\n//* ANCHOR -  Variablen\nlet training_running = false;\nlet training_place_filter = '';\nlet selected_Exercise;\nlet is_edit = false;\n\n//*  Saveobj\nlet save_Object = {\n    training_is_running: false,\n    training_start: '',\n    exercises: [],\n    trainings: [],\n    current_training: [],\n    training_place_filter: '',\n};\n\n\n\n/////////////////////////////////////\n// * ANCHOR - Init\n/////////////////////////////////////\nwindow.onload = () => {\n    load_local_storage();\n\n    setInterval(() => {\n        observer();\n    }, 1000);\n}\n\n\n//########################################\n//* ANCHOR - Load Local Storage\n//########################################\nfunction load_local_storage() {\n    if (localStorage.getItem('stored_fitness_saveobj') != '') {\n        try {\n            save_Object = JSON.parse(localStorage.getItem('stored_fitness_saveobj'));\n        } catch (error) {\n            console.log('Main Error', error);\n            save_Object = {\n                training_is_running: false,\n                training_start: '',\n                exercises: [],\n                trainings: [],\n                current_training: [],\n                training_place_filter: '',\n            };\n            save_into_storage();\n        }\n\n        try {\n            training_running = save_Object.training_is_running;\n        } catch (error) {\n            console.log('training_running', error);\n        }\n\n        try {\n            training_place_filter = save_Object.training_place_filter;\n        } catch (error) {\n            console.log('training_place_filter', error);\n        }\n\n        try {\n            const last = save_Object.trainings.length - 1;\n            last_training.innerHTML = `${save_Object.trainings[last].training_date} -- ${save_Object.trainings[last].duration}`;\n        } catch (error) { \n            console.log('last_training', error);\n        }\n\n        setTimeout(() => {\n            //* Render func\n            render_exercises();\n        }, 500);\n\n        try {\n            fill_chart();\n        } catch (error) {\n            console.log(error);\n        }\n       \n    }\n    if(save_Object === null) {\n        save_Object = {\n            training_is_running: false,\n            training_start: '',\n            exercises: [],\n            trainings: [],\n            current_training: [],\n            training_place_filter: '',\n        };\n        save_into_storage();\n        console.log('was null');\n    }\n    console.log('saveobj', save_Object);\n}\n\n//########################################\n//* ANCHOR - Render Chart\n//########################################\nfunction fill_chart() {\n    const current_time_stamp = new Date();\n    const current_Year = current_time_stamp.getFullYear();\n    let jan = 0;\n    let feb = 0;\n    let mrz = 0;\n    let apr = 0;\n    let mai = 0;\n    let jun = 0;\n    let jul = 0;\n    let aug = 0;\n    let sep = 0;\n    let okt = 0;\n    let nov = 0;\n    let dez = 0;\n\n    for (let i = 0; i < save_Object.trainings.length; i++) {\n        const solved_Date = save_Object.trainings[i].training_date;\n        const solved_year = splitVal(solved_Date, '.', 2);\n        const solved_month = splitVal(solved_Date, '.', 1);\n\n        if(solved_year == current_Year) {\n            switch (solved_month) {\n                case '01':\n                    jan++;\n                    break;\n                case '02':\n                    feb++;\n                    break;\n                case '03':\n                    mrz++;\n                    break;\n                case '04':\n                    apr++;\n                    break;\n                case '05':\n                    mai++;\n                    break;\n                case '06':\n                    jun++;\n                    break;\n                case '07':\n                    jul++;\n                    break;\n                case '08':\n                    aug++;\n                    break;\n                case '09':\n                    sep++;\n                    break;\n                case '10':\n                    okt++;\n                    break;\n                case '11':\n                    nov++;\n                    break;\n                case '12':\n                    dez++;\n                    break;\n            \n                default:\n                    break;\n            }\n        }\n    }\n\n    const month_arr = [jan, feb, mrz, apr, mai, jun, jul, aug, sep, okt, nov, dez];\n\n    //* find max val;\n\n    let max_per_month = 0;\n\n    month_arr.forEach((month)=> {\n        if(month > max_per_month) {\n            max_per_month = month;\n        }\n    })\n\n    // max = 100% aka 350px\n    let left = 2;\n    month_arr.forEach((month, index)=> {\n        const value_in_pixel = ((month * 350) / max_per_month);\n        const col = `chart_col_${index + 1}`;\n        document.getElementById(col).style.height = `${value_in_pixel}px`;\n        document.getElementById(col).style.left = `${left}%`;\n        document.getElementById(col).innerHTML = document.getElementById(col).innerHTML + `</br> ${month}`;\n        left = left += 8;\n    })\n    \n}\n\n//########################################\n//* ANCHOR - Split Function\n//########################################\n\nfunction splitVal(val, marker, pos) {\n    const elem = val.split(marker);\n    const retVal = elem[pos];\n    return retVal;\n}\n\n//########################################\n//* ANCHOR - Save to local Storage\n//########################################\nfunction save_into_storage() {\n    localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));\n}\n\n\n\n\n/////////////////////////////////////\n//* ANCHOR - Class for training\n/////////////////////////////////////\nclass Training {\n    constructor(training_date, duration, exercises) {\n        this.training_date = training_date;\n        this.duration = duration;\n        this.exercises = exercises;\n    }\n}\n/////////////////////////////////////\n//* ANCHOR - Class for Exercise\n/////////////////////////////////////\nclass Exercise {\n    constructor(exercise_id = rnd_id(), name = 'Leere Übung', weight = '0', sets = 0, repeats = 0, machineNumber = '-', machine_seat_settings = '-', musclegroup = '-', trainingsplace = '-', solved_sets = 0) {\n        this.exercise_id = exercise_id;\n        this.name = name;\n        this.weight = weight;\n        this.sets = sets;\n        this.repeats = repeats;\n        this.machineNumber = machineNumber;\n        this.machine_seat_settings = machine_seat_settings;\n        this.musclegroup = musclegroup;\n        this.trainingsplace = trainingsplace;\n        this.solved_sets = solved_sets;\n    }\n\n    show_exercise_in_console() {\n        console.log(`ID=${this.exercise_id}\n        Name = ${this.name} \\n\n        Gewicht = ${this.weight} \\n\n        Sätze = ${this.sets} \\n\n        Wdh = ${this.repeats} \\n\n        Nummer = ${this.machineNumber} \\n\n        Geräteeinstellungen = ${this.machine_seat_settings} \\n\n        Muskelgruppe = ${this.musclegroup} \\n\n        Trainingsort = ${this.trainingsplace} \\n\n        SolvedSets = ${this.solved_sets}`);\n    }\n\n}\n\n/////////////////////////////////////\n//* ANCHOR - Class for Modal\n/////////////////////////////////////\n\nclass Modal {\n\n    static modal_list = [modal_edit, modal_exercise, modal_settings, modal_trainings];\n\n    static open_modal(modal) {\n        this.close_all_modals();\n        modal.classList.add('active');\n    }\n\n    static close_all_modals() {\n        for (let i = 0; i < this.modal_list.length; i++) {\n            this.modal_list[i].classList.remove('active');\n        }\n    }\n}\n\n/////////////////////////////////////\n//* ANCHOR - Random ID Creator\n/////////////////////////////////////\nfunction rnd_id() {\n    const rndStuff = [\n        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',\n        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '$', '?', '1', '2', '3', '4', '8', '7',\n        '6', '5', '9', '0', '#',\n    ];\n    let key = '';\n    for (let i = 1; i <= 16; i++) {\n        key += rndStuff[parseInt(Math.random() * rndStuff.length)];\n    }\n    return key;\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - Render exercises\n/////////////////////////////////////\n\nfunction render_exercises() {\n    try {\n        for (let i = 0; i < save_Object.exercises.length; i++) {\n            let exercisebtn = document.createElement('div');\n            exercisebtn.classList.add('exercise');\n            let exerciseName = save_Object.exercises[i].name;\n            try {\n                const currentSet = save_Object.current_training[`${indexOfExercise(save_Object.exercises[i], save_Object.current_training)}`].solved_sets;\n                exerciseName = `${save_Object.exercises[i].name} (${currentSet}/${save_Object.exercises[i].sets})`;\n                if (currentSet >= save_Object.exercises[i].sets) {\n                    exercisebtn.classList.add('solved');\n                } else {\n                    exercisebtn.classList.add('half-solved');\n                }\n            } catch (error) {\n                console.log(error);\n            }\n            exercisebtn.innerHTML = exerciseName;\n            exercisebtn.id = save_Object.exercises[i].exercise_id;\n            exercisebtn.addEventListener('click', () => {\n                selected_Exercise = save_Object.exercises[i];\n                open_exercise();\n            })\n\n            exercise_container.appendChild(exercisebtn);\n        }\n    } catch (error) {\n        console.log(error);\n    }\n\n}\n\n/////////////////////////////////////\n//* ANCHOR - Save new Exercise\n/////////////////////////////////////\nbtn_saveExercise.addEventListener('click', () => {\n\n    if (inpExercise_Name.value === '') {\n        return\n    }\n    if (inpExercise_Weight.value === '') {\n        inpExercise_Weight.value = 0;\n    }\n    if (inpExercise_Sets.value === '') {\n        inpExercise_Sets.value = 0;\n    }\n    if (inpExercise_Repeats.value === '') {\n        inpExercise_Repeats.value = 0;\n    }\n    if (inpExercise_number.value === '') {\n        inpExercise_number.value = '-'\n    }\n    if (inpExercise_seatSettings.value === '') {\n        inpExercise_seatSettings.value = '-'\n    }\n    if (muscle_select.value === '') {\n        muscle_select.value = '-';\n    }\n    if (training_Area.value === '') {\n        training_Area.value = '-';\n    }\n\n    if (is_edit) {\n        selected_Exercise.name = inpExercise_Name.value;\n        selected_Exercise.weight = inpExercise_Weight.value;\n        selected_Exercise.sets = inpExercise_Sets.value;\n        selected_Exercise.repeats = inpExercise_Repeats.value;\n        selected_Exercise.machineNumber = inpExercise_number.value;\n        selected_Exercise.machine_seat_settings = inpExercise_seatSettings.value;\n        selected_Exercise.musclegroup = muscle_select.value;\n        selected_Exercise.trainingsplace = training_Area.value;\n    } else {\n        const newExercise = new Exercise(rnd_id(),\n            inpExercise_Name.value,\n            inpExercise_Weight.value,\n            inpExercise_Sets.value,\n            inpExercise_Repeats.value,\n            inpExercise_number.value,\n            inpExercise_seatSettings.value,\n            muscle_select.value,\n            training_Area.value,\n            0\n        );\n        save_Object.exercises.push(newExercise);\n    }\n\n    save_into_storage();\n    location.reload();\n})\n\n\n/////////////////////////////////////\n//* ANCHOR - open Exercise\n/////////////////////////////////////\nfunction open_exercise() {\n    Modal.open_modal(modal_exercise);\n    lbl_trainingsname.innerHTML = selected_Exercise.name;\n    lbl_weight.innerHTML = `${selected_Exercise.weight} Kg`;\n    lbl_sets.innerHTML = `${selected_Exercise.sets}`;\n    lbl_repeats.innerHTML = `${selected_Exercise.repeats}`;\n    lbl_number.innerHTML = `Nr.${selected_Exercise.machineNumber}`;\n    lbl_seatsettings.innerHTML = `${selected_Exercise.machine_seat_settings}`;\n    lbl_muscleselect.innerHTML = `${selected_Exercise.musclegroup}`;\n    lbl_donesets.innerHTML = `0`;\n    try {\n        const currentSet = save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets;\n        lbl_donesets.innerHTML = `${currentSet}`;\n    } catch (error) { }\n    lbl_trainingsarea.innerHTML = `${selected_Exercise.trainingsplace}`;\n\n    const trainingamount = save_Object.trainings.length - 1;\n    exercise_table.innerHTML = '';\n\n    for (let i = trainingamount; i > -1; i--) {\n        const title = save_Object.trainings[i].training_date;\n        const duration = save_Object.trainings[i].duration;\n        const exc = save_Object.trainings[i].exercises;\n        let only_ecercise;\n        let is_in = false;\n\n\n        for (let j = 0; j < exc.length; j++) {\n            is_in = false;\n            if (exc[j].exercise_id === selected_Exercise.exercise_id) {\n                is_in = true;\n                only_ecercise = exc[j];\n                break;\n            }\n        }\n        if (is_in === true) {\n            const tableContainer = createTable(`${title} - ${duration}`, only_ecercise, true);\n            exercise_table.appendChild(tableContainer);\n        }\n    }\n\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - Tracking\n/////////////////////////////////////\nbtn_trackSport.addEventListener('click', () => {\n    if (training_running === false) {\n\n        const decision = window.confirm('Soll ein Training gestartet werden?')\n        if (decision) {\n            training_running = true;\n            //* Training boolean speichern\n            save_Object.training_is_running = true;\n            //* Training Startzeit ermitteln und speichern\n            const training_start_stamp = new Date();\n            save_Object.training_start = training_start_stamp;\n            //* Set in Training Array speichern\n            add_solved_set();\n\n            // * persistent speichern\n            save_into_storage();\n\n            //TODO -  replace alert\n            alert(\"Ein weiterer Satz wurde hinzugefügt\");\n            location.reload();\n        }\n\n    } else {\n        //* Set in Training Array speichern\n        add_solved_set()\n\n        // * persistent speichern\n        save_into_storage();\n\n        //TODO -  replace alert\n        alert(\"Ein weiterer Satz wurde hinzugefügt\");\n        location.reload();\n    }\n})\n\nfunction add_solved_set() {\n    //* Übung in Training Array speichern\n    //* Abgleichen ob bereits vorhanden per id match,\n    //* wenn vorhanden eins hochzählen\n    if (check_exercise_in_currentTraining(selected_Exercise)) {\n        let currentSet = save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets;\n        let new_set_amount = currentSet += 1;\n        save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets = new_set_amount;\n        lbl_donesets.innerHTML = `${new_set_amount}`;\n    } else {\n        //* wenn nein, in das Array übertragen und eins hochzählen\n        let cloned_exercise = Object.assign({}, selected_Exercise);\n        cloned_exercise.solved_sets = cloned_exercise.solved_sets += 1;\n        save_Object.current_training.push(cloned_exercise);\n        lbl_donesets.innerHTML = `${cloned_exercise.solved_sets}`;\n    }\n}\n\n\nfunction check_exercise_in_currentTraining(exercise) {\n    const exerciseId = exercise.exercise_id;\n    let is_in_currentTraining = false;\n\n    for (let i = 0; i < save_Object.current_training.length; i++) {\n        if (save_Object.current_training[i].exercise_id === exerciseId) {\n            is_in_currentTraining = true;\n            break;\n        }\n    }\n\n    return is_in_currentTraining;\n}\n\nfunction indexOfExercise(exercise, arr) {\n    const exerciseId = exercise.exercise_id;\n    let index = -1;\n\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i].exercise_id === exerciseId) {\n            index = i;\n            break;\n        }\n    }\n\n    return index;\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - MinutesDiff\n/////////////////////////////////////\nfunction minutesDiff(dateTimeValue2, dateTimeValue1) {\n    var differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;\n    differenceValue /= 60;\n    const rawMinuteTime = Math.abs(Math.round(differenceValue))\n    const hour = Math.floor(rawMinuteTime / 60);\n    const minutes = Math.floor(rawMinuteTime % 60);\n    const time = `${add_zero(hour)}:${add_zero(minutes)}`;\n    return time;\n}\n\nfunction add_zero(val) {\n    if (val < 10) {\n        val = `0${val}`;\n    }\n    return val;\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - Modals\n/////////////////////////////////////\n\nbtn_open_edit.addEventListener('click', () => {\n    Modal.open_modal(modal_edit);\n    is_edit = false;\n});\n\nbtn_edit.addEventListener('click', () => {\n    is_edit = true;\n    Modal.open_modal(modal_edit);\n    load_exercise_into_edit();\n});\n\nbtn_settings.addEventListener('click', () => {\n    Modal.open_modal(modal_settings);\n});\n\nbtn_add.addEventListener('click', () => {\n    Modal.open_modal(modal_edit);\n    is_edit = false;\n});\n\nbtn_show_trainings.addEventListener('click', () => {\n    // open_modal(modal_trainings);\n    Modal.open_modal(modal_trainings);\n    render_trainings();\n})\n\nbtn_home.addEventListener('click', () => {\n    Modal.close_all_modals();\n});\n\nmodal_close_btn.forEach((c_btn) => {\n    c_btn.addEventListener('click', () => {\n        Modal.close_all_modals();\n    })\n})\n\n\n/////////////////////////////////////\n//* ANCHOR - Observer\n/////////////////////////////////////\nfunction observer() {\n\n    //* Schaue ob trainin aktiv\n    if (training_running) {\n        bdy.classList.add('active-training');\n        btn_finish.classList.add('active-training');\n        //TODO - Training diff hochzählen\n\n    } else {\n        bdy.classList.remove('active-training');\n        btn_finish.classList.remove('active-training');\n    }\n}\n\n//* Slider\n\ninpExercise_Repeats.addEventListener('input', () => {\n    lbl_exerciseRepeats.innerHTML = inpExercise_Repeats.value;\n});\ninpExercise_Sets.addEventListener('input', () => {\n    lbl_exerciseSets.innerHTML = inpExercise_Sets.value;\n});\n\n/////////////////////////////////////\n//* ANCHOR - finish training\n/////////////////////////////////////\nbtn_finish.addEventListener('click', () => {\n    finish_training()\n})\nfunction finish_training() {\n    const decision = window.confirm('Soll das Training beendet werden?');\n    if (decision) {\n        const trainingsdate = new Date(save_Object.training_start)\n        const day = trainingsdate.getDate();\n        const month = trainingsdate.getMonth() + 1;\n        const year = trainingsdate.getFullYear();\n        const datum = `${add_zero(day)}.${add_zero(month)}.${year}`;\n\n        const trainingsEnd_timestamp = new Date();\n        const duration = minutesDiff(trainingsEnd_timestamp, trainingsdate);\n\n\n        //* Trainingsobject erstellen und abspeichern\n        const new_solved_training = new Training(datum, duration, save_Object.current_training);\n        save_Object.trainings.push(new_solved_training)\n\n        //* alle sets zurücksetzen\n        for (let i = 0; i < save_Object.exercises.length; i++) {\n            save_Object.exercises[i].solved_sets = 0;\n        }\n\n        //*Reset current training\n        save_Object.current_training = [];\n\n        //* trainingsstart reset\n        save_Object.training_start = '';\n\n        //* set training is running to false\n        training_running = false;\n        save_Object.training_is_running = false;\n\n        // * Save into storage\n        save_into_storage();\n\n        const exercArr = new_solved_training.exercises;\n        let exerciseInfoArr = '';\n        for (let j = 0; j < exercArr.length; j++) {\n            const newRow = `\\n ${exercArr[j].name} - ${exercArr[j].solved_sets} x `\n            exerciseInfoArr = exerciseInfoArr + newRow;\n        }\n        //TODO -  replace alert\n        alert(`Training beendet \\n Datum: ${datum} \\n\n        Zeit: ${duration} \\n\n        Übungen: ${exerciseInfoArr}`);\n\n        //* reload page\n        location.reload();\n    }\n\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - Render Trainings\n/////////////////////////////////////\n\nfunction render_trainings() {\n    const trainingamount = save_Object.trainings.length - 1;\n    trainings_wrapper.innerHTML = '';\n    for (let i = trainingamount; i > -1; i--) {\n        const title = save_Object.trainings[i].training_date;\n        const duration = save_Object.trainings[i].duration;\n        const exc = save_Object.trainings[i].exercises;\n        const tableContainer = createTable(`${title} - ${duration}`, exc);\n        trainings_wrapper.appendChild(tableContainer);\n    }\n\n}\n\nfunction createTable(title, data, only_exercise) {\n    const table = document.createElement(\"table\");\n    const header = document.createElement(\"tr\");\n    const nameHeaderCell = document.createElement(\"th\");\n    const weightHeaderCell = document.createElement(\"th\");\n    const repsHeaderCell = document.createElement(\"th\");\n    const setsHeaderCell = document.createElement(\"th\");\n    const muscleHeaderCell = document.createElement(\"th\");\n    nameHeaderCell.appendChild(document.createTextNode(\"Name\"));\n    weightHeaderCell.appendChild(document.createTextNode(\"Gew\"));\n    repsHeaderCell.appendChild(document.createTextNode(\"Wdh\"));\n    setsHeaderCell.appendChild(document.createTextNode(\"Sätze\"));\n    muscleHeaderCell.appendChild(document.createTextNode(\"Muskel\"));\n    header.appendChild(nameHeaderCell);\n    header.appendChild(weightHeaderCell);\n    header.appendChild(repsHeaderCell);\n    header.appendChild(setsHeaderCell);\n    header.appendChild(muscleHeaderCell);\n    table.appendChild(header);\n    for (let i = 0; i < data.length; i++) {\n        const row = document.createElement(\"tr\");\n        const nameCell = document.createElement(\"td\");\n        const weightCell = document.createElement(\"td\");\n        const repsCell = document.createElement(\"td\");\n        const setsCell = document.createElement(\"td\");\n        const muscleCell = document.createElement(\"td\");\n        nameCell.appendChild(document.createTextNode(data[i].name));\n        weightCell.appendChild(document.createTextNode(data[i].weight));\n        repsCell.appendChild(document.createTextNode(data[i].repeats));\n        setsCell.appendChild(document.createTextNode(data[i].solved_sets));\n        muscleCell.appendChild(document.createTextNode(data[i].musclegroup));\n        row.appendChild(nameCell);\n        row.appendChild(weightCell);\n        row.appendChild(repsCell);\n        row.appendChild(setsCell);\n        row.appendChild(muscleCell);\n        table.appendChild(row);\n    }\n    if (only_exercise) {\n        const row = document.createElement(\"tr\");\n        const nameCell = document.createElement(\"td\");\n        const weightCell = document.createElement(\"td\");\n        const repsCell = document.createElement(\"td\");\n        const setsCell = document.createElement(\"td\");\n        const muscleCell = document.createElement(\"td\");\n        nameCell.appendChild(document.createTextNode(data.name));\n        weightCell.appendChild(document.createTextNode(data.weight));\n        repsCell.appendChild(document.createTextNode(data.repeats));\n        setsCell.appendChild(document.createTextNode(data.solved_sets));\n        muscleCell.appendChild(document.createTextNode(data.musclegroup));\n        row.appendChild(nameCell);\n        row.appendChild(weightCell);\n        row.appendChild(repsCell);\n        row.appendChild(setsCell);\n        row.appendChild(muscleCell);\n        table.appendChild(row);\n    }\n    const container = document.createElement(\"div\");\n    const heading = document.createElement(\"h2\");\n    heading.appendChild(document.createTextNode(title));\n    container.appendChild(heading);\n    container.appendChild(table);\n    return container;\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - Edit Exercise\n/////////////////////////////////////\nfunction load_exercise_into_edit() {\n    inpExercise_Name.value = selected_Exercise.name;\n    inpExercise_Weight.value = selected_Exercise.weight;\n    inpExercise_Sets.value = selected_Exercise.sets;\n    inpExercise_Repeats.value = selected_Exercise.repeats;\n    inpExercise_number.value = selected_Exercise.machineNumber;\n    inpExercise_seatSettings.value = selected_Exercise.machine_seat_settings;\n    muscle_select.value = selected_Exercise.musclegroup;\n    training_Area.value = selected_Exercise.trainingsplace;\n    lbl_exerciseRepeats.innerHTML = inpExercise_Repeats.value;\n    lbl_exerciseSets.innerHTML = inpExercise_Sets.value;\n}\n\n\n//# sourceURL=webpack://project-template/./src/js/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;