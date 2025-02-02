/////////////////////////////////////
//* ANCHOR - Class for Modal
/////////////////////////////////////

export class Modal {

    static modal_list = [modal_edit, modal_exercise, modal_settings, modal_trainings, modal_calendar];

    static open_modal(modal) {
        this.close_all_modals();
        modal.classList.add('active');
    }

    static close_all_modals() {
        for (let i = 0; i < this.modal_list.length; i++) {
            this.modal_list[i].classList.remove('active');
        }
    }
}