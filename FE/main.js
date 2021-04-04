"use strict";

const items = document.querySelector(".main__middle__body");
const input = document.querySelector(".footer__input");
const addBtn = document.querySelector(".footer__button");
const search = document.querySelector(".search");

function onAdd() {
  const text = input.value;
  if (text === "") {
    input.focus();
    return;
  }
  const item = createItem(text);

  items.appendChild(item);

  item.scrollIntoView({ block: "center" });

  input.value = "";
  input.focus();
}

function createItem(text) {
  const itemRow = document.createElement("tr");
  itemRow.setAttribute("class", "main__middle__item");

  const item = document.createElement("td");
  item.setAttribute("class", "main__middle__title");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", text);
  checkbox.setAttribute("name", "done");
  checkbox.setAttribute("class", "check");

  const label = document.createElement("label");
  label.setAttribute("for", text);
  label.setAttribute("class", "todo__title");

  const link = document.createElement("a");
  link.setAttribute("class", "title");
  link.innerHTML = text;

  // const duedate = document.createElement("td");
  // duedate.setAttribute("class", "main__middle__duedate");

  // const detail__duedate = document.createElement("span");
  // detail__duedate.innerHTML = "-";

  const priority = document.createElement("td");
  priority.setAttribute("class", "main__middle__priority");

  // const detail__priority = document.createElement("input");
  // detail__priority.setAttribute("list", "priority");
  // detail__priority.setAttribute("id", "priorities");
  // detail__priority.setAttribute("value", "9");

  const detail__priority = document.createElement("select");
  detail__priority.setAttribute("class", "priority");
  detail__priority.innerHTML =
    '<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9" selected>9</option>';

  const btn = document.createElement("td");
  btn.setAttribute("class", "main__middle__btn");

  const editBtn = document.createElement("button");
  editBtn.setAttribute("class", "detail__btn");
  editBtn.innerHTML = "수정";
  editBtn.addEventListener("click", () => {
    const newText = prompt("변경할 Todo의 새로운 이름을 입력해주세요");
    if (!newText || newText === "" || newText === " ") return false;
    link.innerText = newText;
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "detail__btn");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.addEventListener("click", () => {
    if (confirm("정말 삭제하시겠습니까?") == true) {
      items.removeChild(itemRow);
    } else {
      return;
    }
  });

  const itemDivider = document.createElement("div");
  itemDivider.setAttribute("class", "item__divider");

  label.appendChild(link);
  item.appendChild(checkbox);
  item.appendChild(label);

  // duedate.appendChild(detail__duedate);
  priority.appendChild(detail__priority);
  btn.appendChild(editBtn);
  btn.appendChild(deleteBtn);

  itemRow.appendChild(item);
  // itemRow.appendChild(duedate);
  itemRow.appendChild(priority);
  itemRow.appendChild(btn);

  return itemRow;
}

function filter() {
  var value, li, a, i;

  value = document.getElementById("value").value.toUpperCase();
  li = document.getElementsByClassName("main__middle__item");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.textContent.toUpperCase().indexOf(value) != -1) {
      li[i].style.display = "flex";
    } else {
      li[i].style.display = "none";
    }
  }
}

addBtn.addEventListener("click", () => {
  onAdd();
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    onAdd();
  }
});

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("table");
  switching = true;
  dir = "asc";

  if (n == 1) {
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[1];
        y = rows[i + 1].getElementsByTagName("td")[1];

        var xsel = x.querySelector(".priority");
        var ysel = y.querySelector(".priority");

        if (dir == "asc") {
          if (
            xsel.options[xsel.selectedIndex].text >
            ysel.options[ysel.selectedIndex].text
          ) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (
            xsel.options[xsel.selectedIndex].text <
            ysel.options[ysel.selectedIndex].text
          ) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  } else {
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[n];
        y = rows[i + 1].getElementsByTagName("td")[n];
        if (dir == "asc") {
          if (x.textContent.toUpperCase() > y.textContent.toUpperCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.textContent.toUpperCase() < y.textContent.toUpperCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
  sortChecked();
}

function sortChecked() {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    chkX,
    chkY,
    xchk,
    ychk,
    switchcount = 0;
  table = document.getElementById("table");
  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[0];
      y = rows[i + 1].getElementsByTagName("td")[0];

      xchk = x.querySelector(".check");
      ychk = y.querySelector(".check");

      if (xchk.checked) {
        chkX = 1;
      } else {
        chkX = 0;
      }

      if (ychk.checked) {
        chkY = 1;
      } else {
        chkY = 0;
      }
      if (dir == "asc") {
        if (chkX > chkY) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (chkX < chkY) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    }
  }
}
