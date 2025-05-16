import re
import json
from collections import defaultdict

# Load raw text file with all five books
with open('data/raw/bible_raw.txt', 'r') as file:
    lines = file.readlines()

# Data structure: book -> chapter -> verse -> verse text
bible_data = defaultdict(lambda: defaultdict(dict))

current_book = None
current_chapter = None

for line in lines:
    line = line.strip()
    if not line:
        continue  # Skip empty lines

    # Detect book and chapter lines (e.g., Galatians 1)
    book_chapter_match = re.match(r'^([A-Za-z]+)\s+(\d+)$', line)
    if book_chapter_match:
        current_book = book_chapter_match.group(1)
        current_chapter = book_chapter_match.group(2)
        continue

    # Detect verse lines (e.g., 1 This letter...)
    verse_match = re.match(r'^(\d+)\s+(.+)$', line)
    if verse_match and current_book and current_chapter:
        verse_number = verse_match.group(1)
        verse_text = verse_match.group(2)
        # Store verse with reference
        bible_data[current_book][current_chapter][verse_number] = verse_text

# Convert defaultdict to regular dict for saving
bible_data = {book: {chapter: verses for chapter, verses in chapters.items()} for book, chapters in bible_data.items()}

# Save to JSON file
with open('data/processed/bible_data.json', 'w', encoding='utf-8') as outfile:
    json.dump(bible_data, outfile, indent=4, ensure_ascii=False)

print("Parsing complete. Data saved to bible_data.json")