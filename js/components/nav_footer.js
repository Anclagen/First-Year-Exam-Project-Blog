import {createSponsoredContent, createErrorMessage, validateEmailInput} from "./components.js";
import {callAPI, sponsorUrl} from "./api_utilities.js";

/*------------------------------ Navigation -------------------------*/
/*--------  Menu Open/Close --------*/
//navigation variables
const menuBtn = document.querySelector(".menu-button");
const searchBtn = document.querySelector(".search-button");
const searchForm = document.querySelector(".search-form");
const menuLinks = document.querySelector(".navigation-menu");
const hamTopLine = document.querySelector(".line1");
const hamMidLine = document.querySelector(".line2");
const hamBotLine = document.querySelector(".line3");
const searchContainer = document.querySelector(".search-container");

/*------- Add Navigation Listeners -------*/
menuBtn.addEventListener("click", openCloseMenu);
searchBtn.addEventListener("click", openCloseSearch);
searchBtn.addEventListener('keydown', keyDown);
searchForm.addEventListener("submit", productSearch);

//Open/close menu phone
function openCloseMenu(){
  menuLinks.classList.toggle("hide-menu");
  hamTopLine.classList.toggle("menu-open-rotate1");
  hamBotLine.classList.toggle("menu-open-rotate3");
  hamMidLine.classList.toggle("menu-open-transparent");
}

//displays search input
function openCloseSearch(){
  searchContainer.classList.toggle("hidden-search");
  focus(document.querySelector(".search-input"));
}

/* https://dev.to/tylerjdev/when-role-button-is-not-enough-dac
   https://stackoverflow.com/questions/24386354/execute-js-code-after-pressing-the-spacebar
   https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
   https://css-tricks.com/snippets/javascript/javascript-keycodes/
  enter and space converted to click to open search bar*/
function keyDown(event) {
    if (event.key === "Enter" || event.keyCode === 13 || event.key === " " || event.keyCode === 32 || event.code === "space") {
    event.preventDefault();
    this.click();
  }
}

/*--------- search function ---------*/
function productSearch(submit) {
  submit.preventDefault();
  //define the search input and values splitting them for better results
  const searchInput = document.querySelector(".search-input");
  const searchTerms = searchInput.value.split(" ");
  window.location = `posts.html?search=${searchTerms}`;
}

/*-------------------------- Footer -------------------------*/
//sign up email submission variables
const signUpForm = document.querySelector(".signup-form");
const signUpInput = document.querySelector("#signup");
const signUpSubmit = document.querySelector(".signup-submit");
const signUpError = document.querySelector("#error-signup-email");
const sponsorsContainer = document.querySelector(".sponsors-post-container");

/*------- Add Signup Listeners -------*/
signUpForm.addEventListener("submit", validateSignUp);

/*---------- Validate Sign Up ------------*/
function validateSignUp(submission){
  submission.preventDefault();
  if(validateEmailInput(signUpInput, signUpError)){
    signUpSubmit.setAttribute('disabled', 'disabled');
    signUpSubmit.value = "Success!";
    signUpSubmit.classList.add("signed-up");
    signUpSubmit.style.bottom = "22px";
  }
}

/*---------- Sponsored ------------*/
async function createSponsors(sponsorUrl, sponsorsContainer){
  try{
  //fill sponsor content
  const sponsorData = await callAPI(sponsorUrl);
  createSponsoredContent(sponsorData, sponsorsContainer);
  } catch(error){
    console.log(error);
    createErrorMessage(sponsorsContainer);
  }
}

createSponsors(sponsorUrl, sponsorsContainer);
