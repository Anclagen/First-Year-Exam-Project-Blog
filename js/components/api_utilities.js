// API constants
export const baseUrl = "https://fluffypiranha.one/exam_project_1/wp-json/wp/v2";

// routes 
export const routes = {
  page: "/pages",
  posts: "/posts",
  blogPosts: "/blog_posts",
  sponsors: "/sponsor",
  media: "/media",
  tags: "/tags",
  categories: "/categories",
};

// parameters
export const parameters = {
  acf: "acf_format=standard",
  results20: "per_page=20",
  results50: "per_page=50",
  results100: "per_page=100",
  search: "search=", //add search terms
  embed: "_embed", 
};

// reused urls
export const blogPostUrl = baseUrl + "/blog_posts?_embed&acf_format=standard&per_page=50";
export const latestPostsUrl = baseUrl + "/blog_posts?_embed&acf_format=standard&per_page=100";
export const sponsorUrl = baseUrl + "/sponsor?_embed&acf_format=standard&per_page=50";
export const categoriesUrl = baseUrl + "/categories?_embed&acf_format=standard&per_page=50";
export const sortOldestUrl = baseUrl + "/blog_posts?_embed&filter[orderby]=date&order=asc&acf_format=standard&per_page=50";
export const searchBlogPostsUrl = baseUrl + "/search?_embed&acf_format=standard&per_page=50&type=post&subtype=blog_posts&search=";

/*---------- Fetch --------------*/

// callAPI (url) and return data
export async function callAPI (url){
  const response = await fetch(url);
  const data = await response.json();
 return data;
}

//callApi and returns data, page, and number of posts
export async function callApiGetPages (url){
  const response = await fetch(url);
  const data = await response.json();
  //might be needed for blog posts in the long run
  const pages = response.headers.get("X-WP-TotalPages");
  const numberPosts = response.headers.get("X-WP-Total");
  return [data, pages, numberPosts];
}

/*---------- Posts --------------*/
//Word Press Rest API App Keys: https://www.youtube.com/watch?v=e_thybKPKHc
// Subscriber key can only post comments.
export const subscriberUsername = "Anonymous";
export const commentKey = "Eukx 4nvk mFvr Leod G1ld afv1";

//posts comment
export async function postComment(data, formReportingContainer){
  try{
    const response = await fetch("https://fluffypiranha.one/exam_project_1/wp-json/wp/v2/comments", 
          {method: "POST",
          headers:{"Content-Type": "application/json",
                     "Authorization": "Basic " + btoa("Anonymous" + ":" + "Eukx 4nvk mFvr Leod G1ld afv1")},
                     body: data});
    console.log(response.json);
    formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`;
  } catch(error){
    console.log(error);
    formReportingContainer.innerHTML = `<p class="error">An error occurred when posting your message</p>`;
  }
}