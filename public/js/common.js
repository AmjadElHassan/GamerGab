// const session = require("express-session")

$("#postTextarea, #replyTextarea").keyup((event) => {
    let textBox = $(event.target)
    let value = textBox.val().trim()

    let isModal = textBox.parents(".modal").length == 1
    let submitButton = isModal ? $("#submitReply") : $("#submitPostButton")

    if (submitButton.length === 0) {
        return alert("no submit button found")
    }

    if (value == "") {
        submitButton.prop("disabled", true);
        return
    }

    submitButton.prop("disabled", false)
})

$("#submitPostButton, #submitReply").click(async() => {
    let button = $(event.target)
    let textbox = $("#postTextarea")

    let isModal = button.parents(".modal").length == 1
    let textButton = isModal ? $("#replyTextarea") : $("#postTextarea")
    textbox = $("#postTextarea").val().trim()



    let data = {
        content: textbox
    }

    if (isModal){
        let originalPost = await button.data().id;
        data.replyTo = originalPost
    }

    $.post("/api/posts", data, async (postData, status, xhr) => {
        let html = await createPostHtml(postData)
        $(".postsContainer").prepend(html)
        $("#postTextarea").val("")
        button.prop("disabled", true)
    })

})

$(document).on("click", ".likeButton", (event) => {
    let button = $(event.target);
    let postId = getPostId(button)
    if (!postId) {
        alert('Error')
        return console.log("postId issue")
    }
    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (post) => {
            let length = post.likes.length
            button.find("span").text(length || "")
            if (post.likes.includes(userLoggedIn._id)) {
                button.addClass("active")
            } else {
                button.removeClass("active")
            }

        }
    })
})

$(document).on("click", ".retweetButton", (event) => {
    let button = $(event.target)
    let postId = getPostId(button)
    if (!postId) {
        alert('Error')
        return console.log("postId issue")
    }
    $.ajax({
        url: `/api/posts/${postId}/retweets`,
        type: "POST",
        success: (postData) => {
            console.log(postData)
            button.find("span").text(postData.retweetUsers.length || "")
            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active")
            } else {
                button.removeClass("active")
            }
        }
    })

})


$("#replyModal").on("show.bs.modal", async (event) => {
    let button = $(event.relatedTarget)
    let postId = getPostId(button)
    $(submitReply).data("id", postId)

    $.get(`/api/posts/${postId}`, (results) => {
        outputPosts(results, $("#originalPostContainer"))
        console.log('okay')

    })
})

$("#replyModal").on("hidden.bs.modal", async (event) => {
    $("#originalPostContainer").html("")
})



function getPostId(target) {
    let isRoot = target.hasClass("post");
    let rootElement = isRoot ? target : target.closest(".post")
    let postId = rootElement.data().id
    if (!postId) {
        return false
    }
    return postId
}

function createPostHtml(postData) {

    if (!postData) return alert("post object is null")

    let isRetweet = (postData.retweetData ? true : false)
    retweetedBy = isRetweet ? postData.postedBy.username : null;

    postData = isRetweet ? postData.retweetData : postData

    console.log(isRetweet)
    if (!postData.postedBy._id) {//in the case that the postedby is just an object id
        return console.log('User object not populated')
    }

    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : ""
    let retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""


    //pulling information from server of current user logged in

    let postContent = postData.content
    let user = postData.postedBy
    let userRealName = user.firstName + ` ${user.lastName}`
    let timestamp = timeDifference(new Date(), new Date(postData.createdAt))

    let retweetText = "";
    if (isRetweet) {
        retweetText = `<span>
        <i class="fas fa-retweet"></i>
        Retweeted by <a href="/profile/${retweetedBy}">
        ${retweetedBy}
        </a>
        </span>`
    }

    return `<div class="post" data-id="${postData._id}">
                <div class="postActionContainer">
                    ${retweetText}
                </div>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src="${user.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a class="displayName" href="/profile/${user.username}">
                                ${userRealName}
                            </a>
                            <span class="username">@${user.username}</span>
                            <span class="date">${timestamp}</span>
                        </div>
                        <div class="postBody">
                            <span>${postContent || postData.retweetData}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button class="replyButton" data-toggle="modal" data-target="#replyModal">
                                    <i class="far fa-comment-alt"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweetButton ${retweetButtonActiveClass}">
                                    <i class="fas fa-retweet"></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class="postButtonContainer red">
                                <button class="likeButton ${likeButtonActiveClass}">
                                    <i class="far fa-heart"></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
    </div>`
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Right now"
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

function outputPosts(posts, container){
    container.html("")
    if (!posts){
        return container.append("<span class='no results'>No Results Found</span>")
    }

    if (!Array.isArray(posts)){
        posts = [posts]
    }
    posts.forEach(post=>{
        let html = createPostHtml(post)
        container.append(html)
    })
}