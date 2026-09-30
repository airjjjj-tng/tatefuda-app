import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css?v=2">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
