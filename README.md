# 2025_BibleStudyTool
A simple Bible word analysis and study tool that extracts unique words from the books of Galatians, Ephesians, Philippians, Colossians, and Philemon and visualizes the results through an interactive, filterable website.

This project was built to explore word frequency patterns across these epistles, with options to filter results by book and chapter.

## Features
Parses Bible text into structured JSON format.

Extracts unique words with stopword removal.

Outputs results to a CSV for easy visualization.

Displays an interactive table:

Filter by Book and Chapter.

Sort by Word or Frequency.

## Project Structure
```
2025_BIBLESTUDYTOOL/
│
├── data/
│   ├── raw/
│   │   └── bible_raw.txt                 # Raw Bible text (excluded from GitHub)
│   ├── processed/
│   │   ├── bible_data.json                # Parsed structured Bible data
│   │   └── word_references.csv            # Word frequency data
│   └── scripts/
│       ├── convert_to_json.py             # Converts raw text to structured JSON
│       └── main.py                        # Generates the word frequency CSV
│
├── web/
│   ├── index.html                         # Main webpage (interactive table)
│   ├── js/
│   │   └── script.js                      # JavaScript logic for CSV loading/filtering
│   └── css/
│       └── style.css                      # (Optional) Custom styles
│
└── README.md                              # Project overview and instructions
```
Getting Started
1. Clone the repository
2. Process the Data from the project root
```
cd data/scripts
python convert_to_json.py   # Converts raw Bible text into structured JSON
python main.py              # Generates word_frequencies_by_book_chapter.csv
```
Note: bible_raw.txt is excluded from GitHub to avoid copyright issues. You'll need your own NLT text input if regenerating.

3. Run the Webpage
Since the site reads files locally, you need to run a simple local server:

Using Python 3:
From the project root
```
python -m http.server 8000
Then visit:
http://localhost:8000/web/index.html
```
Important Notes
This project uses selected portions of the New Living Translation (NLT) Bible text for educational and personal analysis purposes only.
Do not redistribute full NLT text.
This repository only contains derived frequency data, not full scripture text.

Privacy:
No personal data or sensitive information is included in this project.
