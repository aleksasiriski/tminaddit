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
        const logInOut = document.querySelector("#logInOut")
        const navbar = document.querySelector("#navbar")
        if (authenticated.data.success) {
            logInOut.innerHTML = "Logout"
            navbar.innerHTML = ""
            navbar.innerHTML += `<a href="/chats"><button class="transparent-btn card-link nav-button"><i class="fa fa-comments fa-2x"></i></button></a>`
            navbar.innerHTML += `<a href="/profile"><button class="transparent-btn card-link nav-button" ><i  class="fa fa-user fa-2x"></i></button></a>`
        } else {
            logInOut.innerHTML = "Login"
            navbar.innerHTML = ""
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
        commentsHTML.innerHTML = await addComments(theme.comments)
        addEventListeners()
    } catch (err) {
        console.log(err)
    }
}
async function addComments(comments) {
    try {
        let cards = ""
        for (const commentID of comments) {
            const commentBody = await axios.get(`/api/comments/${commentID}`)
            const comment = commentBody.data.comment
            let commentAuthor = "[deleted]"
            if (comment.author != "[deleted]") {
                const commentAuthorObject = await axios.get(`/api/username/${comment.author}`)
                commentAuthor = commentAuthorObject.data.username + ":"
            }
            const commentTime = date(comment.createdAt)
            cards += `
            <ul class="comments">
            <li class="clearfix">
              <img src="img/user.png" class="avatar" alt="">
              <div comment-id="${comment._id}" class="post-comments">
                <p class="meta"><div id="time" class="text-muted h7 mb-2">${commentTime}<i class="fa fa-clock-o"></i></div> ${commentAuthor} <i class="pull-right"></i></p>
                <p>${comment.content}</p>
                <button id="btn-reply-form" class="btn reply-btn"><small>Reply</small></button>
                <button id="btn-delete" class="btn reply-btn"><small>Delete</small></button>
                <button id="btn-save" class="btn reply-btn"><small>Save</small></button>
              </div>
              <div comment-id="${comment._id}" id="reply-${comment._id}" hidden>
                <div class="form-group">
                  <label for="content-${comment._id}">Your comment</label>
                  <textarea id="content-${comment._id}" name="content-${comment._id}" class="form-control" rows="3"></textarea>
                </div>
                <button id="btn-reply" class="btn btn-primary"><i class="fa fa-paper-plane"></i>Send</button>
              </div>`
            cards += await addComments(comment.children)
            cards += `</li></ul>`
        }
        return cards
    } catch (err) {
        console.log(err)
    }
}
function replyForm(btn) {
    const commentId = getParentId(btn)
    const reply = document.querySelector(`#reply-${commentId}`)
    if (reply.hasAttribute("hidden")) {
        reply.removeAttribute("hidden")
    }
    else {
        const att = document.createAttribute("hidden")
        att.value = ""
        reply.setAttributeNode(att)
    }
  }
  async function deleteComment(btn) {
    try {
        const commentId = getParentId(btn)
        const response = await axios.delete(`/api/comments/${commentId}`)
        if (response.data.reload) {
            loadPage()
        }
    } catch (err) {
        console.log(err)
    }
}

async function replyComment(btn) {
    try {
        const commentId = getParentId(btn)
        const content = document.querySelector(`#content-${commentId}`)
        if (content.value != "") {
            const body = {
                theme: urlId,
                parent: commentId,
                content: content.value
            }
            await axios.post("/api/comments", body)
            content.value = ""
            loadPage()
        }
    } catch (err) {
        console.log(err)
    }
}
async function saveComment(btn) {
    const commentId = getParentId(btn)
    await axios.put(`/api/user/saved/comments/${commentId}`)
}
async function saveTheme() {
    await axios.put(`/api/user/saved/themes/${urlId}`)
}
function getParentId(btn) {
    const parent = btn.parentElement
    const parentId = parent.getAttribute("comment-id")
    return parentId
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
    const themeCommentBtn = document.querySelector("#theme-send")
    themeCommentBtn.addEventListener("click", () => {
        sendComment()
    })
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
    const deleteBtns = [...document.querySelectorAll("#btn-delete")]
    deleteBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            deleteComment(btn)
        })
    )
    const replyBtns = [...document.querySelectorAll("#btn-reply")]
    replyBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            replyComment(btn)
        })
    )
    const replyFormBtns = [...document.querySelectorAll("#btn-reply-form")]
    replyFormBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            replyForm(btn)
        })
    )
    const saveBtns = [...document.querySelectorAll("#btn-save")]
    saveBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            saveComment(btn)
        })
    )
    const saveThemeBtn = document.querySelector("#saveButton")
    saveThemeBtn.addEventListener("click", () => {
        saveTheme()
    })
}
async function sendComment() {
    try {
        const content = document.querySelector("#theme-comment")
        if (content.value != "") {
            const body = {
                theme: urlId,
                parent: urlId,
                content: content.value
            }
            await axios.post("/api/comments", body)
            content.value = ""
            loadPage()
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
const deleteButton = document.querySelector("#deleteButton")
deleteButton.addEventListener("click", deleteTheme())

async function deleteTheme() {
    try {
        const response = await axios.delete(`/api/themes/${urlId}`)
        if (response.data.reload) {
            window.location.href = "/"
        }
    } catch (err) {
        console.log(err)
    }
}