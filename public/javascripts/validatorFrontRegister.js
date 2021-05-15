window.onload = () => {
    const formRegister = document.querySelector(".form-register");
    const invalid = "border-bottom: 2px solid darkred; color: darkred";
    const onfocus = `content: ""; position: absolute; top: -15px; font-size: calc(var(--fontSize) - 0.5rem);`

    if(formRegister){

        const first_name = document.getElementById("inputName");
        const last_name = document.getElementById("inputLastName");
        const email = document.getElementById("inputEmail");
        const password = document.getElementById("inputPassword");
        const inputs = document.querySelectorAll(".form-register input");
        const labels =  document.querySelectorAll(".form-register label");

        first_name.onkeydown = () => {
            if(first_name.value.trim() != ""){
                first_name.removeAttribute("style");
            }
            first_name.onblur = () => {
                if(first_name.value.trim().length < 3 || first_name.value.trim().length > 30) {
                    first_name.setAttribute("style",`${invalid}`);
                }
            }
        }
        last_name.onkeydown = () => {
            if(last_name.value.trim() != ""){
                last_name.removeAttribute("style");
            }
            last_name.onblur = () => {
                if(last_name.value.trim().length < 3 || last_name.value.trim().length > 30) {
                    last_name.setAttribute("style",`${invalid}`);
                }
            }
        }
        email.onkeydown = () => {
            if(email.value.trim() != ""){
                email.removeAttribute("style");
            }
            email.onblur = () => {
            }
        }
        password.onkeydown = () => {
            if(password.value.trim() != ""){
                password.removeAttribute("style");
            }
            password.onblur = () => {
                if(password.value.trim().length < 8) {
                    password.setAttribute("style",`${invalid}`);
                }
            }
        }

        for(let i=0; i < inputs.length; i++){
            if(inputs[i].value == ""){
                labels[i].removeAttribute("style")
            } else {
                labels[i].setAttribute("style",`${onfocus}`)
            }
            inputs[i].onfocus = () => {
                labels[i].setAttribute("style",`${onfocus}`)
            }
            inputs[i].onblur = () => {
               if(inputs[i].value == ""){
                   labels[i].removeAttribute("style")
                   labels[i].setAttribute("style","color: darkred;")
                   inputs[i].setAttribute("style",`${invalid}`)
               }
            }
        }


        formRegister.addEventListener("submit", (e) => {

            let errors = [];

            if(first_name.value.trim() == ""){
                first_name.setAttribute("style",`${invalid}`);
                errors.push("first_name","Debe ingresar un nombre")
            }
            if(first_name.value.trim().length < 3 || first_name.value.trim().length > 30){
                first_name.setAttribute("style",`${invalid}`);
                errors.push("first_name","El nombre puede tener min. 3 letras y max. 30 letras")
            }
            if(last_name.value.trim() == ""){
                last_name.setAttribute("style",`${invalid}`);
                errors.push("last_name","Debe ingresar un apellido")
            }
            if(last_name.value.trim().length < 3 || last_name.value.trim().length > 30){
                last_name.setAttribute("style",`${invalid}`);
                errors.push("last_name","El apellido puede tener min. 3 letras y max. 30 letras")
            }
            if(email.value.trim() == ""){
                email.setAttribute("style",`${invalid}`);
                errors.push("email","Debe ingresar un email")
            }
            if(password.value.trim().length < 8){
                password.setAttribute("style",`${invalid}`);
                errors.push("password","La contraseña debe tener minimo 8 caracteres")
            }
            if(password.value.trim().indexOf("#") != -1 || password.value.trim().indexOf("!") != -1 || password.value.trim().indexOf("$") != -1 || password.value.trim().indexOf("%") != -1 || password.value.trim().indexOf("&") != -1 || password.value.trim().indexOf("/") != -1 || password.value.trim().indexOf("(") != -1 || password.value.trim().indexOf(")") != -1 || password.value.trim().indexOf("=") != -1 || password.value.trim().indexOf("?") != -1 || password.value.trim().indexOf("¡") != -1){
                password.setAttribute("style",`${invalid}`);
                errors.push("password","La contraseña no puede tener los siguientes caracteres (!#$%&/()=?¡)")
            }

            if(errors.length) {

                e.preventDefault()

                for (let i = 0; i < errors.length; i=i+2) {
                    console.log(errors[i])

                    document.querySelector(`.${errors[i]}.invalid-feedback`).setAttribute("style","display: flex;")
                    document.querySelector(`.${errors[i]}.invalid-feedback`).innerHTML =`<i class="fas fa-exclamation-circle"></i><p>${errors[(i+1)]}</p>`

                }
            }
        })
    }

}