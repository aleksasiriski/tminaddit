GetData();

async function GetData() {
    try {
        let phones = await axios.get("/api/phones");
        RenderCards(phones.data.phones);
        AddEventListeners();
    } catch (err) {
        console.log(err);
    }
}

function AddEventListeners() {
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
}

function RenderCards(phones) {
    const cardsDiv = document.querySelector("#phone-list");
    let cards = "";
    phones.forEach((phone) => {
        cards += CreateCard(phone);
    });

    cardsDiv.innerHTML = cards;
}

function CreateCard(phone) {

    let card = `
    <div class="col-sm-4 text-center" phone-id="${phone._id}">
        <img src="${phone.image}" alt="${phone.model}">
        <h2>Model: ${phone.model}</h2>
        <p>Manufacturer: ${phone.manufacturer}</p>
        <button type="button" class="btn btn-primary info-button">Read more...</button>
        <button type="button" class="btn btn-secondary delete-button">Delete</button>
        <br/><br/><br/>
    </div>
    `;

    return card;
}

async function DeleteData(btn) {
    const id = getId(btn);
    try {
        await axios.delete(`/api/phones/${id}`);
        window.location.href = "/";
    } catch (err) {
        console.log(err);
    }
}

function getId(btn) {
    const parent = btn.parentElement;
    const id = parent.getAttribute("phone-id");
    return id;
}