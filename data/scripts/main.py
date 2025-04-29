import json
import re
import pandas as pd
import nltk
from collections import Counter
from nltk.corpus import stopwords
import nltk

# Download stopwords
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Load Bible data
with open('data/processed/bible_data.json', 'r', encoding='utf-8') as file:
    bible_data = json.load(file)

# Tokenize function (remove punctuation, lowercase, filter stopwords)
def tokenize(text: str):
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    words = text.lower().split()
    return [word for word in words if word not in stop_words]

# Count words per book and chapter
def count_words_by_book_chapter(data):
    rows = []

    for book, chapter_data in data.items():
        for chapter, verses in chapter_data.items():
            counter = Counter()
            for verse in verses:
                words = tokenize(verse)
                counter.update(words)
            # Add each word, its count, book, and chapter to rows
            for word, freq in counter.items():
                rows.append({
                    'Book': book,
                    'Chapter': chapter,
                    'Word': word,
                    'Frequency': freq
                })
    return rows

# Process the data
word_data = count_words_by_book_chapter(bible_data)

# Convert to DataFrame
df = pd.DataFrame(word_data)

# Sort by Book, Chapter, Frequency descending
df = df.sort_values(by=['Book', 'Chapter', 'Frequency'], ascending=[True, True, False])

# Export to CSV
df.to_csv('data/processed/word_frequencies_by_book_chapter.csv', index=False)
print("Exported to word_frequencies_by_book_chapter.csv")
