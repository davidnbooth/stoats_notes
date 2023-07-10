const saveButton = document.querySelector("button");
const saveMessage = document.querySelector("span");
const note = document.querySelector("textarea");

saveButton.addEventListener("click", (event) => {
    event.preventDefault();

    const noteContent = note.value;
    const handleError = (error) => {
        console.warn(error);
        saveMessage.innerText = "Error!";
        setTimeout(() => {
            saveMessage.innerText = "";
        }, 3000);
    }

    const handleSuccess = (response) => {
        if (!response.ok) {
            handleError(response.statusText);
            return
        }

        saveMessage.innerText = "Saved!";
        setTimeout(() => {
            saveMessage.innerText = "";
        }, 3000);
    }

    fetch("/notes", {
        method: "POST",
        body: JSON.stringify({ note: noteContent }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(handleSuccess).catch(handleError);
})
