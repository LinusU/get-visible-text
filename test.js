/* eslint-env mocha */

const assert = require('assert')
const puppeteer = require('puppeteer')
const getVisibleText = require('./')

describe('get-visible-text', function () {
  this.timeout(15000)
  this.slow(250)

  let browser, page

  before(async () => { browser = await puppeteer.launch() })
  beforeEach(async () => { page = await browser.newPage() })
  afterEach(async () => { await page.close() })
  after(async () => { await browser.close() })

  it('finds plain text', async () => {
    await page.setContent('<div>Hello, World!</div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, 'Hello, World!')
  })

  it('collapses whitespace', async () => {
    await page.setContent('<div>  \t\t   Hello,    \n\n\n\n     World!  \t\r\n  </div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, ' Hello, World! ')
  })

  it('preserves whitespace between elements', async () => {
    await page.setContent('<div><span>Hello,</span> <span>World!</span></div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, 'Hello, World!')
  })

  it('sees overflowing text', async () => {
    await page.setContent('<div style="height: 0">Hello, World!</div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, 'Hello, World!')
  })

  it('discards clipped text', async () => {
    await page.setContent('<div style="height: 0; overflow: hidden">Hello, World!</div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, '')
  })

  it('discards elements with display = none', async () => {
    await page.setContent('<div>Hello, <span style="display: none">LALALALALALA</span> World!</div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, 'Hello, World!')
  })

  it('discards transparent elements', async () => {
    await page.setContent('<div>Hello, <span style="opacity: 0.001">LALALALALALA</span> World!</div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, 'Hello, World!')
  })

  it('sees elements with invalid opacity', async () => {
    await page.setContent('<div>Hello, <span style="opacity: foobar">FOO</span> World!</div>')
    const result = await page.evaluate(`(${getVisibleText}(document.querySelector('div')))`)
    assert.strictEqual(result, 'Hello, FOO World!')
  })

  it('works with readme.md example', async () => {
    await page.goto('https://example.com')

    const h1 = await page.$('h1')
    const text = await page.evaluate(getVisibleText, h1)

    assert.strictEqual(text, 'Example Domain')
  })
})
