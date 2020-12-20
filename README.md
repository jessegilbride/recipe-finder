# Recipe Finder
Find recipes based on the ingredients you have.

## Demo
[Recipe Finder App](https://jessegilbride.github.io/recipe-finder/) (Please note limitations, listed below)

## How It Works
Enter an ingredient into the search field to get recipes that use the ingredient. Optionally, enter more than one ingredient and the app will try to get recipes that use as many of them as it can find. You may perform a new search at any time, just enter new search terms into the search bar at the top. Click on the link for any of the results to see its recipe (which opens in a new page).

![app in initial state before a search](/screenshots/ScreenShot-1.jpg "App in its initial state before a search")

![results shown of a search for a single ingredient](/screenshots/ScreenShot-2.jpeg "A search for a single ingredient")

![results shown of a search for multiple ingredients](/screenshots/ScreenShot-3.jpeg "A search for multiple ingredients")

### Limitations
* App currently set to return 4 results. This can be set to any number, but it is kept low to reduce hits to the API.
* Entering at least one ingredient for which results can be found, plus any other ingredients which cannot be found, the search will only look for those ingredients that are found.

## Technologies Used
* HTML
* CSS
* JavaScript
* jQuery
