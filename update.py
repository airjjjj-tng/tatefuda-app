import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = '''        else if (block.type === 'names') {
          const spaceBetweenTitleAndName = 30 * scale; 
          
          block.senders.forEach((sender, i) => {
            const col = block.cols === 2 ? i % 2 : 0;
            const row = block.cols === 2 ? Math.floor(i / 2) : i;
            
            let nameStartY = currentY + (nameFontSize / 2) + (row * (nameFontSize + block.spacing));
            
            let totalNameWidth = 0;
            if (sender.title) {
              ctx.font = `700 ${titleFontSize2}px "Noto Serif JP", serif`; 
              totalNameWidth += ctx.measureText(sender.title).width + spaceBetweenTitleAndName;
            }
            
            ctx.font = `900 ${nameFontSize}px "Noto Serif JP", serif`; 
            totalNameWidth += ctx.measureText(sender.name).width;

            let startXName = centerX - (totalNameWidth / 2);
            if (block.cols === 2) {
              const colCenterX = col === 0 ? (centerX - width * 0.20) : (centerX + width * 0.20);
              startXName = colCenterX - (totalNameWidth / 2);
            }

            ctx.textAlign = 'left';
            ctx.fillStyle = state.colorSenderName;

            if (sender.title) {
              ctx.font = `700 ${titleFontSize2}px "Noto Serif JP", serif`;
              ctx.fillText(sender.title, startXName, nameStartY);
              startXName += ctx.measureText(sender.title).width + spaceBetweenTitleAndName;
            }

            ctx.font = `900 ${nameFontSize}px "Noto Serif JP", serif`;
            ctx.fillText(sender.name, startXName, nameStartY);
          });
        }'''

start_str = "        else if (block.type === 'names') {"
end_str = "        }\n        \n        if (block.height) {"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_logic + "\n" + content[end_idx:]
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Success')
else:
    print('Failed to find block')
