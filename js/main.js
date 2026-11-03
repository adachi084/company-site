(function () {
  // 立面図風のスカイラインを生成（シード固定で毎回同じ街並み）
  var svg = document.getElementById('skyline');
  var NS = 'http://www.w3.org/2000/svg';
  var W = 1200, GL = 272;
  var seed = 7;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  var back = el('g', {}), front = el('g', {}), deco = el('g', {});
  // 奥の列
  var x = 0;
  while (x < W) {
    var w = 40 + rand() * 60, h = 60 + rand() * 110;
    back.appendChild(el('rect', { x: x, y: GL - h, width: w, height: h, fill: 'var(--building-2)' }));
    x += w + 2;
  }
  // 手前の列（窓あり）
  x = 8;
  var tallest = { h: 0 };
  var heights = [];
  while (x < W - 30) {
    var bw = 46 + rand() * 54;
    var bh = 50 + Math.pow(rand(), 1.6) * 170;
    if (x > 560 && x < 700 && tallest.h < 200) bh = 236; // 本社タワー
    var b = el('rect', { x: x, y: GL - bh, width: bw, height: bh, fill: 'var(--building)' });
    front.appendChild(b);
    for (var wy = GL - bh + 12; wy < GL - 14; wy += 14) {
      for (var wx = x + 8; wx < x + bw - 10; wx += 12) {
        if (rand() < 0.22) front.appendChild(el('rect', { x: wx, y: wy, width: 5, height: 7, fill: 'var(--window)', opacity: (0.55 + rand() * 0.45).toFixed(2) }));
      }
    }
    if (bh > tallest.h) tallest = { x: x, w: bw, h: bh };
    x += bw + 6 + rand() * 10;
  }
  // 航空障害灯とアンテナ
  var cx = tallest.x + tallest.w / 2, top = GL - tallest.h;
  deco.appendChild(el('line', { x1: cx, y1: top, x2: cx, y2: top - 18, stroke: 'var(--building)', 'stroke-width': 2 }));
  deco.appendChild(el('circle', { cx: cx, cy: top - 20, r: 3.5, 'class': 'beacon' }));
  // 寸法線
  var dx = tallest.x + tallest.w + 18;
  deco.appendChild(el('line', { x1: dx, y1: top, x2: dx, y2: GL, 'class': 'dim-line' }));
  deco.appendChild(el('line', { x1: dx - 5, y1: top, x2: dx + 5, y2: top, 'class': 'dim-line' }));
  deco.appendChild(el('line', { x1: dx - 5, y1: GL, x2: dx + 5, y2: GL, 'class': 'dim-line' }));
  var t1 = el('text', { x: dx + 8, y: top + 12, 'class': 'dim-text' }); t1.textContent = 'EL. +312m';
  var t2 = el('text', { x: dx + 8, y: top + 28, 'class': 'dim-text' }); t2.textContent = '540 PROJECTS';
  deco.appendChild(t1); deco.appendChild(t2);
  // 地盤線
  deco.appendChild(el('line', { x1: 0, y1: GL, x2: W, y2: GL, 'class': 'gl-line' }));
  var gl = el('text', { x: 4, y: GL + 18, 'class': 'dim-text' }); gl.textContent = '▽ GL ±0 — SINCE 2013';
  deco.appendChild(gl);
  svg.appendChild(back); svg.appendChild(front); svg.appendChild(deco);

  // お問い合わせフォーム（デモ：実際には送信しません）
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = [];
    ['name', 'email', 'message'].forEach(function (id) {
      var f = document.getElementById(id);
      if (!f.value.trim()) missing.push(f.labels[0].firstChild.textContent.trim());
    });
    var email = document.getElementById('email');
    if (missing.length) {
      status.textContent = missing.join('・') + 'を入力してください。';
      return;
    }
    if (!email.checkValidity()) {
      status.textContent = 'メールアドレスの形式を確認してください（例：name@example.com）。';
      return;
    }
    status.textContent = '入力内容を受け付けました。※デモサイトのため、実際には送信されません。';
    form.reset();
  });
})();
