import nltk
from heapq import nlargest
from collections import defaultdict
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from string import punctuation

nltk.data.path.append('/root/nltk_data')

# функция обработки текста, найденого парсером. ищет совпадения по ключевым словам
# из массивов filter_array. ключевые слова настраиваются
# результат мепится в общий поток ответа


async def extract_sentences(text_content, num_keywords, keywords):
    print(keywords)
    if isinstance(text_content, list):
        text_content = ''.join(text_content)

    stop_words = set(stopwords.words("russian") + list(punctuation))

    words_frequency = defaultdict(int)
    for word in word_tokenize(text_content):
        word = word.lower()  # Приводим слово к нижнему регистру
        if word not in stop_words:
            words_frequency[word] += 1

    keywords_count = {keyword: words_frequency.get(keyword.lower(), 0) for keyword in keywords}
    top_keywords = nlargest(num_keywords, keywords, key=lambda k: keywords_count.get(k.lower(), 0))

    sentences = sent_tokenize(text_content)

    relevant_sentences = []
    for sentence in sentences:
        for keyword in top_keywords:
            if keyword.lower() in sentence.lower():
                relevant_sentences.append(sentence)
                break  # Прерываем цикл, чтобы избежать добавления предложения несколько раз

    result_text = " ".join(relevant_sentences)
    print("extract_sentences")

    return result_text

