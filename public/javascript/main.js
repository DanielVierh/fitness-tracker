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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_script_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/script.js */ \"./src/js/script.js\");\n/* harmony import */ var _js_script_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_script_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _js_modals_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/modals.js */ \"./src/js/modals.js\");\n/* harmony import */ var _js_modals_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_modals_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scss/style.scss */ \"./src/scss/style.scss\");\n\n\n\n\n\n//# sourceURL=webpack://project-template/./src/index.js?");

/***/ }),

/***/ "./src/js/modals.js":
/*!**************************!*\
  !*** ./src/js/modals.js ***!
  \**************************/
/***/ (() => {

eval("// const modal_edit = document.getElementById(\"modal_edit\");\n// const modal_exercise = document.getElementById(\"modal_exercise\");\n// const modal_settings = document.getElementById(\"modal_settings\");\n\n// const btn_home = document.getElementById(\"btn_home\");\n// const btn_open_edit = document.getElementById(\"btn_open_edit\");\n// const btn_settings = document.getElementById(\"btn_settings\");\n\n// const modal_close_btn = document.querySelectorAll('.modal_close_btn');\n\n// const modal_list = [modal_edit, modal_exercise, modal_settings];\n\n\n// btn_open_edit.addEventListener('click', ()=> {\n//     open_modal(modal_edit);\n// });\n\n// btn_settings.addEventListener('click', ()=> {\n//     open_modal(modal_settings);\n// });\n\n// btn_home.addEventListener('click', () => {\n//     close_all_modals();\n// });\n\n// function open_modal(modal) {\n//     close_all_modals();\n//     modal.classList.add('active');\n// }\n\n// function close_all_modals() {\n//     for (let i = 0; i < modal_list.length; i++) {\n//         modal_list[i].classList.remove('active');\n//     }\n// }\n\n// modal_close_btn.forEach((c_btn)=> {\n//     c_btn.addEventListener('click', ()=> {\n//         close_all_modals();\n//     })\n// })\n\n//# sourceURL=webpack://project-template/./src/js/modals.js?");

/***/ }),

/***/ "./src/js/script.js":
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
/***/ (() => {

eval("/////////////////////////////////////\n// * Variablen\n/////////////////////////////////////\n//* ANCHOR - Elemente\n\nconst exercise_container = document.getElementById('exercise_container');\nconst btn_add = document.getElementById('btn_add');\nconst btn_saveExercise = document.getElementById('btn_saveExercise');\nconst modal_edit = document.getElementById(\"modal_edit\");\nconst modal_exercise = document.getElementById(\"modal_exercise\");\nconst modal_settings = document.getElementById(\"modal_settings\");\nconst btn_home = document.getElementById(\"btn_home\");\nconst btn_open_edit = document.getElementById(\"btn_open_edit\");\nconst btn_settings = document.getElementById(\"btn_settings\");\nconst modal_close_btn = document.querySelectorAll('.modal_close_btn');\nconst lbl_trainingsname = document.getElementById('lbl_trainingsname');\nconst lbl_weight = document.getElementById('lbl_weight');\nconst lbl_sets = document.getElementById('lbl_sets');\nconst lbl_repeats = document.getElementById('lbl_repeats');\nconst lbl_number = document.getElementById('lbl_number');\nconst lbl_seatsettings = document.getElementById('lbl_seatsettings');\nconst lbl_muscleselect = document.getElementById('lbl_muscleselect');\nconst lbl_donesets = document.getElementById('lbl_donesets');\nconst btn_trackSport = document.getElementById('btn_trackSport');\nconst bdy = document.getElementById('bdy');\nconst btn_finish = document.getElementById('btn_finish');\n\nconst modal_list = [modal_edit, modal_exercise, modal_settings];\n\n\n//* ANCHOR -  Variablen\nlet training_running = false;\nlet training_place_filter = '';\nlet selected_Exercise;\n\n//*  Saveobj\nlet save_Object = {\n    training_is_running: false,\n    training_start: '',\n    exercises: [],\n    trainings: [],\n    current_training: [],\n    training_place_filter: '',\n};\n\n\n\n/////////////////////////////////////\n// * ANCHOR - Init\n/////////////////////////////////////\nwindow.onload = () => {\n    load_local_storage();\n\n    setInterval(() => {\n        observer();\n    }, 1000);\n}\n\n\n//########################################\n//* ANCHOR - Load Local Storage\n//########################################\nfunction load_local_storage() {\n    if (localStorage.getItem('stored_fitness_saveobj') != '') {\n        try {\n            save_Object = JSON.parse(\n                localStorage.getItem('stored_fitness_saveobj'),\n            );\n\n            training_running = save_Object.training_is_running;\n            training_place_filter = save_Object.training_place_filter;\n\n            console.log('saveobj', save_Object);\n\n            setTimeout(() => {\n                //* Render func\n                render_exercises();\n            }, 500);\n\n            try {\n                weeklylist = save_Object.saved_weekly_list;\n                if (weeklylist === undefined) {\n                    weeklylist = [];\n                }\n            } catch (error) {\n                console.log(error);\n            }\n        } catch (error) {\n            console.log(error);\n            save_Object = {\n                training_is_running: false,\n                training_start: '',\n                exercises: [],\n                trainings: [],\n                current_training: [],\n                training_place_filter: '',\n            };\n        }\n    }\n}\n\n\n//########################################\n//* ANCHOR - Save to local Storage\n//########################################\nfunction save_into_storage() {\n    localStorage.setItem('stored_fitness_saveobj', JSON.stringify(save_Object));\n}\n\n\n\n\n/////////////////////////////////////\n//* ANCHOR - Class for training\n/////////////////////////////////////\nclass Training {\n    constructor(training_date, duration, exercises) {\n        this.training_date = training_date;\n        this.duration = duration;\n        this.exercises = exercises;\n    }\n}\n/////////////////////////////////////\n//* ANCHOR - Class for Exercise\n/////////////////////////////////////\nclass Exercise {\n    constructor(exercise_id = rnd_id(), name = 'Leere Übung', weight = '0', sets = 0, repeats = 0, machineNumber = '-', machine_seat_settings = '-', musclegroup = '-', trainingsplace = '-', solved_sets = 0) {\n        this.exercise_id = exercise_id;\n        this.name = name;\n        this.weight = weight;\n        this.sets = sets;\n        this.repeats = repeats;\n        this.machineNumber = machineNumber;\n        this.machine_seat_settings = machine_seat_settings;\n        this.musclegroup = musclegroup;\n        this.trainingsplace = trainingsplace;\n        this.solved_sets = solved_sets;\n    }\n\n    show_exercise_in_console() {\n        console.log(`ID=${this.exercise_id} \n        Name = ${this.name} \\n \n        Gewicht = ${this.weight} \\n \n        Sätze = ${this.sets} \\n \n        Wdh = ${this.repeats} \\n \n        Nummer = ${this.machineNumber} \\n \n        Geräteeinstellungen = ${this.machine_seat_settings} \\n\n        Muskelgruppe = ${this.musclegroup} \\n\n        Trainingsort = ${this.trainingsplace} \\n\n        SolvedSets = ${this.solved_sets}`);\n    }\n\n}\n\n/////////////////////////////////////\n//* ANCHOR - Random ID Creator\n/////////////////////////////////////\nfunction rnd_id() {\n    const rndStuff = [\n        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',\n        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '$', '?', '1', '2', '3', '4', '8', '7',\n        '6', '5', '9', '0', '#',\n    ];\n    let key = '';\n    for (let i = 1; i <= 16; i++) {\n        key += rndStuff[parseInt(Math.random() * rndStuff.length)];\n    }\n    return key;\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - Render exercises\n/////////////////////////////////////\n\nfunction render_exercises() {\n\n    for (let i = 0; i < save_Object.exercises.length; i++) {\n        let exercisebtn = document.createElement('div');\n        exercisebtn.classList.add('exercise');\n        exercisebtn.innerHTML = save_Object.exercises[i].name;\n        exercisebtn.id = save_Object.exercises[i].exercise_id;\n        exercisebtn.addEventListener('click', () => {\n            selected_Exercise = save_Object.exercises[i];\n            console.log('selected_Exercise', selected_Exercise);\n            open_exercise();\n        })\n\n        exercise_container.appendChild(exercisebtn);\n    }\n\n}\n\n/////////////////////////////////////\n//* ANCHOR - Save new Exercise\n/////////////////////////////////////\nbtn_saveExercise.addEventListener('click', () => {\n    let inpExercise_Name = document.getElementById('inpExercise_Name');\n    let inpExercise_Weight = document.getElementById('inpExercise_Weight');\n    let inpExercise_Sets = document.getElementById('inpExercise_Sets');\n    let inpExercise_Repeats = document.getElementById('inpExercise_Repeats');\n    let inpExercise_number = document.getElementById('inpExercise_number');\n    let inpExercise_seatSettings = document.getElementById('inpExercise_seatSettings');\n    let muscle_select = document.getElementById('muscle_select');\n    let training_Area = document.getElementById('training_Area');\n    if (inpExercise_Name.value === '') {\n        return\n    }\n    if (inpExercise_Weight.value === '') {\n        inpExercise_Weight.value = 0;\n    }\n    if (inpExercise_Sets.value === '') {\n        inpExercise_Sets.value = 0;\n    }\n    if (inpExercise_Repeats.value === '') {\n        inpExercise_Repeats.value = 0;\n    }\n    if (inpExercise_number.value === '') {\n        inpExercise_number.value = '-'\n    }\n    if (inpExercise_seatSettings.value === '') {\n        inpExercise_seatSettings.value = '-'\n    }\n    if (muscle_select.value === '') {\n        muscle_select.value = '-';\n    }\n    if (training_Area.value === '') {\n        training_Area.value = '-';\n    }\n\n    const newExercise = new Exercise(rnd_id(),\n        inpExercise_Name.value,\n        inpExercise_Weight.value,\n        inpExercise_Sets.value,\n        inpExercise_Repeats.value,\n        inpExercise_number.value,\n        inpExercise_seatSettings.value,\n        muscle_select.value,\n        training_Area.value,\n        0\n    );\n    save_Object.exercises.push(newExercise);\n    save_into_storage();\n    location.reload();\n})\n\n\n/////////////////////////////////////\n//* ANCHOR - open Exercise\n/////////////////////////////////////\nfunction open_exercise() {\n    open_modal(modal_exercise);\n    lbl_trainingsname.innerHTML = selected_Exercise.name;\n    lbl_weight.innerHTML = `Übungsgewicht: <span>${selected_Exercise.weight}</span> Kg`;\n    lbl_sets.innerHTML = `Sätze: <span>${selected_Exercise.sets}</span>`;\n    lbl_repeats.innerHTML = `Wiederholungen: <span>${selected_Exercise.repeats}</span>`;\n    lbl_number.innerHTML = `Gerätenummer: Nr.<span>${selected_Exercise.machineNumber}</span>`;\n    lbl_seatsettings.innerHTML = `Geräteeinstellungen: <span>${selected_Exercise.machine_seat_settings}</span>`;\n    lbl_muscleselect.innerHTML = `Muskelgruppe: <span>${selected_Exercise.musclegroup}</span>`;\n    lbl_donesets.innerHTML = `Übungen absolviert: <span>${selected_Exercise.solved_sets}</span>`;\n}\n\n\n\n\n/////////////////////////////////////\n//* ANCHOR - Tracking\n/////////////////////////////////////\nbtn_trackSport.addEventListener('click', () => {\n    if (training_running === false) {\n        training_running = true;\n        //* Training boolean speichern\n        save_Object.training_is_running = true;\n        //* Training Startzeit ermitteln und speichern\n        const training_start_stamp = new Date();\n        save_Object.training_start = training_start_stamp;\n        //const timestamp = training_start_stamp.getTime(); \n        //console.log(minutesDiff(dateTimeValue1, training_start_stamp));\n        //* Set in Training Array speichern\n        add_solved_set();\n\n        // * persistent speichern\n        save_into_storage();\n\n        //TODO -  replace alert \n        alert(\"Ein weiterer Satz wurde hinzugefügt\");\n\n    } else {\n        //* Set in Training Array speichern\n        add_solved_set()\n\n        // * persistent speichern\n        save_into_storage();\n\n        //TODO -  replace alert \n        alert(\"Ein weiterer Satz wurde hinzugefügt\");\n    }\n})\n\nfunction add_solved_set() {\n    //* Übung in Training Array speichern\n    //* Abgleichen ob bereits vorhanden per id match, \n    //* wenn vorhanden eins hochzählen\n    if (check_exercise_in_currentTraining(selected_Exercise)) {\n        let currentSet = save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets;\n        let new_set_amount = currentSet += 1;\n        save_Object.current_training[`${indexOfExercise(selected_Exercise, save_Object.current_training)}`].solved_sets = new_set_amount;\n        lbl_donesets.innerHTML = `Übungen absolviert: <span>${new_set_amount}</span>`;\n    } else {\n        //* wenn nein, in das Array übertragen und eins hochzählen\n        let cloned_exercise = Object.assign({}, selected_Exercise);\n        cloned_exercise.solved_sets = cloned_exercise.solved_sets += 1;\n        save_Object.current_training.push(cloned_exercise);\n        lbl_donesets.innerHTML = `Übungen absolviert: <span>${cloned_exercise.solved_sets}</span>`;\n    }\n}\n\n\nfunction check_exercise_in_currentTraining(exercise) {\n    const exerciseId = exercise.exercise_id;\n    let is_in_currentTraining = false;\n\n    for (let i = 0; i < save_Object.current_training.length; i++) {\n        if (save_Object.current_training[i].exercise_id === exerciseId) {\n            is_in_currentTraining = true;\n            break;\n        }\n    }\n\n    return is_in_currentTraining;\n}\n\nfunction indexOfExercise(exercise, arr) {\n    const exerciseId = exercise.exercise_id;\n    let index = -1;\n\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i].exercise_id === exerciseId) {\n            index = i;\n            break;\n        }\n    }\n\n    return index;\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - MinutesDiff\n/////////////////////////////////////\nfunction minutesDiff(dateTimeValue2, dateTimeValue1) {\n    var differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;\n    differenceValue /= 60;\n    const rawMinuteTime = Math.abs(Math.round(differenceValue))\n    const hour = Math.floor(rawMinuteTime / 60);\n    const minutes = Math.floor(rawMinuteTime % 60);\n    const time = `${add_zero(hour)}:${add_zero(minutes)}`;\n    return time;\n}\n\nfunction add_zero(val) {\n    if (val < 10) {\n        val = `0${val}`;\n    }\n    return val;\n}\n\n\n/////////////////////////////////////\n//* ANCHOR - Modals\n/////////////////////////////////////\n\nbtn_open_edit.addEventListener('click', () => {\n    open_modal(modal_edit);\n});\n\nbtn_settings.addEventListener('click', () => {\n    open_modal(modal_settings);\n});\n\nbtn_add.addEventListener('click', () => {\n    open_modal(modal_edit);\n});\n\nbtn_home.addEventListener('click', () => {\n    close_all_modals();\n});\n\nfunction open_modal(modal) {\n    close_all_modals();\n    modal.classList.add('active');\n}\n\nfunction close_all_modals() {\n    for (let i = 0; i < modal_list.length; i++) {\n        modal_list[i].classList.remove('active');\n    }\n}\n\nmodal_close_btn.forEach((c_btn) => {\n    c_btn.addEventListener('click', () => {\n        close_all_modals();\n    })\n})\n\n\n/////////////////////////////////////\n//* ANCHOR - Observer\n/////////////////////////////////////\nfunction observer() {\n\n    //* Schaue ob trainin aktiv\n    if (training_running) {\n        bdy.classList.add('active-training');\n        btn_finish.classList.add('active-training');\n        //TODO - Training diff hochzählen\n\n    } else {\n        bdy.classList.remove('active-training');\n        btn_finish.classList.remove('active-training');\n    }\n\n\n}\n\n/////////////////////////////////////\n//* ANCHOR - finish training\n/////////////////////////////////////\nbtn_finish.addEventListener('click', () => {\n    finish_training()\n})\nfunction finish_training() {\n    const decision = window.confirm('Soll das Training beendet werden?');\n    if (decision) {\n        const trainingsdate = new Date(save_Object.training_start)\n        const day = trainingsdate.getDate();\n        const month = trainingsdate.getMonth() + 1;\n        const year = trainingsdate.getFullYear();\n        const datum = `${add_zero(day)}.${add_zero(month)}.${year}`;\n\n        const trainingsEnd_timestamp = new Date();\n        const duration = minutesDiff(trainingsEnd_timestamp, trainingsdate);\n\n\n        //* Trainingsobject erstellen und abspeichern\n        const new_solved_training = new Training(datum, duration, save_Object.current_training);\n        save_Object.trainings.push(new_solved_training)\n\n        //* alle sets zurücksetzen\n        for (let i = 0; i < save_Object.exercises.length; i++) {\n            save_Object.exercises[i].solved_sets = 0;\n        }\n\n        //*Reset current training\n        save_Object.current_training = [];\n\n        //* trainingsstart reset\n        save_Object.training_start = '';\n\n        //* set training is running to false\n        training_running = false;\n        save_Object.training_is_running = false;\n\n        // * Save into storage\n        save_into_storage();\n\n        //TODO -  replace alert \n        const exercArr = new_solved_training.exercises;\n        let exerciseInfoArr = '';\n        for(let j = 0; j < exercArr.length; j++) {\n            const newRow = `\\n ${exercArr[j].name} - ${exercArr[j].solved_sets} x `\n            exerciseInfoArr = exerciseInfoArr + newRow;\n        }\n        console.log(exercArr);\n        alert(`Training beendet \\n Datum: ${datum} \\n\n        Zeit: ${duration} \\n\n        Übungen: ${exerciseInfoArr}`);\n\n        //* reload page\n        location.reload();\n    }\n\n}\n\n//# sourceURL=webpack://project-template/./src/js/script.js?");

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