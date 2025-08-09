/////////////////////////////////////
//* ANCHOR - Class for Mini Modal
/////////////////////////////////////

export class Mini_Modal {

    static modal_list = [mini_modal_training];

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