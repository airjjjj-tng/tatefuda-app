import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the EXACT string and replace it back.
old_html = '''      <div class="preview-panel">
        <h2>プレビュー</h2>
        <div class="canvas-outer-wrapper" style="position: relative; flex: 1; width: 100%; margin-top: 10px;">
          <div class="canvas-wrapper">
            <canvas id="preview-canvas"></canvas>
          </div>
        </div>
      </div>'''

new_html = '''      <div class="preview-panel">
        <h2>プレビュー</h2>
        <div class="canvas-wrapper">
          <canvas id="preview-canvas"></canvas>
        </div>
      </div>'''

content = content.replace(old_html, new_html)

# Also bump cache buster
content = content.replace('style.css?v=7', 'style.css?v=8')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
