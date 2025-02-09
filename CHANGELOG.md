# CHANGELOG

## v1.2.0 [2024-02-09]
Closed issues: #1, #5, #2, #3

### Improvements
* Add support for filtering by minimum amount of ingredients on web app
* Add message for search with null response
* Add success and error messages for recipe submission
* Add labels to min / max ingredient amount sliders
* Add option to sort search results by number of ingredients

### Bug Fixes
* GET /search now requires `minIngredients` to be undefined or equal to 2
* Fix bug with order of all recipes flipping when selected to newest first


## v1.1.0 [2024-02-06]
Closed issues: #6, #4

### Improvements
* Add support for DELETE method on web app

### Bug Fixes
* Fixed issue for GET request of all recipes with newest first

### Other Changes
* Documentation made consistent between `README.md` and `127.0.0.1:8080/docs`
