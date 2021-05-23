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
    const chatBtns = [...document.querySelectorAll("#chat-button")]
    chatBtns.forEach((btn) =>
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
            const latestMessageDate = new Date(chatSmall.data.time)
            const latestMessageHour = latestMessageDate.getHours()
            const latestMessageMinute = latestMessageDate.getMinutes()
            cards.innerHTML += createCard(chatId, chatSmall.data.chatName, chatSmall.data.latestMessage, latestMessageHour, latestMessageMinute)
            addEventListeners()
        } catch (err) {
            console.log(err)
        }
    })
}

function createCard(chatId, chatName, latestMessage, latestMessageHour, latestMessageMinute) {
    const card = `
    <div chat-id="${chatId}" class="friend-drawer friend-drawer--onhover">
        <img class="profile-image" src="img/user-white.png" alt="">
        <div class="text">
            <h6>${chatName}</h6>
            <p class="text-muted">${latestMessage}</p>
        </div>
        <span class="time text-muted small">${latestMessageHour}:${latestMessageMinute}</span>
        <button id="chat-button" type="button" class="btn btn-primary">Show messages</button>
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
        const chatName = (document.querySelector("#chatName")).value
        const participantsString = (document.querySelector("#participants")).value
        const participantsStringTrimmed = participantsString.replace(/\s+/g, '')
        const participants = participantsStringTrimmed.split(",")
        const newChat = {
            name: chatName,
            participants: participants
        }
        await axios.post("/api/chats", newChat)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}