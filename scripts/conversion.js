import { countryList } from './codes.js';

const convertButton = document.querySelector('.js-convert-button');
const input = document.querySelector('.js-input');
const convertResult = document.querySelector('.js-convert-result');
const fromCurrency = document.querySelector('.js-from-currency');
const toCurrency = document.querySelector('.js-to-currency');

const fromCurrencySymbol = document.querySelector('.js-from-currency-symbol');
const toCurrencySymbol = document.querySelector('.js-to-currency-symbol');

let data;

async function getCountryInfo() {
    const URL = 'https://api.vatcomply.com/currencies';
    let response = await fetch(URL);
    data = await response.json();


    // The API returns an object, not an array, so we need to handle it differently

    Object.entries(data).forEach(([key, data]) => {
        fromCurrency.innerHTML += `<option value="${key}">${data.name} (${key})</option>`;
        toCurrency.innerHTML += `<option value="${key}">${data.name} (${key})</option>`;

    });

    setCurrencyImage();
    getCurrencySymbol();
}

getCountryInfo();

function setCurrencyImage() {

    Object.entries(countryList).forEach(([key, data]) => {

        fromCurrency.addEventListener('change', () => {

            if (fromCurrency.value === key) {
                const fromCountry = document.querySelector('.js-from-currency-image');

                fromCountry.innerHTML = `<img src="https://flagsapi.com/${data}/flat/64.png" alt="${data}" style="width: 64px; object-fit: contain;">`;
                console.log(fromCountry);

            }
        })

        toCurrency.addEventListener('change', () => {

            if (toCurrency.value === key) {
                const toCountry = document.querySelector('.js-to-currency-image');

                toCountry.innerHTML = `<img src="https://flagsapi.com/${data}/flat/64.png" alt="${data}" style="width: 64px; object-fit: contain;">`;
                console.log(toCountry);
            }
        })

    });
};

function getCurrencySymbol() {

    Object.entries(data).forEach(([key, data]) => {

        fromCurrency.addEventListener('change', () => {
            if (fromCurrency.value === key) {
                fromCurrencySymbol.innerHTML = data.symbol;
            }
        })

        toCurrency.addEventListener('change', () => {
            if (toCurrency.value === key) {
                toCurrencySymbol.innerHTML = data.symbol;
            }
        })
    })
}

if (fromCurrency.value === toCurrency.value) {
    convertResult.innerHTML = 'You cannot convert the same currency\'s';

}

convertButton.addEventListener('click', convertCurrency);

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        convertCurrency();
    }
})

async function convertCurrency() {

    if (fromCurrency.value !== toCurrency.value) {

        const URL = `https://api.frankfurter.dev/v1/latest?base=${fromCurrency.value}&symbols=${toCurrency.value}`

        let response = await fetch(URL);
        let data = await response.json();

        let toCurrencyRate = data.rates[toCurrency.value];

        console.log(toCurrencyRate);

        if (input.value === '') {
            input.value = 1;
        }
        let convertAmount = input.value * toCurrencyRate.toFixed(2);

        convertResult.innerHTML = `${input.value}: ${fromCurrency.value} = ${convertAmount}: ${toCurrency.value}`;

    } else {
        convertResult.innerHTML = 'You cannot convert the same currency\'s';
    }
}