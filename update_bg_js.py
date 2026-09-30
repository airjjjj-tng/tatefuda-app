import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = '''        // 背景色の設定(グラデーションをもっと濃く)
        let edgeColor = '#D1C4E9'; // 濃いラベンダー
        if (state.bgStyle === 'pink') edgeColor = '#F8BBD0'; // 濃いピンク
        else if (state.bgStyle === 'blue') edgeColor = '#B3E5FC'; // 濃いアイスブルー
        else if (state.bgStyle === 'peach') edgeColor = '#FFE0B2'; // 濃いピーチ
        else if (state.bgStyle === 'gold') edgeColor = '#FFECB3'; // 濃いゴールド
        else if (state.bgStyle === 'silver') edgeColor = '#CFD8DC'; // 濃いシルバー
        else if (state.bgStyle === 'green') edgeColor = '#C8E6C9'; // 濃いグリーン
        else if (state.bgStyle === 'white') edgeColor = '#FFFFFF';'''

content = content.replace(
'''        // 背景色の設定(グラデーションをもっと濃く)
        let edgeColor = '#D1C4E9'; // 濃いラベンダー
        if (state.bgStyle === 'pink') edgeColor = '#F8BBD0'; // 濃いピンク
        else if (state.bgStyle === 'gold') edgeColor = '#FFECB3'; // 濃いゴールド
        else if (state.bgStyle === 'green') edgeColor = '#C8E6C9'; // 濃いグリーン
        else if (state.bgStyle === 'white') edgeColor = '#FFFFFF';''', new_logic)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
