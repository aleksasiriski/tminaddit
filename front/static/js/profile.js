

loadPage()

async function loadPage() {
    try {
        const userBody = await axios.get(`/api/user`)
        user=userBody.data.user
        const username=document.querySelector("#username")
        username.innerHTML=user.username
        if (user.fname!=""){
            $('#first-name').attr('placeholder',user.fname);

        }
        else{
            $('#first-name').attr('placeholder','First name');
        }
        if (user.lname!=""){
            $('#last-name').attr('placeholder',user.lname);
        }
        else{
            $('#last-name').attr('placeholder','Last name');
        }
        $('#email').attr('placeholder',user.email);
        if(user.admin==true){
            $('#role').attr('placeholder','Admin');
        }
        else{
            $('#role').attr('placeholder','User');
        }
        const themeUpvotes=document.querySelector("#themeUpvotes")
        themeUpvotes.innerHTML=user.upvotes.themes.length

        const downvotes=document.querySelector("#themeDownvotes")
        downvotes.innerHTML=user.downvotes.themes.length 

    } catch (err) {
        console.log(err)
    }
}
const saveButton = document.querySelector("#save-button")
saveButton.addEventListener("click", getInput)

async function getInput() {
    try {
            const fname= document.querySelector("#first-name")
            const lname= document.querySelector("#last-name")
            const email= document.querySelector("#email")
        
        const body = {
            fname: fname.value,
            lname: lname.value,
            email: email.value
        }
        await axios.put("/api/user", body)
        loadPage()
    } catch (err) {
        console.log(err)
    }
}
