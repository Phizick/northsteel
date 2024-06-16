
FROM python:3.9-slim


RUN pip install nltk
RUN python -m nltk.downloader stopwords
RUN python -m nltk.downloader punkt


RUN python -m pip install --upgrade pip


WORKDIR /app


COPY . /app


RUN pip install -r requirements.txt


ENV APP_MODULE=app:app


EXPOSE 5000


CMD ["python", "app.py"]
