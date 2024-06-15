
FROM python:3.9-slim

RUN pip install nltk

RUN python -m nltk.downloader stopwords

RUN python -m nltk.downloader punkt


ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0


WORKDIR /app


COPY . /app

RUN python -m pip install --upgrade pip

RUN pip install -r requirements.txt


EXPOSE 5000


CMD ["flask", "run"]
