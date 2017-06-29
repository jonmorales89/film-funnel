/**
 * Created by Matt on 6/28/2017.
 */


function MovieList() {

    //  Variables
    var movies;
    var movieIndex;
    var movie_api_key = "1c7597f95f188897693c3ccde9dc7a66";
    var test = "test";
    var self = this;
    var genres = [{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 16, "name": "Animation"}, {"id": 35, "name": "Comedy"}, {"id": 80, "name": "Crime"}, {"id": 99, "name": "Documentary"}, {"id": 18, "name": "Drama"}, {"id": 10751, "name": "Family"}, {"id": 14, "name": "Fantasy"}, {"id": 36, "name": "History"}, {"id": 27, "name": "Horror"}, {"id": 10402, "name": "Music"}, {"id": 9648, "name": "Mystery"}, {"id": 10749, "name": "Romance"}, {"id": 878, "name": "Science Fiction"}, {"id": 53, "name": "Thriller"}, {"id": 10752, "name": "War"}, {"id": 37, "name": "Western"}]

    /* -------------------------------Initialize Page Function ------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    this.init = function() {
        // Get movies
        this.getNewMovieList('popular');

        for(var i = 0; i < genres.length; i++) {
            var option = $("<option>").attr("value", genres[i].id).text(genres[i].name);
            $("#genre-menu").append(option);
        }
    };


    /* -------------------------------Get New Movies Function -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    this.getNewMovieList = function(type, inputData){
        var url;
        switch(type) {
            case "popular":
                url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + movie_api_key + '&language=en-US&page=1';
                $("#movie-list-title").text("In Theaters Now");
                break;
            case "search":
                url = "https://api.themoviedb.org/3/search/movie?api_key=" + movie_api_key + "&language=en-US&query=" + inputData + "&page=1&include_adult=false";
                $("#movie-list-title").text("Showing results for : " + inputData);

                break;
            case "genre":
                url = "https://api.themoviedb.org/3/genre/" + inputData + "/movies?api_key=1c7597f95f188897693c3ccde9dc7a66&language=en-US&include_adult=false&sort_by=created_at.asc";
                for(var i = 0; i < genres.length; i++) {
                    if(genres[i].id == inputData) {
                        var genreName = genres[i].name;
                    }
                }
                $("#movie-list-title").text(genreName);
                break;
        }
        console.log(url);

        $.ajax({
            url: url,
            dataType: 'json',
            success: function(result) {
                movies = result.results;
                loadMainPage();
            },
            error: function(err) {
                console.log(err);
            }
        })
    };


    /* -------------------------------Display Movies Function -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function displayMovies(){
        for(var i=0; i < movies.length; i++){
            var image = $("<img>").addClass("fade").attr("src", "https://image.tmdb.org/t/p/original" + movies[i].poster_path);
            var modal = $("<div>").addClass("movie_modal hidden_div");
            var modal_title = $("<div>").html(movies[i].title).appendTo(modal);
            var modal_description = $("<div>").addClass("modal_description").html(movies[i].overview).appendTo(modal);
            if(movies[i].overview.length > 500) {
                modal_description.css("color", "red");
            }
            var img_container = $("<div>").addClass("contain-poster").css("position","relative").append(modal, image).appendTo(".container");
            img_container.attr("index",i);
            img_container.click(function(){
                movieIndex = $(this).attr("index");
                loadReviewPage();
            });
            image.mouseenter(function(){
                // console.log(this);
                // $(this).addClass("overlay");
                $(this).parent(".contain-poster").children(".movie_modal").removeClass("hidden_div");
            });
            image.mouseleave(function(){
                // console.log(this);
                // $(this).removeClass("overlay");
                $(this).parent(".contain-poster").children(".movie_modal").addClass("hidden_div");
            });        }
    };


    /* -------------------------------Movie Info Function ------------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------- */
    function movieInfo() {
        $.ajax({
           url:"https://api.themoviedb.org/3/movie/" + movies[movieIndex].id + " /credits?api_key=" + movie_api_key,
            success: function(result){
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


    /* ------------------------------ Reddit Function ---------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function reddit() {
        // Get title from movie object and split it into an array
        var title = movies[movieIndex].original_title;
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

        // Ajax call to search reddit.com/r/movies for the movie discussion page
        $.ajax({
            url: redditURL,
            dataType: 'json',
            method: 'GET',
            success: function(result) {
                getDiscussion(result);
            },
            error: function() {
                failSafe();
                return;
            }
        });

        function getDiscussion(data) {
            // Get URL from top post on page
            try {
                var url = data.data.children[0].data.url;
                for(var i = 0; i < data.data.children.length; i++){
                    var postTitle = data.data.children[i].data.title.toLowerCase();
                    if(postTitle.includes(title.toLowerCase())) {
                        url = data.data.children[i].data.url;
                        break;
                    }
                }
            } catch(err){
                failSafe();
                return;
            }
            console.log(url);
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
                    failSafe();
                    return;
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
        }

        function failSafe() {
            console.log("failsafe");
            var fail = $("<div>").addClass("fail").text("Reddit has nothing to say about this movie");
            $("#reddit-container").append(fail);
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
                $('.iframeWrapper').append(ytIframe);
            }
        }
        function searchYouTube(movieObj){
            $.ajax({
                dataType : 'json',
                method: 'POST',
                url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
                data: {
                    q: movieObj.title + 'movie review',
                    maxResults: 10,
                    type: 'video',
                    detailLevel: 'low'
                },
                success : function(result){
                    //console.log(result.video);d
                    displayYouTubeResults(result.video);
                    var ytTitle =  $('<p>').text('Top YouTube Reviews of ' + movieObj.title);
                    $('.ytTitle').append(ytTitle);
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
        // $("header").off();

        $.ajax({
            url: "main.html",
            success: function(data) {
                $("#main-content").html(data);
                displayMovies();
            }
        })
    }
}

