from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tests" / "baselines"
OUT.mkdir(parents=True, exist_ok=True)


def main() -> None:
    grain = ROOT / "public" / "media" / "blue-noise.png"
    assert grain.stat().st_size <= 6 * 1024, "grain tile exceeds 6KB"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:3000/specimen")
        page.wait_for_load_state("networkidle")
        page.screenshot(path=str(OUT / "specimen-python.png"), full_page=True)
        browser.close()


if __name__ == "__main__":
    main()
