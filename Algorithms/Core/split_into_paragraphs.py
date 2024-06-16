# функция разбивки текста на параграфы
def split_into_paragraphs(text, sentences_per_paragraph=5):
    truncated_message_patterns = [
        "[Message truncated",
        "due to length.]",
        "...[Message truncated due to length.]",
    ]

    for pattern in truncated_message_patterns:
        text = text.replace(pattern, '')

    sentences = text.replace('!', '.').replace('?', '.').split('.')
    paragraphs = []
    current_paragraph = []

    for sentence in sentences:
        stripped_sentence = sentence.strip()
        if stripped_sentence:
            current_paragraph.append(stripped_sentence)
        if len(current_paragraph) >= sentences_per_paragraph:
            paragraphs.append(' '.join(current_paragraph) + '.')
            current_paragraph = []

    if current_paragraph:
        paragraphs.append(' '.join(current_paragraph) + '.')

    return paragraphs


async def create_paragraphs_object(text):
    paragraphs = split_into_paragraphs(text)
    result = {"text": {}}
    for index, paragraph in enumerate(paragraphs, start=1):
        key = f"p{index}"
        result["text"][key] = paragraph
    return result



