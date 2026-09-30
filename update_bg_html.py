import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_options = '''                <option value="lavender">薄い紫（ラベンダー）</option>
                <option value="pink">薄いピンク（さくら）</option>
                <option value="blue">薄い青（アイスブルー）</option>
                <option value="green">薄い緑（ミントグリーン）</option>
                <option value="peach">薄いオレンジ（ピーチ）</option>
                <option value="gold">薄い金（シャンパンゴールド）</option>
                <option value="silver">薄い銀（プラチナシルバー）</option>
                <option value="white">グラデーションなし（白）</option>'''

content = content.replace(
'''                <option value="lavender">薄い紫（ラベンダー）</option>
                <option value="pink">薄いピンク（さくら）</option>
                <option value="gold">薄い金（シャンパンゴールド）</option>
                <option value="green">薄い緑（ミントグリーン）</option>
                <option value="white">グラデーションなし（白）</option>''', new_options)

# Update cache buster to v=5
content = content.replace('app.js?v=4', 'app.js?v=5')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
