'use strict';

const store = {
  errorIngredientNotFound: "Sorry, we can't find a recipe based on your search. Please try again.",
  errorNoServerResonse: "Seems like we're having trouble contacting the service that provides recipes. Check your internet connection and try again. Thanks!",
  errorPointsQuotaExceeded: "Unfortunately you've reached the daily quota of allowed searches. Please come back tomorrow.",
  searchNotInitiated: true,
  resultsDisplayed: false,
  recipeShown: false
};

/********** TEMPLATE GENERATION **********/



/********** APP RENDERING **********/

function render() {
  /* could this conditional be better handled with a case-switch? */
  if (store.searchNotInitiated === true) {
    // hide the results and recipe screens
    // show the search screen
  } elseif (store.resultsDisplayed === true) {
    // hide the search and recipe screens
    // show the results screen
  } elseif (store.recipeShown === true) {
    // hide the search and results screens
    // show the recipe screen
  }
}

/********** EVENT HANDLERS **********/

function handleSearchForm() {
  $('main').on('submit', '.js-recipe-search-form', function(event) {
    event.preventDefault();
    // do stuff
    const searchTerm = $('#js-search-input').val();
    getResults(searchTerm);
    // change store state
    // call render()
  }
}

function handleApp() {
  render();
  handleSearchForm();
  handleBackToSearch();
  handleBackToResults();
  handleSearchResultClicked();
  handleExportRecipe();
}

$(handleApp);