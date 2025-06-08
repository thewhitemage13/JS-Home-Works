const lights = document.querySelectorAll(".traffic-light .light");
const switchBtn = document.getElementById("switchLight");
let current = 0;

function updateLight() {
  lights.forEach(light => light.classList.remove("active"));
  lights[current].classList.add("active");
  current = (current + 1) % lights.length;
}

switchBtn.addEventListener("click", updateLight);
