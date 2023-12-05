const modal_edit = document.getElementById("modal_edit");
const modal_exercise = document.getElementById("modal_exercise");
const modal_settings = document.getElementById("modal_settings");

const btn_home = document.getElementById("btn_home");
const btn_open_edit = document.getElementById("btn_open_edit");
const btn_settings = document.getElementById("btn_settings");

const modal_close_btn = document.querySelectorAll('.modal_close_btn');

const modal_list = [modal_edit, modal_exercise, modal_settings];


btn_open_edit.addEventListener('click', ()=> {
    open_modal(modal_edit);
});

btn_settings.addEventListener('click', ()=> {
    open_modal(modal_settings);
});

btn_home.addEventListener('click', () => {
    close_all_modals();
});

function open_modal(modal) {
    close_all_modals();
    modal.classList.add('active');
}

function close_all_modals() {
    for (let i = 0; i < modal_list.length; i++) {
        modal_list[i].classList.remove('active');
    }
}

modal_close_btn.forEach((c_btn)=> {
    c_btn.addEventListener('click', ()=> {
        close_all_modals();
    })
})