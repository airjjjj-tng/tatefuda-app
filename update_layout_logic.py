import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_blocks_construction = '''      if (senders.length > 0) {
        let currentNameFontSize = nameFontSize;
        let currentTitleFontSize2 = titleFontSize2;
        
        if (state.orientation === 'landscape') {
           if (senders.length >= 3) {
             // 3名以上の場合は横並びにするので、幅を取るためフォントサイズを少し小さくするが、
             // 「もっと大きく」という要望に合わせて 0.05 くらいにする (元は0.06、前回は0.045)
             currentNameFontSize = Math.floor(width * 0.05);
             currentTitleFontSize2 = Math.floor(width * 0.03);
           } else {
             // 1〜2名の場合、役職は上に配置する。名前は大きく。
             currentTitleFontSize2 = Math.floor(width * 0.035);
           }
        }

        const nameSpacing = 60 * scale;
        const cols = (state.orientation === 'landscape' && senders.length >= 2) ? 2 : 1;
        const rows = Math.ceil(senders.length / cols);
        
        // 横レイアウトで1〜2名の場合は役職を上に配置するため行高を増やす。3名以上は横並びなのでそのまま。
        let rowHeight = currentNameFontSize;
        if (state.orientation === 'landscape' && senders.length < 3) {
           rowHeight = currentNameFontSize + currentTitleFontSize2 * 1.5;
        }
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
          const isLandscape = state.orientation === 'landscape';
          const isTopTitle = isLandscape && block.senders.length < 3;
          
          block.senders.forEach((sender, i) => {
            const col = block.cols === 2 ? i % 2 : 0;
            const row = block.cols === 2 ? Math.floor(i / 2) : i;
            
            let rowStartY = currentY + (block.rowHeight / 2) + (row * (block.rowHeight + block.spacing));
            ctx.fillStyle = state.colorSenderName;
            
            if (isTopTitle) {
              // 横レイアウト 1〜2名：役職を名前の左上に配置
              ctx.font = `900 ${currentNameFontSize}px "Noto Serif JP", serif`; 
              let nameWidth = ctx.measureText(sender.name).width;
              
              let startXName = centerX - (nameWidth / 2);
              if (block.cols === 2) {
                const colCenterX = col === 0 ? (centerX - width * 0.22) : (centerX + width * 0.22);
                startXName = colCenterX - (nameWidth / 2);
              }
              
              let nameY = rowStartY;
              if (sender.title) {
                ctx.font = `700 ${currentTitleFontSize2}px "Noto Serif JP", serif`;
                let titleX = startXName - (currentTitleFontSize2 * 0.5); 
                let titleY = rowStartY - (block.rowHeight / 2) + (currentTitleFontSize2 / 2);
                ctx.fillText(sender.title, titleX, titleY);
                
                nameY = rowStartY + (block.rowHeight / 2) - (currentNameFontSize / 2);
              }
              
              ctx.font = `900 ${currentNameFontSize}px "Noto Serif JP", serif`;
              ctx.fillText(sender.name, startXName, nameY);
              
            } else {
              // 縦レイアウト、または横レイアウトで3名以上：役職と名前を同じ行（横並び）に配置
              let totalNameWidth = 0;
              if (sender.title) {
                ctx.font = `700 ${currentTitleFontSize2}px "Noto Serif JP", serif`;
                totalNameWidth += ctx.measureText(sender.title).width + spaceBetweenTitleAndName;
              }
              ctx.font = `900 ${currentNameFontSize}px "Noto Serif JP", serif`; 
              totalNameWidth += ctx.measureText(sender.name).width;
              
              let startX = centerX - (totalNameWidth / 2);
              if (block.cols === 2) {
                // 3名以上の場合は横幅が広くなるので、中心を少し外側に広げるか？
                // 横レイアウトで3名以上の場合は少し広めに
                const offset = isLandscape ? width * 0.23 : width * 0.22;
                const colCenterX = col === 0 ? (centerX - offset) : (centerX + offset);
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

start_str = "        else if (block.type === 'names') {"
end_str = "        }\n        \n        currentY += block.height;"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_names_render + "\n" + content[end_idx:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
