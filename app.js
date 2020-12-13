'use strict';

const store = {
  errorIngredientNotFound: "Sorry, we can't find a recipe based on your search. Please try again.",
  errorNoServerResonse: "Seems like we're having trouble contacting the service that provides recipes. Check your internet connection and try again. Thanks!",
  errorPointsQuotaExceeded: "Unfortunately you've reached the daily quota of allowed searches. Please come back tomorrow.",
  displaySearch: true,
  displayResults: false,
  displayRecipe: false
};

/********** TEMPLATE GENERATION **********/
// >> generators create dynamic HTML <<


/********** API CALLS **********/

getResults(ingredient) {}

/********** APP RENDERING **********/
// >> render says which screen to show <<

function render() {
  if (store.displaySearch === true) {
    $('#js-search-screen').show();
    $('#js-results-screen').hide();
    $('#js-recipe-screen').hide();
  } else if (store.displayResults === true) {
    $('#js-search-screen').hide();
    $('#js-results-screen').show();
    $('#js-recipe-screen').hide();
  } else if (store.displayRecipe === true) {
    $('#js-search-screen').hide();
    $('#js-results-screen').hide();
    $('#js-recipe-screen').show();
  }
}

/********** EVENT HANDLERS **********/
// >> event handlers change state <<

function handleExportRecipe() {}

function handleSearchResultClicked() {}

function handleBackToResults() {}

function handleBackToSearch() {}

function handleSearchForm() {
  $('main').on('submit', '.js-recipe-search-form', function(event) {
    event.preventDefault();
    const searchTerm = $('#js-search-input').val();

    getResults(searchTerm);

    // change screen states, re-render
    store.displaySearch = false;
    store.displayResults = true;
    render();
  })
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