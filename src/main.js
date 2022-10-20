import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type){

  const colors =  {
    "visa": ["#436D99", "#2D57F2"],
    "mastercard": ["#DF6F29", "#C69347"],
    "default": ["black", "gray"]
  }

  ccBgColor01.setAttribute("fill", colors[type] [0]);
  ccBgColor02.setAttribute("fill", colors[type] [1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
 
}

globalThis.setCardType = setCardType

// security code mask
const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// expiration date mask
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },

    YY: {
        mask: IMask.MaskedRange,
        from: String(new Date.getFullYear()).slice(2),
        to: String(new Date.getFullYear()+10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// card number mask
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:4[0-9]{12}(?:[0-9]{3})?)$/,
      cardtype: "visa"
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[1-5][0-9]{14})$/,
      cardtype: "mastercard"
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g,'');
    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex)
    })
    
    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// addButton
const addButton = document.querySelector('#add-card');
addButton.addEventListener('click', () => {
  alert('Cartão Adicionado!')
})

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
})

//Capturar nome do titular
const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//Capturar cvc
securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector('.cc-security .value')
  ccSecurity.innerText = code.length === 0 ? '123' : code
}

//capturar numberCard
numberCardMasked.on('acept', () => {
  const cardType = cardNumberMasked.masked.CurrentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(cNumber){
  const ccNumber = document.querySelector('.cc-number')
  ccNumber.innerText = cNumber.length === 0 ? '1234 5678 9012 3456' : cNumber
}

//capturar Data expiracao
expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector('.cc-extra .value')
  ccExpiration.innerText = date.length === 0 ? '02/32' : date
}
