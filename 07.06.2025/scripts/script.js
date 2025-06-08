function checkTest() {
  const answers = document.querySelectorAll("input[type='radio']:checked");
  let score = 0;
  answers.forEach(answer => {
    if (answer.dataset.correct === "true") {
      score++;
    }
  });
  alert(`Правильних відповідей: ${score}`);
}

function applyStyles() {
  const text = document.getElementById("inputText").value;
  const color = document.getElementById("color").value;
  const size = document.getElementById("size").value;
  const weight = document.getElementById("weight").checked ? "bold" : "normal";

  const result = document.getElementById("styledText");
  result.textContent = text;
  result.style.color = color;
  result.style.fontSize = size + "px";
  result.style.fontWeight = weight;
}

function submitOrder() {
  const name = document.getElementById("name").value;
  const book = document.getElementById("book").value;
  const quantity = document.getElementById("quantity").value;
  const date = document.getElementById("date").value;
  const address = document.getElementById("address").value;

  const message = `${name}, дякуємо за замовлення. ${book} (${quantity} шт.) буде доставлений у ${date} за адресою: ${address}`;
  document.getElementById("orderResult").textContent = message;
}

const attendanceData = [];
function saveAttendance() {
  const group = document.getElementById("group").value;
  const lesson = document.getElementById("lesson").value;
  const topic = document.getElementById("topic").value;
  const present = [...document.querySelectorAll("input[name='student']:checked")].map(el => el.value);
  attendanceData.push({ group, lesson, topic, present });
  alert("Присутність збережено");
}

function showAttendance() {
  const output = document.getElementById("attendanceList");
  output.innerHTML = attendanceData.map(item =>
    `<li>${item.group}, пара ${item.lesson}, тема: ${item.topic}, присутні: ${item.present.join(", ")}</li>`
  ).join("");
}

const tickets = [];
function bookTickets() {
  const route = document.getElementById("route").value;
  const date = document.getElementById("travelDate").value;
  const seats = [...document.querySelectorAll("input[name='seat']:checked")].map(el => el.value);
  tickets.push({ route, date, seats });
  alert("Бронювання збережено");
}

function showTickets() {
  const output = document.getElementById("ticketList");
  output.innerHTML = tickets.map(item =>
    `<li>${item.route} (${item.date}), місця: ${item.seats.join(", ")}</li>`
  ).join("");
}
