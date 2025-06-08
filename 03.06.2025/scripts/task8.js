const resizable = document.getElementById("resizable");
const resizer = resizable.querySelector(".resizer");

resizer.addEventListener("mousedown", function (e) {
  e.preventDefault();

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = resizable.offsetWidth;
  const startHeight = resizable.offsetHeight;

  function onMouseMove(e) {
    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);
    resizable.style.width = newWidth + "px";
    resizable.style.height = newHeight + "px";
  }

  function onMouseUp() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
});
