const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// düzenleme seçenekleri
let editElement;
let editFlag = false;
let editID = "";

form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItem);

window.addEventListener("DOMContentLoaded", setupItems);

// ! functions

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");

    element.innerHTML = `
    
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <img src="assets/edit.png" alt="" />
            </button>
            <button type="button" class="delete-btn">
                <img src="assets/delete.png" alt="" />
            </button>
        </div>
   
    `;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);

    displayAlert("Başarıyla Eklendi", "success");

    container.classList.add("show-container");

    addToLocalStorage(id, value);

    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Değer Değiştirildi", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Lütfen Değer Giriniz", "danger");
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  element.remove();
  //list.remove(element)

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }

  removeLocalStorage(id);

  displayAlert("Eleman Kaldırıldı", "danger");
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;

  grocery.value = editElement.innerText;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}

function clearItem() {
  const items = document.querySelectorAll(".grocery-item");

  const control = confirm("Bütün kayıtları silmek istediğinizden emin misiniz");

  if (control) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
    displayAlert("Bütün Kayıt Silindi", "danger");
    container.classList.remove("show-container");
    setBackToDefault();
    removeLocalStorage(item);
  } else {
    displayAlert("Kayıtlar silinmedi", "success");
  }
}

function addToLocalStorage(id, value) {
  const groceryList = { id, value };
  let items = getLocalStorage();
  items.push(groceryList);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function setupItems() {
  let items = getLocalStorage();

  items.forEach(function (item) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = item.id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");

    element.innerHTML = `
        <p class="title">${item.value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <img src="assets/edit.png" alt="" />
            </button>
            <button type="button" class="delete-btn">
                <img src="assets/delete.png" alt="" />
            </button>
        </div>
      `;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);

    container.classList.add("show-container");
  });
}

function removeLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    return item.id !== id;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}
