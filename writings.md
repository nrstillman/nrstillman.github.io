---
layout: writings
title: Writings
permalink: /writings/
---

# Writings

## Longer Writings
{% for item in site.writings %}
  {% if item.path contains 'long' %}
    - [{{ item.title }}]({{ item.url | relative_url }}) - {{ item.description | default: "No description provided." }}
  {% endif %}
{% endfor %}

## Shorter Writings
{% for item in site.writings %}
  {% if item.path contains 'short' %}
    - [{{ item.title }}]({{ item.url | relative_url }}) - {{ item.description | default: "No description provided." }}
  {% endif %}
{% endfor %}