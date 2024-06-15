import nltk
from heapq import nlargest
from collections import defaultdict
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from string import punctuation

nltk.data.path.append('/root/nltk_data')


async def extract_sentences(text_content, num_keywords, keywords):
    if isinstance(text_content, list):
        text_content = ''.join(text_content)

    stop_words = set(stopwords.words("russian") + list(punctuation))

    words_frequency = defaultdict(int)

    for word in word_tokenize(text_content):
        if word not in stop_words:
            words_frequency[word] += 1

    keywords_count = {keyword: words_frequency[keyword] for keyword in keywords}
    top_keywords = nlargest(num_keywords, keywords, key=keywords_count.get)

    sentences = sent_tokenize(text_content)

    relevant_sentences = []
    for sentence in sentences:
        for keyword in top_keywords:
            if keyword in sentence.lower():
                relevant_sentences.append(sentence)

    result_text = " ".join(relevant_sentences)
    print('extract_sentences')

    return result_text
