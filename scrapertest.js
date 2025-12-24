const playwright = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await playwright.chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://catalog.registrar.ucla.edu/course/2025/AEROSTA");

    await page.waitForSelector('.ene3w3n2')

    const data = await page.evaluate(() => {
        const getText = (selector) => document.querySelector(selector)?.textContent?.trim() || "N/A";
        
        return {
            courseID: getText('.e1ixoanv1'),
            course_name: getText('.e1ixoanv9'),
            units: getText('.css-3o8c36-styled--StyledFlexItem.e1ixoanv2')[0],
            link: 'https://catalog.registrar.ucla.edu/course/2025/AEROSTA'
        };
    });

    console.log(data.courseID, data.course_name, data.units, data.link)

    page.close()

})()