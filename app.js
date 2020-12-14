'use strict';

const store = {
  displaySearch: true,
  displayResults: false,
  displayRecipe: false
};

const ruhRohShaggy = {
  noServerResonse: "Seems like we're having trouble contacting the service that provides recipes. Check your internet connection and try again. Thanks!",
  pointsQuotaExceeded: "Unfortunately you've reached the daily quota of allowed searches. Please come back tomorrow.",
  ingredientNotFound: "Sorry, we can't find a recipe based on your search. Please try again."
}

const apiKey = `46e759e032d04fc496f2345a2a35256c`;

/* ******************************************************************************
 * TEMPLATE GENERATION 
 * ...generators create dynamic HTML
 * ******************************************************************************/

/* ******************************************************************************
 * DISPLAY FUNCTIONS
 * ...put HTML and API data into the DOM
 * ******************************************************************************/

 function displaySearchResults(responseJSON) {}

/* ******************************************************************************
 * API CALLS 
 * ...get the data, send to display functions
 * ******************************************************************************/

/* function removeParamWhitespace(params) {
  const noWhiteSpaceVar = params["keyName"].replace(/\s/g,''); // strip all whitespace
  params["keyName"] = noWhiteSpaceVar;
  return params;
} */

function formatQueryString(params) {;
  // const paramsWithoutWhitespace = removeParamWhitespace(params);
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURI(params[key])}`); // encodeURI (without "Component" allows for the comma to remain after encoding)
  return queryItems.join('&');
}

function getResults(ingredient) {
  const endpointURL = `https://api.spoonacular.com/recipes/findByIngredients`;
  const params = {
    apiKey: apiKey, // assuming they're allowed to be the same name?
    ingredients: ingredient,
    number: 10, // an arbitrary number of my choosing. for larger numbers consider pagination of results.
  };
  const queryString = formatQueryString(params);
  const requestURL = `${endpointURL}?${queryString}`;
  // console.log(requestURL);

  /* fetch(requestURL)
    .then(
      fetchResponse => {
        if (fetchResponse.ok) {
          return fetchResponse.json();
        } // else, thrown error chains down to catch()
      })
    .then(
      responseJSON => displaySearchResults(responseJSON);
    )
    .catch(
      error => {
        $('js-error-message-box').text(store.noServerResonse);
        alert(error.message);
      }
    ); */
}

/* ******************************************************************************
 * APP RENDERING 
 * ...render says which screen to show
 * ******************************************************************************/

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

/* ******************************************************************************
 * EVENT HANDLERS 
 * ...event handlers change state (or DOM)
 * ******************************************************************************/

function handleExportRecipe() {}

function handleSearchResultClicked() {}

function handleBackToResults() {}

function handleBackToSearch() {}

function handleSearchForm() {
  $('main').on('submit', '.js-recipe-search-form', function(event) {
    event.preventDefault();
    const searchTerm = $('#js-search-input').val();

    console.time("time to get results"); // would this be better in the fetch?
    getResults(searchTerm);
    console.timeEnd("time to get results");

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