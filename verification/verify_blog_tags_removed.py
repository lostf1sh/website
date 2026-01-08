from playwright.sync_api import Page, expect, sync_playwright

def verify_blog_tags_removed(page: Page):
    # 1. Arrange: Go to the blog page
    page.goto("http://localhost:5173/blog")

    # Wait for the initial load
    page.wait_for_timeout(1000)

    # 2. Assert: Check that "ls tags/" is NOT present
    content = page.content()

    if "ls tags/" in content:
        print("FAILURE: 'ls tags/' found in page content.")
        exit(1)
    else:
        print("SUCCESS: 'ls tags/' not found.")

    # 3. Screenshot for visual confirmation
    page.screenshot(path="verification/blog_no_tags.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_blog_tags_removed(page)
        finally:
            browser.close()
