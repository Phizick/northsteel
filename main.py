import requests
from bs4 import BeautifulSoup


def fetch_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Ошибка при запросе к {url}: {e}")
        return None


def scrape_links(url, class_name, keyword):
    html_content = fetch_url(url)
    urls = []
    if html_content:
        soup = BeautifulSoup(html_content, 'html.parser')
        links = soup.find_all('a', class_=class_name)
        for link in links:
            text = link.text.strip().lower()
            href = link.get('href')
            if href and keyword in text:
                base_url = "https://www.rbc.ru"
                if not href.startswith(base_url):
                    href = base_url + href
                urls.append(href)
    print(urls)
    return urls


def scrape_paragraphs_from_pages(urls):
    for url in urls:
        print(f"Содержимое из {url}:")
        html_content = fetch_url(url)
        if html_content:
            soup = BeautifulSoup(html_content, 'html.parser')
            paragraphs = soup.find_all('p')
            for paragraph in paragraphs:
                text = paragraph.text.strip()
                if text:
                    print(text)
            print("-------")


def main():
    start_url = "https://www.rbc.ru/industries/regions"
    class_name = "info-block-title"
    urls = scrape_links(start_url, class_name, 'москвы')
    scrape_paragraphs_from_pages(urls)



if __name__ == "__main__":
    main()
