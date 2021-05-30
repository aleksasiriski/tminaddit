const urlId = getUrlId()

function getUrlId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    if (id == null) {
        window.location.href = "/theme"
    }
    return id
}
loadPage()
async function loadPage() {
    try {
        const authenticated = await axios.get("/api/authenticated")
        if (authenticated.data.success) {
            const logInOut = document.querySelector("#logInOut")
            logInOut.innerHTML = "Logout"
            const navbar = document.querySelector("#navbar")
            navbar.innerHTML = `<a href="/chats"><button class="btn btn-primary">Chats</button></a>`
        }
        const themeBody = await axios.get(`/api/themes/${urlId}`)
        const theme = themeBody.data.theme
        const authorObject = await axios.get(`/api/username/${theme.author}`)
        const userName = document.querySelector("#userName")
        userName.innerHTML = authorObject.data.username
        const sub = document.querySelector("#sub")
        const subID = theme.sub
        const subObject = await axios.get(`/api/subs/${subID}/name`)
        const subName = subObject.data.name
        sub.innerHTML = `<a id = "subName" href="/sub?id=${subID}"><div class="h7 text-muted">${subName}</div></a>`
        const text = document.querySelector("#text")
        text.innerHTML = theme.content
        const title = document.querySelector("#title")
        title.innerHTML = theme.title
        const time = date(theme.createdAt)
        const timeObject = document.querySelector("#time")
        timeObject.innerHTML = time
        const up = document.querySelector("#upVote")
        up.innerHTML = theme.upvotes
        const commentNumber = document.querySelector("#comment-number")
        commentNumber.innerHTML = "Number of comments: " + theme.commentNumber
        const commentsHTML = document.querySelector("#comments")
        await addComments(commentsHTML, theme.comments)
        addEventListeners()
    } catch (err) {
        console.log(err)
    }
}
async function addComments(commentsHTML, comments) {
    try {
        for (const commentID of comments) {
            const commentBody = await axios.get(`/api/comments/${commentID}`)
            const comment = commentBody.data.comment
            const commentAuthorObject = await axios.get(`/api/username/${comment.author}`)
            const commentAuthor = commentAuthorObject.data.username
            const commentTime = date(comment.createdAt)
            commentsHTML.innerHTML += `
            <ul class="comments">
            <li class="clearfix">
              <img src="img/user.png" class="avatar" alt="">
              <div class="post-comments">
                <p class="meta"><div id="time" class="text-muted h7 mb-2">${commentTime}<i class="fa fa-clock-o"></i></div> ${commentAuthor}: <i class="pull-right"><button
                      class="btn reply-btn" onclick="reply()"><small>Reply</small></button></i></p>
                <p>${comment.content}</p>
              </div>
              <div comment-id="${comment._id}" hidden>
                <div class="form-group">
                  <label for="comment-${comment._id}">Your comment</label>
                  <textarea name="comment-${comment._id}" class="form-control" rows="3"></textarea>
                </div>
                <button id="send-${comment._id}" type="submit" class="btn btn-primary"><i class="fa fa-paper-plane"></i>Send</button>
              </div>`
            await addComments(commentsHTML, comment.children)
            commentsHTML.innerHTML += `</li></ul>`
        }
    } catch (err) {
        console.log(err)
    }
}
function date(objectCreatedAt) {
    const objectDate = new Date(objectCreatedAt)
    let objectHour = objectDate.getHours()
    let objectMinute = objectDate.getMinutes()
    let objectTime = new Date()
    if (objectTime.getHours() == objectHour && objectTime.getMinutes() == objectMinute) {
        objectTime = "Now"
    } else {
        if (objectHour < 10) {
            objectHour = "0" + objectHour
        }
        if (objectMinute < 10) {
            objectMinute = "0" + objectMinute
        }
        objectTime = objectHour + ":" + objectMinute
    }
    return objectTime
}
function addEventListeners() {

    const upvoteBtns = [...document.querySelectorAll("#upButton")]
    upvoteBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            voteOnTheme(btn, "upvote")
        })
    )
    const downvoteBtns = [...document.querySelectorAll("#downButton")]
    downvoteBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            voteOnTheme(btn, "downvote")
        })
    )
    const themeCommentBtn = document.querySelector("#theme-send")
    themeCommentBtn.addEventListener("click", () => {
        sendComment()
    })
}
async function sendComment() {
    try {
        const content = document.querySelector("#theme-comment")
        if (content != "") {
            const body = {
                theme: urlId,
                parent: urlId,
                content: content.value
            }
            await axios.post("/api/comments", body)
            content.value = ""
        }
    } catch (err) {
        console.log(err)
    }
}
async function voteOnTheme(btn, vote) {
    let response = false
    if (vote == "upvote") {
        const responseBody = await axios.put(`/api/themes/${urlId}/upvote`)
        response = responseBody.data.reload
    } else {
        const responseBody = await axios.put(`/api/themes/${urlId}/downvote`)
        response = responseBody.data.reload
    }
    if (response) {
        loadPage()
    }
}

