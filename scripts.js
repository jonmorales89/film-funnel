function youTube(movieObj){
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
    function searchYouTube(movie_Obj){
        $.ajax({
            dataType : 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: {
                q: movie_Obj.original_title,
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
    searchYouTube(movieObj)
}