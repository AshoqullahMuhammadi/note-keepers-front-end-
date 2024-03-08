// const overlay = document.querySelector('.overlay');

const addTodoForm = document.querySelector('.add-todo-form');
const updateNoteForm = document.querySelector('.update-todo-form');
const todoTitle = document.querySelector('.todo-title');
const updateNoteTitle = document.querySelector('.update-note-title');
const todoDescription = document.querySelector('.todo-description');
const updateNoteDescription = document.querySelector('.update-note-description');
const addTodo = document.querySelector('.add-todo-form-button');
const updateNoteButton = document.querySelector('.update-todo-form-button');
const todoFormCloseButton = document.querySelector('.add-todo-close-button');
const updateFormCloseButton = document.querySelector('.update-note-close-button');
const viewContainerCloseButton = document.querySelector('.view-note-close-button');

const overlay = document.querySelector('.overlay');

const showAllNote = document.querySelector('.show-todo-container');
const showTodo = document.getElementById('show-todo-frame');

const addTodoButton = document.querySelector('.add-note-button');
const customToast = document.querySelector('.custom-toast');
const customToastMessage = document.querySelector('.custom-toast p');


const confirmationDialog = document.querySelector('.delete-confirmation-dialog');
const confYesButton = document.querySelector('.yes');
const confNoButton = document.querySelector('.no');


const viewNoteContainer = document.querySelector('.view-note-container');
const viewNoteContainerTitle = document.querySelector('.view-note-container h2');
const viewNoteContainerDescription = document.querySelector('.view-note-container p');
// calling some function
// functions 
const closeAddTodoForm = function () {
    addTodoForm.classList.add('hide');
    overlay.classList.add('hide');

    // overlay.classList.remove('hide');
    // addTodoButton.style.display = 'flex';
}

const closeUpdateForm = function () {
    updateNoteForm.classList.add('hide');
    overlay.classList.add('hide');

    // overlay.classList.remove('hide');
    // addTodoButton.style.display = 'flex';
}

const closeViewContainer = function () {
    viewNoteContainer.classList.add('hide');
    overlay.classList.add('hide');

    // overlay.classList.remove('hide');
    // addTodoButton.style.display = 'flex';
}
const showToast = (message, color) => {
    overlay.classList.remove('hide');
    customToastMessage.innerText = message;
    customToast.style.backgroundColor = color;
    customToast.style.top = "10px";
    setTimeout(() => {
        customToast.style.top = "-120px";
        overlay.classList.add('hide');

    }, 2000);
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
// update or edit note
const editNote = async (id) => {

    const url = `http://localhost:3000/api/v1/note/${id}`;
    const body = JSON.stringify({
        note_title: updateNoteTitle.value,
        note_description: updateNoteDescription.value
    });
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });
        const updatedResult = await response.json();

        showToast('update', '#80ffcc')

    } catch (e) {
        showToast(e, "#FA4B42");
    }

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

    document.querySelector(".container").innerHTML = "";

    const notesContainer = document.createElement('div');
    // notesContainer.style.height = "100vh";
    notesContainer.classList.add('scrollable'); // Add the scrollable class to enable scrolling
    if (notes.length == 0) {

        const textContainer = document.createElement('div');
        textContainer.innerHTML = "No Note available";
        textContainer.style = `height:100vh; display: flex; flex-direction: column;justify-content: center; align-items: center;font-size: 30px; color: #ff3300; font-family: sans-serif; font-weight: 500;`;
        notesContainer.appendChild(textContainer);
    }
    notes.forEach(note => {
        // create a new Container
        const noteMainContainer = document.createElement('div');
        noteMainContainer.classList.add("show-todo-container");


        // show title h2 
        const title = document.createElement('h2');
        title.innerText = note.note_title;
        noteMainContainer.appendChild(title);

        // description p
        const description1 = document.createElement('p');
        description1.innerText = note.note_description;
        noteMainContainer.appendChild(description1);

        // horizontal line hr
        const hr = document.createElement('hr');
        noteMainContainer.appendChild(hr);



        // buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');


        // ? info button

        const infoImage = document.createElement('img');
        infoImage.src = './images/info.png';
        infoImage.classList.add('btn');
        buttonsContainer.appendChild(infoImage);


        infoImage.addEventListener('click', function () {
            overlay.classList.remove('hide');

            viewNoteContainerTitle.textContent = note.note_title;
            viewNoteContainerDescription.textContent = note.note_description;
            viewNoteContainer.classList.remove('hide');
            viewContainerCloseButton.addEventListener('click', function () {
                closeViewContainer();
            });
            viewNoteContainerTitle.addEventListener('click', function () {
                viewNoteContainer.classList.add('hide');
                overlay.classList.remove('hide');
                showUpdateForm(note._id, note.note_title, note.note_description);

            });
            viewNoteContainerDescription.addEventListener('click', function () {
                viewNoteContainer.classList.add('hide');
                overlay.classList.remove('hide');

                showUpdateForm(note._id, note.note_title, note.note_description);

            });
            // view note

        });


        // ? edit button

        const editImage = document.createElement('img');
        editImage.src = './images/edit.png';
        editImage.classList.add('btn');
        buttonsContainer.appendChild(editImage);
        // edit note
        editImage.addEventListener('click', function () {
            // edit note
            overlay.classList.remove('hide');

            showUpdateForm(note._id, note.note_title, note.note_description);

        });


        // ? delete button


        const deleteImage = document.createElement('img');
        deleteImage.src = './images/remove.png';
        deleteImage.classList.add('btn');
        buttonsContainer.appendChild(deleteImage);

        deleteImage.addEventListener('click', function () {
            confirmationDialog.classList.remove('hide');
            overlay.classList.remove('hide');

            confYesButton.addEventListener('click', async function () {
                try {

                    const url = `http://localhost:3000/api/v1/note/${note._id}`;

                    const response = await fetch(url, {
                        method: 'DELETE'
                    });
                    const deleted = await response.json();
                    confirmationDialog.classList.add('hide');
                    overlay.classList.add('hide');

                    showToast("Note deleted successfully", "#80ffcc")
                    showAllNoteIn();
                } catch (e) {
                    showToast("Note deleted fail", "#ff6666")

                }

            });
            confNoButton.addEventListener('click', function () {
                confirmationDialog.classList.add('hide');
                overlay.classList.add('hide');


            });
            // delete note

        });

        // buttons creation omitted for brevity

        noteMainContainer.appendChild(buttonsContainer);

        notesContainer.appendChild(noteMainContainer);
    });

    // Append the notes container to an existing container in your HTML, or create a new one if needed
    const existingContainer = document.querySelector('.container'); // Change '.container' to the selector of your existing container
    existingContainer.appendChild(notesContainer);
};

showAllNoteIn();


const showUpdateForm = function (id, noteTitle, noteDescription) {
    updateNoteForm.classList.remove("hide");

    updateNoteTitle.value = noteTitle;
    updateNoteDescription.value = noteDescription;
    updateNoteButton.addEventListener("click", async function () {


        await editNote(id);
        updateNoteForm.classList.add("hide");
        updateNoteTitle.value = "";
        updateNoteDescription.value = "";
        overlay.classList.add('hide');

        showAllNoteIn();
    });

}


const clearForm = function () {
    todoTitle.value = "";
    todoDescription.value = "";

}



addTodoButton.addEventListener('click', function () {
    overlay.classList.remove('hide');

    addTodoForm.classList.remove('hide');
});


todoFormCloseButton.addEventListener('click', closeAddTodoForm);
updateFormCloseButton.addEventListener('click', closeUpdateForm);

addTodo.addEventListener('click', function () {
    addTodo.innerText = "Loading...";
    addTodoInDB();
    addTodo.innerText = "ADD";
    showToast("Note successfully Added", "#80ffcc");
    overlay.classList.add('hide');
    clearForm();
    closeAddTodoForm();
});








