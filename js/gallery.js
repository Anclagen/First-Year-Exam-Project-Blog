// ------- imports --------
import {baseUrl, callAPI} from "./components/api_utilities.js";
import {errorMessage} from "./constants/constants.js";

/*-------------- Containers and variables --------------*/
const diaryMediaUrl = baseUrl + "/media?_embed&categories=11&per_page=100";
const diaryContainer = document.querySelector(".diary-gallery-slide");
const diaryNextBtn = document.querySelector(".diary-next-arrow");
const diaryPreviousBtn = document.querySelector(".diary-previous-arrow");

//slider variables
let diaryTransform = 0;
let diaryCurrentPage = 0;
let diaryMaxPages = 0;

/*-------------- Event listeners For Slider -----------------*/
diaryNextBtn.addEventListener("click", nextSlide);
diaryPreviousBtn.addEventListener("click", previousSlide);

/*-------------- Create Page Content -----------------*/
async function CreatePageContent(){
  try{
    const diaryData = await callAPI(diaryMediaUrl);
    adjustSliderVariables(diaryData.length);
    addGalleryImages(diaryData, diaryContainer);
    //get images after slider creation and adjust widths
    const images = document.querySelectorAll(".gallery-image");
    images.forEach(element => {
      element.style.width = `${diaryTransform}%`;
    });
  }catch(error){
    console.log(error);
    errorMessage(diaryContainer);
  }
}

CreatePageContent();

/*------- Image Modal Slider --------*/
function addGalleryImages(data, container){
  for(let i = 0; i < data.length; i++){
    container.innerHTML += `<img src="${data[i].media_details.sizes.full.source_url}" class="gallery-image"alt="${data[i].alt_text}" />`;
  }
}

//adjust sliders width base on number of images
function adjustSliderVariables(length){
  diaryContainer.style.width = `${(100 * length)}%`;
  diaryTransform = 100/length;
  diaryMaxPages = length;
}

function nextSlide(){
  if(diaryCurrentPage + 1 === diaryMaxPages){
    diaryCurrentPage = 0;
  } else{
    diaryCurrentPage = diaryCurrentPage + 1;
  }
  let transform = (diaryCurrentPage * diaryTransform);
  diaryContainer.style.transform = `translateX(-${transform}%)`;
}

function previousSlide(){
  if(diaryCurrentPage === 0){
    diaryCurrentPage = diaryMaxPages - 1;
  } else{
    diaryCurrentPage = diaryCurrentPage - 1;
  }
  let transform = (diaryCurrentPage * diaryTransform);
  diaryContainer.style.transform = `translateX(-${transform}%)`;
}
