'use strict';

const store = {
  displaySearch: true,
  displayResults: false,
};

const apiKey = `46e759e032d04fc496f2345a2a35256c`;

/****************************************
  TEMPLATE GENERATION
****************************************/

function generateResultsListItem(recipeItem) {

  const image = recipeItem[1].image;
  const title = recipeItem[1].title;
  const url = recipeItem[1].sourceUrl;

  return `
  <li>
    <img src="${image}" class="result-image alt="recipe image" />
    <h3>${title}</h3>
    <a href="${url}" target="_blank">View recipe</a>
  </li>`;
}

async function generateResultsList(responseJSON) {
  
  // get the IDs for all of the results
  let recipeIDs = [];
  for (let i=0; i<responseJSON.length; i++) {
    recipeIDs.push(responseJSON[i].id);
  }

  const recipeInformationBulkJSON = await getRecipeInformationBulk(recipeIDs);
  
  // pass each recipe to list generation function
  const recipesListString = Object.entries(recipeInformationBulkJSON)
    .map(recipeItem => generateResultsListItem(recipeItem));
  
  return recipesListString.join('');

}

/****************************************
  DISPLAY FUNCTION(S)
****************************************/

async function displaySearchResults(responseJSON, searchedIngredients) {
  // console.log(responseJSON);

  await generateResultsList(responseJSON)
  .then(resultsPromise => $('#js-recipes-list').append(resultsPromise));

  $('#js-search-term').text(searchedIngredients);
  $('.results-box').fadeIn('fast');
 }

/****************************************
  API CALLS
****************************************/

async function getRecipeInformationBulk(recipeIDs) { // returns lots of useful data, even tho I just want the URLs
  
  const endpointURL = `https://api.spoonacular.com/recipes/informationBulk`;
  const params = {
    apiKey: apiKey,
    ids: recipeIDs,
    includeNutrition: false // not useful, therefore set to 'false'. future app feature could include nutrition info in a widget.
  };
  const queryString = formatQueryString(params);
  const requestURL = `${endpointURL}?${queryString}`;

  const response = fetch(requestURL)
    /* .then(
      firstResponse => {handleBadRequest(firstResponse)}
    ) */
    .then(
      fetchResponse => {
        if (fetchResponse.ok) {
          return fetchResponse.json(); // get JSON from response body
        }
      }
    )
    .then(
      responseBulkInfoJSON => {
        // console.log(responseBulkInfoJSON); // confirm data to send
        return responseBulkInfoJSON;
      }
    )
    .catch(
      error => {
        console.log("getRecipeInformationBulk() fetch error message: " + error.message);
      }
    );

    return response;
}

function formatQueryString(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURI(params[key])}`); // encodeURI (without "Component" allows for the comma to remain after encoding)
  return queryItems.join('&');
}

function getResults(ingredients) {
  const endpointURL = `https://api.spoonacular.com/recipes/findByIngredients`;
  const params = {
    apiKey: apiKey,
    ingredients: ingredients,
    number: 4, // an arbitrary amount, useful for limiting API hits.
  };
  const queryString = formatQueryString(params);
  const requestURL = `${endpointURL}?${queryString}`;

  fetch(requestURL)
    .then(
      fetchResponse => {
        if (fetchResponse.ok) {
          // console.log(fetchResponse.status);
          return fetchResponse.json(); // get JSON from response body
        }
      })
    .then(
      responseJSON => displaySearchResults(responseJSON, ingredients)
    )
    .catch(
      error => {
        //check if error is because network is down, then tell user
        if (error.message === "Failed to fetch") {
          $('#js-error-message-box').show().text("Uable to connect to the server. Check your internet connection.").toggleClass('animate__rubberBand');
        }
        else if (error.message === "Cannot convert undefined or null to object") {
          $('#js-error-message-box').show().text("Sorry, no recipes found. Try something else?").toggleClass('animate__rubberBand');
        }
      }
    );
}

/****************************************
  EVENT HANDLERS
****************************************/

// function handleExportRecipe() {}

// function handleShowNutritionWidget() {}

// handle what happens when the response status is 400. NOTE: this works from the informationBulk fetch, not findByIngredients fetch.
/* function handleBadRequest(response) { // this function could be more generalized to check for other status codes with a switch statement.
  console.log(response.status);
  if (response.status === 400) {
    $('#js-error-message-box').show().text("Sorry, no recipes found. Try something else?");
  }
  return response;
} */

function handleSearchForm() {
  $('main').on('submit', '.js-recipe-search-form', function(event) {
    event.preventDefault();

    let searchTerm = $('#js-search-input').val();

    // strip any surrounding whitespace from search term
    searchTerm = searchTerm.trim();
    
    // empty search field validation
    if (searchTerm === '') {
      $('#js-error-message-box').show().text("There was no text in the search box. Please enter an ingredient before searching.").delay(500).toggleClass('animate__rubberBand'); // removed .show()
      return
    }

    $('#js-error-message-box').fadeOut('fast').delay(1000).empty();

    // $('#js-recipes-list').fadeOut('fast').empty();

    // console.time("time to get results"); // would this be better in the fetch?
    getResults(searchTerm);
    // console.timeEnd("time to get results");
  })
}

/* function handleApp() {
  // render();
  // handleSearchForm();
  // handleExportRecipe();
  // handleShowNutritionWidget();
} */

$(handleSearchForm);
