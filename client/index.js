/**
 * Creates the div element for the reviews
 * @param {object} review The JSON data for the review
 * @returns {HTMLDivElement} The formatted div element
 */
function createReviewDiv({strName, strDate, numberStars, strComment}){
    let reviewDiv = document.createElement("div");
    let reviewTitle = document.createElement("h5");
    let reviewDate = document.createElement("p");
    let reviewComment = document.createElement("p");
    reviewDiv.setAttribute("class", "review");
    reviewTitle.innerHTML = `${strName} - ${formatStars(numberStars)}`;
    reviewDate.innerHTML = `${strDate}`;
    reviewDate.setAttribute("class", "date");
    reviewComment.innerHTML = strComment;
    reviewDiv.appendChild(reviewTitle);
    reviewDiv.appendChild(reviewDate);
    reviewDiv.appendChild(reviewComment);
    return reviewDiv;
}

/**
 * Generates a string for the review rating
 * @param {number} numberStars The rating of the review
 * @returns {string} The formatted string for the rating
 */
function formatStars(numberStars){
    if (numberStars == 0){
        return "☆☆☆☆☆"
    } else if (numberStars == 5){
        return "★★★★★"
    } else {
        let strStars = "";
        for (let i = 0; i < numberStars; i++){
            strStars = strStars + "★";
        }
        for (let i = 0; i < 5-numberStars; i++){
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
    let objJsonContent = await response.json();
    const reviewsDiv = document.getElementById("all-reviews");
    if (objJsonContent.reviews.length < 10){
        for (let objReview of objJsonContent.reviews){
            let div = createReviewDiv(objReview);
            reviewsDiv.appendChild(div);
            reviewsDiv.appendChild(document.createElement("br"));
        };
    } else {
        for (let i = -1; i > -11; i--){
            let objReview = objJsonContent.reviews.slice(i)
            let div = createReviewDiv(objReview);
            reviewsDiv.appendChild(div);
            reviewsDiv.appendChild(document.createElement("br"));
        }
    }
}

document.addEventListener("DOMContentLoaded", getJsonData(event));
window.addEventListener("click", async function(event){
    let response = await this.fetch("https://localhost:5000/review");
    let body = await response.text();
    document.getElementById("output").innerHTML = body
});