import json
import re
import pandas as pd
from collections import Counter
import nltk
from nltk.corpus import stopwords

# Download stopwords
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Load Bible data
with open('data/processed/bible_data.json', 'r', encoding='utf-8') as file:
    bible_data = json.load(file)

# Collect all words with references and verses
word_references = []

for book, chapters in bible_data.items():
    for chapter, verses in chapters.items():
        for verse_num, verse_text in verses.items():
            # Normalize apostrophes
            verse_text = verse_text.replace('’', "'")

            # Adjusted regex to properly handle words with apostrophes
            words = re.findall(r"\b\w+'?\w*\b", verse_text.lower())
            for word in words:
                if word not in stop_words:
                    word_references.append({
                        'Word': word,
                        'Book': book,
                        'Chapter': chapter,
                        'Verse': verse_num,
                        'Text': verse_text
                    })

# Convert to DataFrame
df = pd.DataFrame(word_references)

# Export to CSV
df.to_csv('data/processed/word_references.csv', index=False)
print("Exported to word_references.csv")