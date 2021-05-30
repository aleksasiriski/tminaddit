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
    } catch (err) {
        console.log(err)
    }
}

