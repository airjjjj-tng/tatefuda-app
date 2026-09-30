import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1 & 2: Update getState
state_replacement = '''      title: (formData.get('title') || '').trim(),
      colorRecipient: formData.get('colorRecipient') || '#333333',
      colorTitle: formData.get('colorTitle') || '#C62828',
      colorSenderCompany: formData.get('colorSenderCompany') || '#333333',
      colorSenderName: formData.get('colorSenderName') || '#000000',
      senderCompany: (formData.get('senderCompany') || '').trim(),
      senderTitle1: (formData.get('senderTitle1') || '').trim(),
      senderName1: (formData.get('senderName1') || '').trim(),
      senderTitle2: (formData.get('senderTitle2') || '').trim(),
      senderName2: (formData.get('senderName2') || '').trim(),
      senderTitle3: (formData.get('senderTitle3') || '').trim(),
      senderName3: (formData.get('senderName3') || '').trim(),
      senderTitle4: (formData.get('senderTitle4') || '').trim(),
      senderName4: (formData.get('senderName4') || '').trim(),
      senderTitle5: (formData.get('senderTitle5') || '').trim(),
      senderName5: (formData.get('senderName5') || '').trim(),
      senderTitle6: (formData.get('senderTitle6') || '').trim(),
      senderName6: (formData.get('senderName6') || '').trim()'''

content = re.sub(
    r"      title: \(formData\.get\('title'\) \|\| ''\)\.trim\(\),\n      senderCompany: \(formData\.get\('senderCompany'\) \|\| ''\)\.trim\(\),[\s\S]*?senderName3: \(formData\.get\('senderName3'\) \|\| ''\)\.trim\(\)",
    state_replacement,
    content
)

# 3: Update senders array
senders_replacement = '''      if (state.senderName1) senders.push({ title: state.senderTitle1, name: state.senderName1 });
      if (state.senderName2) senders.push({ title: state.senderTitle2, name: state.senderName2 });
      if (state.senderName3) senders.push({ title: state.senderTitle3, name: state.senderName3 });
      if (state.senderName4) senders.push({ title: state.senderTitle4, name: state.senderName4 });
      if (state.senderName5) senders.push({ title: state.senderTitle5, name: state.senderName5 });
      if (state.senderName6) senders.push({ title: state.senderTitle6, name: state.senderName6 });'''

content = re.sub(
    r"      if \(state\.senderName1\).*?\n      if \(state\.senderName2\).*?\n      if \(state\.senderName3\).*?\}\);",
    senders_replacement,
    content
)

# 4: Update blocks for names layout
names_block_replacement = '''      if (senders.length > 0) {
        // 連名の数だけ高さを確保（名前間の隙間も含む）
        const nameSpacing = 60 * scale;
        const cols = senders.length >= 2 ? 2 : 1;
        const rows = Math.ceil(senders.length / cols);
        const totalNamesHeight = (nameFontSize * rows) + (nameSpacing * (rows - 1));
        blocks.push({ type: 'names', height: totalNamesHeight, senders: senders, spacing: nameSpacing, cols: cols });
      }'''
content = re.sub(
    r"      if \(senders\.length > 0\) \{[\s\S]*?blocks\.push\(\{ type: 'names',.*?\n      \}",
    names_block_replacement,
    content
)

# 5, 6, 7, 8: Replace fillStyle logic inside render loop
# Find color definitions and remove them
content = re.sub(
    r"      // 色の定義\n      const colorTextMain = '#1A1A1A'; \n      const colorTitle = '#C62828';    \n      const colorSama = '#a05c50';     \n",
    "",
    content
)

# Replace all colorTextMain, colorSama, colorTitle with appropriate state vars
content = content.replace("ctx.fillStyle = colorTextMain;", "ctx.fillStyle = (block.type === 'recipient') ? state.colorRecipient : (block.type === 'company' ? state.colorSenderCompany : state.colorSenderName);")
content = content.replace("ctx.fillStyle = colorSama;", "ctx.fillStyle = state.colorRecipient;")
content = content.replace("ctx.fillStyle = colorTitle;", "ctx.fillStyle = state.colorTitle;")


# 9: Update block.type === 'names' rendering logic
new_names_render = '''        else if (block.type === 'names') {
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

# Extract the block to replace
start_str = "        else if (block.type === 'names') {"
end_str = "        }\n        \n        currentY += block.height;"
start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_names_render + "\n" + content[end_idx:]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Finished rewriting app.js")
