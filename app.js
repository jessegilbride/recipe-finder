'use strict';

const store = {
  displaySearch: true,
  displayResults: false,
  displayRecipe: false
};

const ruhRohShaggy = {
  noServerResponse: "Seems like we're having trouble contacting the service that provides recipes. Check your internet connection and try again. Thanks!",
  pointsQuotaExceeded: "Unfortunately you've reached the daily quota of allowed searches. Please come back tomorrow.",
  ingredientNotFound: "Sorry, we can't find a recipe based on your search. Please try again.",
}

const apiKey = `46e759e032d04fc496f2345a2a35256c`;

let consoleStyleHeaderGrey = "color:black; background-color:lightgrey; padding:4px;border-radius:5px";
let consoleStyleHeaderDarkGreen = "color:yellow; background-color:darkgreen; padding:4px;border-radius:5px";;

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
  console.log("%c---- recipeInformationBulkJSON ----", consoleStyleHeaderGrey);
  console.log(recipeInformationBulkJSON);
  
  // pass each recipe to list generation function
  console.log("%c---- recipeItemsJSON ----", consoleStyleHeaderGrey);
  const recipesListString = Object.entries(recipeInformationBulkJSON)
    .map(recipeItem => generateResultsListItem(recipeItem));
  
  // what I expect to be returned to displaySearchResults()...
  // console.log(recipesListString.join(''));
  
  return recipesListString.join('');

}

/****************************************
  DISPLAY FUNCTIONS ...put HTML and API data into the DOM
****************************************/

async function displaySearchResults(responseJSON) {
  // console.log(responseJSON);
  //  const resultsList = /* await */ generateResultsList(responseJSON); // resultsList is a returned [PromiseResult]
  await generateResultsList(responseJSON)
  .then(resultsPromise => $('#js-recipes-list').append(resultsPromise));


  /* // this is what I expected resultsList to contain. when uncommented, you see it show in the DOM.
  const htmlToInster = `
  <li>
    <img src="https://spoonacular.com/recipeImages/987595-556x370.jpg" alt="recipe image" />
    <h3>Apple Ginger Kombucha Cocktail</h3>
    <a href="https://www.afamilyfeast.com/apple-ginger-kombucha-cocktail/" target="_blank">View recipe</a>
  </li>
  <li>
    <img src="https://spoonacular.com/recipeImages/719320-556x370.png" alt="recipe image" />
    <h3>20 Celebration ! + $500 GIVEAWAY</h3>
    <a href="http://www.julieseatsandtreats.com/20-celebration-recipes/" target="_blank">View recipe</a>
  </li>
  <li>
    <img src="https://spoonacular.com/recipeImages/35060-556x370.jpg" alt="recipe image" />
    <h3>Peanut Butter-stuffed Apple</h3>
    <a href="http://www.wholeliving.com/172996/peanut-butter-stuffed-apple" target="_blank">View recipe</a>
  </li>
  <li>
    <img src="https://spoonacular.com/recipeImages/65597-556x370.jpg" alt="recipe image" />
    <h3>Cinnamon Streusel Muffins</h3>
    <a href="http://www.myrecipes.com/recipe/cinnamon-streusel-muffins-10000001694196/" target="_blank">View recipe</a>
  </li>
  <li>
    <img src="https://spoonacular.com/recipeImages/66531-556x370.jpg" alt="recipe image" />
    <h3>Caramel Fondue</h3>
    <a href="http://www.myrecipes.com/recipe/caramel-fondue-10000001921279/" target="_blank">View recipe</a>
  </li>`;
  $('#js-recipes-list').append(htmlToInster); */

  // $('#js-recipes-list').append(resultsList);
 }

/****************************************
  API CALLS ...get the data, send to display/generation functions
****************************************/

async function getRecipeInformationBulk(recipeIDs) { // returns lots of useful data, even tho I just want the URLs
  
  const endpointURL = `https://api.spoonacular.com/recipes/informationBulk`;
  const params = {
    apiKey: apiKey, // assuming they're allowed to be the same name?
    ids: recipeIDs,
    includeNutrition: false // not useful, therefore set to 'false'. future app feature may include nutrition info in a widget or table using this data.
  };
  const queryString = formatQueryString(params);
  const requestURL = `${endpointURL}?${queryString}`;

  console.log(requestURL);

  const response = fetch(requestURL)
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
        $('#js-error-message-box').text(ruhRohShaggy.noServerResponse);
        alert(error.message);
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
    number: 5, // an arbitrary number of my choosing. for larger numbers consider pagination of results.
  };
  const queryString = formatQueryString(params);
  const requestURL = `${endpointURL}?${queryString}`;
  // console.log("request URL: " + requestURL);

  function handleErrors(response) {
    // console.log("handleErrors() called");
    // console.log(response.status);
    return response;
  }

  /* ===== DISPLAY SEARCH RESULTS TESTING ===== */
  // displaySearchResults(recipesResponseSample); // called with sample data
  /* ========================================== */

  fetch(requestURL)
    // .then(firstResponse => handleErrors(firstResponse))
    .then(
      fetchResponse => {
        console.log("%c---- response.status ----", consoleStyleHeaderDarkGreen);
        console.log(fetchResponse.status);
        console.log("%c---- response.statusText ----", consoleStyleHeaderDarkGreen);
        console.log(fetchResponse.statusText);
        console.log("%c---- response.ok ----", consoleStyleHeaderDarkGreen);
        console.log(fetchResponse.ok);
        console.log("%c---- response.type ----", consoleStyleHeaderDarkGreen);
        console.log(fetchResponse.type);
        console.log("%c---- response.url ----", consoleStyleHeaderDarkGreen);
        console.log(fetchResponse.url);
        console.log("%c---- response.headers ----", consoleStyleHeaderDarkGreen);
        console.log(fetchResponse.headers);
        if (fetchResponse.ok) {
          // console.log(fetchResponse.status);
          return fetchResponse.json(); // get JSON from response body
        }
        else if (fetchResponse.status === 400) {
          $('#js-error-message-box').text(ruhRohShaggy.ingredientNotFound);
          return
        }
      })
    .then(
      responseJSON => displaySearchResults(responseJSON)
    )
    .catch(
      error => {
        /* if (error.status === 400) {
          $('#js-error-message-box').text(ruhRohShaggy.ingredientNotFound);
          console.log(fetchResponse.status);
          console.log(error.message);
          return
        } */
        $('#js-error-message-box').text(ruhRohShaggy.noServerResponse);
        // console.log(error.message);
        console.log(error);
        console.log("mmmk?");
        return
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

/****************************************
  EVENT HANDLERS  ...handle changes in state or DOM
****************************************/

function handleExportRecipe() {}

function handleSearchResultClicked() {}

function handleBackToResults() {}

function handleBackToSearch() {}

function handleSearchForm() {
  $('main').on('submit', '.js-recipe-search-form', function(event) {
    event.preventDefault();
    const searchTerm = $('#js-search-input').val();
    
    // extra validation (beyond native HTML validation) for blank form entry
    if (searchTerm === '') {
      $('#js-error-message-box').text(ruhRohShaggy.ingredientNotFound);
      return
    }

    // console.time("time to get results"); // would this be better in the fetch?
    getResults(searchTerm);
    // console.timeEnd("time to get results");

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
