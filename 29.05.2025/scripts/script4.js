let classrooms = [
  { name: "101", seats: 15, faculty: "Фізико-математичний" },
  { name: "202", seats: 20, faculty: "Інформаційні технології" },
  { name: "303", seats: 10, faculty: "Фізико-математичний" },
  { name: "404", seats: 18, faculty: "Гуманітарний" }
];

function showAllClassrooms(list) {
  list.forEach(room => {
    console.log(`${room.name} — ${room.seats} місць, факультет: ${room.faculty}`);
  });
}

function showClassroomsByFaculty(list, faculty) {
  list
    .filter(room => room.faculty === faculty)
    .forEach(room => console.log(`${room.name} — ${room.seats} місць`));
}

function suitableClassrooms(list, group) {
  return list.filter(room => 
    room.seats >= group.students && room.faculty === group.faculty
  );
}

function sortBySeats(list) {
  return [...list].sort((a, b) => a.seats - b.seats);
}

function sortByName(list) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

let group = { name: "ІТ-12", students: 17, faculty: "Інформаційні технології" };
