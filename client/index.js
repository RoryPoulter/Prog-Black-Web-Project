/**
 * Creates the div element for the reviews
 * @param {object} review The JSON data for the review
 * @returns {HTMLDivElement} The formatted div element
 */
function createReviewDiv(review){
    let reviewDiv = document.createElement("div");
    let reviewTitle = document.createElement("h5");
    let reviewDate = document.createElement("p");
    let reviewComment = document.createElement("p");
    reviewDiv.setAttribute("class", "review");
    reviewTitle.innerHTML = `${review.strName} - ${formatStars(review.numberStars)}`;
    reviewDate.innerHTML = `${review.strDate}`;
    reviewDate.setAttribute("class", "date");
    reviewComment.innerHTML = review.strComment;
    reviewDiv.appendChild(reviewTitle);
    reviewDiv.appendChild(reviewDate);
    reviewDiv.appendChild(reviewComment);
    return reviewDiv;
}

/**
 * Generates a string for the review rating
 * @param {number} stars The rating of the review
 * @returns {string} The formatted string for the rating
 */
function formatStars(stars){
    if (stars == 0){
        return "☆☆☆☆☆"
    } else if (stars == 5){
        return "★★★★★"
    } else {
        let strStars = "";
        for (let i = 0; i < stars; i++){
            strStars = strStars + "★";
        }
        for (let i = 0; i < 5-stars; i++){
            strStars = strStars + "☆";
        }
        return strStars
    }
}

/**
 * Fetches the JSON content and populates the webpage with div elements for the reviews
 */
async function getJsonData(event){
    let response = await fetch("./data/data.json");
    let jsonContent = await response.json();
    const reviewsDiv = document.getElementById("all-reviews");
    // The index of the most recent review
    let startIndex = jsonContent.reviews.length - 1;
    // The index of the first review (0) or tenth most recent review if there are more than 10 reviews
    let finalIndex = Math.max(0, startIndex - 9);
    for (let i = startIndex; i >= finalIndex; i--){
        let review = jsonContent.reviews[i];
        let div = createReviewDiv(review);
        reviewsDiv.appendChild(div);
        reviewsDiv.appendChild(document.createElement("br"));
    }
}

document.addEventListener("DOMContentLoaded", getJsonData(event));
const reviewForm = document.getElementById("review-form");
reviewForm.addEventListener("submit", async function(event){
    try {
        event.preventDefault();
        const formData = new FormData(reviewForm);
        const formJson = JSON.stringify(Object.fromEntries(formData.entries()));
        console.log("Form data: ", formData);
        const response = await fetch("/review",
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
            document.getElementById("output").innerHTML = responseBody
        } else {
            alert("Problem with POST request " + response.statusText);
        }
    } catch(e) {
        alert(e);
    }
});