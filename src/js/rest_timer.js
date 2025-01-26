export function restTimer() {
  const rest_timer = document.getElementById("btn_timer");
  const lbl_timer = document.getElementById("lbl_timer");
  const rest_time = 60;
  let timer_is_running = false;

  rest_timer.addEventListener("click", () => {
    if (timer_is_running) {
      return;
    }
    let time = rest_time;
    lbl_timer.innerHTML = time;
    lbl_timer.classList.add("active");
    timer_is_running = true;
    const interval = setInterval(() => {
      time--;
      lbl_timer.innerHTML = time;
      if (time <= 0) {
        clearInterval(interval);
        lbl_timer.innerHTML = "Ende";
        timer_is_running = false;
        setTimeout(() => {
          lbl_timer.classList.remove("active");
        }, 1000);
      }
    }, 1000);
  });
}
