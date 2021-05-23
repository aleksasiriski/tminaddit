const { post } = require("../../../back/controller/theme");

GetData();

async function GetData() {
    try {
        let themes = await axios.get("/api/themes");
        RenderCards(themes.data.themes);
        AddEventListeners();
    } catch (err) {
        console.log(err);
    }
}

/*function AddEventListeners() {
    let moreInfoBtn = [...document.querySelectorAll(".info-button")];
    moreInfoBtn.forEach((btn) =>
        btn.addEventListener("click", () => {
            window.location.href = `phone?id=${getId(btn)}`;
        })
    );

    let deleteBtns = [...document.querySelectorAll(".delete-button")];
    deleteBtns.forEach((btn) =>
        btn.addEventListener("click", () => DeleteData(btn))
    );
}*/

function RenderCards(themes) {
    const cardsDiv = document.querySelector("#themes");
    let cards = "";
    themes.forEach((theme) => {
        themes += CreateCard(theme);
    });

    cardsDiv.innerHTML = cards;
}

function CreateCard(theme) {
    let card = `
                    <div class="card gedf-card main-card" theme-id="${theme._id}">
                      <div class="card-header">
                          <div class="d-flex justify-content-between align-items-center">
                              <div class="d-flex justify-content-between align-items-center">
                                  <div class="mr-2">
                                      <img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="">
                                  </div>
                                  <div class="ml-2">
                                      <div class="h5 m-0">${theme.author}</div>
                                      <a href="sub"><div class="h7 text-muted">${theme.sub}</div></a>
                                  </div>
                              </div>
                              <div>
                                  <div class="dropdown">
                                      <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                          <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>${theme.createdAt}</div>
                          <a class="card-link" href="theme">
                              <h5 class="card-title">${theme.title}.</h5>
                          </a>

                          <p class="card-text">
                            ${theme.content}
                          </p>
                      </div>
                      <div class="card-footer">
                          <button class="transparent-btn card-link"><i class="fa fa-arrow-up"></i> 23</button>
                          <button class="transparent-btn card-link"><i class="fa fa-arrow-down"></i> </button>
                          <a href="theme?id=${theme.id}"><button class="transparent-btn card-link"onclick="showComment()"><i class="fa fa-comment"></i> Comment</button></a>
                          <button class="transparent-btn card-link" onclick="share()"><i class="fa fa-mail-forward"></i> Share</button>
                          <button class="transparent-btn card-link" ><i class="fa fa-bookmark"></i> Save</button>
                      </div>
                  </div>`
    return card;
}
/*
async function DeleteData(btn) {
    const id = getId(btn);
    try {
        await axios.delete(`/api/phones/${id}`);
        window.location.href = "/";
    } catch (err) {
        console.log(err);
    }
}*/
/*

function getId(btn) {
    const parent = btn.parentElement;
    const id = parent.getAttribute("phone-id");
    return id;
}*/
const postButton = document.querySelector("#btn-post")
postButton.addEventListener("click", getInput)
async function getInput() {
    try {
        post=document.querySelector("#posts")
        image=document.querySelector("#images")
        link=document.querySelector("#links")
        if (post.hasAttribute("active"))
        {
            const title = document.querySelector("#title")
            const content = document.querySelector("#content")
            await axios.post("/api/themes", newTheme)
            title.value = ""
            content.value = ""
            location.reload()
        }
        if (image.hasAttribute("active"))
        {
            const title = document.querySelector("#title-file")
            const content = document.querySelector("#customFile")
            await axios.post("/api/themes", newTheme)
            title.value = ""
            content.value = ""
            location.reload()
        }
        if (link.hasAttribute("active"))
        {
            const title = document.querySelector("#title-link")
            const content = document.querySelector("#link")
            await axios.post("/api/themes", newTheme)
            title.value = ""
            content.value = ""
            location.reload()
        }
    } catch (err) {
        console.log(err)
    }
}