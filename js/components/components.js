/*----------------------HTML Content Creators -----------------------*/ 
/*------ standard post layout creator -------*/
export function createPost(data){
  let tags ="";
  data.category.forEach((tag, i) => {
    if(i !== 0){
      tags += ", ";
    }
    tags += `<a href="posts.html?tags=${tag.id}" class="post-tags">${tag.name}</a>`;
  });

  let post = `
              <div class="post-container">
                <div class="post-image-container">
                    <a href="post_specific.html?id=${data.id}" tabindex="-1">
                      <img src="${data.featured_image.size_large}" alt="${data._embedded['wp:featuredmedia'][0].alt_text}" class="post-image">
                    </a>
                    <div class="author-image">
                      <img src="${data.acf.author_image}" alt="Picture of ${data.acf.author}">
                    </div>
                  </div>
                  <div class="post-date">
                    <span>${data.acf.published}</span><span class="author-text">Author: ${data.acf.author}</span>
                  </div>
                <div class="post-heading">
                  <a href="post_specific.html?id=${data.id}" ><h3>${data.title.rendered}</h3></a>
                  <p>${data.acf.post_summary}</p>
                </div>
                <div class="post-details">
                  <span>Tags: ${tags}</span>
                </div>
              </div>
                `;
  return post;
}

/*------ compressed post layout creator -------*/
export function createPostCompressed(data){

  let post = `<div class="post-container">
                  <div class="post-image-container">
                    <a href="post_specific.html?id=${data.id}">
                      <img src="${data.featured_image.size_large}" alt="${data._embedded['wp:featuredmedia'][0].alt_text}" class="post-image">
                      <h3>${data.title.rendered}</h3>
                    </a>
                  </div>
                  <div class="post-date">
                  <span>${data.acf.published}</span>
                    
                  </div>
                </div>
                `;
  return post;
}

/*------- Loader and error messages for API calls --------*/
export function addLoader(container){
  container.innerHTML = `<div class="loader">
                          <div class="outer-loader"></div>
                          <div class="inner-loader"></div>
                          <p>Getting products, please wait...</p>
                        </div>`;
}

// catch error message generator
export function createErrorMessage(container){
  container.innerHTML = `<div class="error message">
                          <p> An error occurred while fetching the data </p>
                          <p> Please try reloading the page, if this error persists please contact us using a query form </p>
                        </div>`;
}

/*------ sponsor content creator ------*/
export function createSponsoredContent(sponsorData, sponsorsContainer){
  sponsorsContainer.innerHTML="";
  let sponsorPost = "<p>No Sponsors, No Money!</p>";
  for(let i = 0; i < sponsorData.length; i++){
    sponsorPost = `<div class="sponsor-container">
                    <div>
                      <a href="${sponsorData[i].acf.sponsor_url}" target="_blank">
                        <img src="${sponsorData[i].acf.logo}" alt="${sponsorData[i].acf.name}'s logo" class="sponsor-logo-image" loading=lazy>
                      </a>
                    </div>
                    <div class="leo-sponsor-comment">
                      <p>${sponsorData[i].acf.our_quote}</p>
                      <img src="${sponsorData[i].acf.our_image}" alt="Leo giving his speech"/>
                    </div>
                  </div>`;
    sponsorsContainer.innerHTML += sponsorPost;
  }
}

/*-------- create comments --------*/
export function createComments(data, commentsContainer){
  commentsContainer.innerHTML ="";
  let countLeft = 1;
  let countRight = 1;
  for(let i = 0; i < data.length; i++){
    if((i+1)%2 !== 0){
      if(countRight%2 !== 0){
        commentsContainer.innerHTML +=`<div class="comment-right">
                                        <img src="/images/head_of_leo.png" alt="image of dog head" class="comment-img hidden-on-mobile" />
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        </div>`;
        countRight++;
      } else{ 
        commentsContainer.innerHTML += `<div class="comment-right">
                                      <img src="/images/head_of_dog_2.png" alt="image of dog head" class="comment-img hidden-on-mobile">
                                      <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                      </div>`;
        countRight++;
      }
    } else{
      if(countLeft%2 !== 0){
        commentsContainer.innerHTML +=`<div class="comment-left">
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        <img src="/images/head_of_beagle.png" alt="image of dog head" class="comment-img hidden-on-mobile" />
                                        </div>`;
        countLeft++;
      } else{ 
        commentsContainer.innerHTML += `<div class="comment-left">
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        <img src="/images/head_of_dog.png" alt="image of dog head" class="comment-img hidden-on-mobile" />
                                        </div>`;
        countLeft++;
      }
    }
  }
}

/*---------------------------------- image modal ----------------------------------*/

export function addImageModals(){
  const imageModalBackground = document.querySelector(".modal-background-container");
  const imageModalContent = document.querySelector(".image-modal-content");
  const imagesModals = document.querySelectorAll(".modal-image, .featured-image");
  
  imagesModals.forEach(function(image) {
    //assign event listener to all images
    image.addEventListener('click', function() {
      imageModalContent.innerHTML = `<img class="image-modal" src="${this.src}" alt="${this.alt}">
                                     <span class="image-modal-caption">${this.alt}</span>`;
      imageModalContent.classList.add("image-modal-content-expanded");
      imageModalBackground.style.display = "block";
    });  
  });

  //assign event listener to background for closing modal
  imageModalBackground.addEventListener("click", function(){
  imageModalContent.classList.remove("image-modal-content-expanded");
  imageModalContent.innerHTML =" ";
  imageModalBackground.style.display = "none";
  });
}

/*References;
  https://www.youtube.com/watch?v=4SQXOA8Z-lo
  https://dev.to/salehmubashar/create-an-image-modal-with-javascript-2lf3
  https://www.w3schools.com/howto/howto_css_modal_images.asp
*/

/*------------------------------ Form Validation ----------------------------------*/

//validates text inputs
export function validatedInputLength(input, length, errorContainer) {
  if (input.value.trim().length > length) {
    errorContainer.innerText = "";
    input.style.border ="3px solid green";
    return true;
  } else {
    input.style.border ="3px solid red";
    errorContainer.innerText = `Your ${input.name} must have a minimum of ${length + 1} characters.`;
    return false;
  }
}

//validate emails
export function validateEmailInput(email, errorContainer) {
  const emailRegEx = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  const validateEmail = emailRegEx.test(email.value);
  if (validateEmail){ 
    errorContainer.innerText = "";
    email.style.border ="3px solid green";
    return true;
  } else {
    errorContainer.innerText = `Please enter a valid email address`;
    email.style.border ="3px solid red";
    return false;
  }
}

export function resetBorders(input){
  input.style.border = "3px solid grey";
}

//Validators without error messaging
export function validateLength(input, length) {
  if (input.value.trim().length > length) {
    return true;
  } else {
    return false;
  }
}

export function validateEmail(email) {
  const emailRegEx = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  const validateEmail = emailRegEx.test(email.value);
  if (validateEmail){ 
    return true;
  } else {
    return false;
  }
}







