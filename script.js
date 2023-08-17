let habitInput = document.getElementById("habit");
let tracker = document.getElementById("tracker");

// Load data from localStorage or initialize an empty array
const savedData = JSON.parse(localStorage.getItem("habitData")) || [];

function saveToLocalStorage() {
  localStorage.setItem("habitData", JSON.stringify(savedData));
}

function renderSavedData() {
    if (savedData.length > 0) {
        tracker.classList.remove("hidden");
      }
    // Get the existing rows with class "habit-row"
    let existingRows = tracker.querySelectorAll(".habit-row");

    // Map habit text of already rendered rows
    let existingHabitTexts = Array.from(existingRows).map(row => 
        row.querySelector(".habit-text").textContent
    );
    savedData.forEach(habitObject => {
        // Check if habit is already rendered
        if(!existingHabitTexts.includes(habitObject.habit)) {
            // Create a new row for each habit
            let row = document.createElement("tr");
            tracker.appendChild(row);
            row.classList.add("habit-row");

            // Habit text
            let column1 = document.createElement("td");
            row.appendChild(column1);
            column1.textContent = habitObject.habit;
            column1.setAttribute("class", "habit-text");

            // Checkboxes
            for (let i = 0; i < 7; i++) {
                let column = document.createElement("td");
                row.appendChild(column);
                let box = document.createElement("input");
                box.type = "checkbox";
                box.name = "habit-check";
                box.className = "check";
                column.appendChild(box);

                box.addEventListener("change", function () {
                    habitObject.checkboxes[i] = box.checked;
                    saveToLocalStorage();
                });

                box.checked = habitObject.checkboxes[i];
            }

            // X Mark to cancel
            let escCol = document.createElement("td");
            row.appendChild(escCol);
            let mark = document.createElement("i");
            mark.setAttribute("class", "fa-solid fa-square-xmark");
            escCol.appendChild(mark);
            mark.onclick = function () {
                savedData.splice(savedData.indexOf(habitObject), 1);
                saveToLocalStorage();
                tracker.removeChild(row);
            };
        }
    });
}; 

// Add Habit function
function addHabit() {
    let habitValue = habitInput.value.trim();
    if (habitValue === '') {
        alert("Please add a habit");
    } else {
        let habitObject = {
        habit: habitValue,
        checkboxes: new Array(7).fill(false)
        };
        savedData.push(habitObject);
        saveToLocalStorage();

        // Clear input field
        habitInput.value = '';
        renderSavedData();
    }
}

// Call renderSavedData on page load to populate habits
window.addEventListener("load", renderSavedData);

function clearAll() {
    // Clear the saved data array
     savedData.length = 0;

    // Clear the localStorage
    localStorage.removeItem("habitData");

    // Clear the tracker by removing all rows
    tracker.innerHTML = '';
}