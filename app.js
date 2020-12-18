'use strict';

const store = {
  displaySearch: true,
  displayResults: false,
};

const ruhRohShaggy = {
  noServerResponse: "Seems like we're having trouble contacting the service that provides recipes. Check your internet connection and try again. Thanks!",
  pointsQuotaExceeded: "Unfortunately you've reached the daily quota of allowed searches. Please come back tomorrow.",
  ingredientNotFound: "Sorry, we can't find a recipe based on your search. Please try again.",
}

const apiKey = `46e759e032d04fc496f2345a2a35256c`;

/****************************************
  TEMPLATE GENERATION ...generate HTML
****************************************/

function generateResultsListItem(recipeItem) {
  // console.log("generateResultsListItem() called");
  console.log(recipeItem);

  const image = recipeItem[1].image;
  const title = recipeItem[1].title;
  const url = recipeItem[1].sourceUrl;
  // console.log(image);
  // console.log(title);
  // console.log(url);

  return `
  <li>
    <img src="${image}" alt="recipe image" />
    <h3>${title}</h3>
    <a href="${url}" target="_blank">View recipe</a>
  </li>`;
}

async function generateResultsList(responseJSON) {
  // console.log("responseJSON: " + JSON.stringify(responseJSON));
  // console.log(responseJSON);
  
  // get the IDs for all of the results
  let recipeIDs = [];
  for (let i=0; i<responseJSON.length; i++) {
    // console.log("push ID: " + responseJSON[i].id);
    recipeIDs.push(responseJSON[i].id);
  }

  const recipeInformationBulkJSON = await getRecipeInformationBulk(recipeIDs);
  /* ===== DISPLAY SEARCH RESULTS TESTING ===== */
  // const recipeInformationBulkJSON = recipeInformationBulkSample; // dummy "sample" data
  /* ========================================== */
  
  // console.log(recipeInformationBulkJSON);
  
  // pass each recipe to list generation function
  const recipesListString = Object.entries(recipeInformationBulkJSON)
    .map(recipeItem => generateResultsListItem(recipeItem));
  
  return recipesListString.join('');

}

/****************************************
  DISPLAY FUNCTIONS ...put HTML and API data into the DOM
****************************************/

async function displaySearchResults(responseJSON) {
  // console.log(responseJSON);
  
  // the change in screen view happens in this function so that if there's a search error, the user stays on search screen, else then it changes here.
  store.displaySearch = false;
  store.displayResults = true;
  render();

  await generateResultsList(responseJSON)
  .then(resultsPromise => $('#js-recipes-list').append(resultsPromise));
 }

/****************************************
  API CALLS ...get the data, send to display/generation functions
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

  // console.log(requestURL);

  const response = fetch(requestURL)
    // .then(
    //   firstResponse => {handleBadRequest(firstResponse)}
    // )
    .then(
      fetchResponse => {
        if (fetchResponse.ok) {
          return fetchResponse.json(); // get JSON from response body
        }
      }
    )
    .then(
      responseBulkInfoJSON => {
        // console.log(responseBulkInfoJSON); // [!] make sure this is the right data
        return responseBulkInfoJSON;
      }
    )
    .catch(
      error => {
        console.log("getRecipeInformationBulk() fetch error message: " + error.message);
      }
    );

    // console.log(functionReturn);
    return response;
}

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
    number: 3, // an arbitrary amount of my choosing, useful to limit API hits.
  };
  const queryString = formatQueryString(params);
  const requestURL = `${endpointURL}?${queryString}`;
  // console.log("request URL: " + requestURL);

  /* ===== DISPLAY SEARCH RESULTS TESTING ===== */
  // displaySearchResults(recipesResponseSample); // called with sample data
  /* ========================================== */

  fetch(requestURL)
    .then(
      fetchResponse => {
        if (fetchResponse.ok) {
          // console.log(fetchResponse.status);
          return fetchResponse.json(); // get JSON from response body
        }
      })
    .then(
      responseJSON => displaySearchResults(responseJSON)
    )
    .catch(
      error => {
        //check if error is because network is down, then tell user
        if (error.message === "Failed to fetch") {
          $('#js-error-message-box').show().text("Uable to connect to the server. Check your internet connection.");
        }
        else if (error.message === "Cannot convert undefined or null to object") {
          $('#js-error-message-box').show().text("Sorry, no recipes found. Try something else?");
          $('#js-back-to-search').show();
        }
      }
    );
}

/****************************************
  APP RENDERING ...render which screen to show
****************************************/

function render() {
  // console.info(store);
  if (store.displaySearch === true) {
    $('#js-search-screen').show();
    $('#js-results-screen').hide();
    $('#js-back-to-search').hide();
  } else if (store.displayResults === true) {
    $('#js-search-screen').hide();
    $('#js-results-screen').show();
    $('#js-back-to-search').show();
  }
}

/****************************************
  EVENT HANDLERS  ...handle changes in state or DOM
****************************************/

// function handleExportRecipe() {}

// function handleShowNutritionWidget() {}

function handleBackToSearch() {
  $('#js-back-to-search').on('click', function(event){
    $('#js-recipes-list').empty();
    $('#js-error-message-box').empty().hide();
    $('#js-search-input').val('');
    store.displaySearch = true;
    store.displayResults = false;
    render();
  });
}

// handle what happens when the response status is 400. NOTE: this works from the informationBulk fetch, not findByIngredients fetch.
/* function handleBadRequest(response) { // this function could be more generalized to check for other status codes with a switch statement.
  console.log(response.status);
  if (response.status === 400) {
    $('#js-error-message-box').show().text("Sorry, no recipes found. Try something else?");
    // change screen state in store
    store.displaySearch = true;
    store.displayResults = false;
    // render
    // render();
  }
  return response;
} */

function handleSearchForm() {
  $('main').on('submit', '.js-recipe-search-form', function(event) {
    event.preventDefault();
    $('#js-error-message-box').empty();

    const searchTerm = $('#js-search-input').val();
    
    // extra validation (beyond native HTML validation) for blank form entry
    if (searchTerm === '') {
      $('#js-error-message-box').show().text("There was no text in the search box. Please enter an ingredient before searching.");
      return
    }

    // console.time("time to get results"); // would this be better in the fetch?
    getResults(searchTerm);
    // console.timeEnd("time to get results");

    // change screen states, re-render
    // store.displaySearch = false;
    // store.displayResults = true;
    // render();
  })
}

function handleApp() {
  render();
  handleSearchForm();
  handleBackToSearch();
  // handleExportRecipe();
  // handleShowNutritionWidget();
}

$(handleApp);
