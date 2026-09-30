import re

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace .preview-panel
content = re.sub(
    r'\.preview-panel \{.*?\n\}',
    '''.preview-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px);
}''',
    content,
    flags=re.DOTALL
)

# Replace .canvas-wrapper
content = re.sub(
    r'\.canvas-wrapper \{.*?\n\}',
    '''.canvas-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: grid;
  place-items: center;
  background: #EFEFEF;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  margin-top: 10px;
}''',
    content,
    flags=re.DOTALL
)

# Replace canvas
content = re.sub(
    r'canvas \{.*?\n\}',
    '''canvas {
  max-width: 100%;
  max-height: 100%;
  min-width: 0;
  min-height: 0;
  width: auto;
  height: auto;
  object-fit: contain;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  background: white;
}''',
    content,
    flags=re.DOTALL
)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(content)
