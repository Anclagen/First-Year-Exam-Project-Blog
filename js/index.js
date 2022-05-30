// ------- imports --------
import {createPost, createPostCompressed, createErrorMessage} from "./components/components.js";
import {callAPI, latestPostsUrl, baseUrl, routes, parameters} from "./components/api_utilities.js";


/*-------------- Containers and variables --------------*/
const latestContainer = document.querySelector(".latest-post-slider");
const newestContainer = document.querySelector(".newest-posts");
const popularContainer = document.querySelector(".most-commented");
const bannerImageContainer = document.querySelector(".index-heading");
const additionalContentContainer = document.querySelector(".additional-content");

//grabs for arrows and button on slider
const latestNext = document.querySelector(".latest-next");
const latestPrevious = document.querySelector(".latest-previous");
const latestPreviousArrow = document.querySelector(".previous-arrow");
const latestNextArrow = document.querySelector(".next-arrow");

// variables for slider functionality.
let sliderLengthMax = 20;
let slidePercentage = 5;
let transformMax = 95;
let transform = 0;
let latestPostsData = [];

/*-------------- Event listeners For Slider -----------------*/
window.addEventListener("resize", adjustSliderWidths);
latestPrevious.addEventListener("click", previousPage);
latestPreviousArrow.addEventListener("click", previousPage);
latestNext.addEventListener("click", nextPage);
latestNextArrow.addEventListener("click", nextPage);

/*-------------- Creating main page content --------------*/
async function createPageContent(){
  try{
    //updates header image, and adds additional content
    const homeData = await callAPI(baseUrl + routes.page + "/168" + "?" + parameters.embed);
    bannerImageContainer.style.backgroundImage = `url("${homeData.featured_image.size_full}")`;
    additionalContentContainer.innerHTML = homeData.content.rendered;

    //grabs post data
    latestPostsData = await callAPI(latestPostsUrl);

    //adds page content for slider and new.
    createSliderContent(latestPostsData, latestContainer);
    //adds two newest posts to new section.
    createPosts(latestPostsData , newestContainer, 2);

    //filtering results for commented posts and sorting by most commented
    const commentedPosts = latestPostsData.filter(filterCommentedPosts);
    const sortedCommentedPosts = sortMostCommented(commentedPosts);
    createPosts(sortedCommentedPosts, popularContainer, 4);
  } catch(error){
    console.log(error);
    createErrorMessage(latestContainer);
  }
}

createPageContent();

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
      return true;
    }
  }
}

//sorts high to low
function sortMostCommented(data){
  return data.sort((a, b) => b._embedded.replies[0].length - a._embedded.replies[0].length);
}

/*-------------- Responsive Latest content slider -----------------*/

/* Limited to 20 posts max, resizes from 1 to 2 to 4 posts at a time 
   depending on the screen size, and*/

//creates upto 20 slides content
function createSliderContent(data, container){
  container.innerHTML= "";
  if(data.length < 20){
    sliderLengthMax = data.length;}
  disableButtons();
  for(let i = 0; i < data.length; i++){
    if(i === 20){
      sliderLengthMax = 20;
      break;
    }
    container.innerHTML += `<div class="latest-slider-content">${createPostCompressed(data[i])}</div>`;
  }
}

// transforms slider
function transformSlider(){
    latestContainer.style.transform = `translateX(-${transform}%)`;
}

/* Calculates correct transform and transform max for screen size
   use 0 to resize, 1 for next, and -1 for previous page changes*/
function calculateTransform(num){
  if(window.innerWidth < 720){
    transform += (5*num);
    transformMax = (sliderLengthMax-1) * slidePercentage;
  }else if(window.innerWidth >= 1100){
    transform += (20*num);
    transformMax = (sliderLengthMax-4) * slidePercentage;
    if(transform > transformMax){
      transform = (sliderLengthMax-4) * slidePercentage;
    }
  }else if(window.innerWidth >= 720){
    transform += (10*num);
    transformMax = (sliderLengthMax-2) * slidePercentage;
    if(transform > transformMax){
      transform = (sliderLengthMax-2) * slidePercentage;  
    }
  }
  if(transform < 0){
    transform = 0;
  }
}

// disables buttons
function disableButtons(){
  //disables previous at slider start
  if(transform === 0){
    latestPrevious.setAttribute('disabled', 'disabled');
    latestPreviousArrow.style.display = "none";
  } else {
    latestPrevious.disabled = false;
    latestPreviousArrow.style.display = "block";
  }

  //disables next if max transform reached
  if(transform === transformMax){
      latestNext.setAttribute('disabled', 'disabled');
      latestNextArrow.style.display = "none";
  }
    if(transform  < transformMax){
      latestNext.disabled = false;
      latestNextArrow.style.display = "block";
    }
}

//function for resize listener to update slider on window resize.
function adjustSliderWidths(){
  calculateTransform(0);
  transformSlider();
  disableButtons();
}

//change page functions for listeners
function previousPage(){
  calculateTransform(-1);
  transformSlider();
  disableButtons();
}

function nextPage(){
  calculateTransform(1);
  transformSlider();
  disableButtons();
}