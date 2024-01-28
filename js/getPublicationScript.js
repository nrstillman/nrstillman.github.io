function processBibtex(bibtex, targetElementId) {
    var parsed = bibtexParse.toJSON(bibtex);
    console.log("Parsed content:", parsed);

    parsed.sort((a, b) => b.entryTags.year - a.entryTags.year);

    const groupedByYear = parsed.reduce((acc, entry) => {
        const year = entry.entryTags.year || 'Unknown';
        if (!acc[year]) acc[year] = [];
        acc[year].push(entry);
        return acc;
    }, {});

    var output = "";
    Object.keys(groupedByYear).sort((a, b) => b - a).forEach(year => {
        output += `<h3>${year}</h3><ul>`;
        groupedByYear[year].forEach(entry => {
            var title = entry.entryTags.title || "Untitled";
            var author = entry.entryTags.author || "Unknown Author";
            var journal = entry.entryTags.journal || "";
            var volume = entry.entryTags.volume || "";
            var number = entry.entryTags.number || "";
            var pages = entry.entryTags.pages || "";
            var doi = entry.entryTags.doi || "";
            var url = entry.entryTags.url || "#";
            var apaCitation = `<strong>${title}</strong><br>` +
                              `${author}<br>` +
                              `${journal}${journal ? ", " : ""}` +"<br>";
            output += "<li><a href='" + url + "'>" + apaCitation + "</a></li>";
        });
        output += "</ul>";
    });

    document.getElementById(targetElementId).innerHTML = output;
}

// Fetch and process main publications
fetch('bib/publications.bib')
    .then(response => {
        if (!response.ok) {
            throw new Error("Error fetching .bib file");
        }
        return response.text();
    })
    .then(bibtex => processBibtex(bibtex, "bibliography"))
    .catch(error => console.error("An error occurred:", error));

// Fetch and process upcoming publications
fetch('bib/upcoming_publications.bib')
    .then(response => {
        if (!response.ok) {
            throw new Error("Error fetching upcoming .bib file");
        }
        return response.text();
    })
    .then(bibtex => processBibtex(bibtex, "upcomingBibliography"))
    .catch(error => console.error("An error occurred:", error));
