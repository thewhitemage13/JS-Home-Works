document.querySelectorAll(".tooltip-btn").forEach(button => {
  let tooltip;

  button.addEventListener("mouseenter", () => {
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerText = button.dataset.tooltip;
    document.body.appendChild(tooltip);

    const rect = button.getBoundingClientRect();
    const top = rect.top - tooltip.offsetHeight - 5;
    const bottom = rect.bottom + 5;

    if (top > 0) {
      tooltip.style.left = rect.left + "px";
      tooltip.style.top = top + "px";
    } else {
      tooltip.style.left = rect.left + "px";
      tooltip.style.top = bottom + "px";
    }
  });

  button.addEventListener("mouseleave", () => {
    if (tooltip) tooltip.remove();
  });
});
