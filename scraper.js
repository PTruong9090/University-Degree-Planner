const playwright = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Go to the page
    await page.goto("https://catalog.registrar.ucla.edu/browse/Subject%20Areas/COMSCI");

    const course_links = [];

    while (true) {
        // Wait for the page to load
        await page.waitForTimeout(1000);

        // Get links for each course
        const links = await page.evaluate(() => {
            // Select all the elements with the specified class and extract href attributes
            return Array.from(
                document.querySelectorAll('.cs-list-item.css-6xsx5y-Links--StyledLink-Links--StyledAILink.e1t6s54p8')
            ).map(link => link.href);
        });

        // Add links to the main array
        course_links.push(...links);

        // Check if next button is disabled
        const isNextButtonDisabled = await page.evaluate(() => {
            const nextButton = document.querySelector('button[aria-label="Go forward 1 page in results"]');
            return nextButton? nextButton.disabled || nextButton.getAttribute('aria-disabled') === 'true': true;
        })

        if (isNextButtonDisabled) {
            break;
        }

        await page.click('button[aria-label="Go forward 1 page in results"]')
    }
    const courses_data = [];

    // Loop through all links
    for (const link of course_links) {
        await page.goto(link);
        await page.waitForSelector('.css-3o8c36-styled--StyledFlexItem.e1ixoanv2');

        // Get course name and units
        const course_name = await page.evaluate(() => document.querySelector('.css-1bzya3n-styled--StyledFlexItemSubheading.e1ixoanv1').textContent.trim());
        
        const course_unit = await page.evaluate(() => {
            const unit = document.querySelector('.css-3o8c36-styled--StyledFlexItem.e1ixoanv2').textContent.trim();
            return Number(unit[0]);
        })
        console.log(course_unit);

        // Add course data into JSON
        courses_data.push({
            course_name,
            department: "Computer Science",
            units: course_unit,
            link: link
        })
    }

    // Save all links to a file (optional)
    fs.writeFileSync('comsci_courses.json', JSON.stringify(courses_data, null, 4));

    // Close the browser
    await browser.close();
})();
