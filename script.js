
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



// "async": true,
//     "crossDomain": true,
//     "url": "https://api.themoviedb.org/3/movie/297762?language=en-US&api_key=1c7597f95f188897693c3ccde9dc7a66",
//     "method": "GET",
//     "headers": {},
// "data": "{}"
// // Object {readyState: 0, getResponseHeader: function, getAllResponseHeaders: function, setRequestHeader: function, overrideMimeType: function…}