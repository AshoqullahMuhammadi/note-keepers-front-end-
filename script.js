// const overlay = document.querySelector('.overlay');

const addTodoForm = document.querySelector('.add-todo-form');
const todoTitle = document.querySelector('.todo-title');
const todoDescription = document.querySelector('.todo-description');
const addTodo = document.querySelector('.add-todo-form-button');
const todoFormCloseButton = document.querySelector('.add-todo-close-button');

const showAllNote = document.querySelector('.show-todo-container');
const showTodo = document.getElementById('show-todo-frame');

const addTodoButton = document.querySelector('.add-note-button');
const customToast = document.querySelector('.custom-toast');
const customToastMessage = document.querySelector('.custom-toast p');
// calling some function
// functions 
const closeAddTodoForm = function () {
    addTodoForm.classList.add('hide');
    // overlay.classList.remove('hide');
    // addTodoButton.style.display = 'flex';
}
// ? create operations
const addTodoInDB = async function () {
    const url = 'http://localhost:3000/api/v1/note';
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            note_title: todoTitle.value,
            note_description: todoDescription.value
        }),
        headers: {
            "Control-Allow-Origin": "no-cors",
            "Content-type": "application/json; charset=UTF-8",
        }
    });
    const result = await response.json();

}

// get all notes
const getAllNotes = async function () {
    const url = "http://localhost:3000/api/v1/note";
    const response = await fetch(url);
    const data = await response.json();
    if (data.message === "success") {
        return data.notes; // Return the "notes" array from the response
    } else {
        throw new Error("Failed to fetch notes: " + data.message);
    }
};
const showAllNoteIn = async function () {
    const notes = await getAllNotes();
    console.log(notes);

    const iframe = document.getElementById('show-todo-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    notes.forEach(note => {
        // Create card container
        const card = iframeDoc.createElement('div');
        card.classList.add('note-card');
        const editIcon = "./images/edit.png";
        const infoIcon = "./images/info.png";
        const deleteIcon = "./images/remove.png";
        // Create title element
        const title = iframeDoc.createElement('h2');
        title.textContent = note.note_title;
        card.appendChild(title);

        // Create description element
        const description = iframeDoc.createElement('p');
        description.textContent = note.note_description;
        card.appendChild(description);

        // Create horizontal line
        const hr = iframeDoc.createElement('hr');
        card.appendChild(hr);

        // Create buttons container
        const buttonsContainer = iframeDoc.createElement('div');
        buttonsContainer.classList.add('buttons-container');

        // Create buttons
        const editButton = iframeDoc.createElement('div');
        editButton.innerHTML = `<img src="${editIcon}"/>`;
        editButton.classList.add('btn');
        buttonsContainer.appendChild(editButton);

        const deleteButton = iframeDoc.createElement('div');
        deleteButton.innerHTML = `<img src="${deleteIcon}"/>`;
        deleteButton.classList.add('btn');
        buttonsContainer.appendChild(deleteButton);

        const detailButton = iframeDoc.createElement('div');
        detailButton.innerHTML = `<img src="${infoIcon}"/>`;
        detailButton.classList.add('btn');
        buttonsContainer.appendChild(detailButton);

        card.appendChild(buttonsContainer);

        // Append the card to the iframe document body
        iframeDoc.body.appendChild(card);
    });
};


showAllNoteIn();

const clearForm = function () {
    todoTitle.value = "";
    todoDescription.value = "";
}

const showToast = (message, color) => {

    customToastMessage.innerText = message;
    customToast.style.backgroundColor = color;
    customToast.style.top = "10px";
    setTimeout(() => {
        customToast.style.top = "-120px";
    }, 2000);
}

addTodoButton.addEventListener('click', function () {
    // overlay.classList.add('overlay');
    addTodoForm.classList.remove('hide');
});


todoFormCloseButton.addEventListener('click', closeAddTodoForm);

addTodo.addEventListener('click', function () {
    addTodo.innerText = "Loading...";
    addTodoInDB();
    addTodo.innerText = "ADD";
    showToast("Note successfully Added", "#53ff1a");

    clearForm();
    closeAddTodoForm();
});








