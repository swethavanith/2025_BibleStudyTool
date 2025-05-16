$(document).ready(function() {
    Papa.parse('../data/processed/word_references.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;

            // Calculate word frequencies within chapters
            const wordFreqMap = {};
            data.forEach(row => {
                const wordKey = `${row.Book}-${row.Chapter}-${row.Word}`;
                if (!wordFreqMap[wordKey]) {
                    wordFreqMap[wordKey] = {
                        Book: row.Book,
                        Chapter: row.Chapter,
                        Word: row.Word,
                        Frequency: 0
                    };
                }
                wordFreqMap[wordKey].Frequency += 1;
            });

            const frequencyData = Object.values(wordFreqMap);

            // Initialize DataTable for search list
            const table = $('#wordTable').DataTable({
                data: frequencyData,
                columns: [
                    { data: 'Book' },
                    { data: 'Chapter' },
                    { data: 'Word' },
                    { data: 'Frequency' }
                ],
                order: [[3, 'asc']] // Sort by frequency ascending
            });

            // Populate Book filter
            const bookSet = new Set(frequencyData.map(row => row.Book));
            bookSet.forEach(book => {
                $('#bookFilter').append(`<option value="${book}">${book}</option>`);
            });

            // Update Chapter filter based on selected book
            $('#bookFilter').on('change', function() {
                const selectedBook = $(this).val();
                const chapters = new Set(frequencyData.filter(row => row.Book === selectedBook).map(row => row.Chapter));

                $('#chapterFilter').html('<option value="">All Chapters</option>');
                chapters.forEach(chapter => {
                    $('#chapterFilter').append(`<option value="${chapter}">${chapter}</option>`);
                });
                table.draw();
            });

            // Apply custom filter
            $.fn.dataTable.ext.search.push(function(settings, searchData) {
                const selectedBook = $('#bookFilter').val();
                const selectedChapter = $('#chapterFilter').val();
                const selectedLetter = $('#letterFilter').val();
                const rowBook = searchData[0];
                const rowChapter = searchData[1];
                const rowWord = searchData[2];

                const bookMatch = !selectedBook || rowBook === selectedBook;
                const chapterMatch = !selectedChapter || rowChapter === selectedChapter;
                const letterMatch = !selectedLetter || rowWord.toLowerCase().startsWith(selectedLetter.toLowerCase());

                return bookMatch && chapterMatch && letterMatch;
            });

            $('#bookFilter, #chapterFilter, #letterFilter').on('change', function() {
                table.draw();
            });

            $('#clearFilters').on('click', function() {
                $('#bookFilter').val('');
                $('#chapterFilter').val('');
                $('#letterFilter').val('');
                table.draw();
            });

            // Click event to display occurrences with full verse, no duplicates, scrollable
            $('#wordTable tbody').on('click', 'tr', function() {
                // Remove highlight from any previously selected row
                $('#wordTable tbody tr').removeClass('selected');

                // Add highlight to the currently clicked row
                $(this).addClass('selected');

                const word = $(this).find('td:eq(2)').text().toLowerCase();
                const book = $(this).find('td:eq(0)').text();
                const chapter = $(this).find('td:eq(1)').text();

                const seenVerses = new Set();
                const filteredData = data.filter(row => 
                    (!book || row.Book === book) &&
                    (!chapter || row.Chapter === chapter) &&
                    row.Word === word
                );

                let htmlContent = `<h3>Occurrences of "${word}" in ${book} ${chapter}"</h3>`;
                filteredData.forEach(entry => {
                    const verseRef = `${entry.Book} ${entry.Chapter}:${entry.Verse}`;
                    if (!seenVerses.has(verseRef)) {
                        seenVerses.add(verseRef);

                        // Highlight the word as a whole word only
                        const regex = new RegExp(`\\b${word}\\b(?!['’]\\w+)`, 'gi');
                        const highlightedText = entry.Text.replace(regex, '<span class="highlight">$&</span>');
                        htmlContent += `<p><strong>${verseRef}</strong> - ${highlightedText}</p>`;
                    }
                });

                $('#displayContainer').html(htmlContent);
            });

            // Remove highlight when interacting with pagination or search
            $('#wordTable').on('page.dt search.dt', function() {
                $('#wordTable tbody tr').removeClass('selected');
            });

        }
    });
});