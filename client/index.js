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
    for (let objReview of objJsonContent.reviews){
        let div = createReviewDiv(objReview);
        reviewsDiv.appendChild(div);
        reviewsDiv.appendChild(document.createElement("br"));
    };
}

document.addEventListener("DOMContentLoaded", getJsonData(event));