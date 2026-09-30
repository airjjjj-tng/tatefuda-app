import re

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace .canvas-wrapper
content = re.sub(
    r'\.canvas-wrapper \{.*?\n\}',
    '''.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #EFEFEF;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  overflow: hidden;
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
