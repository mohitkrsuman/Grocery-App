
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
const grocery = document.getElementById('grocery');

window.addEventListener('DOMContentLoaded', setupItems);

//********** EDIT OPTION **********/
let editElement;
let editFlag = false;
let editID = "";

// ********** SELECT ITEMS **********

//********* EVENT LISTENERS *******/
form.addEventListener('submit', addItem);

//clear Buttons
clearBtn.addEventListener('click', clearItems);

//********* FUNTIONS ************/
function addItem(e) {
   e.preventDefault();
   //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
   console.log(grocery.value);
   const value = grocery.value;

   const id = new Date().getTime().toString();
   
   if(value && !editFlag){
       createListItem(id, value);
       displayAlert("item added to the list", "success");

       if(!container.classList.contains('show-container')){
         container.classList.add('show-container');
       }
       //add to local storage
       addToLocalStorage(id, value);
       //set back to default
       setBackToDefault();
       clearBtn.classList.add('show-clear');
   }else if(value && editFlag){
      // console.log("editing");
      editElement.innerHTML = value;
      displayAlert("item updated", "success");
      setBackToDefault();

      //edit local storage
      editLocalStorage(editID, value);
   }else{
      displayAlert("please enter value", "danger");
   }
}

// display alert
function displayAlert(text, action){
   alert.textContent = text;
   alert.classList.add(`alert-${action}`);
   //remove alert
   setTimeout(function(){
      alert.textContent = "";
      alert.classList.remove(`alert-${action}`);
   }, 2000);
}

// clear items
function clearItems(){
   const items = document.querySelectorAll('.grocery-item');
   if(items.length > 0){
      items.forEach(function(item){
         list.removeChild(item);
      })
   }
   container.classList.remove('show-container');
   displayAlert("empty list", "danger");
   setBackToDefault();
   clearBtn.classList.remove('show-clear');
   localStorage.removeItem('list');
}

// set back to default
function setBackToDefault(){
   grocery.value = "";
   editFlag = false;
   editId = "";
   submitBtn.textContent = "submit";
}

// delete item
function deleteItem(e){
   // console.log(e.currentTarget.parentElement.parentElement);
   const element = e.currentTarget.parentElement.parentElement;
   list.removeChild(element);
   const id = element.dataset.id;

   if(list.children.length === 0){
      container.classList.remove("show-container");
   }
   displayAlert('item removed', 'danger');
   setBackToDefault();

   // remove from local storage
   removeLocalStorage(id);
}

function editItem(e){
   // console.log("item edited");
   const element = e.currentTarget.parentElement.parentElement;
   //set edit item
   editElement = e.currentTarget.parentElement.previousElementSibling;
   // set form value
   grocery.value = editElement.innerHTML;
   editFlag = true;
   editID = element.dataset.id;

   submitBtn.textContent = "edit";
   // addItem(); 
}

//********* LOCAL STORAGE **********/
function addToLocalStorage(id, value){
   // to save in grocery named local storage
   const grocery = {id, value};
   console.log(grocery);
   let items = getLocalStorage();

   items.push(grocery);
   localStorage.setItem('list', JSON.stringify(items));
}
function removeLocalStorage(id){
   let items = getLocalStorage();
   items = items.filter(function(item){
      if(item.id !== id){
          return item;
      }
   });
   localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
   return localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')) : [];
}

function editLocalStorage(id, value){
   let items = getLocalStorage();
   items = items.map(function(item){
      if(item.id === id){
         item.value = value;
      }
      return item;
   });
   localStorage.setItem('list', JSON.stringify(items));
}


//********* SETUP ITEMS **********/

function setupItems(){
   let items = getLocalStorage();
   if(items.length > 0){
      items.forEach(function(item){
         createListItem(item.id, item.value);
      })
      container.classList.add('show-container');
   };
}

function createListItem(id, value){
   const elem = document.createElement('article');
   //add class
   elem.classList.add('grocery-item');
   //add id
   const attr = document.createAttribute('data-id');
   attr.value = id;
   elem.setAttributeNode(attr);

   // create the whole element
   elem.innerHTML = ` 
   <p class="title">${value}</p>
   <div class="btn-container">
      <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
      <button type="button" class="del-btn"><i class="fas fa-trash"></i></button>
   </div>`;
   //edit function
   const editBtn = elem.querySelector('.edit-btn');
   editBtn.addEventListener('click', editItem);

   //delete function
   const deleteBtn = elem.querySelector('.del-btn');
   deleteBtn.addEventListener('click', deleteItem);
   //append child
   list.appendChild(elem);
}