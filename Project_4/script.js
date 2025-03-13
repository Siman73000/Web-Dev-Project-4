const addButton = document.getElementById("add-button");
const deleteButton = document.getElementById("delete-button");
const input = document.getElementById("input");
const list = document.getElementById("list");

let itemStorage = JSON.parse(localStorage.getItem("itemStorage")) || [];

function createListItem(text, checked = false, iconSrc = null) {
  const li = document.createElement("li");
  li.classList.add("list-item");

  // Create a clickable box element that acts as a toggle.
  const box = document.createElement("div");
  box.classList.add("clickable-box");
  if (checked) {
    box.classList.add("active");
  }

  // Create an SVG icon for checked state.
  const svgIcon = document.createElement("img");
  svgIcon.src = iconSrc || "assets/checked.svg"; // Load from storage or default
  svgIcon.alt = "Checked";
  svgIcon.classList.add("svg-icon");
  svgIcon.style.display = checked ? "block" : "none"; // Show only if checked

  box.appendChild(svgIcon); // Append SVG inside the box

  // Create a span for the task text.
  const span = document.createElement("span");
  span.textContent = text;
  if (checked) {
    span.classList.add("completed");
  }

  // Create the delete icon (using delete.svg).
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "assets/delete.svg"; // Correct path to delete icon
  deleteIcon.alt = "Delete";
  deleteIcon.classList.add("delete-icon");

  // Toggle active state when the box is clicked.
  box.addEventListener("click", () => {
    box.classList.toggle("active");
    const isActive = box.classList.contains("active");
    span.classList.toggle("completed", isActive);
    svgIcon.style.display = isActive ? "block" : "none"; // Show SVG when active

    // Update itemStorage
    itemStorage = itemStorage.map(item =>
      item.text === text ? { text, checked: isActive, iconSrc: svgIcon.src } : item
    );
    localStorage.setItem("itemStorage", JSON.stringify(itemStorage));
  });

  // When the delete icon is clicked, remove the item.
  deleteIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    itemStorage = itemStorage.filter(item => item.text !== text);
    localStorage.setItem("itemStorage", JSON.stringify(itemStorage));
  });

  // Append elements in the correct order: [Checkbox] [Text] [Delete Button]
  li.appendChild(box);
  li.appendChild(span);
  li.appendChild(deleteIcon);

  return li;
}


input.addEventListener("input", () => {
  input.style.height = "auto"; // Reset height
  input.style.height = input.scrollHeight + "px"; // Adjust based on content
});




// Render stored items on load.
itemStorage.forEach(({ text, checked }) => {
  const li = createListItem(text, checked);
  list.appendChild(li);
});

// Add new item.
addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;
  const li = createListItem(text, false);
  list.appendChild(li);
  itemStorage.push({ text, checked: false });
  localStorage.setItem("itemStorage", JSON.stringify(itemStorage));
  input.value = "";
});

// Delete selected items using the "Delete" button (if needed).
deleteButton.addEventListener("click", (e) => {
  e.preventDefault();
  const checkedItems = [...list.querySelectorAll(".clickable-box.active")];
  checkedItems.forEach((box) => {
    const li = box.parentElement;
    const text = li.querySelector("span").textContent;
    li.remove();
    itemStorage = itemStorage.filter(item => item.text !== text);
  });
  localStorage.setItem("itemStorage", JSON.stringify(itemStorage));
});

document.addEventListener("DOMContentLoaded", () => {
  input.addEventListener("focus", () => input.classList.add("animate"));
  input.addEventListener("blur", () => input.classList.remove("animate"));
});


input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent default form submission
    addButton.click();  // Trigger the Add button's click event
  }
});