import {baseUrl, routes, callAPI, parameters, postComment, blogPostUrl} from "./components/api_utilities.js";
import {fullname, errorName, message, errorMessage, formReporting} from "./constants/constants.js";
import {resetBorders, validatedInputLength, addImageModals, createComments, createErrorMessage, createPostCompressed} from "./components/components.js";

/*-------------- Query string grabs and url --------------*/
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
const url = baseUrl + routes.blogPosts + "/" + id + "?" + parameters.acf + "&_embed";

/*-------------- Containers and variables --------------*/
//head variables
const title = document.querySelector("title");
const headDetails = document.querySelector('meta[name="description"]');
//main content
const titleContainer = document.querySelector("h1");
const featuredImageContainer = document.querySelector(".featured-image-container");
const mainContentContainer = document.querySelector(".post-content-container");
const postDateContainer = document.querySelector(".post-date");
//related posts
const relatedPostsContainer = document.querySelector(".related-posts");
//comments
const commentsContainer = document.querySelector(".comments-container");
const commentUrl = baseUrl + "/comments?post=" + id;
const commentsForm = document.querySelector("#comment-form");

/*-------------- Event listeners For Comments -----------------*/
commentsForm.addEventListener("submit", validateSubmitComment);

/*-------------- Api Call and Page Creation --------------*/
async function createPageContent(){
  try{
    const postData = await callAPI(url);
    await createPostHTML(postData);

    createHeadInformation(postData);
    addImageModals();

    const similarPosts = await callAPI(getIds(postData));
    createRelatedPosts(similarPosts, postData);

  } catch(error){
    console.log(error);
    createErrorMessage(mainContentContainer);
  }
}

createPageContent();

/*-------------- Page Information --------------*/
function createHeadInformation(data){
  const titleContent = decodeHtmlSymbols(data.title.rendered);
  title.innerText = `The Fluffy Piranha | ${titleContent} `;
  headDetails.content = data.acf.post_summary;
}

//page title wasn't converting html symbols codes.
function decodeHtmlSymbols(data) {
  var text = document.createElement("textarea");
  text.innerHTML = data;
  return text.value;
}

//gets ids for related ids call
function getIds(data){
  let ids = "";
  data.categories.forEach(element => {
    ids += element + ",";});
  const relatedUrl = blogPostUrl + "&categories="  + ids;
  return relatedUrl;
}

/*-------------- Page HTML Creation --------------*/
async function createPostHTML(data){
  const featuredImgSrc = data.featured_image.size_full;
  const featuredImgAlt = data._embedded['wp:featuredmedia'][0].alt_text;

  /*removing inline styling tags injected by box creator plugin.
  https://stackoverflow.com/questions/52212030/js-how-to-remove-style-tags-and-their-content-from-an-html-string-using-regula */
  let postText = data.content.rendered.replace(/<style((.|\n|\r)*?)<\/style>/gm, '');

  titleContainer.innerHTML = data.title.rendered;
  featuredImageContainer.innerHTML = `<img src="${featuredImgSrc}" alt="${featuredImgAlt}" class="featured-image">`;
  postDateContainer.innerHTML = `<span>${data.acf.published}</span>
                                 <span class="author-text">Author: ${data.acf.author}</span>
                                 <div class="author-image">
                                  <img src="${data.acf.author_image}" alt="${data.acf.author}">
                                </div>`;
  mainContentContainer.innerHTML = postText;
}

function createRelatedPosts(data, postData){
  for(let i = 0; i< data.length; i++){
    if(data[i].id === postData.id){
      if(i < data.length - 1 && i > 0){
        relatedPostsContainer.innerHTML += `${createPostCompressed(data[i-1])} ${createPostCompressed(data[i+1])}`;
      } else if(i + 1 < data.length && i === 0){
          relatedPostsContainer.innerHTML += createPostCompressed(data[i+1]);
          if(i + 2 < data.length){
            relatedPostsContainer.innerHTML += createPostCompressed(data[i+2]);
          }
      } else if(i === data.length - 1 && i - 1 >= 0){
        relatedPostsContainer.innerHTML += createPostCompressed(data[i-1]);
        if(i - 2 >= 0){
          relatedPostsContainer.innerHTML += createPostCompressed(data[i-2]);
        }
      }
    }
  }
}

/*-------------- Get Comments  --------------*/
async function getComments(){
  try{
    let commentData = await callAPI(commentUrl);
    if(commentData.length === 0){
      commentsContainer.innerHTML=`<p>No comments yet be the first!</p>`;
    } else{
      createComments(commentData, commentsContainer);
    }
  } catch(error){
    console.log(error);
    createErrorMessage(commentsContainer);
  }
}

getComments();

/*-------------- Comment Posting --------------*/

//validates inputs and when passed, posts form to server.
async function validateSubmitComment(submission) {
  submission.preventDefault();

  //clear success/error container.
  formReporting.innerHTML = "";

  //variables assigned true if they pass, and errors generated on fail.
  const a = validatedInputLength(fullname, 1, errorName);
  const b = validatedInputLength(message, 3, errorMessage);
  // const c = validateEmailInput(email, errorEmail);

  if(a && b) {
  //create data for post with id corresponding to page or post
  const data = JSON.stringify({post: Number(id), author_name: fullname.value, author_email:"anonymous@anonymous.com", content:message.value});
  
  await postComment(data, formReporting);
  await getComments();
  //give api time to update
  commentsForm.reset();
  resetBorders(fullname);
  resetBorders(message);
  }
}
