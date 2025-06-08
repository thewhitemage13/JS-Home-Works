document.querySelectorAll("#tree li").forEach(li => {
  const childUl = li.querySelector("ul");
  if (childUl) {
    li.style.cursor = "pointer";
    childUl.style.display = "none";

    li.addEventListener("click", function (e) {
      if (e.target === li) {
        childUl.style.display = childUl.style.display === "none" ? "block" : "none";
      }
    });
  }
});
