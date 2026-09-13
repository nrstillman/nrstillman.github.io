---
layout: default
published: false
title: Articles
description: Essays and working notes on models, machine learning, and complex systems.
permalink: /articles/
---

<section class="page-heading">
  <p class="eyebrow">Writing</p>
  <h1>Articles</h1>
  <p>Essays and working notes on models, machine learning, and complex systems.</p>
</section>

<section class="article-list" aria-label="Article list">
{% assign articles = site.writings | sort: 'date_published' | reverse %}
{% for item in articles %}
  <a class="article-card" href="{{ item.url | relative_url }}">
    <span class="article-date">{{ item.date_published | date: "%Y" }}</span>
    <span>
      <strong>{{ item.title }}</strong>
      <span>{{ item.description }}</span>
    </span>
    <span class="article-arrow" aria-hidden="true">↗</span>
  </a>
{% endfor %}
</section>
