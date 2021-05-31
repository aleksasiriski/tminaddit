
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
            const cards = document.querySelector("#sub-list")
            cards.innerHTML = ""
            await renderCards(user.created.subs, cards)
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


async function renderCards(subs, cards) {
    try {
        for(const subId of subs){
            const sub = await axios.get(`/api/subs/${subId}/small`)
            cards += createCard(sub)
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
                    <a href="/sub?id=${sub.data._id}"> <div class="h5 m-0">${sub.data.name}</div></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <p class="card-text">${sub.data.description}</p>
        </div>
    </div>`
    return card
}