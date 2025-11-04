"use strict";

import { ERROR_SERVER, NO_ITEMS_CART } from './constants.js';
import { 
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';

const cart = document.querySelector('.cart');
let productsData = [];

async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('../data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            productsData = await res.json();
        }

        loadProductBasket(productsData);
    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err.message);
    }
}

function loadProductBasket(data) {
    cart.textContent = '';

    if (!data || !data.length) {
        showErrorMessage(ERROR_SERVER);
        return;
    }

    checkingRelevanceValueBasket(data);
    const basket = getBasketLocalStorage();

    if (!basket || !basket.length) {
        showErrorMessage(NO_ITEMS_CART);
        return;
    }

    const findProducts = data.filter(item => basket.includes(String(item.id)));

    if (!findProducts.length) {
        showErrorMessage(NO_ITEMS_CART);
        return;
    }

    renderProductsBasket(findProducts);
}

function delProductBasket(event) {
    const targetButton = event.target.closest('.cart__del-card');
    if (!targetButton) return;

    const card = targetButton.closest('.cart__product');
    const id = card.dataset.productId;
    const basket = getBasketLocalStorage();

    const newBasket = basket.filter(item => item !== id);
    setBasketLocalStorage(newBasket);

    getProducts();
}
let goodTitle = [];
let goodSumma = [];
let goodSumma1 = [];
let goodSumma2 = [];
function renderProductsBasket(arr) {
    let summa = 0;
    let summa1 = 0;
    let summa2 = 0;
    arr.forEach(card => {
        const { id, img, title, price, discount  } = card;
        const priceDiscount = price - ((price * discount) / 100);
        summa += Number(priceDiscount);
        summa1 += Number(priceDiscount) * 98
        summa2 += Number(priceDiscount) * 10.7
        
        
        goodTitle.push(title);
        goodSumma = summa.toFixed(1);
        goodSumma1 = summa1.toFixed(1);
        goodSumma2 = summa2.toFixed(1);
        const cardItem = `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__img">
                <img src="./images/${img}" alt="${title}">
            </div>
        </div>
        `;

        cart.insertAdjacentHTML('beforeend', cardItem);

    });
}

// URL твоего Google Apps Script
const scriptURL = "https://script.google.com/macros/s/AKfycbxYBPqDO_SEfwBeCNy5NmfaEktA6KEcrOidL89lgBJrRSdVZSrdozTz14MTf4Np5M3i/exec";

document.querySelector('#applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const fullName = formData.get('fullName');
    const phoneNumber = formData.get('phoneNumber');
    const adress = formData.get('adress');
    const comment = formData.get('commentari');

    const data = {
        fullName,
        phoneNumber,
        adress,
        goodTitle,
        goodSumma,
        goodSumma1,
        goodSumma2,
        comment
    };

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(res => {
        alert("Ваша заявка отправлено! Скоро свяжемся с вами! С уважением, САМО!");
        window.location.href = 'index.html';
    })
    .catch(err => console.error('Ошибка сохранения: ', err));
});

getProducts();


get
