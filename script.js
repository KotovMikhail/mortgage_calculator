/* Константы */
const CREDIT_MIN = 0;
const CREDIT_MAX = 15000000;
const CONTRIBUTION_MIN = 0;
const CONTRIBUTION_MAX = 2500000;
const RETURN_PERIOD_MIN = 1;
const RETURN_PERIOD_MAX = 200;

/* Переменные */
const creditText = document.querySelector(`#creditText`);
const creditRange = document.querySelector(`#creditRange`);
const firstContributionText = document.querySelector(`#firstContributionText`);
const firstContributionRange = document.querySelector(`#firstContributionRange`);
const returnPeriodText = document.querySelector(`#returnPeriodText`);
const returnPeriodRange = document.querySelector(`#returnPeriodRange`);

/* Форматтеры */
const formatterNumber = new Intl.NumberFormat(`ru`);
const formatterCurrency = new Intl.NumberFormat(`ru`, {
  style: `currency`,
  currency: `RUB`,
  minimumFractionDigits: 0
});

/* Меняет слово год */
const changeYearWord = function (value, variants) {
  const m1 = value % 100;
  const m0 = value % 10;

  if (m1 >= 5 && m1 <= 20) return variants[0];
  if (m0 === 1) return variants[1];
  if (m0 >= 2 && m0 <= 4) return variants[2];
  return variants[0];
}

/* Меняет слово год */
const formatterYear = value => `${formatterNumber.format(value)} ${changeYearWord(value,[`лет`,`год`,`года`])}`;

/* Вычисляет значение input */
const setValue = function (elem) {
  let number = ``;

  for (const letter of elem.value) {
    if (`0123456789`.includes(letter)) {
      number += letter;
    }
  }

  return number = parseInt(number)
}

// Первоначальное соответствие input'ов type="text" - type="range"
creditRange.value = setValue(creditText);
firstContributionRange.value = setValue(firstContributionText);
returnPeriodRange.value = setValue(returnPeriodText)

// Форматированние числа при focus
const onFocusFormatHundler = function (evt) {
  let number = setValue(evt.target)
  this.value = formatterNumber.format(number)
}

// Смена input range
const changeInputRange = function (elem) {
  if (elem === creditText) {
    return range = creditRange
  }

  if (elem === firstContributionText) {
    return range = firstContributionRange
  }

  if (elem === returnPeriodText) {
    return range = returnPeriodRange
  }
}

// Форматированние числа при событии input
const inputHandler = function () {
  let MIN = null;
  let MAX = null;
  let number = setValue(this);
  let range = changeInputRange(this);

  if (this === creditText) {
    MIN = CREDIT_MIN
    MAX = CREDIT_MAX
  }

  if (this === firstContributionText) {
    MIN = CONTRIBUTION_MIN
    MAX = CONTRIBUTION_MAX
  }

  if (this === returnPeriodText) {
    MIN = RETURN_PERIOD_MIN
    MAX = RETURN_PERIOD_MAX
  }

  if (number < MIN || isNaN(number)) {
    number = MIN
  }

  if (number > MAX) {
    number = MAX
  }

  range.value = number
  number = formatterNumber.format(number);
  this.value = number;
}

// Форматирование числа при событии blur
const onBlurFormatHundler = function (evt) {
  let number = setValue(evt.target);

  if (this === returnPeriodText) {
    this.value = formatterYear(number)
  } else {
    this.value = formatterCurrency.format(number)
  }
}

// Вешаем событие input на input
const setReaction = function (...args) {
  const handler = args.splice(-1)[0];

  for (const element of args) {
    element.addEventListener(`input`, function (event) {
      handler.call(this, event, args.slice())
    })
  }
}

const mainProccess = function () {
  const credit = parseInt(creditRange.value);
  const firstContribution = parseInt(firstContributionRange.value);
  const returnPeriod = parseInt(returnPeriodRange.value);

  let percent = 10 + Math.log(returnPeriod) / Math.log(0.5)
  percent = parseInt(percent * 100 + 1) / 100
  document.querySelector(`#percentNumber`).value = percent + ` %`

  let commonDebit = (credit - firstContribution) * (1 + percent) ^ returnPeriod;
  document.querySelector(`#common`).textContent = formatterCurrency.format(commonDebit)

  let subpayment = commonDebit - (credit - firstContribution);
  document.querySelector(`#subpayment`).textContent = formatterCurrency.format(subpayment)

  let payment = subpayment / (returnPeriod * 12);
  document.querySelector(`#payment`).textContent = formatterCurrency.format(payment)

}

setReaction(
  creditText,
  creditRange,
  firstContributionText,
  firstContributionRange,
  returnPeriodText,
  returnPeriodRange,
  mainProccess
)

mainProccess()

// Стоимость недвжимости
creditText.addEventListener(`focus`, onFocusFormatHundler)
creditText.addEventListener(`input`, inputHandler)
creditText.addEventListener(`blur`, onBlurFormatHundler)
creditRange.addEventListener(`input`, function () {
  creditText.value = formatterCurrency.format(parseInt(this.value))
})

// Перовначальный взнос
firstContributionText.addEventListener(`focus`, onFocusFormatHundler)
firstContributionText.addEventListener(`input`, inputHandler)
firstContributionText.addEventListener(`blur`, onBlurFormatHundler)
firstContributionRange.addEventListener(`input`, function () {
  firstContributionText.value = formatterCurrency.format(parseInt(this.value))
})

// Срок кредита
returnPeriodText.addEventListener(`focus`, onFocusFormatHundler)
returnPeriodText.addEventListener(`input`, inputHandler)
returnPeriodText.addEventListener(`blur`, onBlurFormatHundler)
returnPeriodRange.addEventListener(`input`, function () {

  returnPeriodText.value = formatterYear(this.value)
})