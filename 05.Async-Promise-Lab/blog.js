$(function attachEvents(){
    const kinveyAppId="kid_B1cBm1GPW";
    const baseURL="https://baas.kinvey.com/appdata/"+kinveyAppId;
    const kinveyUser="peter";
    const kinveyPass="p";
    const base64auth=btoa(kinveyUser+":"+kinveyPass);
    const autHeader={ "Authorization": "Basic " + base64auth };


    $('#btnLoadPosts').click(loadPostClick);
    $('#btnViewPost').click(viewPostClick);
    
    function viewPostClick() {
        let selectedPostId=$('#posts').val();
        if(!selectedPostId)return;
        let reqPost=$.ajax({
            url:baseURL + "/posts/"+selectedPostId,
            headers:autHeader,
        });
        let reqComments=$.ajax({
            url:baseURL+`/comments/?query={"post_id":"${selectedPostId}"}`,
            headers:autHeader,
        });
        Promise.all([reqPost,reqComments])
            .then(displayPostWithComments)
            .catch(displayErrors);
    }
    function displayPostWithComments([post,comments]) {
        $('#post-title').text(post.title);
        $('#post-body').text(post.body);
        $('#post-comments').empty();
        for(let comment of comments){
            let commentItem=$('<li>').text(comment.text);
            $('#post-comments').append(commentItem);
        }
    }
    function loadPostClick() {
        let req={
            url:baseURL + "/posts",
            headers: autHeader,
        };
        $.ajax(req)
            .then(displayPosts)
            .catch(displayErrors)
    }
    function displayPosts(posts) {
        $('#posts').empty();
        for(let post of posts){
            let option=$('<option>').text(post.title).val(post._id);
            $('#posts').append(option);
        }
    }
    function displayErrors(err) {
        let errorDiv = $('<div>').text("Error: " + err.status + ' (' + err.statusText + ')');
        $(document.body).prepend(errorDiv);
        setTimeout(function () {
            $(errorDiv).fadeOut(function () {
                errorDiv.remove();
            });
        }, 3000);
    }

})