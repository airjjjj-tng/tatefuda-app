// 遶九※譛ｭ繧ｸ繧ｧ繝阪Ξ繝ｼ繧ｿ繝ｼ 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ繝ｭ繧ｸ繝・け

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('tatefuda-form');
  const canvas = document.getElementById('preview-canvas');
  const ctx = canvas.getContext('2d');
  const downloadBtn = document.getElementById('download-btn');

  // 逕ｨ邏吶し繧､繧ｺ螳夂ｾｩ (300dpi險ｭ螳・
  // A4 = 210 x 297 mm -> 2480 x 3508 px
  // A5 = 148 x 210 mm -> 1748 x 2480 px
  const SIZES = {
    A4: { short: 2480, long: 3508 },
    A5: { short: 1748, long: 2480 }
  };

  // 鬮伜刀雉ｪ縺ｪSVG繝輔Ξ繝ｼ繝縺ｮ繝代せ繝・・繧ｿ (繝吶・繧ｹ64蛹悶＠縺ｦ菴ｿ逕ｨ)
  const SVG_FRAME_LUXURY = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 螟門・縺ｮ髱槫ｸｸ縺ｫ螟ｪ縺・≡譫 -->
    <rect x="30" y="30" width="940" height="1354" fill="none" stroke="#D4AF37" stroke-width="12" />
    <!-- 蜀・・縺ｮ驥第棧 -->
    <rect x="55" y="55" width="890" height="1304" fill="none" stroke="#D4AF37" stroke-width="4" />
    <!-- 蟾ｨ螟ｧ縺ｪ蝗幃嚆縺ｮ繧ｪ繝ｼ繝翫Γ繝ｳ繝・-->
    <g fill="none" stroke="#D4AF37" stroke-width="6">
      <path d="M 30,250 C 150,250 250,150 250,30" />
      <path d="M 55,200 C 120,200 200,120 200,55" />
      <circle cx="140" cy="140" r="25" fill="#D4AF37" opacity="0.5"/>
      <path d="M 970,250 C 850,250 750,150 750,30" />
      <path d="M 945,200 C 880,200 800,120 800,55" />
      <circle cx="860" cy="140" r="25" fill="#D4AF37" opacity="0.5"/>
      <path d="M 30,1164 C 150,1164 250,1264 250,1384" />
      <path d="M 55,1214 C 120,1214 200,1294 200,1359" />
      <circle cx="140" cy="1274" r="25" fill="#D4AF37" opacity="0.5"/>
      <path d="M 970,1164 C 850,1164 750,1264 750,1384" />
      <path d="M 945,1214 C 880,1214 800,1294 800,1359" />
      <circle cx="860" cy="1274" r="25" fill="#D4AF37" opacity="0.5"/>
    </g>
    <!-- 荳贋ｸ句ｷｦ蜿ｳ縺ｮ螟ｧ縺阪↑陬・｣ｾ -->
    <g fill="#D4AF37">
      <polygon points="500,10 540,42 500,75 460,42" />
      <polygon points="500,1339 540,1372 500,1404 460,1372" />
      <polygon points="10,707 42,747 75,707 42,667" />
      <polygon points="925,707 958,747 990,707 958,667" />
    </g>
  </svg>`;

  const SVG_FRAME_SIMPLE = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 螟ｪ繧√・譫邱・-->
    <rect x="40" y="40" width="920" height="1334" fill="none" stroke="#444444" stroke-width="8" />
    <!-- 縺輔ｉ縺ｫ蜀・・縺ｮ譫邱・-->
    <rect x="60" y="60" width="880" height="1294" fill="none" stroke="#444444" stroke-width="2" />
    <!-- 蝗幃嚆縺ｮ逶ｮ遶九▽繝峨ャ繝・-->
    <circle cx="40" cy="40" r="15" fill="#444444"/>
    <circle cx="960" cy="40" r="15" fill="#444444"/>
    <circle cx="40" cy="1374" r="15" fill="#444444"/>
    <circle cx="960" cy="1374" r="15" fill="#444444"/>
  </svg>`;

  const SVG_FRAME_MODERN = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 螟ｪ縺上※繧｢繧ｷ繝ｳ繝｡繝医Μ繝ｼ縺ｪ譫邱・-->
    <rect x="30" y="30" width="880" height="1294" fill="none" stroke="#2c3e50" stroke-width="12" />
    <rect x="90" y="90" width="880" height="1294" fill="none" stroke="#d35400" stroke-width="6" />
    <!-- 逶ｮ遶九▽繝｢繝繝ｳ縺ｪ謚ｽ雎｡蝗ｳ蠖｢・亥・・・-->
    <g fill="#95a5a6" opacity="0.4">
      <circle cx="80" cy="80" r="140" />
      <circle cx="920" cy="1334" r="120" />
      <circle cx="900" cy="180" r="80" fill="#e74c3c" opacity="0.2"/>
    </g>
    <!-- 謚ｽ雎｡逧・〒蟾ｨ螟ｧ縺ｪ繝ｪ繝ｼ繝募ｽ｢迥ｶ (繝・く繧ｹ繝医↓陲ｫ繧峨↑縺・ｈ縺・ｸｮ蟆・ -->
    <g fill="none" stroke="#34495e" stroke-width="8">
      <path d="M 30,30 Q 180,30 180,180 Q 30,180 30,30" />
      <path d="M 970,1384 Q 820,1384 820,1234 Q 970,1234 970,1384" />
    </g>
  </svg>`;

  const SVG_FRAME_ARTDECO = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <rect x="40" y="40" width="920" height="1334" fill="none" stroke="#B8860B" stroke-width="4" />
    <rect x="50" y="50" width="900" height="1314" fill="none" stroke="#B8860B" stroke-width="1" />
    <rect x="60" y="60" width="880" height="1294" fill="none" stroke="#B8860B" stroke-width="2" />
    <g fill="none" stroke="#B8860B" stroke-width="3">
      <polygon points="40,100 100,40 160,40 40,160" />
      <polygon points="960,100 900,40 840,40 960,160" />
      <polygon points="40,1314 100,1374 160,1374 40,1254" />
      <polygon points="960,1314 900,1374 840,1374 960,1254" />
    </g>
  </svg>`;

  const SVG_FRAME_FLORAL = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <rect x="30" y="30" width="940" height="1354" fill="none" stroke="#4A5D23" stroke-width="2" />
    <g fill="none" stroke="#4A5D23" stroke-width="4">
      <path d="M 30,30 C 100,50 150,150 30,300" />
      <path d="M 30,30 C 50,100 150,150 300,30" />
      <path d="M 970,1384 C 900,1364 850,1264 970,1114" />
      <path d="M 970,1384 C 950,1314 850,1264 700,1384" />
    </g>
    <g fill="#4A5D23" opacity="0.6">
      <circle cx="80" cy="80" r="8" />
      <circle cx="120" cy="60" r="5" />
      <circle cx="60" cy="120" r="5" />
      <circle cx="920" cy="1334" r="8" />
      <circle cx="880" cy="1354" r="5" />
      <circle cx="940" cy="1294" r="5" />
    </g>
  </svg>`;

  const SVG_FRAME_HEAVY_GOLD = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 螟門・縺ｮ讌ｵ螟ｪ譫 -->
    <rect x="20" y="20" width="960" height="1374" fill="none" stroke="#A67B5B" stroke-width="20" />
    <rect x="30" y="30" width="940" height="1354" fill="none" stroke="#FFF" stroke-width="6" />
    <!-- 蜀・・縺ｮ螟ｪ譫 -->
    <rect x="50" y="50" width="900" height="1314" fill="none" stroke="#A67B5B" stroke-width="6" />
    <!-- 蝗幃嚆縺ｮ驥榊字縺ｪ陬・｣ｾ -->
    <g fill="#A67B5B">
      <path d="M 20,20 L 150,20 L 150,50 L 50,50 L 50,150 L 20,150 Z" />
      <path d="M 980,20 L 850,20 L 850,50 L 950,50 L 950,150 L 980,150 Z" />
      <path d="M 20,1394 L 150,1394 L 150,1364 L 50,1364 L 50,1264 L 20,1264 Z" />
      <path d="M 980,1394 L 850,1394 L 850,1364 L 950,1364 L 950,1264 L 980,1264 Z" />
    </g>
    <!-- 霑ｽ蜉縺ｮ蝗幃嚆縺ｮ荳ｸ縺ｿ -->
    <circle cx="85" cy="85" r="20" fill="#A67B5B" />
    <circle cx="915" cy="85" r="20" fill="#A67B5B" />
    <circle cx="85" cy="1329" r="20" fill="#A67B5B" />
    <circle cx="915" cy="1329" r="20" fill="#A67B5B" />
  </svg>`;

  const SVG_FRAME_BOLD_LEAF = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 螟ｪ縺・ｷ代・繝吶・繧ｹ譫 -->
    <rect x="30" y="30" width="940" height="1354" fill="none" stroke="#2D4A22" stroke-width="12" />
    <rect x="60" y="60" width="880" height="1294" fill="none" stroke="#2D4A22" stroke-width="3" />
    <!-- 髫・・蟾ｨ螟ｧ縺ｪ闡峨▲縺ｱ縺ｮ繧ｷ繝ｫ繧ｨ繝・ヨ -->
    <g fill="#2D4A22">
      <!-- 蟾ｦ荳・-->
      <path d="M 30,30 Q 150,30 200,200 Q 30,150 30,30" />
      <path d="M 30,30 Q 250,50 300,100 Q 100,200 30,30" />
      <!-- 蜿ｳ荳・-->
      <path d="M 970,30 Q 850,30 800,200 Q 970,150 970,30" />
      <path d="M 970,30 Q 750,50 700,100 Q 900,200 970,30" />
      <!-- 蟾ｦ荳・-->
      <path d="M 30,1384 Q 150,1384 200,1214 Q 30,1264 30,1384" />
      <path d="M 30,1384 Q 250,1364 300,1314 Q 100,1214 30,1384" />
      <!-- 蜿ｳ荳・-->
      <path d="M 970,1384 Q 850,1384 800,1214 Q 970,1264 970,1384" />
      <path d="M 970,1384 Q 750,1364 700,1314 Q 900,1214 970,1384" />
    </g>
    <!-- 繧ｵ繧､繝峨・陬・｣ｾ繝ｪ繝ｼ繝・-->
    <g fill="#4A7034" opacity="0.8">
      <circle cx="30" cy="707" r="15" />
      <circle cx="970" cy="707" r="15" />
      <circle cx="500" cy="30" r="15" />
      <circle cx="500" cy="1384" r="15" />
    </g>
  </svg>`;

  const SVG_FRAME_JAPANESE = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 譛ｱ濶ｲ縺ｨ驥代・蜥碁｢ｨ譫 -->
    <rect x="25" y="25" width="950" height="1364" fill="none" stroke="#C62828" stroke-width="16" />
    <rect x="50" y="50" width="900" height="1314" fill="none" stroke="#D4AF37" stroke-width="8" />
    <rect x="65" y="65" width="870" height="1284" fill="none" stroke="#C62828" stroke-width="2" />
    <!-- 邵∬ｵｷ縺ｮ濶ｯ縺・ｧ帝｣ｾ繧・-->
    <g fill="#D4AF37">
      <polygon points="50,50 150,50 150,65 65,65 65,150 50,150" />
      <polygon points="75,75 120,75 120,85 85,85 85,120 75,120" />
      <polygon points="950,50 850,50 850,65 935,65 935,150 950,150" />
      <polygon points="925,75 880,75 880,85 915,85 915,120 925,120" />
      <polygon points="50,1364 150,1364 150,1349 65,1349 65,1264 50,1264" />
      <polygon points="75,1339 120,1339 120,1329 85,1329 85,1294 75,1294" />
      <polygon points="950,1364 850,1364 850,1349 935,1349 935,1264 950,1264" />
      <polygon points="925,1339 880,1339 880,1329 915,1329 915,1294 925,1294" />
    </g>
  </svg>`;

  const SVG_FRAME_POP = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 隗偵′荳ｸ縺・・繝・・縺ｪ螟ｪ譫 -->
    <rect x="40" y="40" width="920" height="1334" rx="40" ry="40" fill="none" stroke="#FF4081" stroke-width="12" stroke-dasharray="30 15" />
    <rect x="60" y="60" width="880" height="1294" rx="20" ry="20" fill="none" stroke="#00BCD4" stroke-width="4" />
    <!-- 邏吝聖髮ｪ (Confetti) -->
    <g opacity="0.7">
      <circle cx="100" cy="120" r="15" fill="#FFEB3B" />
      <polygon points="150,80 170,110 130,110" fill="#00BCD4" />
      <rect x="80" y="200" width="20" height="20" transform="rotate(45 90 210)" fill="#FF4081" />
      <circle cx="900" cy="130" r="12" fill="#FF4081" />
      <polygon points="850,70 870,100 830,100" fill="#FFEB3B" />
      <circle cx="120" cy="1300" r="18" fill="#00BCD4" />
      <rect x="180" y="1250" width="15" height="15" transform="rotate(20 187 1257)" fill="#FFEB3B" />
      <polygon points="900,1300 920,1330 880,1330" fill="#FF4081" />
      <circle cx="820" cy="1320" r="14" fill="#00BCD4" />
    </g>
    <!-- 蝗幃嚆縺ｮ繝ｪ繝懊Φ -->
    <g fill="#FF4081">
      <path d="M 10,10 L 120,10 L 100,50 L 120,90 L 10,90 Z" transform="translate(10, 10) rotate(-45 65 50)" />
      <path d="M 10,10 L 120,10 L 100,50 L 120,90 L 10,90 Z" transform="translate(870, 1314) rotate(135 65 50)" />
    </g>
  </svg>`;

  const SVG_FRAME_VINTAGE = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 繝√こ繝・ヨ縺ｮ繧医≧縺ｪ蛻・ｊ谺縺・-->
    <path d="
      M 80,30 L 920,30 A 50,50 0 0,0 970,80 L 970,1334 A 50,50 0 0,0 920,1384 L 80,1384 A 50,50 0 0,0 30,1334 L 30,80 A 50,50 0 0,0 80,30 Z
    " fill="none" stroke="#3E2723" stroke-width="4" />
    <!-- 蜀・・縺ｮ遐ｴ邱・-->
    <path d="
      M 90,45 L 910,45 A 35,35 0 0,0 955,90 L 955,1324 A 35,35 0 0,0 910,1369 L 90,1369 A 35,35 0 0,0 45,1324 L 45,90 A 35,35 0 0,0 90,45 Z
    " fill="none" stroke="#3E2723" stroke-width="2" stroke-dasharray="10 10" />
    <!-- 荳贋ｸ九・繝舌・繧ｳ繝ｼ繝蛾｢ｨ陬・｣ｾ -->
    <g fill="#3E2723">
      <rect x="400" y="15" width="5" height="15" /><rect x="410" y="15" width="2" height="15" />
      <rect x="417" y="15" width="8" height="15" /><rect x="430" y="15" width="3" height="15" />
      <rect x="438" y="15" width="6" height="15" /><rect x="448" y="15" width="2" height="15" />
      <rect x="455" y="15" width="5" height="15" /><rect x="465" y="15" width="8" height="15" />
      <rect x="478" y="15" width="2" height="15" /><rect x="485" y="15" width="6" height="15" />
      <rect x="495" y="15" width="10" height="15" />
      <text x="515" y="27" font-family="monospace" font-size="12" font-weight="bold">NO.0001</text>
    </g>
  </svg>`;

  const SVG_FRAME_NORDIC = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1414" preserveAspectRatio="none">
    <!-- 荳崎ｦ丞援縺ｪ驟咲ｽｮ縺ｮ驥阪↑繧雁粋縺・濠騾乗・繧ｵ繝ｼ繧ｯ繝ｫ・亥圏谺ｧ繝・く繧ｹ繧ｿ繧､繝ｫ鬚ｨ・・-->
    <g opacity="0.6">
      <circle cx="50" cy="50" r="100" fill="#FFAB91" />
      <circle cx="120" cy="80" r="70" fill="#81D4FA" />
      <circle cx="70" cy="150" r="50" fill="#FFE082" />
      <circle cx="950" cy="1364" r="120" fill="#81D4FA" />
      <circle cx="850" cy="1300" r="80" fill="#FFE082" />
      <circle cx="900" cy="1220" r="60" fill="#FFAB91" />
      <circle cx="950" cy="100" r="80" fill="#FFE082" />
      <circle cx="880" cy="60" r="50" fill="#FFAB91" />
      <circle cx="60" cy="1350" r="90" fill="#FFAB91" />
      <circle cx="130" cy="1280" r="50" fill="#81D4FA" />
    </g>
    <!-- 蜈ｨ菴薙ｒ蝗ｲ繧謇区嶌縺埼｢ｨ縺ｮ繧・ｋ縺・ｷ・-->
    <path d="M 30,50 Q 500,20 970,50 Q 980,707 970,1364 Q 500,1394 30,1364 Q 20,707 30,50 Z" fill="none" stroke="#5D4037" stroke-width="4" stroke-dasharray="20 10" opacity="0.8" />
  </svg>`;

  const FRAMES = {
    luxury: SVG_FRAME_LUXURY,
    heavygold: SVG_FRAME_HEAVY_GOLD,
    simple: SVG_FRAME_SIMPLE,
    modern: SVG_FRAME_MODERN,
    artdeco: SVG_FRAME_ARTDECO,
    floral: SVG_FRAME_FLORAL,
    boldleaf: SVG_FRAME_BOLD_LEAF,
    japanese: SVG_FRAME_JAPANESE,
    pop: SVG_FRAME_POP,
    vintage: SVG_FRAME_VINTAGE,
    nordic: SVG_FRAME_NORDIC
  };

  function getState() {
    const formData = new FormData(form);
    return {
      size: formData.get('paperSize') || 'A4',
      orientation: formData.get('orientation') || 'portrait',
      frame: formData.get('framePattern') || 'luxury',
      bgStyle: formData.get('bgStyle') || 'lavender',
      recipient: (formData.get('recipient') || '').trim(),
      title: (formData.get('title') || '').trim(),
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
      senderName3: (formData.get('senderName3') || '').trim()
    };
  }

  async function render() {
    try {
      const state = getState();
      
      const dims = SIZES[state.size];
      const width = state.orientation === 'portrait' ? dims.short : dims.long;
      const height = state.orientation === 'portrait' ? dims.long : dims.short;
      
      canvas.width = width;
      canvas.height = height;

      // 閭梧勹濶ｲ縺ｮ險ｭ螳・(繧ｰ繝ｩ繝・・繧ｷ繝ｧ繝ｳ繧偵ｂ縺｣縺ｨ豼・￥)
      let edgeColor = '#D1C4E9'; // 豼・＞繝ｩ繝吶Φ繝繝ｼ
      if (state.bgStyle === 'pink') edgeColor = '#F8BBD0'; // 豼・＞繝斐Φ繧ｯ
      else if (state.bgStyle === 'gold') edgeColor = '#FFECB3'; // 豼・＞繧ｴ繝ｼ繝ｫ繝・      else if (state.bgStyle === 'green') edgeColor = '#C8E6C9'; // 豼・＞繧ｰ繝ｪ繝ｼ繝ｳ
      else if (state.bgStyle === 'white') edgeColor = '#FFFFFF';

      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 1.2
      );
      gradient.addColorStop(0, '#FFFFFF'); // 荳ｭ蠢・・螳悟・縺ｫ逋ｽ
      gradient.addColorStop(0.4, '#FFFFFF'); // 荳ｭ蠢・°繧・0%縺ｮ遽・峇縺ｾ縺ｧ縺ｯ逵溘▲逋ｽ繧偵く繝ｼ繝・      gradient.addColorStop(1, edgeColor); // 螟也ｸ√↓陦後￥縺ｫ蠕薙▲縺ｦ縺励▲縺九ｊ濶ｲ縺･縺・      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 繝輔Ξ繝ｼ繝
      const svgString = FRAMES[state.frame] || FRAMES.luxury;
      const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
      const svgDataUrl = 'data:image/svg+xml;base64,' + svgBase64;
      
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          resolve();
        };
        img.onerror = (err) => {
          console.error("SVG Load Error", err);
          resolve();
        };
        img.src = svgDataUrl;
      });

      // --- 繝・く繧ｹ繝域緒逕ｻ ---
      const centerX = width / 2;
      const scale = Math.min(width, height) / 1748; 
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 濶ｲ縺ｮ螳夂ｾｩ
      // colorTextMain removed 
      const colorTitle = state.colorTitle;    
      const colorSama = state.colorRecipient;     

      // 繝輔か繝ｳ繝医し繧､繧ｺ螳夂ｾｩ
      const titleFontSize = 320 * scale; 
      const recFontSize = 130 * scale; 
      const samaFontSize = 90 * scale;
      const compFontSize = 160 * scale; 
      const corpFontSize = 100 * scale; 
      const nameFontSize = 200 * scale; 
      const titleFontSize2 = 100 * scale; 

      // 騾｣蜷阪ョ繝ｼ繧ｿ縺ｮ蜿朱寔
      const senders = [];
      if (state.senderName1) senders.push({ title: state.senderTitle1, name: state.senderName1 });
      if (state.senderName2) senders.push({ title: state.senderTitle2, name: state.senderName2 });
      if (state.senderName3) senders.push({ title: state.senderTitle3, name: state.senderName3 });

      // 繝ｬ繧､繧｢繧ｦ繝医ヶ繝ｭ繝・け縺ｮ讒狗ｯ会ｼ郁ｦ∫ｴ縺ｮ鬮倥＆縺ｨ髫咎俣繧貞ｮ夂ｾｩ縺励※蜍慕噪驟咲ｽｮ縺吶ｋ・・      const blocks = [];
      
      if (state.recipient) {
        blocks.push({ type: 'recipient', height: recFontSize });
        blocks.push({ type: 'gap', height: 180 * scale }); // 螳帛・縺ｨ繧ｿ繧､繝医Ν髢・      }
      
      blocks.push({ type: 'title', height: titleFontSize });
      
      if (state.senderCompany) {
        blocks.push({ type: 'gap', height: 260 * scale }); // 繧ｿ繧､繝医Ν縺ｨ莨夂､ｾ髢難ｼ亥ｺ・ａ・・        blocks.push({ type: 'company', height: compFontSize });
        blocks.push({ type: 'gap', height: 160 * scale }); // 莨夂､ｾ縺ｨ豌丞錐髢・      } else {
        blocks.push({ type: 'gap', height: 260 * scale }); // 莨夂､ｾ縺ｪ縺励・蝣ｴ蜷医・繧ｿ繧､繝医Ν縺ｨ豌丞錐髢・      }
      
      if (senders.length > 0) {
        // 騾｣蜷阪・謨ｰ縺縺鷹ｫ倥＆繧堤｢ｺ菫晢ｼ亥錐蜑埼俣縺ｮ髫咎俣繧ょ性繧・・        const nameSpacing = 60 * scale;
        const totalNamesHeight = (nameFontSize * senders.length) + (nameSpacing * (senders.length - 1));
        blocks.push({ type: 'names', height: totalNamesHeight, senders: senders, spacing: nameSpacing });
      }

      // 繝悶Ο繝・け蜈ｨ菴薙・鬮倥＆繧定ｨ育ｮ励＠縺ｦ縲〆縺ｮ繧ｹ繧ｿ繝ｼ繝井ｽ咲ｽｮ繧呈ｱｺ繧√ｋ・亥桙逶ｴ荳ｭ螟ｮ謠・∴・・      const totalHeight = blocks.reduce((sum, b) => sum + b.height, 0);
      let currentY = (height - totalHeight) / 2;

      // 蜷・ヶ繝ｭ繝・け縺ｮ謠冗判繝ｫ繝ｼ繝・      for (const block of blocks) {
        const drawY = currentY + (block.height / 2); // textBaseline=middle 縺ｮ縺溘ａ荳ｭ螟ｮ繧呈欠螳・
        if (block.type === 'recipient') {
          const recText = state.recipient;
          const suffix = ' 讒倥∈';
          
          ctx.font = `900 ${recFontSize}px "Noto Serif JP", serif`;
          const textWidth = ctx.measureText(recText).width;
          ctx.font = `700 ${samaFontSize}px "Noto Serif JP", serif`;
          const suffixWidth = ctx.measureText(suffix).width;
          
          const space = 20 * scale;
          const totalWidth = textWidth + space + suffixWidth;
          let startX = centerX - (totalWidth / 2);
          
          ctx.textAlign = 'left';
          ctx.font = `900 ${recFontSize}px "Noto Serif JP", serif`;
          ctx.fillStyle = (block.type === 'recipient') ? state.colorRecipient : (block.type === 'company' ? state.colorSenderCompany : state.colorSenderName);
          ctx.fillText(recText, startX, drawY);
          
          startX += textWidth + space;
          ctx.font = `700 ${samaFontSize}px "Noto Serif JP", serif`;
          ctx.fillStyle = colorSama;
          ctx.fillText(suffix, startX, drawY);
        } 
        else if (block.type === 'title') {
          ctx.textAlign = 'center';
          ctx.font = `900 ${titleFontSize}px "Noto Serif JP", serif`;
          ctx.fillStyle = colorTitle;
          const displayTitle = state.title || '逾・;
          ctx.fillText(displayTitle, centerX, drawY);
        }
        else if (block.type === 'company') {
          const companyParts = state.senderCompany.split(/(譬ｪ蠑丈ｼ夂､ｾ|譛蛾剞莨夂､ｾ|蜷亥酔莨夂､ｾ|荳闊ｬ遉ｾ蝗｣豕穂ｺｺ|荳闊ｬ雋｡蝗｣豕穂ｺｺ|NPO豕穂ｺｺ)/);
          
          let totalWidth = 0;
          const measuredParts = companyParts.map(part => {
            if (!part) return null;
            let isCorp = /譬ｪ蠑丈ｼ夂､ｾ|譛蛾剞莨夂､ｾ|蜷亥酔莨夂､ｾ|荳闊ｬ遉ｾ蝗｣豕穂ｺｺ|荳闊ｬ雋｡蝗｣豕穂ｺｺ|NPO豕穂ｺｺ/.test(part);
            let fSize = isCorp ? corpFontSize : compFontSize;
            ctx.font = `900 ${fSize}px "Noto Serif JP", serif`;
            let w = ctx.measureText(part).width;
            totalWidth += w;
            return { text: part, width: w, font: ctx.font };
          }).filter(Boolean);

          let startX = centerX - (totalWidth / 2);
          ctx.textAlign = 'left';
          ctx.fillStyle = (block.type === 'recipient') ? state.colorRecipient : (block.type === 'company' ? state.colorSenderCompany : state.colorSenderName);
          
          measuredParts.forEach(p => {
            ctx.font = p.font;
            ctx.fillText(p.text, startX, drawY);
            startX += p.width;
          });
        }
        else if (block.type === 'names') {
          let nameStartY = currentY + (nameFontSize / 2); // 譛蛻昴・蜷榊燕縺ｮY
          const spaceBetweenTitleAndName = 30 * scale; 
          
          block.senders.forEach(sender => {
            let totalNameWidth = 0;
            if (sender.title) {
              ctx.font = `700 ${titleFontSize2}px "Noto Serif JP", serif`; 
              totalNameWidth += ctx.measureText(sender.title).width + spaceBetweenTitleAndName;
            }
            
            ctx.font = `900 ${nameFontSize}px "Noto Serif JP", serif`; 
            totalNameWidth += ctx.measureText(sender.name).width;

            let startXName = centerX - (totalNameWidth / 2);
            ctx.textAlign = 'left';
            ctx.fillStyle = (block.type === 'recipient') ? state.colorRecipient : (block.type === 'company' ? state.colorSenderCompany : state.colorSenderName);

            if (sender.title) {
              ctx.font = `700 ${titleFontSize2}px "Noto Serif JP", serif`;
              ctx.fillText(sender.title, startXName, nameStartY);
              startXName += ctx.measureText(sender.title).width + spaceBetweenTitleAndName;
            }

            ctx.font = `900 ${nameFontSize}px "Noto Serif JP", serif`;
            ctx.fillText(sender.name, startXName, nameStartY);
            
            nameStartY += nameFontSize + block.spacing;
          });
        }
        
        currentY += block.height;
      }

    } catch (e) {
      console.error("Render Error:", e);
    }
  }

  form.addEventListener('input', render);
  
  render();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      render();
    });
  }

  downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `tatefuda_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
