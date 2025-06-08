document.getElementById("nameInput").addEventListener("input", function () {
  this.value = this.value.replace(/\d/g, "");
});
