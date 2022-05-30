// ------- imports --------
import {createPost, createPostCompressed, createErrorMessage} from "./components/components.js"
import {callAPI, latestPostsUrl, baseUrl, routes, parameters} from "./components/api_utilities.js"


/*-------------- Creating main page content --------------*/
const latestContainer = document.querySelector(".latest-post-slider");
const newestContainer = document.querySelector(".newest-posts");
const popularContainer = document.querySelector(".most-commented");
const bannerImageContainer = document.querySelector(".index-heading");
const additionalContentContainer = document.querySelector(".additional-content");

// variables for next and previous button functions of latest images slider.
let latestPageCurrent = 1;
let latestPageCurrentMobile = 1;
let latestPageCurrentDesktop = 1;
let latestPageMaxMobile = 20;
let latestPageMaxDesktop = 5;
let latestPostsData = [];

async function createPageContent(){
  try{
    //updates header image, and any additional content user wants to add
    const homeData = await callAPI(baseUrl + routes.page + "/168" + "?" + parameters.embed);
    bannerImageContainer.style.backgroundImage = `url("${homeData.featured_image.size_full}")`;
    additionalContentContainer.innerHTML = homeData.content.rendered;

    //grabs post data
    latestPostsData = await callAPI(latestPostsUrl);
    //adjusting page max if I don't add more than 20 posts
    if(latestPostsData.length < 20){
    latestPageMaxMobile = latestPostsData.length;
    latestPageMaxTablet = Math.ceil(latestPostsData.length/2);
    latestPageMaxDesktop = Math.ceil(latestPostsData.length/4);
    }

    //adds page content for slider and new
    createPostImageSlider(latestPostsData, latestContainer);
    // resize slider listener
    window.addEventListener("resize", adjustSliderWidths);

    // 2 newest posts
    createPosts(latestPostsData , newestContainer, 2);

    //filtering results for commented posts and sorting by most commented
    const commentedPosts = latestPostsData.filter(filterCommentedPosts);
    const sortedCommentedPosts = sortMostCommented(commentedPosts);

    //adds page content for popular
    createPosts(sortedCommentedPosts, popularContainer, 4);
  } catch(error){
    console.log(error)
    createErrorMessage(latestContainer)
  }
}

createPageContent()

/*-------------- Newest Posts -----------------*/

function createPosts(data, container, amount){
  container.innerHTML = "";
  for(let i = 0; i < amount; i++){
    container.innerHTML += createPost(data[i]);
  }
}

/*--------------- Popular/Most commented posts ----------------*/

//filters out undefined(posts with no embedded replies)
function filterCommentedPosts(data){
  if(data._embedded !== undefined){
    if(data._embedded.replies !== undefined){
      return true
    }
  }
}

//sorts high to low
function sortMostCommented(data){
  return data.sort((a, b) => b._embedded.replies[0].length - a._embedded.replies[0].length);
}

/*-------------- Responsive Latest content slider -----------------*/

/* designed to handle the 20 results the call was limited (could be expanded to more)
   and shrink on mobile to 2 posts at a time from 4*/

let slidePercentage = 10;

//function for resize listener to update slider on window resize.
function adjustSliderWidths(){
  getWidths();
  changePageNumber(0);
  disableButtons();
  transformSlider();
}

// updates max number of pages and slide % amount
function getWidths(){
  if(window.innerWidth < 720){
    slidePercentage = 10;
  }
  else if(window.innerWidth >= 720){
    slidePercentage = 20;
  };
}

// calculates the amount of transform depending on screen width
function transformSlider(){
  if(window.innerWidth < 720){
    let transform = (latestPageCurrent- 1) * slidePercentage;
    latestContainer.style.transform = `translateX(-${transform}%)`;
  }
  else if(window.innerWidth >= 720){
    let transform = (latestPageCurrent - 1) * slidePercentage;
    latestContainer.style.transform = `translateX(-${transform}%)`;
  };
}

/*  function to update the page number 
throw in 0 just for resize, 1 for next, -1 for previous page changes*/
function changePageNumber(Num){
  if(window.innerWidth < 720){
    latestPageCurrentMobile = latestPageCurrentMobile + (Num * 1);
    latestPageCurrentDesktop = latestPageCurrentDesktop + (Num * 0.5);
    latestPageCurrent = latestPageCurrentMobile;
  }
  else if(window.innerWidth >= 720){
    latestPageCurrentMobile = latestPageCurrentMobile + (Num * 2);
    latestPageCurrentDesktop = latestPageCurrentDesktop + (Num * 1);
    //rounds down if desktop page is a decimal
    latestPageCurrent  = Math.floor(latestPageCurrentDesktop);
  }
}

// disables buttons 
function disableButtons(){
  if(latestPageCurrent === 1){
    latestPrevious.setAttribute('disabled', 'disabled');
    latestPreviousArrow.style.display = "none";
  } else {
    latestPrevious.disabled = false;
    latestPreviousArrow.style.display = "block";
  }
  if(window.innerWidth < 720){
    if(latestPageCurrent === latestPageMaxMobile){
      latestNext.setAttribute('disabled', 'disabled');
      latestNextArrow.style.display = "none";
    }
    if(latestPageCurrent < latestPageMaxMobile){
      latestNext.disabled = false;
      latestNextArrow.style.display = "block";
    }
  } else {
    if(latestPageCurrent === latestPageMaxDesktop){
      latestNext.setAttribute('disabled', 'disabled');
      latestNextArrow.style.display = "none";
    }
    if(latestPageCurrent < latestPageMaxDesktop){
      latestNext.disabled = false;
      latestNextArrow.style.display = "block";
    }
  }
}

//create responsive image slider
function createPostImageSlider(data, container){
  container.innerHTML= "";
  getWidths();
  disableButtons();
  let slide = document.createElement("div");
  slide.classList = "latest-slider-content";

  for(let i = 0; i < data.length; i++){
    if(i === 20){
      break
    }
    //every 4 posts creates new slide
    if(i!== 0 && i%4 === 0){
      container.appendChild(slide);
      slide = document.createElement("div");
      slide.classList = "latest-slider-content";
    }
    //create post and adds to slide
    let post = createPostCompressed(data[i]);
    slide.innerHTML+=post;
    }
  //appends last slide
  container.appendChild(slide);
  
}

//grabs for arrows and button variables
const latestNext = document.querySelector(".latest-next");
const latestPrevious = document.querySelector(".latest-previous");
const latestPreviousArrow = document.querySelector(".previous-arrow");
const latestNextArrow = document.querySelector(".next-arrow");

//event listeners for next and previous buttons
latestPrevious.addEventListener("click", previousPage);
latestPreviousArrow.addEventListener("click", previousPage);
latestNext.addEventListener("click", nextPage);
latestNextArrow.addEventListener("click", nextPage);
latestPreviousArrow.style.display = "none";

//change page functions for latest posts
function previousPage(){
  changePageNumber(-1);
  disableButtons();
  transformSlider();
}

function nextPage(){
  changePageNumber(1);
  disableButtons();
  transformSlider();
}



