/////////////////////////////////////
//* ANCHOR - Class for Modal
/////////////////////////////////////

export class Modal {
  static open_modal(modal) {
    this.close_all_modals();
    modal.classList.add("active");
  }

  static close_all_modals() {
    document
      .querySelectorAll(".modal")
      .forEach((m) => m.classList.remove("active"));
  }
}
