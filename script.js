
var popular_movies = [];
// popular movies list
var api_key = "1c7597f95f188897693c3ccde9dc7a66";
$(document).ready(function(){
    $.ajax({
        url: 'https://api.themoviedb.org/3/movie/popular?api_key=' + api_key + '&language=en-US&page=1',
        dataType: 'json',
        jsonpCallback: 'testing',
        success: function(result){
            console.log("success: ", result);
            popular_movies = result.results;
            displayMovies();
        },
        error: function(result){
         console.log("error");
        }
    });
});



function displayMovies(){
    console.log(popular_movies.length);
    for(var i=0; i < popular_movies.length; i++){

        var image = $("<img>").attr("src", "https://image.tmdb.org/t/p/original" + popular_movies[i].poster_path);
        // var img_link =
        var img_container = $("<div>").append(image).appendTo(".container");
        img_container.click(function(){


        });
    }
}
