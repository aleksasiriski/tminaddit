

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
            $('#first-name').attr('placeholder','first name');
        }
        if (user.lname!=""){
            $('#last-name').attr('placeholder',user.lname);
        }
        else{
            $('#last-name').attr('placeholder','last name');
        }
        $('#email').attr('placeholder',user.email);
        if(user.admin==true){
            $('#role').attr('placeholder','admin');
        }
        else{
            $('#role').attr('placeholder','user');
        }
        const upvotes=document.querySelector("#upvotes")
        upvotes.innerHTML=user.upvotes.themes.length + user.upvotes.comments.length

        const downvotes=document.querySelector("#downvotes")
        downvotes.innerHTML=user.downvotes.themes.length + user.downvotes.comments.length

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
