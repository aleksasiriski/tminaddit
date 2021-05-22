loadPage()

async function loadPage() {
    try {
        const chats = await axios.get("/api/chats")
        renderCards(chats.data.chats)
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    const messagesBtn = [...document.querySelectorAll("#message-button")]
    messagesBtn.forEach((btn) =>
        btn.addEventListener("click", () => {
            window.location.href = `chat?id=${getId(btn)}`
        })
    )
}

function renderCards(chats) {
    const cards = document.querySelector("#chat-list")
    chats.forEach (async (chatId) => {
        try {
            const chatSmall = await axios.get(`/api/chats/${chatId}/small`)
            const latestMessageHour = chatSmall.data.time.prototype.getHours()
            const latestMessageMinute = chatSmall.data.time.prototype.getMinutes()
            cards.innerHTML += createCard(chatId, chatSmall.data.chatName, chatSmall.data.latestMessage, latestMessageHour, latestMessageMinute)
            console.log(chatId + chatSmall.data.chatName + chatSmall.data.latestMessage + latestMessageHour + latestMessageMinute)
            addEventListeners()
        } catch (err) {
            console.log(err)
        }
    })
}

function createCard(chatId, chatName, latestMessage, latestMessageHour, latestMessageMinute) {
    const card = `
    <div chat-id=${chatId}" class="friend-drawer friend-drawer--onhover">
        <img class="profile-image" src="img/user-white.png" alt="">
        <div class="text">
            <h6>${chatName}</h6>
            <p class="text-muted">${latestMessage}</p>
        </div>
        <span class="time text-muted small">${latestMessageHour}:${latestMessageMinute}</span>
    </div>`
    return card
}

function getId(btn) {
    const parent = btn.parentElement
    const id = parent.getAttribute("chat-id")
    return id
}

const sendButton = document.querySelector("#start-chat-button")
sendButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const username = (document.querySelector("#username")).value
        const recipient = {
            recipient: username
        }
        await axios.post("/api/chats", recipient)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}