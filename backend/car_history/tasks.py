from celery import shared_task
import logging, time, os
from django.core.cache import cache
from .models import Discussion
from celery import shared_task
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
from datetime import datetime

logger = logging.getLogger(__name__)
BROWSERLESS_TOKEN = os.getenv("BROWSERLESS_TOKEN")

@shared_task
def fetch_vehicle_history(registration, vin, production_date):
    """
    Task Celery do pobierania historii pojazdu.
    """
    url = "https://historiapojazdu.gov.pl/"

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Remote(
        command_executor=f"https://production-sfo.browserless.io/webdriver?token={BROWSERLESS_TOKEN}",
        options=chrome_options
    )

    try:
        date_obj = datetime.strptime(str(production_date), "%d%m%Y")
        date_str = date_obj.strftime("%d%m%Y")
        logger.info(f"Pobieranie danych dla VIN={vin}, rej={registration}, data={date_str}")

        driver.get(url)
        wait = WebDriverWait(driver, 10)

        # --- Fill form ---
        rejestracja_field = wait.until(EC.presence_of_element_located((By.ID, "registrationNumber")))
        vin_field = wait.until(EC.presence_of_element_located((By.ID, "VINNumber")))
        data_rejestracji = wait.until(EC.presence_of_element_located((By.ID, "firstRegistrationDate")))

        rejestracja_field.clear()
        rejestracja_field.send_keys(registration)

        vin_field.clear()
        vin_field.send_keys(vin)

        data_rejestracji.clear()
        data_rejestracji.send_keys(Keys.HOME)
        data_rejestracji.send_keys(date_str)

        submit = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.nforms-button")))
        submit.click()
        time.sleep(3)

        # --- Extract technical data ---
        tech_section = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//section[.//h2[contains(., 'Dane techniczne')]]")
        ))
        tech_html = tech_section.get_attribute("outerHTML")
        soup = BeautifulSoup(tech_html, "html.parser")
        field_map = {
            "Pojemność silnika": "engine_capacity",
            "Moc silnika": "engine_power",
            "Norma euro": "euro_norm",
            "Liczba miejsc ogółem": "seats_total",
            "Masa własna pojazdu": "mass_own",
            "Dopuszczalna masa całkowita": "mass_total",
            "Maks. masa całkowita przyczepy z hamulcem": "trailer_with_brake",
            "Maks. masa całkowita przyczepy bez hamulca": "trailer_without_brake"
        }

        data = {}
        for element in soup.find_all("app-label-value"):
            label = element.get("label", "").strip()
            if not label:
                label_elem = element.find("p", class_="label")
                if label_elem:
                    label = label_elem.get_text(strip=True).replace(":", "")
            value_elem = element.find("p", class_="value")
            if value_elem and label and label in field_map:
                data[field_map[label]] = value_elem.get_text(strip=True)

        # --- Extract timeline ---
        timeline_html = None
        try:
            timeline_tab = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//div[@role='tab' and contains(., 'Oś czasu')]")
            ))
            timeline_tab.click()
            time.sleep(2)
            timeline_container = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "app-axis ul")))
            timeline_html = timeline_container.get_attribute("outerHTML")
        except Exception as e:
            logger.warning(f"Nie udało się pobrać osi czasu: {e}")

        result = {
            "vin": vin,
            "registration": registration,
            "data_rejestracji": date_str,
            "technical_data": data,
            "timeline_html": timeline_html
        }

        logger.info("Zakończono scrapowanie pojazdu.")
        return result

    except Exception as e:
        logger.error(f"Błąd podczas scrapowania dla VIN={vin}: {e}")
        return None
    finally:
        driver.quit()


# -------------------------------
#  CACHE REFRESH TASK
# -------------------------------

CACHE_KEY = "discussion_list"
CACHE_TTL = 30


@shared_task
def refresh_discussions_cache_task():
    """Odświeżenie cache listy dyskusji."""
    try:
        queryset = (
            Discussion.objects.all()
            .select_related("author")
            .prefetch_related("images")
        )
        cache.set(CACHE_KEY, queryset, CACHE_TTL)

    except Exception as e:
        print(f"❌ Failed to refresh discussion cache: {e}")
