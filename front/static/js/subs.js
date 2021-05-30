
loadPage()

async function loadPage() {
    try {
        const authenticated = await axios.get("/api/authenticated")
        if (authenticated.data.success) {
            const logInOut = document.querySelector("#logInOut")
            logInOut.innerHTML = "Logout"
            const navbar = document.querySelector("#navbar")
            navbar.innerHTML = ""
            navbar.innerHTML += `<a href="/chats"><button class="transparent-btn card-link nav-button"><i class="fa fa-comments"></i></button></a>`
            navbar.innerHTML += `<a href="/profile"><button class="transparent-btn card-link" ><i  class="fa fa-user"></i></button></a>`
        }
        const subs = await axios.get("/api/subs")
        await renderCards(subs.data.subs)
        addEventListeners()
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


async function renderCards(sub) {
    try {
        const cards = document.querySelector("#sub-list")
        cards.innerHTML = ""
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