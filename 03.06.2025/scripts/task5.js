const bookList = document.getElementById("bookList");
let activeItem = null;

bookList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    if (activeItem) {
      activeItem.style.backgroundColor = "";
    }
    e.target.style.backgroundColor = "orange";
    activeItem = e.target;
  }
});
