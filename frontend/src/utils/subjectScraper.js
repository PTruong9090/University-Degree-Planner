const playwright = require('playwright');
const fs = require('fs');

const CONCURRENCY_LIMIT = 12;

(async () => {
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // OPTIMIZATION: Block images to save bandwidth
   await context.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort()); 

    // Go to the page
    console.log("Phase 1: Finding all Subject Areas...")
    await page.goto("https://catalog.registrar.ucla.edu/");

    // Click Subject Area tab and wait for selector to load
    await page.getByTestId('browse ? browse-tabs-2 : tabs-2').click()
    await page.waitForSelector('.css-9tm5q0-Tile--STileHeader.e1mix0ja2')

    const subjectLinks = await page.evaluate(() =>
        [...document.querySelectorAll('.e1mix0ja3 a')]
            .map(a => a.href)
    );
    
    const course_links = [];

    console.log(`Found ${subjectLinks.length} subjects. Phase 2: Collecting course links`)

    async function processSubject(subLink) {
        const page = await context.newPage();
        const subjectName = subLink.split('/').pop()
        const localLinks = []

        try {
            console.log(`Starting: ${subjectName}`)
            await page.goto(subLink, {waitUntil: 'networkidle'})

            while (true) {
                // Wait for the page to load
                await page.waitForSelector('.e1t6s54p8')

                // Get links for each course
                const links = await page.evaluate(() => {
                    // Select all the elements with the specified class and extract href attributes
                    return Array.from(
                        document.querySelectorAll('.e1t6s54p8')
                    ).map(link => link.href);
                });

                // Add links to the main array
                localLinks.push(...links);

                // Check if next button is disabled
                const nextButton = await page.$('button[aria-label="Go forward 1 page in results"]');
                if (!nextButton) break

                const isDisabled = await nextButton.evaluate(btn => btn.disabled || btn.getAttribute('aria-disabled') === 'true')
                if (isDisabled) break

                await page.click('button[aria-label="Go forward 1 page in results"]')
            }
            console.log(`Finished: ${subjectName}: Found ${localLinks.length} courses`)

        } catch (error) {
            console.error(`Error on subject ${subjectName}: ${error.message}`);
        } finally {
            await page.close();
        }
        return localLinks
    }

    // Process subjects in parallel chunks
    for (let i = 0; i < subjectLinks.length; i += CONCURRENCY_LIMIT) {
        const chunk = subjectLinks.slice(i, i + CONCURRENCY_LIMIT);
        const results = await Promise.all(chunk.map(link => processSubject(link)))

        results.forEach(links => course_links.push(...links))
        console.log(`Overall Progress: ${Math.round((i / subjectLinks.length) * 100)}%}`)
    }


    const uniqueLinks = [...new Set(course_links)]

    // Save all data to a JSON file
    fs.writeFileSync('course_links.json', JSON.stringify(uniqueLinks, null, 4));

    console.log(`Total Unique Course Links: ${uniqueLinks.length}}`)
    
    const courses_data = [];

    async function processCourse(link) {
        const page = await context.newPage();
        const courseName = link.split('/').pop()

        try {
            console.log(`Starting: ${courseName}`)
            await page.goto(link, {waitUntil: 'domcontentloaded'})

            await page.waitForSelector('.ekft6gv0')

            const subject = await page
                .getByRole('heading', { level: 3, name: 'Subject Area' })
                .locator('xpath=following-sibling::div//a')
                .textContent();

            const course_name = await page
                .locator('.e1ixoanv9')
                .textContent();

            const courseID = await page
                .locator('.css-1bzya3n-styled--StyledFlexItemSubheading.e1ixoanv1')
                .textContent()

            const units = await page
                .locator('.css-3o8c36-styled--StyledFlexItem.e1ixoanv2')
                .textContent()

            return {
                subject,
                course_name,
                courseID,
                units,
                link
            }

        } catch (error) {
            console.error(`Error on course ${courseName}: ${error.message}`);
        } finally {
            await page.close();
        }
    }

    // Process courses in parallel
    for (let i = 0; i < uniqueLinks.length; i += CONCURRENCY_LIMIT) {
        const chunk = uniqueLinks.slice(i, i + CONCURRENCY_LIMIT);
        const results = await Promise.all(chunk.map(link => processCourse(link)))

        courses_data.push(...results.filter(r => r !== null));

        if (i % 100 === 0 || i + COURSE_CONCURRENCY >= uniqueLinks.length) {
            console.log(`📈 Progress: ${courses_data.length} / ${uniqueLinks.length} courses scraped`);
        }
    }

    // Save all data to a JSON file
    fs.writeFileSync('course_data.json', JSON.stringify(courses_data, null, 4));

    // Close the browser
    await browser.close();
})();
