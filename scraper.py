import asyncio
from playwright.async_api import async_playwright
import pandas as pd

async def scrape_ucla_courses():
    # Initialize Playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to the main page
        await page.goto("https://catalog.registrar.ucla.edu/browse/Subject%20Areas/MATH")

        course_links = []

        # Extract links from all pages
        while True:
            # Wait for the page to load
            await page.wait_for_timeout(1000)

            # Get links for each course
            links = await page.evaluate("""
                () => Array.from(
                    document.querySelectorAll('.cs-list-item.css-6xsx5y-Links--StyledLink-Links--StyledAILink.e1t6s54p8')
                ).map(link => link.href)
            """)
            course_links.extend(links)

            # Check if the next button is disabled
            is_next_disabled = await page.evaluate("""
                () => {
                    const nextButton = document.querySelector('button[aria-label="Go forward 1 page in results"]');
                    return nextButton ? nextButton.disabled || nextButton.getAttribute('aria-disabled') === 'true' : true;
                }
            """)
            if is_next_disabled:
                break

            # Click the next button
            await page.click('button[aria-label="Go forward 1 page in results"]')

        # Initialize a DataFrame to store course details
        courses_data = []

        for link in course_links:
            print(link);
        

        # Close the browser
        await browser.close()

# Run the async function
if __name__ == "__main__":
    asyncio.run(scrape_ucla_courses())
