loadPage()

async function loadPage() {
    try {
        const dms = await axios.get("/api/dms")
        renderCards(dms.data.dms)
        //addEventListeners() //ovo je dobro ali ne radi, jer je kod "SHREK" problem sto ne znam gde await da stavim pa se generisu DM-ovi nakon sto je pozvana funkcija za dodavanje button event-a
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    const messagesBtn = [...document.querySelectorAll("#message-button")]
    messagesBtn.forEach((btn) =>
        btn.addEventListener("click", () => {
            window.location.href = `dm?id=${getId(btn)}`
        })
    )
}

function renderCards(dms) {
    const cards = document.querySelector("#dm-list")
    //SHREK
    dms.forEach (async (dm) => {
        try {
            const user = await axios.get(`/api/username/${dm}`)
            cards.innerHTML += createCard(dm, user.data.username)
            addEventListeners() //ovo je lose, jer se poziva na kreaciji svakog DM-a ali trenutno ovako jedino radi
            // ne radi jer na += u html se svi eventovi obrisu a ne mogu da awaitujem forEach pa tek onda da pozivam dodavanje eventova
            // ovako poslednja nit dodavanja u html izvrsava pravljenje svih eventova
        } catch (err) {
            console.log(err)
        }
    })
}

function createCard(dm, username) {
    const card = `
    <div class="col-sm-4 text-center" dm-id="${dm}">
        <button id="message-button" type="button" class="btn btn-primary">${username}</button>
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
        await axios.post("api/dms/noid", content)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}