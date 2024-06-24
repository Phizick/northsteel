
FROM joyzoursky/python-chromedriver:3.8

RUN export PATH=$PATH:/usr/local/bin/chromedriver


RUN python -m pip install --upgrade pip
RUN pip install nltk
RUN pip install webdriver-manager
RUN python -m nltk.downloader stopwords
RUN python -m nltk.downloader punkt


WORKDIR /app
COPY . /app

RUN pip install -r requirements.txt


ENV APP_MODULE=app:app


EXPOSE 5000


CMD ["python", "app.py"]
