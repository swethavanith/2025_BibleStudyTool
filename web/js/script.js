$(document).ready(function() {
    Papa.parse('../data/processed/word_frequencies_by_book_chapter.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;

            // Initialize DataTable
            const table = $('#wordTable').DataTable({
                data: data,
                columns: [
                    { data: 'Book' },
                    { data: 'Chapter' },
                    { data: 'Word' },
                    { data: 'Frequency' }
                ],
                order: [[0, 'asc'], [1, 'asc'], [3, 'desc']]
            });

            // Populate Book filter
            const bookSet = new Set(data.map(row => row.Book).filter(book => book));
            bookSet.forEach(book => {
                $('#bookFilter').append(`<option value="${book}">${book}</option>`);
            });

            // Update Chapter filter based on Book selection
            $('#bookFilter').on('change', function() {
                const selectedBook = $(this).val();
                const chapterSet = new Set();

                // Reset chapter filter
                $('#chapterFilter').html('<option value="">All Chapters</option>');

                data.forEach(row => {
                    if (!selectedBook || row.Book === selectedBook) {
                        chapterSet.add(row.Chapter);
                    }
                });

                chapterSet.forEach(chapter => {
                    $('#chapterFilter').append(`<option value="${chapter}">${chapter}</option>`);
                });

                table.draw();
            });

            // Add custom filter for Book and Chapter
            $.fn.dataTable.ext.search.push(function(settings, searchData) {
                const selectedBook = $('#bookFilter').val();
                const selectedChapter = $('#chapterFilter').val();
                const rowBook = searchData[0]; // Book column
                const rowChapter = searchData[1]; // Chapter column

                const bookMatch = !selectedBook || rowBook === selectedBook;
                const chapterMatch = !selectedChapter || rowChapter === selectedChapter;

                return bookMatch && chapterMatch;
            });

            // Trigger table redraw on filter change
            $('#bookFilter, #chapterFilter').on('change', function() {
                table.draw();
            });
        }
    });
});
