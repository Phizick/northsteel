import requests
from bs4 import BeautifulSoup
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from starlette.responses import FileResponse
import aiohttp
from urllib.parse import unquote
import xml.etree.ElementTree as ET
from Algorithms.Core import config
import asyncio
from urllib.parse import urljoin


async def find_pdf_link(session, url, year):
    try:
        async with session.get(url) as response:
            text = await response.text()
            soup = BeautifulSoup(text, 'html.parser')
            containers = soup.find_all(['a', 'div'])

            for container in containers:
                links = container.find_all('a') if container.name == 'div' else [container]
                for link in links:
                    link_text = link.text + ''.join(span.text for span in link.find_all('span'))

                    if str(year) in link_text:
                        href = link.get('href')
                        if href and href.lower().endswith('.pdf'):
                            if not href.lower().startswith('http'):
                                href = urljoin(url, href)
                            return href
    except UnicodeDecodeError as e:
        return None
    return None


# def download_pdf(url, year):
#     pdf_link = find_pdf_link(url, year)
#     if not pdf_link:
#         raise ValueError(f"No PDF link found for the year on the provided URL")
#         response = requests.get(pdf_link)
#         pdf_file = f"document_{year}.pdf"
#         with open(pdf_file, 'wb') as f:
#             f.write(response.content)
#         return pdf_file


async def search_finance_report(query, year):
    print(f"Search query: {query}")
    full_query = f"{query} финансовая отчетность"

    url = config.YNDX_SEARCH_URL
    params = {'folderid': config.YNDX_API_FOLDER_ID, 'apikey': config.YNDX_TOKEN, 'query': full_query}

    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            print(f"API response status: {response.status}")
            if response.status != 200:
                return {'error': 'Search API did not respond properly'}

            text = await response.text()
            root = ET.fromstring(text)

            results = root.findall(".//results/grouping/group/doc")
            for result in results:
                url_element = result.find("url")
                if url_element is not None:
                    unquoted_url = unquote(url_element.text)
                    pdf_link = await find_pdf_link(session, unquoted_url, year)
                    if pdf_link:
                        return pdf_link

            return


