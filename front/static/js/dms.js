loadPage()

async function loadPage() {
    try {
        const dms = await axios.get("/api/dms")
        renderCards(dms.data.dms)
        addEventListeners()
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    const messagesBtn = [...document.querySelectorAll(".info-button")]
    messagesBtn.forEach((btn) =>
        btn.addEventListener("click", () => {
            window.location.href = `dm?id=${getId(btn)}`
        })
    )
}

function renderCards(dms) {
    const cards = document.querySelector("#dm-list")
    dms.forEach(async (dm) => {
        try {
            const user = await axios.get(`/api/username/${dm}`)
            cards.innerHTML += createCard(dm, user.data.username)
        } catch (err) {
            console.log(err)
        }
    })
}

function createCard(dm, username) {
    const card = `
    <div class="col-sm-4 text-center" dm-id="${dm}">
        <h2>${username}</h2>
        <button type="button" class="btn btn-primary info-button">View messages...</button>
        <br/><br/><br/>
    </div>`
    return card
}

function getId(btn) {
    const parent = btn.parentElement
    const id = parent.getAttribute("dm-id")
    return id
}

const sendButton = document.querySelector("#send-button")
sendButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const username = (document.querySelector("#username")).value
        const message = (document.querySelector("#message")).value

        const content = {
            username: username,
            content: message
        }
        await axios.post("api/dms", content)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}