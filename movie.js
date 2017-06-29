/**
 * Created by Matt on 6/28/2017.
 */


function MovieList() {

    //  Variables
    var movies;
    var movieIndex;
    var movie_api_key = "1c7597f95f188897693c3ccde9dc7a66";

    /* -------------------------------Initialize Page Function ------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    this.init = function() {
        console.log("Init MovieObj");

        // Get movies
        // var movie_api_key = "1c7597f95f188897693c3ccde9dc7a66";
        $.ajax({
            url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + movie_api_key + '&language=en-US&page=1',
            dataType: 'json',
            // jsonpCallback: 'testing',
            success: function(result){
                console.log("success: ", result);
                movies = result.results;
                loadMainPage();
            },
            error: function(result){
                console.log("error");
            }
        });
    };

    /* -------------------------------Display Movies Function -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function displayMovies(){
        for(var i=0; i < movies.length; i++){
            var image = $("<img>").attr("src", "https://image.tmdb.org/t/p/original" + movies[i].poster_path);
            var img_container = $("<div>").append(image).appendTo(".container");
            img_container.attr("index",i);
            img_container.click(function(){
                movieIndex = $(this).attr("index");
                loadReviewPage();
            });
        }
    };


    /* -------------------------------Movie Info Function ------------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------- */
    function movieInfo() {
        $.ajax({
           url:"https://api.themoviedb.org/3/movie/" + movies[movieIndex].id + " /credits?api_key=" + movie_api_key,
            success: function(result){
               console.log(result);
               $(".cast-div > span").html(result.cast[0].name + ", " + result.cast[1].name + ", " + result.cast[2].name + ", " + result.cast[3].name);
               for(var i=0; i<result.crew.length; i++){
                   if(result.crew[i].job === "Director"){
                       $(".director-div > span").html(result.crew[i].name);
                   }
               }
            }
        });

        $(".movie-title").html(movies[movieIndex].title);
        $(".description-div > span").html(movies[movieIndex].overview);
        $(".contain-img").css("background-image","url(https://image.tmdb.org/t/p/original" + movies[movieIndex].poster_path+ ")");
        // $("<img>").attr("src", "https://image.tmdb.org/t/p/original" + movies[movieIndex].poster_path).appendTo(".contain-img");
        $(".rating-div > span").html(movies[movieIndex].vote_average + "/10");
        // (".contain-img")
    };


    /* ------------------------------ RottenTomatoes Function -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
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
            var sort = "?sort=confidence";
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
            count = 0;
            for(var i = 0; i < comments.length; i++) {
                if(count > 9) {break;}
                if(comments[i].length < 400 || comments[i].length > 1000) {continue;}
                count++;
                var commentDiv = $("<div>").addClass("comment").text(comments[i]);
                $("#reddit-container").append(commentDiv);
            }
            var rTitle = $('<p>').text("Top Reddit Comments");
            $("#reddit-container").prepend(rTitle);
        }
    }



    /* -------------------------------- YouTube Function ------------------------------------------------  */
    /* --------------------------------------------------------------------------------------------------- */
    function youTube(){
        function displayYouTubeResults(videoArray){
            for(var i = 0; i < videoArray.length;i++){
                var ytIframe = $('<iframe>').attr({
                    src: 'https://www.youtube.com/embed/' + videoArray[i].id,
                    frameborder: '0',
                    allowfullscreen: ''
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
                    q: movieObj.title + 'movie review',
                    maxResults: 3,
                    type: 'video',
                    detailLevel: 'low'
                },
                success : function(result){
                    //console.log(result.video);
                    displayYouTubeResults(result.video);
                    var ytTitle =  $('<p>').text('Top YouTube Reviews of ' + movieObj.title);
                    $('#youtube-container').prepend(ytTitle);
                },
                error: function(err){
                    console.log(err);
                }
            })
        }
        searchYouTube(movies[movieIndex]);
    }


    /* ----------------------------------------Load Review Page Function---------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function loadReviewPage(){

        // Add click listener to title
        $("header").click(loadMainPage);

        $.ajax({
            url: "review.html",
            success: function(data) {
                $("#main-content").html(data);
                reddit();
                youTube();
                movieInfo();
            }
        });
    }

    /* ----------------------------------------Load Main Page Function---------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function loadMainPage() {

        // Remove click listener from title
        $("header").off();

        $.ajax({
            url: "main.html",
            success: function(data) {
                $("#main-content").html(data);
                displayMovies();
            }
        })
    }
}