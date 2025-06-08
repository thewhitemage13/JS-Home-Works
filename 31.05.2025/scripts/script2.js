class ExtendedDate extends Date {
  constructor(...args) {
    super(...args);
  }

  getTextDate() {
    const months = [
      "січня", "лютого", "березня", "квітня", "травня", "червня",
      "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];
    return `${this.getDate()} ${months[this.getMonth()]}`;
  }

  isFuture() {
    const now = new Date();
    return this >= now;
  }

  isLeapYear() {
    const year = this.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  getNextDate() {
    const next = new Date(this);
    next.setDate(this.getDate() + 1);
    return next.toDateString();
  }
}

const extDate = new ExtendedDate(2024, 1, 29); 
console.log("Дата:", extDate.getTextDate());
console.log("Майбутня чи поточна дата?", extDate.isFuture());
console.log("Високосний рік?", extDate.isLeapYear());
console.log("Наступна дата:", extDate.getNextDate());
