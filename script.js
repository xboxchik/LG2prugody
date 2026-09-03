// ========================================
// LOGIGAMER 2.0
// ========================================


// ========================================
// ELEMENTS
// ========================================

const catalogBtn = document.getElementById("catalogBtn");
const catalogMenu = document.getElementById("catalogMenu");

const categoryButtons =
    document.querySelectorAll("#catalogMenu button");

const cards =
    document.querySelectorAll(".card");

const categoryTitle =
    document.getElementById("categoryTitle");

const searchInput =
    document.getElementById("searchInput");

const cartBtn =
    document.getElementById("cartBtn");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const clearCart =
    document.getElementById("clearCart");

const checkout =
    document.getElementById("checkout");


// ========================================
// CATALOG
// ========================================

catalogBtn.addEventListener("click", function(event) {

    event.stopPropagation();

    catalogMenu.classList.toggle("active");

});


document.addEventListener("click", function(event) {

    if (!event.target.closest(".catalog-wrapper")) {

        catalogMenu.classList.remove("active");

    }

});


// ========================================
// FILTER
// ========================================

let currentCategory = "all";


const categoryNames = {

    all: "Всі ігри",

    action: "⚔️ Екшн",

    rpg: "🧙 RPG",

    strategy: "♟️ Стратегії",

    simulator: "🚗 Симулятори",

    adventure: "🗺️ Пригоди",

    arcade: "👾 Аркади",

    puzzle: "🧩 Головоломки"

};


function filterGames() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    cards.forEach(card => {

        const name =
            card.dataset.name
                .toLowerCase();

        const category =
            card.dataset.category;


        const categoryMatch =
            currentCategory === "all" ||
            category === currentCategory;


        const searchMatch =
            name.includes(search);


        if (
            categoryMatch &&
            searchMatch
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


categoryButtons.forEach(button => {

    button.addEventListener("click", function() {

        currentCategory =
            this.dataset.category;


        categoryTitle.textContent =
            categoryNames[currentCategory];


        catalogMenu.classList.remove("active");


        filterGames();


        document
            .getElementById("games")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", function() {

    filterGames();

});


// ========================================
// CART
// ========================================

let cart =
    JSON.parse(
        localStorage.getItem("logigamerCart")
    ) || [];


// ========================================
// SAVE
// ========================================

function saveCart() {

    localStorage.setItem(
        "logigamerCart",
        JSON.stringify(cart)
    );

}


// ========================================
// ADD TO CART
// ========================================

document
    .querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const name =
                    this.dataset.name;

                const price =
                    Number(
                        this.dataset.price
                    );


                const existing =
                    cart.find(
                        item =>
                            item.name === name
                    );


                if (existing) {

                    alert(
                        "Ця гра вже є у кошику!"
                    );

                    return;

                }


                cart.push({
                    name: name,
                    price: price
                });


                saveCart();

                updateCart();


                const oldText =
                    this.textContent;


                this.textContent =
                    "✓ Додано!";


                this.style.background =
                    "#28a745";


                setTimeout(() => {

                    this.textContent =
                        oldText;

                    this.style.background =
                        "";

                }, 1200);

            }
        );

    });


// ========================================
// UPDATE CART
// ========================================

function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                🛒 Кошик порожній
            </p>
        `;

    }


    let total = 0;


    cart.forEach((item, index) => {

        total += item.price;


        const element =
            document.createElement("div");


        element.className =
            "cart-item";


        element.innerHTML = `

            <div class="cart-item-info">

                <h4>
                    ${escapeHTML(item.name)}
                </h4>

                <p>
                    ${item.price}₴
                </p>

            </div>

            <button
                class="remove-item"
                data-index="${index}"
                type="button"
            >
                ✕
            </button>

        `;


        cartItems.appendChild(element);

    });


    cartCount.textContent =
        cart.length;


    cartTotal.textContent =
        total + "₴";


    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    cart.splice(
                        index,
                        1
                    );


                    saveCart();

                    updateCart();

                }
            );

        });

}


// ========================================
// HTML SECURITY
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ========================================
// OPEN CART
// ========================================

cartBtn.addEventListener(
    "click",
    function() {

        cartOverlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }
);


// ========================================
// CLOSE CART
// ========================================

function closeCartWindow() {

    cartOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


closeCart.addEventListener(
    "click",
    closeCartWindow
);


cartOverlay.addEventListener(
    "click",
    function(event) {

        if (
            event.target === cartOverlay
        ) {

            closeCartWindow();

        }

    }
);


// ========================================
// ESC
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            catalogMenu.classList.remove(
                "active"
            );

            if (
                cartOverlay.classList.contains(
                    "active"
                )
            ) {

                closeCartWindow();

            }

        }

    }
);


// ========================================
// CLEAR CART
// ========================================

clearCart.addEventListener(
    "click",
    function() {

        if (cart.length === 0) {
            return;
        }


        const confirmed =
            confirm(
                "Очистити весь кошик?"
            );


        if (!confirmed) {
            return;
        }


        cart = [];


        saveCart();

        updateCart();

    }
);


// ========================================
// CHECKOUT
// ========================================

checkout.addEventListener(
    "click",
    function() {

        if (cart.length === 0) {

            alert(
                "Ваш кошик порожній!"
            );

            return;

        }


        let total = 0;

        cart.forEach(item => {
            total += item.price;
        });


        alert(
            "Дякуємо за замовлення! 🎮\n\n" +
            "Товарів: " +
            cart.length +
            "\n" +
            "Сума: " +
            total +
            "₴\n\n" +
            "Це демо-версія LogiGamer."
        );

    }
);


// ========================================
// HERO BUTTON
// ========================================

document
    .getElementById("letsGo")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById("games")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


// ========================================
// DARK THEME
// ========================================

const themeBtn =
    document.createElement("button");


themeBtn.textContent = "🌙";

themeBtn.title =
    "Змінити тему";

themeBtn.setAttribute(
    "aria-label",
    "Змінити тему"
);


themeBtn.style.position =
    "fixed";

themeBtn.style.bottom =
    "20px";

themeBtn.style.right =
    "20px";

themeBtn.style.width =
    "50px";

themeBtn.style.height =
    "50px";

themeBtn.style.border =
    "none";

themeBtn.style.borderRadius =
    "50%";

themeBtn.style.background =
    "#111";

themeBtn.style.color =
    "white";

themeBtn.style.fontSize =
    "20px";

themeBtn.style.cursor =
    "pointer";

themeBtn.style.zIndex =
    "1500";

themeBtn.style.boxShadow =
    "0 5px 20px rgba(0,0,0,0.3)";


document.body.appendChild(
    themeBtn
);


// ========================================
// LOAD THEME
// ========================================

const savedTheme =
    localStorage.getItem(
        "logigamerTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-theme"
    );

    themeBtn.textContent =
        "☀️";

}


// ========================================
// CHANGE THEME
// ========================================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-theme"
        );


        const dark =
            document.body.classList.contains(
                "dark-theme"
            );


        if (dark) {

            themeBtn.textContent =
                "☀️";

            localStorage.setItem(
                "logigamerTheme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙";

            localStorage.setItem(
                "logigamerTheme",
                "light"
            );

        }

    }
);
 function createSnowflake() {
    const flake = document.createElement('div');
    flake.textContent = '🎮'; 
    flake.style.position = 'fixed';
    flake.style.top = '-20px';
    flake.style.left = Math.random() * window.innerWidth + 'px';
    flake.style.fontSize = (Math.random() * 20 + 10) + 'px';
    flake.style.opacity = Math.random();
    flake.style.pointerEvents = 'none';
    flake.style.transition = 'transform 4s linear, opacity 4s linear';

    document.body.appendChild(flake);

    setTimeout(() => {
      flake.style.transform = `translateY(${window.innerHeight + 50}px) rotate(360deg)`;
    }, 50);

    setTimeout(() => {
      flake.remove();
    }, 4000);
  }

  // Створюємо нову сніжинку кожні 300 мілісекунд
  setInterval(createSnowflake, 300);




// ========================================
// START
// ========================================

updateCart();
filterGames();
