---
layout: default
title: Publications
description: Books, academic articles, conference papers, and research outputs.
permalink: /publications/
---

<section class="page-heading">
  <p class="eyebrow">Research output</p>
  <h1>Publications</h1>
  <p>Books and academic publications across scientific machine learning, simulation, complex systems, and computational biology.</p>
</section>

<section class="publication-section">
  <h2 class="publication-section-title">Books</h2>
  <div class="book-list">
    <article class="book-entry">
      <p class="book-meta">In progress</p>
      <h3>World Models</h3>
      <p class="book-authors">Namid R. Stillman</p>
      <p>An upcoming book about the architecture of world models and how AI architectures encode models of the world for prediction, simulation, and actions.</p>
      <a href="https://worldmodelsbook.com" rel="noopener">Visit worldmodelsbook.com <span aria-hidden="true">↗</span></a>
    </article>
    <article class="book-entry">
      <p class="book-meta">Manning · 2025 · 392 pages</p>
      <h3>Graph Neural Networks in Action</h3>
      <p class="book-authors">Keita Broadwater and Namid R. Stillman</p>
      <p>A practical guide to building, training, and applying graph neural networks to connected data.</p>
      <a href="https://www.manning.com/books/graph-neural-networks-in-action" rel="noopener">View the book <span aria-hidden="true">↗</span></a>
    </article>
  </div>
</section>

<section class="publication-section academic-publications">
  <h2 class="publication-section-title">Academic Publications</h2>
  <div id="bibliography" class="publication-list" data-source="{{ '/bib/publications.bib' | relative_url }}" aria-live="polite">
    <p class="publication-status">Loading publications…</p>
  </div>
</section>

<script src="{{ '/js/bibtexParse.js' | relative_url }}"></script>
<script src="{{ '/js/getPublicationScript.js' | relative_url }}"></script>
