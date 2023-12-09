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

eval("const modal_edit = document.getElementById(\"modal_edit\");\nconst modal_exercise = document.getElementById(\"modal_exercise\");\nconst modal_settings = document.getElementById(\"modal_settings\");\n\nconst btn_home = document.getElementById(\"btn_home\");\nconst btn_open_edit = document.getElementById(\"btn_open_edit\");\nconst btn_settings = document.getElementById(\"btn_settings\");\n\nconst modal_close_btn = document.querySelectorAll('.modal_close_btn');\n\nconst modal_list = [modal_edit, modal_exercise, modal_settings];\n\n\nbtn_open_edit.addEventListener('click', ()=> {\n    open_modal(modal_edit);\n});\n\nbtn_settings.addEventListener('click', ()=> {\n    open_modal(modal_settings);\n});\n\nbtn_home.addEventListener('click', () => {\n    close_all_modals();\n});\n\nfunction open_modal(modal) {\n    close_all_modals();\n    modal.classList.add('active');\n}\n\nfunction close_all_modals() {\n    for (let i = 0; i < modal_list.length; i++) {\n        modal_list[i].classList.remove('active');\n    }\n}\n\nmodal_close_btn.forEach((c_btn)=> {\n    c_btn.addEventListener('click', ()=> {\n        close_all_modals();\n    })\n})\n\n//# sourceURL=webpack://project-template/./src/js/modals.js?");

/***/ }),

/***/ "./src/js/script.js":
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
/***/ (() => {

eval("/////////////////////////////////////\n// * Variablen\n/////////////////////////////////////\n//* ANCHOR - Elemente\n\nconst exercise_container = document.getElementById('exercise_container');\n\n\n//* ANCHOR -  Variablen\n\n\n//*  Saveobj\nlet save_Object = {\n    training_is_running: false,\n    exercises: [],\n    trainings: [],\n    current_training: [],\n    training_place_filter: '',\n};\n\n\n\n/////////////////////////////////////\n// * ANCHOR - Init\n/////////////////////////////////////\nwindow.onload = ()=> {\n    loadAndShow();\n    \n    setTimeout(() => {\n        render_exercises();\n    }, 500);\n}\n\n\n\n\n/////////////////////////////////////\n//* ANCHOR - Class for training\n/////////////////////////////////////\nclass Training {\n    constructor(training_id = rnd_id(),start_date, set_amount, start, end, exercises) {\n\n    }\n}\n/////////////////////////////////////\n//* ANCHOR - Class for Exercise\n/////////////////////////////////////\nclass Exercise {\n    constructor(exercise_id = rnd_id(), name = 'Leere Übung', weight = '0', sets = 0, repeats = 0, machineNumber = '-', machine_seat_settings = '-', musclegroup = '-', trainingsplace = '-', solved_sets = 0) {\n        this.exercise_id = exercise_id;\n        this.name = name;\n        this.weight = weight;\n        this.sets = sets;\n        this.repeats = repeats;\n        this.machineNumber = machineNumber;\n        this.machine_seat_settings = machine_seat_settings;\n        this.musclegroup = musclegroup;\n        this.trainingsplace = trainingsplace;\n        this.solved_sets = solved_sets;\n    }\n\n    show_exercise_in_console() {\n        console.log(`ID=${this.exercise_id} \n        Name = ${this.name} \\n \n        Gewicht = ${this.weight} \\n \n        Sätze = ${this.sets} \\n \n        Wdh = ${this.repeats} \\n \n        Nummer = ${this.machineNumber} \\n \n        Geräteeinstellungen = ${this.machine_seat_settings} \\n\n        Muskelgruppe = ${this.musclegroup} \\n\n        Trainingsort = ${this.trainingsplace} \\n\n        SolvedSets = ${this.solved_sets}`);\n    }\n\n}\n\n/////////////////////////////////////\n//* ANCHOR - Random ID Creator\n/////////////////////////////////////\nfunction rnd_id() {\n    const rndStuff = [\n        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',\n        'R','S','T','U','V','W','X','Y','Z','$','?','1','2','3','4','8','7',\n        '6','5','9','0','#',\n    ];\n    let key = '';\n    for (let i = 1; i <= 16; i++) {\n        key += rndStuff[parseInt(Math.random() * rndStuff.length)];\n    }\n    return key;\n}\n\n/////////////////////////////////////\n//*DELETE test objects\n/////////////////////////////////////\nfunction loadAndShow() {\n    const liegestuetze = new Exercise(rnd_id(), 'Liegestütze', '-', 3, 10, '-', '-')\n    const chesspress = new Exercise(rnd_id(), 'chestpress', 45, 3, 12, '31', 'Stufe 6', 'Brust', 'Fitnessstudio')\n\n    save_Object.exercises.push(chesspress);\n    save_Object.exercises.push(liegestuetze);\n\n    console.log('Saveobject', save_Object);\n}\n\n/////////////////////////////////////\n//* ANCHOR - Render exercises\n/////////////////////////////////////\n\nfunction render_exercises() {\n\n    for(let i = 0; i < save_Object.exercises.length; i++) {\n        let exercisebtn = document.createElement('div');\n        exercisebtn.classList.add('exercise');\n        exercisebtn.innerHTML = save_Object.exercises[i].name;\n        exercisebtn.id = save_Object.exercises[i].exercise_id;\n        exercise_container.appendChild(exercisebtn);\n    }\n\n}\n\n/////////////////////////////////////\n//* ANCHOR -\n/////////////////////////////////////\n\n/////////////////////////////////////\n//* ANCHOR -\n/////////////////////////////////////\n\n/////////////////////////////////////\n//* ANCHOR -\n/////////////////////////////////////\n\n\n\n//# sourceURL=webpack://project-template/./src/js/script.js?");

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