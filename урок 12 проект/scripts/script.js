window.addEventListener('hashchange', () => {
  selectPage();
});

document.addEventListener('DOMContentLoaded', () => {
  selectPage();
});

function selectPage() {
  const route = window.location.hash.split('/');
  switch (route[0]) {
    case '':
    case '#home':
      homePage();
      break;
    case '#rate':
      ratePage(route[1]);
      break;
    default:
      notFoundPage();
  }
}

function m(val) {
  return val < 10 ? `0${val}` : val;
}

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${m(d.getMonth() + 1)}-${m(d.getDate())}`;
}

function formatDate(dateInput) {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return `${m(d.getDate())}.${m(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function loadExchange(dateStr) {
  let url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
  if (dateStr) {
    url += `&date=${dateStr.replaceAll('-', '')}`;
  }

  fetch(url)
    .then(r => r.json())
    .then(j => {
      const mainBlock = document.getElementById('main-block');
      let dateToShow = dateStr ? formatDate(dateStr) : formatDate(new Date());

      let table = `<h3 class="mb-3">Курси валют на ${dateToShow}</h3><div class="card shadow-sm mb-4"><div class="table-responsive"><input type="date" id="rate-date" class="form-control mb-3" value="${dateStr || getToday()}" /><table class="table table-striped table-hover"><thead class="table-dark"><tr><th><i class="bi bi-currency-exchange"></i> Код</th><th><i class="bi bi-translate"></i> Назва</th><th class="text-end"><i</tr></thead><tbody>
      `;

      for (let r of j) {
        table += `<tr data-cc="${r.cc}"><td>${r.cc}</td><td>${r.txt}</td><td class="text-end">${r.rate}</td></tr>`;
      }

      table += `</tbody></table></div></div>`;

      mainBlock.innerHTML = table;

      const dateInput = document.getElementById('rate-date');
      if (dateInput) {
        dateInput.addEventListener('change', rateDateChange);
      }

      for (let e of mainBlock.querySelectorAll('[data-cc]')) {
        e.onclick = rateClick;
      }
    })
    .catch(error => {
      document.getElementById('main-block').innerHTML = "<div class='alert alert-danger'>Помилка завантаження даних.</div>";
      console.error("Fetch error:", error);
    });
}

function homePage() {
  loadExchange(); 
}

function rateDateChange(e) {
  const selectedDate = e.target.value;
  loadExchange(selectedDate);
}

function ratePage(cc) {
  if (typeof cc === 'undefined') {
    cc = 'USD';
  }

  const date = new Date();
  const dateStr = `${date.getFullYear()}${m(date.getMonth() + 1)}${m(date.getDate())}`;
  const apiUrl = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${cc}&date=${dateStr}&json`;

  fetch(apiUrl)
    .then(r => r.json())
    .then(data => {
      if (data.length === 0) {
        throw new Error("Немає даних на цю дату.");
      }

      const rate = data[0];
      const html = `<div class="d-flex justify-content-center align-items-center min-vh-100"><div class="card shadow-sm" style="max-width: 500px; width: 100%;"><div class="card-header bg-primary text-white"><h4 class="mb-0">Курс валюти ${rate.cc} – ${rate.txt}</h4></div><div class="card-body"><p><strong>Дата:</strong> ${rate.exchangedate}</p><p><strong>Офіційний курс НБУ:</strong> <span class="fs-4 text-success fw-bold">${rate.rate} ₴</span></p><a href="#home" class="btn btn-outline-primary mt-3">Повернутись до списку валют</a></div></div></div>
      `;

      document.getElementById('main-block').innerHTML = html;
    })
    .catch(err => {
      document.getElementById('main-block').innerHTML = "<div class='alert alert-danger'>Помилка при завантаженні курсу.</div>";
      console.error("Fetch error:", err);
    });
}

function notFoundPage() {
  document.getElementById('main-block').innerHTML = "<div class='alert alert-warning'>Сторінку не знайдено.</div>";
}

function rateClick(e) {
  const cc = e.currentTarget.getAttribute('data-cc');
  window.location.hash = "#rate/" + cc;
}
