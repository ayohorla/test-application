var portfolioPostsBtn = document.getElementById("portfolio-posts-button");
var portfolioPostsContainer = document.getElementById("portfolio-container-posts");

if(portfolioPostsBtn){
    portfolioPostsBtn.addEventListener("click", function(){
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'http://unimall.onlinewebshop.net/wp-json/wp/v2/posts?categories=10');
    ourRequest.onload = function(){
        if (ourRequest.status>=200 && ourRequest.status < 400){
            var data = JSON.parse(ourRequest.responseText);
            createHTML(data);
        } else {
            console.log("We Connected to the server, but it returned an error.");
        }
    }
    ourRequest.onerror = function(){
        console.log("Connection error"); 
    };
    ourRequest.send();
    });
}

function createHTML(postsData){
    var ourHTMLString = '';
    for(i=0; i < postsData.length; i++){
      ourHTMLString +='<h5>' + postsData[i].date + '<h5>' + postsData[i].title.rendered + '<h5>';
      ourHTMLString += postsData[i].content.rendered;  
    }
    portfolioPostsContainer.innerHTML += ourHTMLString;
    $('#portfolio-container-posts').append("<section class='posts'><h5>Date: " + date +"</h5><p>" + excerpt + "</p></section>");
}