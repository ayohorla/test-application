var portfolioPostsBtn = document.getElementById("portfolio-posts-btn");
var portfolioPostContainer = document.getElementById("portfolio-posts-container");

if(portfolioPostsBtn){
    portfolioPostsBtn.addEventListener("click", function(){
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'http://unimall.onlinewebshop.net/wp-json/wp/v2/posts?categories=12');
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
    portfolioPostContainer.innerHTML = ourHTMLString;
    $('#portfolio-posts-container').append("<section class='posts'><h5>Date: " + date +"</h5><p>" + excerpt + "</p></section>");
}