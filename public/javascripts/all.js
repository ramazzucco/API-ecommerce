window.onload = () => {
    //========================================HEADER _ HEADER _ HEADER==============================================//

    //----------------------  INPUT SEARCH  -----------------------------//
    let input = document.querySelector(".search input");
    let iconSearch = document.querySelector(".icon-search");

    input.onfocus = () => {
        input.setAttribute(
            "style",
            "box-shadow: -5px 1px 10px 5px var(--bgColorHover);"
        );
        iconSearch.setAttribute(
            "style",
            "box-shadow: 5px 1px 10px 5px var(--bgColorHover);"
        );
        input.onblur = () => {
            input.removeAttribute("style");
            iconSearch.removeAttribute("style");
        };
    };

    //--------------------  COLAPSAR BOTON MENU   ----------------------//

    let button = document.querySelector(".buttonCollapse");

    let menu = document.getElementById("menu-column");

    let pantalla = window.screen.width;

    button.onclick = () => {
        if (menu.hasAttribute("style") == false) {
            menu.setAttribute("style", "display: flex;");
        } else {
            menu.removeAttribute("style");
        }
    };

    if (pantalla < 768) {
        menuColumn();
    } else {
        menuInline();
    }

    // --SACA EL BOTON MENU Y PONE EL MENU INLINE----//
    function menuInline() {
        document
            .querySelector(".buttonCollapse")
            .setAttribute("style", "display: none;");
        document.querySelector(".navBar-inline").removeAttribute("style");
        document
            .getElementById("menu-inline")
            .setAttribute("style", "display: flex;");
        document
            .querySelector(".navBar-inline")
            .setAttribute("style", "display: flex");
        document.getElementById("menu-column").removeAttribute("style");
    }

    // ----SACA EL MENU INLINE Y PONE EL BOTON MENU ----//
    function menuColumn() {
        document
            .querySelector(".buttonCollapse")
            .setAttribute("style", "display: flex;");
        document
            .querySelector(".navBar-inline")
            .setAttribute("style", "display: none;");
    }

    // -CAMBIA EL MENU SEGUN EL TAMAÑO DE PANTALLA-//
    window.onresize = () => {
        if (window.screen.width < 768) {
            menuColumn();
        } else {
            menuInline();
        }
    };

    // Pinta de verde el icono de login si esta logueado.
    const login = document.querySelector(".material-icons.icon-login");

    if (login.hasAttribute("data-user")) {
        login.classList.add("loginOn");
    }

    //----------------------   ABRIR Y CERRAR CARRITO  MODAL  -------------------------//

    const cartIcon = document.querySelector(".icon-cart");
    const cartContainer = document.querySelector(".container_cart");

    if (cartIcon) {
        cartIcon.onclick = () => {
            if (cartContainer.hasAttribute("style") == false) {
                cartIcon.classList.add("loginOn");
                cartContainer.setAttribute("style", "display: flex");
            } else {
                cartContainer.removeAttribute("style");
                cartIcon.classList.remove("loginOn");
            }
            const container_cart = document.querySelector(".container_cart");
            container_cart.onclick = (e) => {
                if(e.target.hasAttribute("style")){
                    cartContainer.removeAttribute("style");
                    cartIcon.classList.remove("loginOn");
                }
            }

            // Para eliminar items del carrito modal.
            const close = document.querySelectorAll(".close span");
            close.forEach(element => {

                element.onclick = () => {

                    const itemID = element.getAttribute("data-id");
                    document.querySelector(`.row.${itemID}`).setAttribute("style","display: none");

                    const itemsId = document.querySelectorAll(".form_cart input");
                    itemsId.forEach(id => {
                        if(`id${id.value}` == itemID){
                            id.setAttribute("disabled","");
                        }
                    })

                }

            })

        }

    }

    //==========================================BODY _ BODY _ BODY=============================================//

    //-------------------------------- SLIDER AUTOMATICO Y MANUAL-------------------------------//
    $(function () {
        $("#slider a:gt(0)").hide();
        var interval = setInterval(changeDiv, 6000);
        function changeDiv() {
            $("#slider a:first-child")
                .fadeOut(1000)
                .next("a")
                .fadeIn(1000)
                .end()
                .appendTo("#slider");
        }
        $(".mas").click(function () {
            changeDiv();
            clearInterval(interval);
            interval = setInterval(changeDiv, 6000);
        });
        $(".menos").click(function () {
            $("#slider a:first-child").fadeOut(1000);
            $("#slider a:last-child").fadeIn(1000).prependTo("#slider");
            clearInterval(interval);
            interval = setInterval(changeDiv, 6000);
        });
    });
    //------------------------------ ORDER BY ---------------------------------//
    const orderBy = document.querySelector(".ordenarPor select");

    function show(x) {
        x.forEach((element) => {
            element.setAttribute("style", "display: flex;");
        });
    }

    function hide(x) {
        x.forEach((element) => {
            element.removeAttribute("style", "display: flex;");
        });
    }

    if (orderBy) {
        const byName = document.querySelectorAll(".byName");
        const byPrice = document.querySelectorAll(".byPrice");
        const containerCards = document.querySelector(".container_cards");

        show(byName);

        orderBy.onchange = () => {
            if (orderBy.value == "Nombre Ascendente") {
                show(byName);
                hide(byPrice);
                containerCards.removeAttribute("style");
            } else if (orderBy.value == "Nombre Descendente") {
                show(byName);
                hide(byPrice);
                containerCards.setAttribute(
                    "style",
                    "flex-direction: row-reverse;"
                );
            } else if (orderBy.value == "Precio Ascendente") {
                show(byPrice);
                hide(byName);
                containerCards.removeAttribute("style");
            } else if (orderBy.value == "Precio Descendente") {
                show(byPrice);
                hide(byName);
                containerCards.setAttribute(
                    "style",
                    "flex-direction: row-reverse;"
                );
            }
        };
    }

    //-----------------------------  PAGINADO -----------------------------------//

    const pages = document.querySelectorAll(".paginado a");
    const pagesSearch = document.querySelectorAll(".paginado a");
    const search = location.href.slice(29, 35);
    const arrowLeft = document.querySelector(".arrow_left");
    const arrowRight = document.querySelector(".arrow_right");

    // Si la pagina es cargada por una busqueda en el search.
    if (search == "search") {
        const numberPageSearch = Number(
            pagesSearch[0].getAttribute("href").slice(18)
        );

        pagesSearch.forEach((page) => {
            if (numberPageSearch == page.innerHTML) {
                page.classList.add("active");
            }
        });

        if (numberPageSearch > 1) {
            arrowLeft.setAttribute("style", "display: flex");
        }
        if (numberPageSearch == pagesSearch.length) {
            arrowRight.setAttribute(
                "style",
                "color: var(--bgColorUno);cursor: default;"
            );
        }
    }

    // Cuando entra a una categoria.
    if (arrowRight) {
        const category = location.href.slice(31, 32);
        const numberPage = Number(location.href.slice(39));
        console.log(location.href.slice(39));

        pages.forEach((page) => {
            if (numberPage == page.innerHTML) {
                page.classList.add("active");
            }
        });

        if (numberPage > 1) {
            arrowLeft.setAttribute("style", "display: flex");
        }
        if (numberPage == pages.length) {
            arrowRight.setAttribute(
                "style",
                "color: var(--bgColorUno);cursor: default;"
            );
        }

        arrowRight.onclick = () => {
            if (numberPage != NaN) {
                if (numberPage == pages.length) {
                } else {
                    location.href = `/products/${category}?_page=${
                        numberPage + 1
                    }`;
                }
            } else {
                const pagesSearch = document.querySelectorAll(".paginado a");
            }
        };
        arrowLeft.onclick = () => {
            location.href = `/products/${category}?_page=${numberPage - 1}`;
        };
    }

    //------------   MODIFICAR LA CANTIDAD DE PRODUCTOS A COMPRAR EN LA PAGINA CARRITO  --------//

    const singleProduct = document.querySelectorAll(".singleProduct");
    const totalPrice = document.querySelector(".total_price span");
    const subtotales = [];

    singleProduct.forEach( (element, i) => {

        const deleteItem = element.querySelector(".delete p");
        const quantity = element.querySelector(".quantity select");
        subtotales.push(Number(element.querySelector(".price span").innerHTML))

        quantity.onchange = () => {

            const newQuantity = element.querySelector(".quantity select");
            const newSubtotal = Number(newQuantity.value) * subtotales[i];
            element.querySelector(".price span").innerHTML = newSubtotal.toFixed(2);

            let total = 0;
            const newSubtotals = document.querySelectorAll(".price span");

            newSubtotals.forEach( element => {

                total = total + Number(element.innerHTML);

            });
            totalPrice.innerHTML = total.toFixed(2);
        }

        deleteItem.onclick = () => {

            element.setAttribute("style","display: none;");
            element.querySelector(".price span").innerHTML = ""
            element.querySelector(".quantity input").setAttribute("disabled","");

            let total = 0;
            const newSubtotals = document.querySelectorAll(".price span");
            newSubtotals.forEach( element => {

                total = total + Number(element.innerHTML);

            });
            totalPrice.innerHTML = total.toFixed(2);

        }

    })


    //---------------------------------- AGREGAR AL CARRITO MODAL ----------------------------------------//

    const iconAdd = document.querySelectorAll(".fa-cart-plus");

    // Para que agregue los items al carrito cuando cambia de pagina.
    if (sessionStorage.cart) {
        document.querySelector(
            ".oneProduct"
        ).innerHTML = sessionStorage.getItem("cart");
        document.querySelector(
            ".form_cart"
        ).innerHTML += sessionStorage.getItem("itemsId");
    }

    let items = [];
    let itemsId = [];
    // Crea la sessionStorage y agrega los items al carrito modal.
    iconAdd.forEach((element) => {
        element.onclick = () => {

            const id = element.getAttribute("data-id");
            const image = document.querySelector(`.prod${id} .item_image`);
            const name = document.querySelector(`.prod${id} .item_name`);
            const price = document.querySelector(`.prod${id} .item_price`);

            if (!sessionStorage.cart) {
                items.push(
                    `<div class="row id${id}"><div class="image_cart"><img src="${image.src}" alt=""></div><div class="content_cart"><p class="close"><span data-id="id${id}">X</span></p><h3>${name.innerHTML}</h3><p>${price.innerHTML}</p></div></div>`
                );
                itemsId.push(
                    `<input name="id" style="display: none;" value="${id}">`
                );
                sessionStorage.setItem("cart", `${items}`);
                sessionStorage.setItem("itemsId", `${itemsId}`);
            } else {
                items = [];
                itemsId = [];
                const sessionItems = sessionStorage.getItem("cart");
                const sessionItemsId = sessionStorage.getItem("itemsId");
                items.push(
                    `<div class="row id${id}"><div class="image_cart"><img src="${image.src}" alt=""></div><div class="content_cart"><p class="close"><span data-id="id${id}">X</span></p><h3>${name.innerHTML}</h3><p>${price.innerHTML}</p></div></div>`,
                    sessionItems
                );
                itemsId.push(
                    `<input name="id" style="display: none;" value="${id}">`,
                    sessionItemsId
                );

                sessionStorage.setItem("cart", `${items}`);
                sessionStorage.setItem("itemsId", `${itemsId}`);
            }

            document.querySelector(".oneProduct").innerHTML = items.join("");
            document.querySelector(".form_cart").innerHTML += itemsId.join("");
        };

        // Vaciar carrito cuando va a Mis Compras (Pagina Carrito).
        const misCompras = document.querySelector(".mis_compras");
        misCompras.onclick = () => {

            sessionStorage.clear("cart");
            sessionStorage.clear("itemsId");

        }

        // Vaciar carrito.
        const clearCart = document.querySelector(".clear_cart");
        clearCart.onclick = () => {
            sessionStorage.clear("cart");
            sessionStorage.clear("itemsId");
            // sessionStorage.clear("cantItems");
            document.querySelector(
                ".oneProduct"
            ).innerHTML = sessionStorage.getItem("cart");
            document.querySelector(".form_cart").innerHTML += "";
            location.reload(true);
        };
    });

    

    //---------------------------------    PROFILE   ---------------------------------------------//

    // Para los botones de (Mis Datos).
    const enableModify = document.querySelector(".eneable_modify");
    const inputs = document.querySelectorAll(".form_update_profile input");
    const cancelar = document.querySelector(".disable_modify");
    const enviar = document.querySelector(".modify_myDates");
    const buttonsEneabled = document.querySelector(".buttons_eneabled");
    const password = document.querySelector(".labelPassword");

    if (enableModify) {
        enableModify.onclick = () => {
            enableModify.setAttribute("style", "display:none;");
            buttonsEneabled.setAttribute("style", "display: flex;");
            password.setAttribute("style", "display: inline-block;");

            inputs.forEach((input) => {
                input.removeAttribute("disabled");
            });
        };

        cancelar.onclick = () => {
            buttonsEneabled.removeAttribute("style");
            enableModify.removeAttribute("style");
            password.removeAttribute("style");

            inputs.forEach((input) => {
                input.setAttribute("disabled", "");
            });
        };
    }
    const watchDetail = document.querySelectorAll(".verDetalles");
                watchDetail.forEach(wD => {
                    const buttonId = wD.getAttribute("data-id");
                    const purchaseDetail = document.querySelector(`.purchaseDetail.id${buttonId}`);
                    wD.onclick = () =>{
                        if(purchaseDetail.hasAttribute("style")){
                            purchaseDetail.removeAttribute("style");
                        } else {
                            purchaseDetail.setAttribute("style","display: flex;");
                        }
                    }
                })
    // Botones principales ( Mis datos - Compras - Mensajes - Notificaciones)
    const enabled = document.querySelectorAll(".enabled_button");

    if (enabled) {
        enabled.forEach((button) => {
            button.onclick = () => {
                const id = button.getAttribute("data-id");
                const detail = document.querySelector(`.id${id}`);

                if (detail.hasAttribute("style")) {
                    document.querySelector(`.enabled_button.${id} i`).classList.remove("active");
                    document.querySelector(`.enabled_button.${id} p`).removeAttribute("style");
                    detail.removeAttribute("style");
                } else {
                    document.querySelector(`.enabled_button.${id} i`).classList.add("active");
                    document.querySelector(`.enabled_button.${id} p`).setAttribute("style","color: var(--bgColorCuatro);");
                    detail.setAttribute("style", "display: flex;");
                }

            };
        });
    }
    //Para los errores en el formulario de usuario, cuando modifica sus datos.
    const modify = location.href.slice(28, 34);
    if (modify == "update") {
        document
            .querySelector(".content_myDates.idmyDates")
            .setAttribute("style", "display: flex;");
    }
    // Si no hay mensajes.
    const noMessages = document.querySelector(".messages_profile .noMessages");
    const messages = document.querySelector(".messages_profile .singleMessage");
    const messagesContainer = document.querySelector(".messages_profile");

    if (messagesContainer) {
        if (!messages) {
            noMessages.setAttribute("style", "display: flex");
        } else {
            noMessages.removeAttribute("style");
        }
    }
    // Cambiar la imagen del avatar.
    const avatar = document.querySelector(".dateUser label");
    const inputAvatar = document.querySelector(
        ".form_update_avatar #inputAvatar"
    );
    const formAvatar = document.querySelector(".form_update_avatar")

    if (avatar) {
        inputAvatar.onchange = (e) => {
            const confirmar = confirm(
                "Esta seguro que desea cambiar la imagen?"
            );

            if (confirmar == true) {
                document
                    .querySelector(".idmyDates")
                    .setAttribute("style", "display: flex;");
                enableModify.setAttribute("style", "display:none;");
                buttonsEneabled.setAttribute("style", "display: flex;");

                inputs.forEach((input) => {
                    input.removeAttribute("disabled");
                });

                formAvatar.submit();
            } else {
                e.preventDefault();
            }
        };
    }

    const whatsappIcon = document.querySelector(".redes_sociales .fa-whatsapp");
    console.log(whatsappIcon)
    whatsappIcon.onclick = () => {

        const whatsapp_message = document.getElementById("whatsapp_message");
        console.log(whatsapp_message)
        if(whatsapp_message.hasAttribute("style")){
            whatsapp_message.removeAttribute("style");
        } else {
            whatsapp_message.setAttribute("style","display: flex;");
        }

    }
    const send = document.querySelector("#whatsapp_message button");

    send.onclick = () => {

        const message = document.querySelector("#whatsapp_message textarea").value;
        location.href = `https://api.whatsapp.com/send?phone=5493415853666&text=${message}`

    }

};
