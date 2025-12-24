const playwright = require('playwright');
const fs = require('fs');

const CONCURRENCY_LIMIT = 6;
const DATA_FILE = 'course_data.json';

(async () => {
    const allLinks = JSON.parse(fs.readFileSync('course_links.json', 'utf8'));

    let courses_data = [];
    if (fs.existsSync(DATA_FILE)) {
        try {
            const existingContent = fs.readFileSync(DATA_FILE, 'utf8');
            // If file is empty or corrupted, start with empty array
            courses_data = existingContent ? JSON.parse(existingContent) : [];
        } catch (e) {
            courses_data = [];
        }
    }

    // Filter out items where courseID is "N/A" (failed ones) or already finished
    const finishedLinks = new Set(
        courses_data
            .filter(c => c && c.courseID !== "N/A") 
            .map(c => c.link)
    );

    const linksToScrape = allLinks.filter(link => !finishedLinks.has(link));

    console.log(`🚀 Total links: ${allLinks.length}`);
    console.log(`✅ Already finished: ${finishedLinks.size}`);
    console.log(`📡 Remaining to scrape: ${linksToScrape.length}`);

    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    });
    
    
    console.log(`🚀 Starting Phase 3: Scraping ${allLinks.length} courses...`);

    async function processCourse(link) {
        const page = await context.newPage();
        const courseName = link.split('/').pop()

        try {
            await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));

            console.log(`Starting: ${courseName}`)
            await page.goto(link, {waitUntil: 'domcontentloaded'})

            // Check if we hit the Forbidden wall
            const isForbidden = await page.evaluate(() => document.body.innerText.includes("Forbidden"));
            if (isForbidden) {
                throw new Error("IP_BANNED");
            }

            await page.waitForSelector('[data-testid="attributes-table"]')

            const subject = await page
                .getByRole('heading', { level: 3, name: 'Subject Area' })
                .locator('xpath=following-sibling::div//a')
                .textContent().catch(() => "N/A")

            const course_name = await page
                .locator('.e1ixoanv9')
                .textContent().catch(() => "N/A")

            const courseID = await page
                .locator('.css-1bzya3n-styled--StyledFlexItemSubheading.e1ixoanv1')
                .textContent().catch(() => "N/A")

            const units = await page
                .locator('.css-3o8c36-styled--StyledFlexItem.e1ixoanv2')
                .textContent().catch(() => "N/A")

            return {
                subject: subject?.trim(),
                course_name: course_name?.trim(),
                courseID: courseID?.trim(),
                units: units?.trim(),
                link
            }

        } catch (error) {
            if (error.message === "IP_BANNED") {
                console.error("⛔ STILL BLOCKED: Stop script and change IP/VPN.");
                process.exit(1);
            }
            console.error(`Error on course ${courseName}: ${error.message}`);
            return { courseID: "N/A", link };
        } finally {
            await page.close();
        }
    }

    // Process courses in parallel
    for (let i = 0; i < linksToScrape.length; i += CONCURRENCY_LIMIT) {
        const chunk = linksToScrape.slice(i, i + CONCURRENCY_LIMIT);
        const results = await Promise.all(chunk.map(link => processCourse(link)))

        courses_data.push(...results.filter(r => r !== null));

        fs.writeFileSync(DATA_FILE, JSON.stringify(courses_data, null, 4));
        console.log(`📈 Progress: ${courses_data.length} total courses in file`);
    }

    
    console.log(`🏁 Finished! Total courses saved: ${courses_data.length}`);

    // Close the browser
    await browser.close();
})();
