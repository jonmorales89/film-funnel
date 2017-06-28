
// var popular_movies = [];
// popular movies list
var api_key = "1c7597f95f188897693c3ccde9dc7a66";
$(document).ready(function(){
    $.ajax({
        url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + api_key + '&language=en-US&page=1',
        dataType: 'json',
        jsonpCallback: 'testing',
        success: function(result){
            console.log("success: ", result);
            var popular_movies = result.results;
            displayMovies(popular_movies);
        },
        error: function(result){
         console.log("error");
        }
    });
});



function displayMovies(popular_movies){
    console.log(popular_movies.length);
    for(var i=0; i < popular_movies.length; i++){

        var image = $("<img>").attr("src", "https://image.tmdb.org/t/p/original" + popular_movies[i].poster_path);
        var img_link = $("<a>", {href: "review.html"}).append(image);
        var img_container = $("<div>").append(img_link).appendTo(".container");
        img_container.click(function(){
            //have access to popular_movies[i]
            movieInfo(popular_movies[i]);
        });
    }
};

function movieInfo(movieObj){
    //  var api_key = "1c7597f95f188897693c3ccde9dc7a66";
//     $(document).ready(function(){
    console.log("inside movieinfo function");
      $.ajax({
          url: 'https://api.themoviedb.org/3/movie/297762?api_key=' + api_key + '&language=en-US',
          method: "get",
          async: true,
          headers: {},
          data: {},
          crossDomain: true,
          success: function(result){
              console.log("success: ", result);
          },
          error: function(result){
              console.log("error: ", result);
          }
      });
//     });
}


function reddit(movie) {

    // Get title from movie object and split it into an array
    var title = movie.original_title;
    var titleArray = title.split(" ");

    // Declare some variables
    var redditURL = "https://www.reddit.com/r/movies/search.json?q=";
    var URLcap = "&restrict_sr=on";

    // Create reddit URL
    for (var i = 0; i < titleArray.length; i++) {
        redditURL += titleArray[i] + "+";
    }
    redditURL += "discussion";
    redditURL += URLcap;
    console.log(redditURL);

    // Ajax call to search reddit.com/r/movies for the movie discussion page
    $.ajax({
        url: redditURL,
        dataType: 'json',
        method: 'GET',
        success: function(result) {
            console.log("Successfully connected to reddit");
            getDiscussion(result);
        },
        error: function(result) {
            console.log("ERROR");
            console.log(result);
        }
    });

    function getDiscussion(data) {
        // Get URL from top post on page
        var url = data.data.children[0].data.url;

        // Add .json to use the API
        var newURL = url + ".json";

        // Ajax call to get the discussion page json
        $.ajax({
            url: newURL,
            dataType: 'json',
            method: 'GET',
            success: function(result) {
                console.log("Successfully connected to reddit");
                getComments(result);
            },
            error: function(result) {
                console.log("ERROR");
                console.log(result);
            }
        })
    }

    function getComments(data){

        // Loop to get all the comments out of the data
        var comments = [];
        for(var i = 0; i < data[1].data.children.length; i++) {
            var comment = data[1].data.children[i].data.body;
            comments.push(comment);
        }
        displayComments(comments);
    }

    function displayComments(comments) {
        for(var i = 0; i < comments.length; i++) {
            var commentDiv = $("<div>").addClass("comment").text(comments[i]);
            $("#reddit-container").append(commentDiv);
        }
    }
}
