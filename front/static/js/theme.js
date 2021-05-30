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
        const authorID = theme.author
        const authorObject = await axios.get(`/api/username/${authorID}`)
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
        const time = await date(theme)
        const timeObject = document.querySelector("#time")
        timeObject.innerHTML = time
        addEventListeners()
        const up = document.querySelector("#upVote")
        up.innerHTML = theme.upvotes
    } catch (err) {
        console.log(err)
    }
}
async function date(theme) {
    try {
            const themeDate = new Date(theme.createdAt)
            let themeHour = themeDate.getHours()
            let themeMinute = themeDate.getMinutes()
            let themeTime = new Date()
            if (themeTime.getHours() == themeHour && themeTime.getMinutes() == themeMinute) {
                themeTime = "Now"
            } else {
                if (themeHour < 10) {
                    themeHour = "0" + themeHour
                }
                if (themeMinute < 10) {
                    themeMinute = "0" + themeMinute
                    }
                themeTime = themeHour + ":" + themeMinute
            }
        return themeTime
    } catch (err) {
        console.log(err)
    }
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

