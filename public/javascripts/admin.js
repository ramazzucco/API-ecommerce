window.onload = () => {
    var f=new Date();
    const month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const date = (f.getDate() + " de " + month[f.getMonth()] + " de " + f.getFullYear());
    document.querySelector(".date").innerHTML = `<p>${date}</p>`;

    window.onoffline = () => {
        document.querySelector("img").setAttribute("style","box-shadow: 0 0 10px 3px red;")
    }
    window.ononline = () => {
        document.querySelector("img").setAttribute("style","box-shadow: 0 0 10px 3px green;")
    }

    // Botones de la barra lateral.
    const buttons = document.querySelectorAll(".sideBar_button")

    buttons.forEach( button => {
        button.onclick = () => {
            const dataItem = button.getAttribute("data-title");
            const item = document.querySelector(".items." + dataItem);

            if(button.hasAttribute("style") == false){
                button.setAttribute("style", "box-shadow: inset 0 0 3px 1px black;")
            } else {
                button.removeAttribute("style")
            }

            if(item.hasAttribute("style") == false){
                item.setAttribute("style", "display: flex;")
            } else {
                item.removeAttribute("style")
            }

        }
    })
    // Collapsar las cards.
    const buttonCollapse = document.querySelector(".collapse_cards_admin");
    const containerCards = document.querySelector(".cards_admin");
    const cards = document.querySelectorAll(".card_admin");

    buttonCollapse.onclick = () => {

        if(containerCards.className == "cards_admin"){
            containerCards.classList.add("minimized");
            buttonCollapse.innerHTML = `<span class="material-icons keyboard_arrow_up">keyboard_arrow_up</span>`
        } else {
            containerCards.classList.remove("minimized");
            buttonCollapse.innerHTML = `<span class="material-icons keyboard_arrow_down">keyboard_arrow_down</span>`
        }

        cards.forEach(card => {
            if(containerCards.className.includes("minimized") == true){
                card.classList.add("minimized");
            } else {
                card.classList.remove("minimized");
            }
        })

    }

    // Boton eliminar producto.
    const buttonsDelete = document.querySelectorAll(".button_form_delete");

    buttonsDelete.forEach( button => {
        button.onclick = (e) => {
            const eliminar = confirm("Esta seguro que desea eliminar este producto ?")
            console.log(eliminar)
            if(eliminar == false){
                e.preventDefault()
            } else {}

        }
    })
    // Boton modificar producto.
    const buttonsModify = document.querySelectorAll(".button_modify");

    buttonsModify.forEach( button => {

        button.onclick = () => {

            const itemsId = button.getAttribute("data-itemsId");
            const containerEdit = document.querySelector(".edit_product");
            const headerEdit = document.querySelector(`.form_header_edit.edit${itemsId}`);
            const formEdit = document.querySelector(`.form_edit.edit${itemsId}`);

            if( containerEdit.hasAttribute("style") == true){
                containerEdit.removeAttribute("style");
                headerEdit.removeAttribute("style");
                formEdit.removeAttribute("style");
            } else {
                containerEdit.setAttribute("style","display: flex;");
                headerEdit.setAttribute("style","display: flex;");
                formEdit.setAttribute("style","display: flex;");
                document.querySelector(".products").removeAttribute("style");
            }
            // Boton volver al listado de productos.
            const back = document.querySelector(`.button_back.edit${itemsId} button`);

            back.onclick = () => {
                containerEdit.removeAttribute("style");
                headerEdit.removeAttribute("style");
                formEdit.removeAttribute("style");
                document.querySelector(".products").setAttribute("style","display: flex;");

            }
        }

    })
    // Abrir los mensajes de usuarios.
    const users = document.querySelectorAll(".messages_admin .user .userName");

    users.forEach( user => {

        const id = user.getAttribute("data-id");

        user.onclick = () => {

            const idUserClick = user.getAttribute("data-id");
            const messages = document.querySelector(`.message.id${id}`)
            const newMessage = document.querySelector(`.writeMessage.id${id}`)


            if(messages.hasAttribute("style")){
                user.querySelector("h5 span").removeAttribute("style");
                user.querySelector("h5 ").removeAttribute("style");
                messages.removeAttribute("style");
                newMessage.removeAttribute("style");
            } else {
                user.querySelector("h5").setAttribute("style","background-color: var(--bgColorCuatro);transition: all .6s linear");
                user.querySelector("h5 span").setAttribute("style","background-color: transparent; transition: all .6s linear");
                messages.setAttribute("style", "display: flex;");
                newMessage.setAttribute("style", "display: flex;");
            }

            users.forEach(user => {

                if(user.className != `userName id${idUserClick}`){
                    if(user.hasAttribute("style")){
                        user.removeAttribute("style");
                    } else {
                        user.setAttribute("style","display: none;");
                    }
                }

            })

        }

        // Muestra solo los usuario que tienen mensajes.
        const messages_content = document.querySelector(`.message.id${id} .message_content`);

        if(messages_content == null){
            document.querySelector(`.user.id${id}`).setAttribute("style","display:none;")
        }

    });

    // Validacion del formulario Editar Producto.
    const formEdit = document.querySelectorAll(".form_edit");

    formEdit.forEach(form => {

        const name = form.querySelector(`.form_edit #inputName`);
        const price = form.querySelector(`.form_edit #inputPrice`);
        const description = form.querySelector(`.form_edit #inputDescription`);
        const stock = form.querySelector(`.form_edit #inputStock`);
        const discount = form.querySelector(`.form_edit #inputDiscount`);

        form.addEventListener("submit", (e) => {
            let errors = [];
            if (name.value.trim() == "") {
                name.classList.add("is-invalid");
                errors.push("name","El nombre es obligatorio.")
            }
            if (price.value.trim().indexOf(".") != -1) {
                price.classList.add("is-invalid");
                errors.push("price","Coloque numeros sin puntos ni coma.")
            }
            if (description.value.trim() == "") {
                description.classList.add("is-invalid");
                errors.push("description","Debe ingresar el Precio.")
            }
            if (stock.value.trim().indexOf("-") != -1) {
                stock.classList.add("is-invalid");
                errors.push("stock","No puede ingresar numeros negativos.")
            }
            if (discount.value.trim().indexOf("%") != -1) {
                discount.classList.add("is-invalid");
                errors.push("discount","Coloque el numero sin el porcentaje.")
            }
            if (errors.length != 0) {
                e.preventDefault()

                for (let i = 0; i < errors.length; i=i+2) {
                    form.querySelector(`.${errors[i]}.invalid-feedback`).innerHTML = `<p>${errors[(i+1)]}</p>`
                }
            }

             name.onkeydown = () => {
                if(name.value != ""){
                    name.classList.remove("is-invalid");
                    form.querySelector(`.name.invalid-feedback`).innerHTML = ""
                }
            }
            price.onkeydown = () => {
                if(price.value != ""){
                    price.classList.remove("is-invalid");
                    form.querySelector(`.price.invalid-feedback`).innerHTML = ""
                }
            }
            description.onkeydown = () => {
                if(description.value != ""){
                    description.classList.remove("is-invalid");
                    form.querySelector(`.description.invalid-feedback`).innerHTML = ""
                }
            }
            stock.onkeydown = () => {
                if(stock.value.indexOf("-") != -1){
                    stock.classList.remove("is-invalid");
                    form.querySelector(`.stock.invalid-feedback`).innerHTML = ""
                }
            }
            discount.onkeydown = () => {
                if(discount.value != ""){
                    discount.classList.remove("is-invalid");
                    form.querySelector(`.discount.invalid-feedback`).innerHTML = ""
                }
            }

        });
    });
    // Validacion del formulario Crear Producto.
    const formCreate = document.querySelector(".form_create");
    const category = document.querySelector(".form_create #inputCategory");
    const name = document.querySelector(`.form_create #inputName`);
    const price = document.querySelector(`.form_create #inputPrice`);
    const description = document.querySelector(`.form_create #inputDescription`);
    const stock = document.querySelector(`.form_create #inputStock`);
    const discount = document.querySelector(`.form_create #inputDiscount`);
    const image = document.querySelector(".form_create #inputImage");
    const imageError = document.querySelector(".form_create .image.invalid-feedback");
    const urlCreateProduct = location.href.slice(31,37);

    if(urlCreateProduct == "create"){
        document.querySelector(".new_products").setAttribute("style", "display: flex;");
        containerCards.classList.add("minimized");
        buttonCollapse.innerHTML = `<span class="material-icons keyboard_arrow_up">keyboard_arrow_up</span>`;
        cards.forEach(card => {
            card.classList.add("minimized");
        });
        if( imageError != "null") {
            image.classList.add("is-invalid");
        }
    }

    formCreate.addEventListener("submit", (e) => {
        let errors = [];

        if (category.value.trim() ==  "Seleccione una categoria") {
            category.classList.add("is-invalid");
            errors.push("category","Debe seleccionar una categoria.")
        }
        if (name.value.trim() == "") {
            name.classList.add("is-invalid");
            errors.push("name","Debe ingresar un nombre.")
        }
        if (price.value.trim() == "") {
            price.classList.add("is-invalid");
            errors.push("price","Debe ingresar un precio.")
        }
        if (price.value.trim().indexOf(".") != -1 || price.value.trim().indexOf(",") != -1) {
            price.classList.add("is-invalid");
            errors.push("price","Debe ingresar numeros sin comas ni puntos.")
        }
        if (description.value.trim() == "") {
            description.classList.add("is-invalid");
            errors.push("description","Debe ingresar una descripcion.")
        }
        if (stock.value.trim().indexOf("-") != -1 ) {
            stock.classList.add("is-invalid");
            errors.push("stock","No puede ingresar numeros negativos.")
        }
        if (stock.value.trim() == "") {
            stock.classList.add("is-invalid");
            errors.push("stock","Ingrese numeros sin porcentaje.")
        }

        if (errors.length != 0) {
            e.preventDefault()
            console.log(errors)
            for (let i = 0; i < errors.length; i=i+2) {
                console.log(`.${errors[i]}`)
                document.querySelector(`.form_create .${errors[i]}.invalid-feedback`).innerHTML = `<p>${errors[(i+1)]}</p>`
            }
        }
        category.onchange = () => {
            if(category.value != "Seleccione una categoria"){
                category.classList.remove("is-invalid");
                document.querySelector(".category.invalid-feedback").innerHTML = ""
            }
        }
        name.onkeydown = () => {
            if(name.value != ""){
                name.classList.remove("is-invalid");
                document.querySelector(".form_create .name.invalid-feedback").innerHTML = ""
            }
        }
        price.onkeydown = () => {
            if(price.value != "" || price.value.indexOf(".") == -1 || price.value.indexOf(",") == -1){
                price.classList.remove("is-invalid");
                document.querySelector(".form_create .price.invalid-feedback").innerHTML = ""
            }
        }
        description.onkeydown = () => {
            if(description.value != ""){
                description.classList.remove("is-invalid");
                document.querySelector(".form_create .description.invalid-feedback").innerHTML = ""
            }
        }
        stock.onkeydown = () => {
            if(stock.value != "" || stock.value.indexOf("-") == -1){
                stock.classList.remove("is-invalid");
                document.querySelector(".form_create .stock.invalid-feedback").innerHTML = ""
            }
        }
        discount.onkeydown = () => {
            if(discount.value != "" || discount.value.indexOf("%") == -1){
                discount.classList.remove("is-invalid");
                document.querySelector(".form_create .discount.invalid-feedback").innerHTML = ""
            }
        }
        image.onchange = () => {
            if(image.value.includes(".jpg") == true || image.value.includes(".jpeg") == true || image.value.includes(".png") == true) {
                image.classList.remove("is-invalid");
                document.querySelector(".form_create .image.invalid-feedback").innerHTML = ""
            }
        }
    })
    // Crear oferta
    const createOfferButton = document.querySelector(".create_offer");

    createOfferButton.onclick = () => {

        const form_create_promotion = document.querySelector(".form_create_promotion");

        if(form_create_promotion.hasAttribute("style")){
            form_create_promotion.removeAttribute("style");
        } else {
            form_create_promotion.setAttribute("style","display: flex;");
        }

    }
}