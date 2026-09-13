(() => {
  const bibliography = document.getElementById('bibliography');
  if (!bibliography) return;

  const clean = (value = '') => value
    .replace(/\\&/g, '&')
    .replace(/[{}]/g, '')
    .replace(/''/g, '”')
    .replace(/``/g, '“')
    .replace(/--/g, '–')
    .trim();

  const formatAuthors = (value = '') => clean(value)
    .split(/\s+and\s+/)
    .map((name) => {
      if (name.toLowerCase() === 'others') return 'et al.';
      const parts = name.split(',').map((part) => part.trim());
      return parts.length > 1 ? `${parts.slice(1).join(' ')} ${parts[0]}` : name;
    })
    .join(', ');

  const addText = (parent, tag, className, content) => {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = content;
    parent.appendChild(element);
    return element;
  };

  const isPreprint = (entry) => /^arxiv\s*:/i.test(clean(entry.entryTags.journal));

  const publicationKind = (entry) => {
    if (isPreprint(entry)) return 'Preprint';
    if (entry.entryType === 'inproceedings') return 'Conference';
    if (entry.entryType === 'incollection') return 'Book chapter';
    return 'Journal';
  };

  const renderEntry = (entry) => {
    const tags = entry.entryTags;
    const item = document.createElement('article');
    item.className = 'publication-entry';

    addText(item, 'span', 'publication-kind', publicationKind(entry));
    const details = document.createElement('div');
    details.className = 'publication-details';

    const title = clean(tags.title) || 'Untitled publication';
    const destination = tags.doi
      ? `https://doi.org/${clean(tags.doi)}`
      : clean(tags.url);

    if (destination) {
      const link = addText(details, 'a', 'publication-title', title);
      link.href = destination;
      link.rel = 'noopener';
    } else {
      addText(details, 'h2', 'publication-title', title);
    }

    addText(details, 'p', 'publication-authors', formatAuthors(tags.author));
    const venue = [clean(tags.journal || tags.booktitle || tags.publisher), clean(tags.volume), clean(tags.pages)]
      .filter(Boolean)
      .join(' · ');
    if (venue) addText(details, 'p', 'publication-venue', venue);
    item.appendChild(details);

    if (destination) addText(item, 'span', 'publication-link', '↗');
    return item;
  };

  const render = (bibtex) => {
    const entries = bibtexParse.toJSON(bibtex)
      .filter((entry) => clean(entry.entryTags.title))
      .sort((a, b) => Number(b.entryTags.year || 0) - Number(a.entryTags.year || 0));

    const featured = entries.find((entry) => clean(entry.entryTags.featured).toLowerCase() === 'true');
    const publications = entries.filter((entry) => entry !== featured);

    bibliography.replaceChildren();
    let currentYear = null;

    publications.forEach((entry) => {
      const year = clean(entry.entryTags.year) || 'Undated';
      if (year !== currentYear) {
        currentYear = year;
        addText(bibliography, 'h2', 'publication-year', year);
      }
      bibliography.appendChild(renderEntry(entry));
    });
  };

  fetch(bibliography.dataset.source)
    .then((response) => {
      if (!response.ok) throw new Error('The bibliography could not be loaded.');
      return response.text();
    })
    .then(render)
    .catch(() => {
      bibliography.replaceChildren();
      addText(bibliography, 'p', 'publication-status', 'Publications are temporarily unavailable.');
    });
})();
