const statusBox = document.querySelector("span");
const note = document.querySelector("textarea");

const timeoutToSave = 1000;

const saveNote = async () => {
    statusBox.innerHTML = "Saving...";
    const usNoteContent = note.value;
    
    try {
        const saveResponse = await fetch("/api/notes", {
            method: "POST",
            body: JSON.stringify({ note: usNoteContent }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!saveResponse.ok) {
            throw new Error(saveResponse.statusText);
        }
        statusBox.innerHTML = "Saved.";
    } catch (err) {
        console.warn(err);
        statusBox.innerHTML = "Error!";
        return;
    }
};

let timeoutId = null;
note.addEventListener("input", (event) => {
    statusBox.innerHTML = "Editing...";
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(saveNote, timeoutToSave);
});
