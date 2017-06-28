/**
 * Created by Matt on 6/28/2017.
 */


function MovieList() {

    var movies;
    var movieIndex;
    var movie_api_key = "1c7597f95f188897693c3ccde9dc7a66";


    this.init = function() {
        console.log("Init MovieObj");
        $.ajax({
            url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + movie_api_key + '&language=en-US&page=1',
            dataType: 'json',
            jsonpCallback: 'testing',
            success: function(result){
                console.log("success: ", result);
                movies = result.results;
                displayMovies();
            },
            error: function(result){
                console.log("error");
            }
        });
    };

    function displayMovies(){
        for(var i=0; i < movies.length; i++){
            var image = $("<img>").attr("src", "https://image.tmdb.org/t/p/original" + movies[i].poster_path);
            //var img_link = $("<a>", {href: "review.html"}).append(image);
            // var img_container = $("<div>").append(img_link).appendTo(".container");
            var img_container = $("<div>").append(image).appendTo(".container");

            img_container.attr("index",i);
            img_container.click(function(){
                movieIndex = $(this).attr("index");
                loadPage();
            });
        }
    };

    function movieInfo() {
        console.log("MOVIEINFO");
    }

    function reddit() {
        // Get title from movie object and split it into an array
        var title = movies[movieIndex].original_title;
        console.log("movie: ", title);
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
        console.log("redditURL: ", redditURL);

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

    function youTube(){
        function displayYouTubeResults(videoArray){
            for(var i = 0; i < videoArray.length;i++){
                var ytIframe = $('<iframe>').attr({
                    src: 'https://www.youtube.com/embed/' + videoArray[i].id,
                    width: '560',
                    height: '315',
                    frameborder: '0',
                    allowfullscreen: null,
                });
                $('#youtube-container').append(ytIframe);
            }
        }
        function searchYouTube(movieObj){
            $.ajax({
                dataType : 'json',
                method: 'POST',
                url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
                data: {
                    q: movieObj.original_title,
                    maxResults: 3,
                    type: 'video',
                    detailLevel: 'low'
                },
                success : function(result){
                    console.log(result.video);
                    displayYouTubeResults(result.video);
                },
                error: function(err){
                    console.log(err);
                }
            })
        }
        searchYouTube(movies[movieIndex]);
    }

    function loadPage(){
        $.ajax({
            url: "review.html",
            success: function(data) {
                $("body").html(data);
                reddit();
                youTube();
                movieInfo();
            }
        });
    }

}