const puppeteer = require('puppeteer');
const testString = require('../public/testStrings')

puppeteer.launch({
    headless: false,
    slowMo: 1,
    devtools: true
}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({
        width: 2000,
        height: 600
    });
    await page.goto('http://localhost:8080/');


    await page.click("#identify")
    // await browser.close();
});

async function fillData(page, text, username) {
    await page.type('#text_input', text, {
        delay: Math.floor(Math.random() * 21) + 40
    })
    await page.type('#user_input', username)
}

async function createUser(page, text, username) {
    await fillData(page, text, username)
    await page.click("#add_user")
}

async function identify(page, text, username) {
    await fillData(page, text, username)
    await page.click("#identify")
}

async function checkUserExists(page, username) {
    await page.type('#user_input', username)
    await page.click("#user_exists")
}

async function checkUserExists(page, username) {
    await page.type('#user_input', username)
    await page.click("#delete_user")
}

