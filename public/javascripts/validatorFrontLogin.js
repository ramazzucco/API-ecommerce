window.onload = () => {

    const formLogin = document.querySelector(".form-login");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if(formLogin){

        const invalid = "border-bottom: 2px solid red; color: darkred";

        email.onfocus = () => {

            if(email.value.trim() == ""){
                email.setAttribute("style",`${invalid}`);
            } else {}

            email.onkeypress = () => {

                if(email.value.trim().indexOf("@") != -1){
                    email.removeAttribute("style");
                } else {
                    email.setAttribute("style",`${invalid}`);
                }

            }

        }

        email.onblur = () => {

            if(email.value.trim().indexOf("@") == -1){
                email.setAttribute("style",`${invalid}`);
                document.querySelector(".email.invalid-feedback").setAttribute("style","display: flex;")
                document.querySelector(".email.invalid-feedback").innerHTML = `<i class="fas fa-exclamation-circle"></i><p>Debe ingresar un mail válido</p>`

            } else {
                email.removeAttribute("style");
                document.querySelector(".email.invalid-feedback").removeAttribute("style")
            }

        }

        password.onfocus = () => {

            if(password.value.trim() == ""){
                password.setAttribute("style",`${invalid}`);
            } else {}

            password.onkeydown = () => {
                console.log(password.value.trim().length)
                if(password.value.trim().length >= 7) {
                    password.removeAttribute("style");
                } else {
                    password.setAttribute("style",`${invalid}`);
                }

            }

        }

        password.onblur = () => {

            if(password.value.trim().length < 7){
                password.setAttribute("style",`${invalid}`);
                document.querySelector(".password.invalid-feedback").setAttribute("style","display: flex;")
                document.querySelector(".password.invalid-feedback").innerHTML = `<i class="fas fa-exclamation-circle"></i><p>Debe ingresar una contraseña válida</p>`

            } else {
                password.removeAttribute("style");
                document.querySelector(".password.invalid-feedback").removeAttribute("style")
            }

        }

        formLogin.addEventListener("submit", (e) => {

            let errors = [];

            if(email.value.trim() == ""){
                email.setAttribute("style",`${invalid}`)
                errors.push("email","Debe ingresar un email")
            }
            if(password.value.trim().length < 8){
                password.setAttribute("style",`${invalid}`)
                errors.push("password","La contraseña debe tener minimo 8 caracteres")
            }
            if(password.value.trim().indexOf("#") != -1 || password.value.trim().indexOf("!") != -1 || password.value.trim().indexOf("$") != -1 || password.value.trim().indexOf("%") != -1 || password.value.trim().indexOf("&") != -1 || password.value.trim().indexOf("/") != -1 || password.value.trim().indexOf("(") != -1 || password.value.trim().indexOf(")") != -1 || password.value.trim().indexOf("=") != -1 || password.value.trim().indexOf("?") != -1 || password.value.trim().indexOf("¡") != -1){
                password.setAttribute("style",`${invalid}`)
                errors.push("password","La contraseña no puede tener los siguientes caracteres (!#$%&/()=?¡)")
            }

            if(errors.length) {

                e.preventDefault()

               for (let i = 0; i < errors.length; i=i+2) {

                    document.querySelector(`.${errors[i]}.invalid-feedback`).setAttribute("style","display: flex;")
                    document.querySelector(`.${errors[i]}.invalid-feedback`).innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${errors[(i+1)]}</p>`

               }
            }
        })

    }

}