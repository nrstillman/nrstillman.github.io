---
layout: writings
title: Writings
permalink: /writings/
---

# Writings

### Quick Thoughts
Snapshots of a thought or the early shoots of an idea, recorded here for posterity. 

{% for item in site.writings %}
  {% if item.path contains 'quick' %}
    - [{{ item.title }}]({{ item.url | relative_url }}) - {{ item.description | default: "(I'm yet to write a description — click through to find out)" }}
  {% endif %}
{% endfor %}

### Shorter Writings
A collection of shorter pieces that cover a single topic or an early-stage idea. 

{% for item in site.writings %}
{% if item.path contains 'short' %}
  - [{{ item.title }}]({{ item.url | relative_url }}) - {{ item.description | default: "(I'm yet to write a description — click through to find out)" }}
{% endif %}
{% endfor %}

### Longer Writings
More extensive work, covering collections of topics. I'll typically write these in series over a longer timespan. 

{% for item in site.writings %}
{% if item.path contains 'long' %}
  - [{{ item.title }}]({{ item.url | relative_url }}) - {{ item.description | default: "(I'm yet to write a description — click through to find out)" }}
{% endif %}
{% endfor %}