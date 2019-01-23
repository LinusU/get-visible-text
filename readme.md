# Get Visible Text

Retreives the visible text of a DOM Element.

## Installation

```sh
npm install --save get-visible-text
```

## Usage

```js
const getVisibleText = require('get-visible-text')

// <div>Hello,   <span>World<span>!</div>
getVisibleText(document.querySelector('div'))
//=> Hello, World!
```

The function can also be used with Puppeteer:

```js
const getVisibleText = require('get-visible-text')
const puppeteer = require('puppeteer')

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://example.com')

  const h1 = await page.$('h1')
  const text = await page.evaluate(getVisibleText, h1)

  console.log(text)
  //=> Example Domain

  await browser.close()
})()
```
