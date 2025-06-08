class Employee {
  constructor(name, position) {
    this.name = name;
    this.position = position;
  }
}

class EmpTable {
  constructor(employees) {
    this.employees = employees;
  }

  getHtml() {
    let html = "<table><tr><th>Ім’я</th><th>Посада</th></tr>";
    for (const emp of this.employees) {
      html += `<tr><td>${emp.name}</td><td>${emp.position}</td></tr>`;
    }
    html += "</table>";
    return html;
  }
}

class StyledEmpTable extends EmpTable {
  getStyles() {
    return `
      <style>
        table {
          width: 50%;
          border-collapse: collapse;
          margin: 10px 0;
          font-family: Arial;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        th, td {
          padding: 8px 12px;
          border: 1px solid #444;
          text-align: left;
        }
        th {
          background-color: #4CAF50;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
      </style>
    `;
  }

  getHtml() {
    return this.getStyles() + super.getHtml();
  }
}

const staff = [
  new Employee("Іван", "Касир"),
  new Employee("Олена", "Менеджер"),
  new Employee("Сергій", "Аналітик")
];

const styledTable = new StyledEmpTable(staff);
document.getElementById("table-container").innerHTML = styledTable.getHtml();
