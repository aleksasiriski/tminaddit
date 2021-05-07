loadPage()

async function loadPage() {
    try {
        let dms = await axios.get("/api/dms")
        renderCards(dms.data.dms)
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

function renderCards(dms) {
    const cardsDiv = document.querySelector("#dm-list")
    let cards = ""
    dms.forEach((dm) => {
        cards += createCard(dm)
    })
    cardsDiv.innerHTML = cards
}

function createCard(dm) {
    try {
        const username = await axios.get(`/api/username/${dm}`)
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