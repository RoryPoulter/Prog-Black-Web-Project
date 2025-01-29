// ? Code snippet from https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
// ? End of snippet

let ingredientCount = 2;
const addIngredientButton = document.getElementById("addIngr");
const subIngredientButton = document.getElementById("subIngr");
const allIngredientsDiv = document.getElementById("all-ingredients");

addIngredientButton.addEventListener("click", function(event){
    event.preventDefault();
    ingredientCount++;

    if (ingredientCount == 3){
        subIngredientButton.disabled = false
    } else if (ingredientCount == 15){
        addIngredientButton.disabled = true
    }

    // Add the input elements
    let newDiv = document.createElement("div");
    let newIngredient = document.createElement("input");
    newIngredient.type = "text";
    newIngredient.id = "strIngredient" + ingredientCount;
    newIngredient.name = "strIngredient" + ingredientCount;
    let newAmount = document.createElement("input");
    newAmount.type = "text";
    newAmount.id = "strIngredientAmount" + ingredientCount;
    newAmount.name = "strIngredientAmount" + ingredientCount;
    newAmount.setAttribute("class", "ingredient-amount");

    newDiv.appendChild(newIngredient);
    newDiv.appendChild(newAmount);
    allIngredientsDiv.appendChild(newDiv);
})
subIngredientButton.addEventListener("click", function(event){
    event.preventDefault();
    ingredientCount--;

    if (ingredientCount == 2){
        subIngredientButton.disabled = true
    } else if (ingredientCount == 14){
        addIngredientButton.disabled = false
    }

    allIngredientsDiv.removeChild(allIngredientsDiv.lastChild)
})

// const dropZoneDiv = document.getElementById("dropZone");
// dropZoneDiv.addEventListener("drop", function(event){
//     console.log("File(s) dropped");

//     // Prevent default behavior (Prevent file from being opened)
//     event.preventDefault();

//     if (event.dataTransfer.items) {
//         // Use DataTransferItemList interface to access the file(s)
//         [...event.dataTransfer.items].forEach((item, i) => {
//         // If dropped items aren't files, reject them
//         if (item.kind === "file") {
//             const file = item.getAsFile();
//             console.log(`… file[${i}].name = ${file.name}`);
//         }
//         });
//     } else {
//         // Use DataTransfer interface to access the file(s)
//         [...event.dataTransfer.files].forEach((file, i) => {
//         console.log(`… file[${i}].name = ${file.name}`);
//         });
//     }
// })
// dropZoneDiv.addEventListener("dragover", function(event){
//     console.log("File(s) in drop zone");

//     // Prevent default behavior (Prevent file from being opened)
//     event.preventDefault();
// })


/**
 * Gets the JSON data and adds the ingredients to the select element
 */
async function getJsonData(event) {
    console.log(event);
    let response = await fetch("./data/data.json");
    let jsonContent = await response.json();
    let searchSelect = document.getElementById("ingredients");
    for (let ingredient of jsonContent.ingredients){
        // ? Ex: <option value="vodka">Vodka</option>
        let ingredientOption = document.createElement("option");
        ingredientOption.value = ingredient;
        ingredientOption.innerHTML = ingredient.toProperCase();
        searchSelect.appendChild(ingredientOption);
    }
}
document.addEventListener("DOMContentLoaded", getJsonData(event));

/**
 * Creates a div element with information about a given drink
 * @param {object} drinkData The drink data from `data.json`
 * @returns {HTMLDivElement} The formatted div for the drink
 */
function createDrinkDiv(drinkData){
    let parentDiv = document.createElement("div");
    parentDiv.setAttribute("class", "col-md-6")
    let drinkDiv = document.createElement("div");
    drinkDiv.setAttribute("class", "drink-div")
    let drinkTitle = document.createElement("h4");
    drinkTitle.innerHTML = drinkData.strName;
    let drinkInstructions = document.createElement("p");
    drinkInstructions.innerHTML = "<b>Instructions:</b> " + drinkData.strInstructions;
    let p = document.createElement("p");
    p.innerHTML = "<b>Ingredients:</b>";
    // Make the ingredients table
    let ingredientsTable = document.createElement("table");

    for (let i = 1; i <= drinkData.numberIngredients; i++){
        let tableRow = document.createElement("tr");
        let rowAmount = document.createElement("td");
        rowAmount.setAttribute("class", "amount-header");
        rowAmount.innerHTML = drinkData["strIngredientAmount"+i];
        let rowIngredient = document.createElement("td");
        rowIngredient.innerHTML = drinkData["strIngredient"+i].toProperCase();
        tableRow.appendChild(rowAmount);
        tableRow.appendChild(rowIngredient);
        ingredientsTable.appendChild(tableRow);
    };

    drinkDiv.append(drinkTitle, p, ingredientsTable, drinkInstructions);
    parentDiv.appendChild(drinkDiv);
    return parentDiv
};


const searchForm = document.getElementById("search");
const searchResult = document.getElementById("searchResult");
searchForm.addEventListener("submit", async function(event){
    event.preventDefault();
    const formData = new FormData(searchForm);
    const formJson = Object.fromEntries(formData.entries());
    const response = await fetch(`/search?ingredients=${formJson.ingredients}&maxIngredients=${formJson.maxIngredients}&order=${formJson.order}`);
    let jsonContent = await response.json();
    if (jsonContent.drinks == null){
        return
    };
    searchResult.innerHTML = "";
    for (let drink of jsonContent.drinks){
        let drinkDiv = createDrinkDiv(drink);
        searchResult.appendChild(drinkDiv);
    }
})

const submitForm = document.getElementById("submit");
submitForm.addEventListener("submit", async function(event){
    try {
        event.preventDefault();
        const formData = new FormData(submitForm);
        const formJson = JSON.stringify(Object.fromEntries(formData.entries()));
        console.log("Form data: ", formData);
        const response = await fetch("/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: formJson
            }
        );
        if (response.ok){
            const responseBody = await response.text();
            console.log(responseBody);
        } else {
            const error = await response.json().error;
            alert("Problem with POST request: " + error);
        }
    } catch(e) {
        alert(e);
    }
})