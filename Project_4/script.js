const addButton = document.getElementById("add-button");
const deleteButton = document.getElementById("delete-button");
const input = document.getElementById("input");
const list = document.getElementById("list");

let itemStorage = JSON.parse(localStorage.getItem("itemStorage")) || [];

function createListItem(text, checked = false, iconSrc = null) {
  const li = document.createElement("li");
  li.classList.add("list-item");

  const box = document.createElement("div");
  box.classList.add("clickable-box");
  if (checked) {
    box.classList.add("active");
  }

  const svgIcon = document.createElement("img");
  svgIcon.src = iconSrc || "assets/checked.svg";
  svgIcon.alt = "Checked";
  svgIcon.classList.add("svg-icon");
  svgIcon.style.display = checked ? "block" : "none";

  box.appendChild(svgIcon);

  const span = document.createElement("span");
  span.textContent = text;
  if (checked) {
    span.classList.add("completed");
  }

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "assets/delete.svg";
  deleteIcon.alt = "Delete";
  deleteIcon.classList.add("delete-icon");

  box.addEventListener("click", () => {
    box.classList.toggle("active");
    const isActive = box.classList.contains("active");
    span.classList.toggle("completed", isActive);
    svgIcon.style.display = isActive ? "block" : "none";

    itemStorage = itemStorage.map(item =>
      item.text === text ? { text, checked: isActive, iconSrc: svgIcon.src } : item
    );
    localStorage.setItem("itemStorage", JSON.stringify(itemStorage));
  });

  deleteIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    itemStorage = itemStorage.filter(item => item.text !== text);
    localStorage.setItem("itemStorage", JSON.stringify(itemStorage));
  });

  li.appendChild(box);
  li.appendChild(span);
  li.appendChild(deleteIcon);

  return li;
}


input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = input.scrollHeight + "px";
});

itemStorage.forEach(({ text, checked }) => {
  const li = createListItem(text, checked);
  list.appendChild(li);
});

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
    e.preventDefault();
    addButton.click();
  }
});
