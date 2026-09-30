import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_blocks_construction = '''      if (senders.length > 0) {
        let currentNameFontSize = nameFontSize;
        let currentTitleFontSize2 = titleFontSize2;
        
        if (state.orientation === 'landscape') {
           if (senders.length >= 3) {
             currentNameFontSize = Math.floor(width * 0.045);
             currentTitleFontSize2 = Math.floor(width * 0.022);
           } else {
             // 1〜2名の場合も、役職は上に配置するため少し小さくしておく
             currentTitleFontSize2 = Math.floor(width * 0.028);
           }
        }

        const nameSpacing = 60 * scale;
        const cols = (state.orientation === 'landscape' && senders.length >= 2) ? 2 : 1;
        const rows = Math.ceil(senders.length / cols);
        
        // 横レイアウトでは役職を左上に配置するため、1行あたりの高さを役職分だけ増やす
        const rowHeight = state.orientation === 'landscape' ? (currentNameFontSize + currentTitleFontSize2 * 1.5) : currentNameFontSize;
        const totalNamesHeight = (rowHeight * rows) + (nameSpacing * (rows - 1));
        
        blocks.push({ 
          type: 'names', 
          height: totalNamesHeight, 
          senders: senders, 
          spacing: nameSpacing, 
          cols: cols,
          nameFontSize: currentNameFontSize,
          titleFontSize2: currentTitleFontSize2,
          rowHeight: rowHeight
        });
      }'''

content = re.sub(
    r"      if \(senders\.length > 0\) \{[\s\S]*?blocks\.push\(\{ type: 'names'.*?\}\);\n      \}",
    new_blocks_construction,
    content
)

new_names_render = '''        else if (block.type === 'names') {
          const spaceBetweenTitleAndName = 30 * scale; 
          const currentNameFontSize = block.nameFontSize || nameFontSize;
          const currentTitleFontSize2 = block.titleFontSize2 || titleFontSize2;
          
          block.senders.forEach((sender, i) => {
            const col = block.cols === 2 ? i % 2 : 0;
            const row = block.cols === 2 ? Math.floor(i / 2) : i;
            
            // rowHeightを使って各行の中心Y位置を計算
            let rowStartY = currentY + (block.rowHeight / 2) + (row * (block.rowHeight + block.spacing));
            
            ctx.font = `900 ${currentNameFontSize}px "Noto Serif JP", serif`; 
            let nameWidth = ctx.measureText(sender.name).width;

            let startXName = centerX - (nameWidth / 2);
            if (block.cols === 2) {
              const colCenterX = col === 0 ? (centerX - width * 0.22) : (centerX + width * 0.22);
              startXName = colCenterX - (nameWidth / 2);
            }

            ctx.textAlign = 'left';
            ctx.fillStyle = state.colorSenderName;

            if (state.orientation === 'landscape') {
              // 横レイアウト：役職を名前の少し左上に配置
              let nameY = rowStartY;
              
              if (sender.title) {
                ctx.font = `700 ${currentTitleFontSize2}px "Noto Serif JP", serif`;
                let titleX = startXName - (currentTitleFontSize2 * 0.5); // 少し左
                // 役職は行の上半分に
                let titleY = rowStartY - (block.rowHeight / 2) + (currentTitleFontSize2 / 2);
                ctx.fillText(sender.title, titleX, titleY);
                
                // 役職がある場合、名前は行の下半分に
                nameY = rowStartY + (block.rowHeight / 2) - (currentNameFontSize / 2);
              }
              
              ctx.font = `900 ${currentNameFontSize}px "Noto Serif JP", serif`;
              ctx.fillText(sender.name, startXName, nameY);
            } else {
              // 縦レイアウト：役職と名前を同じ行に配置
              let totalNameWidth = nameWidth;
              if (sender.title) {
                ctx.font = `700 ${currentTitleFontSize2}px "Noto Serif JP", serif`;
                totalNameWidth += ctx.measureText(sender.title).width + spaceBetweenTitleAndName;
              }
              
              let startX = centerX - (totalNameWidth / 2);
              if (block.cols === 2) {
                const colCenterX = col === 0 ? (centerX - width * 0.22) : (centerX + width * 0.22);
                startX = colCenterX - (totalNameWidth / 2);
              }

              if (sender.title) {
                ctx.font = `700 ${currentTitleFontSize2}px "Noto Serif JP", serif`;
                ctx.fillText(sender.title, startX, rowStartY);
                startX += ctx.measureText(sender.title).width + spaceBetweenTitleAndName;
              }
              ctx.font = `900 ${currentNameFontSize}px "Noto Serif JP", serif`;
              ctx.fillText(sender.name, startX, rowStartY);
            }
          });
        }'''

# Safely extract and replace the block
start_str = "        else if (block.type === 'names') {"
end_str = "        }\n        \n        currentY += block.height;"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_names_render + "\n" + content[end_idx:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
