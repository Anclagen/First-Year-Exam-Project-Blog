import {callAPI, callApiGetPages, blogPostUrl, categoriesUrl, searchBlogPostsUrl} from "./components/api_utilities.js";
import {createPost, createErrorMessage, addLoader} from "./components/components.js";

/*-------------- query string grabs and url --------------*/

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const tags = params.get("tags");
let searchTerms = params.get("search");

/*-------------- Containers and variables --------------*/
const title = document.querySelector("title");
const pageHeading = document.querySelector("h1");
let filterSelector = document.querySelector("#filter");
let sortSelector = document.querySelector("#sort");
const postResultsContainer = document.querySelector(".post-results-container");
// results and pages containers
const numberShownPostsContainer = document.querySelector(".current-shown-results");
const totalNumberPostsContainer = document.querySelector(".total-results");
const showMoreBtn = document.querySelector(".show-more-results");

// variables for show more
let currentPostCreated = 0;
let postData = [];
let pagesAndPosts = [];

/*-------------- defining the initial url --------------*/
//sorting out url based on queries
let initialUrl = blogPostUrl;
if(tags !== null){
  initialUrl = blogPostUrl + "&categories=" + tags;
} else if(searchTerms !== null){
  initialUrl = searchBlogPostsUrl + searchTerms;
  title.innerText = `Searching Posts For; ${searchTerms} | The Fluffy Piranha`;
}

/*-------------- Event listeners -----------------*/
filterSelector.addEventListener("change", updateResults);
sortSelector.addEventListener("change", updateResults);
showMoreBtn.addEventListener("click", showMorePosts);

/*-------------- Main Page Content Creation --------------*/
async function createPageContent(){
  try{
    //initial api call, also grabbing headers for pages and results
    let data = await callApiGetPages(initialUrl);
    
    //search data lacking some info so additional call done with post ids for more data
    if(searchTerms !== null ){
      if(data[0].length > 0){
        data = await getSearchData(data);
      }
    }
    
    //update variables
    postData = data[0];
    pagesAndPosts = [data[1], data[2]];

    //get number of results disable show more button
    if(postData.length <= 10){
      currentPostCreated = postData.length;
      showMoreBtn.disabled = true;
    } else {
      currentPostCreated = 10;
      showMoreBtn.disabled = false;
    }

    createPageHTML(postData);
    fillResultsDetails(postData);
    updateHeading();
  }catch(error){
    console.log(error);
    createErrorMessage(postResultsContainer);
  }
}

/*need filter created first for page load but need it separate 
  from the page content creation function for headings to update*/
async function fillPage(){
  await addFilterOptions();
  createPageContent();
}

fillPage();


/*------ Improve Search Data ---------*/
async function getSearchData(data){
  let searchIds = "";
  data[0].forEach(element => {
    searchIds += element.id + ",";
  });
  const searchResultsUrl = blogPostUrl + "&include=" + searchIds;
  data = await callApiGetPages(searchResultsUrl);
  return data;
}

/*------- Get Filter Options -------*/
async function addFilterOptions(){
  try{
  const categoriesData = await callAPI(categoriesUrl);
  createFilterOptions(categoriesData);
  }catch(error){
    console.log(error);
    createErrorMessage(postResultsContainer);
  }
}

/*-------------- Creating Page Html --------------*/

//creates the filter options html
function createFilterOptions(data){
  filterSelector.innerHTML =`<option value="All" selected> All</option>`;
  data.forEach(element => {
    const option = `<option value="${element.id}" name="${element.name}"> ${element.name}</option>`;
    filterSelector.innerHTML += option;
  });
  //sets category drop down to selected tag
  if(tags !== null){
    filterSelector.value = tags;
  }
}

//adds posts to page
function createPageHTML(data){
  postResultsContainer.innerHTML = "";
  if(data.length === 0){
    postResultsContainer.innerHTML='<p class="no-results">Nothing to see here humans!</p>'
  }
  for(let i = 0; i < data.length; i++){
    let post = createPost(data[i]);
    postResultsContainer.innerHTML += post;
    if(i === (currentPostCreated-1)){
      break;
    }
  }
}

//update heading
function updateHeading(){
  if(searchTerms !== null ){
    pageHeading.innerText = `Search Results For; ${searchTerms}`;
    title.innerText = `Searching Posts For; ${searchTerms} | The Fluffy Piranha`;
    //prevents search terms over writing filters headings
    searchTerms = null;
  } else{
    pageHeading.innerHTML = filterSelector.options[filterSelector.selectedIndex].text;
    title.innerText = `${filterSelector.options[filterSelector.selectedIndex].text} Posts | The Fluffy Piranha`;
  }
}

//updates result shown
function fillResultsDetails(data){
  if(data.length >=10){
    numberShownPostsContainer.innerText = currentPostCreated;
  } else {
    numberShownPostsContainer.innerText = data.length;
  }
  totalNumberPostsContainer.innerText = pagesAndPosts[1];
}

/*-------------- Show more posts --------------*/
function showMorePosts(){
  if(currentPostCreated + 10 >= postData.length){
    currentPostCreated = postData.length;
    showMoreBtn.disabled = true;
  } else{
    currentPostCreated += 10;
  }
  numberShownPostsContainer.innerHTML = currentPostCreated;
  createPageHTML(postData);
}

/*-------------- Filter and Sort Functionality --------------*/

//combines filter and sort url additions to generate results
function updateResults(){
  addLoader(postResultsContainer);
  filterResults();
  sortResults();
  createPageContent();
}

//updates the categories for url
function filterResults(){
  //stops search query string over writing heading
  searchTerms = null;
  if(filterSelector.value === "All"){
    initialUrl = blogPostUrl;
  } else {
    initialUrl = blogPostUrl + "&categories=" + filterSelector.value;
  }
}

//add appropriate sort to the url
function sortResults(){
  if(sortSelector.value === "Oldest"){
    initialUrl = initialUrl + "&filter[orderby]=date&order=asc";
  } 
}