loadPage()

async function loadPage() {
    try {
        const dms = await axios.get("/api/dms")
        await renderCards(dms.data.dms)
        addEventListeners()
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    let messagesBtn = [...document.querySelectorAll(".info-button")]
    messagesBtn.forEach((btn) =>
        btn.addEventListener("click", () => {
            window.location.href = `dm?id=${getId(btn)}`
        })
    )
}

async function renderCards(dms) {
    const cardsDiv = document.querySelector("#dm-list")
    let cards = ""
    try {
        dms.forEach((dm) => {
            cards += await createCard(dm)
        })
    } catch (err) {
        console.log(err)
    }
    cardsDiv.innerHTML = cards
}

async function createCard(dm) {
    try {
        const user = await axios.get(`/api/username/${dm}`)
        const username = user.data.username
        let card = `
        <div class="col-sm-4 text-center" dm-id="${dm}">
            <h2>${username}</h2>
            <button type="button" class="btn btn-primary info-button">View messages...</button>
            <br/><br/><br/>
        </div>`
        return card
    } catch (err) {
        console.log(err)
    }
}

function getId(btn) {
    const parent = btn.parentElement
    const id = parent.getAttribute("dm-id")
    return id
}

const sendButton = document.querySelector("#send-button")
sendButton.addEventListener("click", getInput)

async function getInput() {
    const username = (document.querySelector("#username")).value
    const message = (document.querySelector("#message")).value

    const content = {
        username: username,
        content: message
    }

    try {
        await axios.post("api/dms", content)
    } catch (err) {
        console.log(err)
    }

    location.reload()
}