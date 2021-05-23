const urlId = getUrlId()

function getUrlId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    return id
}

loadPage()

async function loadPage() {
    try {
        const chatData = await axios.get(`/api/chats/${urlId}`)
        const chat = chatData.data.chat
        if (chat == "NULL") {
            console.log("Chat not found")
        } else {
            const chatname = document.querySelector("#chatname")
            chatname.innerHTML = chat.name
            const user = await axios.get(`/api/userid/self`)
            const userId = user.data.userId
            renderCards(chat, userId)
        }
    } catch (err) {
        console.log(err)
    }
}

async function renderCards(chat, userId) {
    try {
        const cards = document.querySelector("#message-list")
        cards.innerHTML = ""
        for (const message of chat.messages) {
            if (message.sender == userId) {
                cards.innerHTML += createCard(message, "me")
            } else {
                const user = await axios.get(`/api/username/${message.sender}`)
                const username = user.data.username
                cards.innerHTML += createCard(message, username)
            }
        }
    } catch (err) {
        console.log(err)
    }
}

function createCard(message, username) {
    let orient = "left"
    if (username == "me") {
        orient = "right"
    }
    const messageDate = new Date(message.sentAt)
    const messageHour = messageDate.getHours()
    const messageMinute = messageDate.getMinutes()
    const card = `
    <div class="msg ${orient}-msg">
      <div class="msg-img" style="background-image: url(img/user.png)"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${username}</div>
          <div class="msg-info-time">${messageHour}:${messageMinute}</div>
        </div>
        <div class="msg-text">${message.content}</div>
      </div>
    </div>`
    return card
}

const sendButton = document.querySelector("#send-button")
sendButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const message = (document.querySelector("#message")).value
        await axios.post(`/api/chats/${urlId}/messages`, {content: message})
        location.reload()
    } catch (err) {
        console.log(err)
    }
}