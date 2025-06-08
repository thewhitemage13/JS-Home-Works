const field = document.getElementById("field");
const ball = document.getElementById("ball");

field.addEventListener("click", function (e) {
  const fieldRect = field.getBoundingClientRect();
  const ballSize = ball.offsetWidth;

  let x = e.clientX - fieldRect.left - ballSize / 2;
  let y = e.clientY - fieldRect.top - ballSize / 2;

  x = Math.max(0, Math.min(x, field.clientWidth - ballSize));
  y = Math.max(0, Math.min(y, field.clientHeight - ballSize));

  ball.style.left = x + "px";
  ball.style.top = y + "px";
});
