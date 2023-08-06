document.addEventListener("DOMContentLoaded", function () {
    const thisScriptTag = document.getElementById("note-page-js");
    const textareaId = thisScriptTag.getAttribute("data-textarea-id");
    const editingStyle = thisScriptTag.getAttribute("data-editing-style");

    const statusBox = document.querySelector("span");
    const note = document.getElementById(textareaId);
    
    const timeoutToSave = 1000;
    
    /**
     * @param {"saving"|"saved"|"editing"|"error"} state 
     */
    const setNoteState = (state) => {
        note.classList.remove("saving");
        note.classList.remove("saved");
        note.classList.remove(editingStyle);
        note.classList.remove("error");
        note.classList.add(state);
    };
    
    const saveNote = async () => {
        statusBox.innerHTML = "Saving...";
        setNoteState("saving");
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
            setNoteState("saved");
        } catch (err) {
            console.warn(err);
            statusBox.innerHTML = "Error!";
            setNoteState("error");
            return;
        }
    };
    
    let timeoutId = null;
    note.addEventListener("input", (event) => {
        statusBox.innerHTML = "Editing...";
        setNoteState(editingStyle);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(saveNote, timeoutToSave);
    });    
});
