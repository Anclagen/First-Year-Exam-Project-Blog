import {baseUrl, routes, callAPI} from "./components/api_utilities.js";
import {createErrorMessage} from "./components/components.js";

/*-------------- create main page content --------------*/
const aboutContentContainer = document.querySelector(".about-content-container");

async function createPageContent(){
  try{
    const aboutData = await callAPI(baseUrl + routes.page + "/90");
    aboutContentContainer.innerHTML = aboutData.content.rendered;
  } catch(error){
    console.log(error);
    createErrorMessage(aboutContentContainer);
  }
}

createPageContent();