
loadPage()

async function loadPage() {
    try {
        const authenticated = await axios.get("/api/authenticated")
        const logInOut = document.querySelector("#logInOut")
        const navbar = document.querySelector("#navbar")
        if (authenticated.data.success) {
            logInOut.innerHTML = "Logout"
            navbar.innerHTML = ""
            navbar.innerHTML+=`<a href="/chats"><button class="transparent-btn card-link nav-button"><i class="fa fa-comments fa-2x"></i></button></a>`
            navbar.innerHTML+=`<a href="/profile"><button class="transparent-btn card-link nav-button" ><i  class="fa fa-user fa-2x"></i></button></a>`
            const userBody = await axios.get("/api/user")
            const user = userBody.data.user
            const cards = document.querySelector("#theme-list")
            cards.innerHTML = ""
            for(const subId of user.created.subs) {
                const sub = await axios.get(`/api/subs/${subId}/small`)
                await renderCards(sub, cards)
            }
            addEventListeners()
        } else {
            logInOut.innerHTML = "Login"
            navbar.innerHTML = ""
        }
    } catch (err) {
        console.log(err)
    }
}



function addEventListeners() {
    const shareButton = document.querySelector("#btn-post")
    shareButton.addEventListener("click", () => {
        getInput()
    })

}


async function renderCards(sub, cards) {
    try {
        subName = sub.data.name
        subDescription = sub.data.description
        cards.innerHTML += createCard(subName, subDescription)
    }
    catch (err) {
        console.log(err)
    }
}

async function renderCards(subs) {
    try {
        const cards = document.querySelector("#sub-list")
        cards.innerHTML = ""
        for (const sub of subs) {
            cards.innerHTML += createCard(sub)
        }
    } catch (err) {
        console.log(err)
    }
}


function createCard(sub) {
    const card = `
    <div class="card gedf-card main-card">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                        <img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="">
                    </div>
                    <div class="ml-2">
                    <a href="/sub?id=${sub._id}"> <div class="h5 m-0">${sub.name}</div></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <p class="card-text">${sub.description}</p>
        </div>
    </div>`
    return card
}


const postButton = document.querySelector("#btn-post")
sendButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const name = document.querySelector("#name")
        const description = document.querySelector("#description")

        const newsub = {
            name: name.value,
            description: description.value,
        }
        await axios.post("/api/subs", newsub)

        name.value = ""
        description.value = ""
        loadPage()
    } catch (err) {
        console.log(err)
    }
}