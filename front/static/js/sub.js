
const urlId = getUrlId()

function getUrlId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    if (id == null) {
        window.location.href = "/subs"
    }
    return id
}
loadPage()

async function loadPage() {
    try {
        const authenticated = await axios.get("/api/authenticated")
        const logInOut = document.querySelector("#logInOut")
        const navbar = document.querySelector("#navbar")
        const followButton = document.querySelector("#btn-follow")
        if (authenticated.data.success) {
            logInOut.innerHTML = "Logout"
            navbar.innerHTML = ""
            navbar.innerHTML += `<a href="/chats"><button class="transparent-btn card-link nav-button"><i class="fa fa-comments fa-2x"></i></button></a>`
            navbar.innerHTML += `<a href="/profile"><button class="transparent-btn card-link nav-button" ><i  class="fa fa-user fa-2x"></i></button></a>`
            followButton.removeAttribute("hidden")
        } else {
            logInOut.innerHTML = "Login"
            navbar.innerHTML = ""
            const att = document.createAttribute("hidden")
            att.value = "";
            followButton.setAttributeNode(att)
        }
        const sub = await axios.get(`/api/subs/${urlId}/themes`)
        const subName = document.querySelector("#subName")
        subName.innerHTML = sub.data.name
        const subNameh4 = document.querySelector("#subName-h4")
        subNameh4.innerHTML = "t/" + sub.data.name
        const subDescription = document.querySelector("#subDescription")
        subDescription.innerHTML = sub.data.description
        await renderCards(sub.data.themes)
        addEventListeners()
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    const upvoteBtns = [...document.querySelectorAll("#upvote-button")]
    upvoteBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            voteOnTheme(btn, "upvote")
        })
    )
    const downvoteBtns = [...document.querySelectorAll("#downvote-button")]
    downvoteBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            voteOnTheme(btn, "downvote")
        })
    )
}

async function voteOnTheme(btn, vote) {
    const themeId = getId(btn)
    let response = false
    if (vote == "upvote") {
        const responseBody = await axios.put(`/api/themes/${themeId}/upvote`)
        response = responseBody.data.reload
    } else {
        const responseBody = await axios.put(`/api/themes/${themeId}/downvote`)
        response = responseBody.data.reload
    }
    if (response) {
        loadPage()
    }
}

async function renderCards(themes) {
    try {
        const cards = document.querySelector("#theme-list")
        cards.innerHTML = ""
        for (const themeId of themes) {
            const themeSmallBody = await axios.get(`/api/themes/${themeId}/small`)
            const themeSmall = themeSmallBody.data.theme
            const themeDate = new Date(themeSmall.time)
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
            const authorNameBody = await axios.get(`/api/username/${themeSmall.author}`)
            const authorName = authorNameBody.data.username
            const subNameBody = await axios.get(`/api/subs/${themeSmall.sub}/name`)
            const subName = subNameBody.data.name
            cards.innerHTML += createCard(themeSmall, authorName, subName, themeTime)
        }
    } catch (err) {
        console.log(err)
    }
}



function createCard(theme, authorName, subName, themeTime) {
    const card = `
                    <div class="card gedf-card main-card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="mr-2">
                                        <img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="">
                                    </div>
                                    <div class="ml-2">
                                        <div class="h5 m-0">${authorName}</div>
                                        <a href="/sub?id=${theme.sub}">
                                            <div class="h7 text-muted">r/${subName}</div>
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <div class="dropdown">
                                        <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa fa-ellipsis-h"></i>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                                            <div class="h6 dropdown-header">Configuration</div>
                                            <a class="dropdown-item" href="#">Save</a>
                                            <a class="dropdown-item" href="#">Hide</a>
                                            <a class="dropdown-item" href="#">Report</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>${themeTime}</div>
                            <a theme-id="${theme._id}" class="card-link" href="/theme?id=${theme._id}">
                                <h5 class="card-title">${theme.title}</h5>
                            </a>
                            <p class="card-text">${theme.content}</p>
                        </div>
                        <div theme-id="${theme._id}" class="card-footer">
                            <button id="upvote-button" class="transparent-btn card-link"><i class="fa fa-arrow-up"></i>${theme.upvotes}</button>
                            <button id="downvote-button" class="transparent-btn card-link"><i class="fa fa-arrow-down"></i> </button>
                            <a href="/theme?id=${theme._id}"><button class="transparent-btn card-link"><i class="fa fa-comment"></i> Comment</button></a>
                            <button class="transparent-btn card-link" onclick="share()"><i class="fa fa-mail-forward"></i> Share</button>
                            <button class="transparent-btn card-link"><i class="fa fa-bookmark"></i> Save</button>
                        </div>s
                    </div>`
    return card
}

function getId(btn) {
    const parent = btn.parentElement
    const id = parent.getAttribute("theme-id")
    return id
}

const postButton = document.querySelector("#btn-post")
postButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const title = document.querySelector("#title")
        const content = document.querySelector("#content")

        const body = {
            sub: urlId,
            title: title.value,
            content: content.value
        }
        await axios.post("/api/themes", body)

        title.value = ""
        content.value = ""
        loadPage()
    } catch (err) {
        console.log(err)
    }
}

const followButton = document.querySelector("#btn-follow")
followButton.addEventListener("click", followSub)

async function followSub() {
    try {
        await axios.put(`/api/user/subs/${urlId}`)
    } catch (err) {
        console.log(err)
    }
}