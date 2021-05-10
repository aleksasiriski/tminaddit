const urlId = getUrlId()

function getUrlId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    return id
}

loadPage()

async function loadPage() {
    try {
        const dmData = await axios.get(`/api/dms/${urlId}`)
        const dm = dmData.data.dm
        if (dm == "NULL") {
            console.log("DM not found")
        } else {
            const user = await axios.get(`/api/username/${dm.id}`)
            const username = user.data.username
            renderCards(dm, username)
            addEventListeners()
        }
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    const deleteBtns = [...document.querySelectorAll(".delete-button")]
    deleteBtns.forEach((btn) =>
        btn.addEventListener("click", () => deleteData(btn))
    )
}

function renderCards(dm, username) {
    const cards = document.querySelector("#message-list")
    dm.messages.forEach((message) => {
        if (message.id == dm.id) {
            cards.innerHTML += createCard(message, username)
        } else {
            cards.innerHTML += createCard(message, "me")
        }
    })
}

function createCard(message, username) {
    let prefix = ""
    let suffix = ""
    if (username == "me") {
        prefix = `<div class="col-sm-8"></div>`
    } else {
        suffix = `<div class="col-sm-8"></div>`
    }
    const card = `
    ${prefix}
    <div class="col-sm-4 text-center" message-id="${message._id}">
        <h3>${username}</h2>
        <p>${message.content}</p>
    </div>
    ${suffix}`
    //<button type="button" class="btn btn-secondary delete-button">Delete</button>
    //<p>${message.sentAt}</p>
    return card
}

function getId(btn) {
    const parent = btn.parentElement
    const id = parent.getAttribute("dm-id")
    return id
}

async function deleteData(btn) {
    const id = getId(btn)
    try {
        //await axios.delete(`/api/message/${id}`)
        //location.reload()
        console.log("Tried to remove message")
    } catch (err) {
        console.log(err)
    }
}

const sendButton = document.querySelector("#send-button")
sendButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const message = (document.querySelector("#message")).value

        const content = {
            content: message
        }
        await axios.post(`api/dms/${urlId}`, content)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}