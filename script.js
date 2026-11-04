// Dynamically compute exact artboard scale to preserve 100% pixel-perfect coordinates across all aspect ratios (16:9, 16:10, 2K, MacBook)
function updateCoverScale() {
  const root = document.documentElement;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Fit 1920x1080 artboard inside screen with contain scaling
  const scale = Math.min(vw / 1920, vh / 1080);
  root.style.setProperty('--cover-scale', scale.toFixed(4));
}
window.addEventListener('resize', updateCoverScale);
window.addEventListener('orientationchange', updateCoverScale);
updateCoverScale();

// Program data (photos live in assets/foto/02-program/<folder>/1.jpg, 2.jpg, ...)
const PROGRAMS = [
  { f: '2026-sma-n1-bantul-mpls', y: 2026, t: 'MPLS dan Sosialisasi SMA Negeri 1 Bantul',
    d: 'Bank BPD DIY Goes to School dalam rangkaian MPLS. Siswa baru dibekali pemahaman mengelola keuangan secara bijak sejak dini, dengan antusiasme tinggi pada sesi diskusi dan tanya jawab.' },
  { f: '2026-smp-tumbuh-cerdas', y: 2026, t: 'SMP Tumbuh Cerdas Kelola Keuangan',
    d: 'Siswa mengenal pentingnya menabung dan mengelola uang saku, bahaya pinjaman online ilegal, serta risiko judi online yang menyasar anak muda.' },
  { f: '2026-tk-it-anak-sholeh', y: 2026, t: 'Goes to School TK IT Anak Sholeh Bantul',
    d: 'Menanamkan pemahaman dasar pengelolaan keuangan dan membentuk kebiasaan finansial yang positif pada generasi muda sejak usia dini.' },
  { f: '2026-sd-n1-trirenggo', y: 2026, t: 'Goes to School SD Negeri 1 Trirenggo',
    d: 'Edukasi interaktif dan menyenangkan: manfaat menabung, mengenal produk perbankan secara sederhana, dan meraih cita-cita lewat perencanaan keuangan.' },
  { f: '2026-slb-pgri-trimulyo-marsudi-putra', y: 2026, t: 'Literasi Keuangan Segmen Prioritas (SLB)',
    d: 'Edukasi di SLB PGRI Trimulyo Jetis dan SLB Marsudi Putra 1 Bantul, rangkaian Program KEJAR 2026, dengan pendekatan ramah bagi anak berkebutuhan khusus.' },
  { f: '2025-simpel-gratis', y: 2025, t: 'Inklusi Keuangan Pelajar: Tabungan SimPel Gratis',
    d: 'Penyerahan simbolis Tabungan SimPel kepada pelajar Bantul, mendukung gerakan Satu Rekening Satu Pelajar (KEJAR) dan target inklusi keuangan nasional 91%.' },
  { f: '2025-smk-n1-bantul-waspada-finansial', y: 2025, t: 'Waspada Finansial Sejak Dini, SMK Negeri 1 Bantul',
    d: 'Edukasi literasi keuangan pada MPLS untuk membangun kebiasaan finansial sehat dan waspada terhadap ancaman digital di kalangan remaja.' },
  { f: '2025-smp-n3-bantul', y: 2025, t: 'Edukasi Keuangan SMP Negeri 3 Bantul',
    d: 'Motivasi menabung rutin lewat Mini Bank di lingkungan sekolah, serta tips bijak mengelola keuangan sejak usia dini.' },
  { f: '2025-sma-n2-bantul', y: 2025, t: 'Cerdas Kelola Keuangan SMA Negeri 2 Bantul',
    d: 'Tips mengatur uang saku serta waspada terhadap pinjaman online ilegal dan investasi bodong.' },
  { f: '2025-sd-nu-pemanahan', y: 2025, t: 'Literasi Keuangan SD NU Pemanahan',
    d: 'Mendukung Program KEJAR agar siswa memahami pentingnya menabung dan menjadikannya kebiasaan bermanfaat untuk masa depan.' },
  { f: '2024-sembako-stunting', y: 2024, t: 'Bantuan Sembako Pencegahan Stunting',
    d: 'Setiap paket yang disalurkan memastikan ibu hamil dan balita mendapatkan asupan nutrisi layak, demi generasi yang sehat, cerdas, dan bebas stunting.' }
];

const BASE = 'assets/foto/02-program/';
const rail = document.getElementById('rail');
let lastYear = null;
PROGRAMS.forEach((p, i) => {
  if (p.y !== lastYear) {
    const g = document.createElement('div');
    g.className = 'year-gap';
    g.textContent = p.y;
    rail.append(g);
    lastYear = p.y;
  }
  const c = document.createElement('article');
  c.className = 'pcard glass';
  c.tabIndex = 0;
  c.innerHTML = `
    <div class="ph"><img src="${BASE}${p.f}/1.jpeg" alt="" draggable="false" onerror="this.src='${BASE}${p.f}/1.jpg';this.onerror=function(){this.src='${BASE}${p.f}/1.JPG';this.onerror=function(){this.src='${BASE}${p.f}/1.png';this.onerror=function(){this.src='${BASE}${p.f}/1.gif';this.onerror=function(){this.remove();};};};}"><span>Foto kegiatan</span></div>
    <div class="pbody">
      <span class="pill">${p.y}</span>
      <h3>${p.t}</h3>
      <p>${p.d}</p>
    </div>`;
  c.dataset.i = i;
  rail.append(c);
});

// Split hero headline into animated words
document.querySelectorAll('.split').forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((w, i) => `<span class="w" style="animation-delay:${0.2 + i * 0.09}s">${w}</span>`)
    .join(' ');
});

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up numbers (Indonesian formatting)
const counter = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / 1800, 1);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = pre + v.toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  });
});
document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

// Cursor glow + glass specular highlight
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});
document.querySelectorAll('.glass').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

// Subtle 3D tilt
document.querySelectorAll('.tilt').forEach(el => {
  const isPortrait = el.classList.contains('portrait');
  const max = isPortrait ? 4.5 : 3;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-y * max}deg) rotateY(${x * max}deg)${isPortrait ? ' translateY(-4px)' : ''}`;
    if (isPortrait) {
      el.style.setProperty('--px', (x * 10).toFixed(1) + 'px');
      el.style.setProperty('--py', Math.max(0, y * 6).toFixed(1) + 'px');
    }
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
    if (isPortrait) {
      el.style.setProperty('--px', '0px');
      el.style.setProperty('--py', '0px');
    }
  });
});

// Word-by-word scrub text
const scrubs = [...document.querySelectorAll('[data-scrub]')].map(el => {
  const parts = el.innerHTML.trim().split(/<br\s*\/?>/i);
  el.innerHTML = parts
    .map(p => p.trim().split(/\s+/).map(w => `<span class="sw">${w}</span>`).join(' '))
    .join('<br>');
  return {
    el,
    isHeroStmt: !!el.closest('.cover-statement-text'),
    words: [...el.querySelectorAll('.sw')].map(w => ({ el: w, last: -1 }))
  };
});

// Scroll engine: every scroll-linked effect runs in one smoothed frame loop
(() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dim = document.getElementById('dim');
  const hero = document.querySelector('[data-hero]');
  const heroText = hero.querySelector('.hero-text');
  const heroObj = hero.querySelector('[data-heroobj]');
  const bgText = hero.querySelector('.cover-bg-text');
  const rightCols = hero.querySelector('.cover-right');
  const stmtWrap = hero.querySelector('[data-statementwrap]');
  const pin = document.querySelector('[data-pin]');
  const track = document.getElementById('rail');
  const pinBar = document.getElementById('pinBar');
  const stages = [...document.querySelectorAll('[data-stage]')].map(el => ({
    el,
    obj: el.querySelector('[data-stageobj]'),
    lis: [...el.querySelectorAll('.pillars li')],
    quote: el.querySelector('.stage-quote'),
    sp: 0
  }));
  const coin = document.querySelector('[data-coin]');
  const decos = [...document.querySelectorAll('.deco')].map(el => ({ el, p: 0 }));

  let mx = 0, my = 0, cmx = 0, cmy = 0, lastY = -1, vel = 0, pinSmooth = 0;
  addEventListener('pointermove', e => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  // The pinned section is as tall as the horizontal distance it needs to travel
  let totalScroll = 1;
  const sizePin = () => {
    const dist = Math.max(0, track.scrollWidth - innerWidth);
    pin.style.height = dist + innerHeight + 'px';
    pin.dataset.dist = dist;
    totalScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  };
  sizePin();
  addEventListener('resize', sizePin);
  addEventListener('load', sizePin);

  const progress = el => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - innerHeight));
  };

  const frame = () => {
    const sy = scrollY;
    const dmx = mx - cmx;
    const dmy = my - cmy;
    const dy = sy - lastY;

    // Sleep when neither scroll nor mouse is moving
    if (Math.abs(dy) < 0.1 && Math.abs(dmx) < 0.0005 && Math.abs(dmy) < 0.0005 && Math.abs(vel) < 0.1) {
      requestAnimationFrame(frame);
      return;
    }

    const vh = innerHeight;
    cmx += dmx * 0.08;
    cmy += dmy * 0.08;
    vel += (dy - vel) * 0.15;
    lastY = sy;
    const stretch = Math.min(Math.abs(vel) * 0.004, 0.2);

    // veil deepens down the page
    dim.style.opacity = (0.25 + 0.75 * clamp(sy / totalScroll)).toFixed(3);

    const hp = progress(hero); // 0 (cover) -> 1 (end of statement)

    if (!reduce) {
      // Only update hero DOM if hero is near or in viewport
      if (sy < vh * 3.5) {
        // Phase 1 (hp: 0 -> 0.35): Cover elements slide out horizontally
        const p1 = clamp(hp / 0.35);
        heroText.style.transform = `translate3d(${-p1 * 550}px,0,0)`;
        heroText.style.opacity = clamp(1 - p1 * 1.4).toFixed(2);

        if (rightCols) {
          rightCols.style.transform = `translate3d(${p1 * 600}px,0,0)`;
          rightCols.style.opacity = clamp(1 - p1 * 1.4).toFixed(2);
        }

        if (bgText) {
          bgText.style.transform = `translate3d(-50%, calc(-50% - ${p1 * 120}px), 0)`;
          bgText.style.opacity = clamp(1 - p1 * 1.3).toFixed(2);
        }

        // Phase 2 (hp: 0.22 -> 1.0): Statement text enters and stays locked at center
        if (stmtWrap) {
          const p2 = clamp((hp - 0.22) / 0.25);
          stmtWrap.style.opacity = p2.toFixed(2);
          stmtWrap.style.transform = `translate3d(0, calc(-50% + ${(1 - p2) * 60}px), 0)`;
          stmtWrap.style.pointerEvents = p2 > 0.5 ? 'auto' : 'none';
        }

        // TUNAS CHOREOGRAPHY: Seamless travel inside the locked 1920x1080 canvas
        const heroObjImg = heroObj.querySelector('img');
        if (vh > 0 && innerWidth > 768) {
          const pt = clamp(hp / 0.45);
          const easePt = 1 - Math.pow(1 - pt, 3);
          const moveX = easePt * 500;
          const moveY = easePt * 70;
          const scaleVal = 1 - easePt * 0.1;
          
          heroObj.style.transform =
            `translate3d(calc(-50% + ${moveX + cmx * 25}px), calc(-50% + ${moveY + cmy * 20}px), 0) scale(${scaleVal})`;
          if (heroObjImg) heroObjImg.style.opacity = '1';
        } else {
          const pt = clamp(hp / 0.45);
          const easePt = 1 - Math.pow(1 - pt, 3);
          const moveX = -easePt * (innerWidth * 0.25);
          const moveY = easePt * (vh * 0.04);
          const scaleVal = 1 + easePt * 0.35;
          heroObj.style.transform =
            `translate3d(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px), 0) scale(${scaleVal})`;
          if (heroObjImg) heroObjImg.style.opacity = (1 - easePt * 0.76).toFixed(2);
        }
      }

      // pinned horizontal program track (only update when near viewport)
      const pinRect = pin.getBoundingClientRect();
      if (pinRect.bottom > -200 && pinRect.top < vh + 200) {
        const dist = +pin.dataset.dist || 0;
        const pr = clamp(-pinRect.top / Math.max(1, pinRect.height - vh));
        pinSmooth += (pr - pinSmooth) * 0.14;
        track.style.transform = `translate3d(${-pinSmooth * dist}px,0,0)`;
        pinBar.style.width = (pinSmooth * 100).toFixed(1) + '%';
      }

      // product stages: object turns, pillars light up one by one
      stages.forEach(s => {
        const sr = s.el.getBoundingClientRect();
        if (sr.bottom < -200 || sr.top > vh + 200) return;
        const p = clamp(-sr.top / Math.max(1, sr.height - vh));
        s.sp += (p - s.sp) * 0.12;
        const mirror = s.el.classList.contains('mirror') ? -1 : 1;
        s.obj.style.transform =
          `translate3d(${cmx * 24}px,${cmy * 16}px,0) rotate(${(-8 + s.sp * 16) * mirror}deg) scale(${0.88 + Math.min(s.sp * 1.6, 1) * 0.2})`;
        s.lis.forEach((li, i) => li.classList.toggle('on', p > 0.2 + (i * 0.5) / s.lis.length));
        if (s.quote) s.quote.classList.toggle('on', p > 0.65);
      });

      // coin sways gently with scroll through the numbers section
      if (coin) {
        const r = coin.parentElement.getBoundingClientRect();
        if (r.bottom > -300 && r.top < vh + 300) {
          const t = (r.top + r.height / 2 - vh / 2) / vh;
          coin.style.transform = `translate3d(${cmx * 30}px,${t * 80 + cmy * 20}px,0) rotate(${-t * 14}deg) scale(${1 - stretch * 0.2},${1 + stretch * 0.5})`;
        }
      }

      // floating glass objects parallax inside their own section
      decos.forEach((d, i) => {
        const el = d.el;
        const sec = el.parentElement.getBoundingClientRect();
        if (sec.bottom < -300 || sec.top > vh + 300) return;
        const target = (sec.top + sec.height / 2 - vh / 2) / vh;
        d.p += (target - d.p) * 0.1;
        const s = +el.dataset.speed || 0, r = +el.dataset.rot || 0, dp = +el.dataset.depth || 0;
        const spin = el.dataset.spin ? Math.sin(sy * 0.0018) * 5 : d.p * (r * 0.5);
        const y = d.p * s * 160 + cmy * dp * 1.2;
        const x = Math.sin(d.p * 1.5 + i) * 20 + cmx * dp * 1.4;
        el.style.transform =
          `translate3d(${x}px,${y}px,0) rotate(${spin}deg) scale(${1 - stretch * 0.2},${1 + stretch * 0.4})`;
      });
    }

    // scrubbed words (only touch DOM if opacity actually changed)
    scrubs.forEach(s => {
      let p = 0;
      if (s.isHeroStmt) {
        if (sy > vh * 3.5) return;
        p = clamp((hp - 0.3) / 0.65);
      } else {
        const r = s.el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.25));
      }
      const n = s.words.length;
      s.words.forEach((w, i) => {
        const o = +(0.18 + clamp((p * (n + 4) - i) / 3) * 0.82).toFixed(2);
        if (w.last !== o) {
          w.last = o;
          w.el.style.opacity = o;
        }
      });
    });
    requestAnimationFrame(frame);
  };
  frame();
})();

// Program cards: click opens lightbox; keyboard support
rail.addEventListener('click', e => {
  const c = e.target.closest('.pcard');
  if (c) openBox(+c.dataset.i);
});
rail.addEventListener('keydown', e => {
  const c = e.target.closest('.pcard');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openBox(+c.dataset.i); }
});

// Profile gallery strip: click opens lightbox for profile documentation photos (2, 3, 4...)
const profileGallery = document.getElementById('profileGallery');
if (profileGallery) {
  profileGallery.addEventListener('click', e => {
    const btn = e.target.closest('.pg-item');
    if (btn) openProfileBox(+btn.dataset.pg || 0);
  });
}

// Fasilitas bento tiles (01 - 04): click opens lightbox pop-up
const fasilitasTiles = [...document.querySelectorAll('#fasilitas .tile')];
fasilitasTiles.forEach((tile, idx) => {
  tile.tabIndex = 0;
  tile.addEventListener('click', () => openFacilityBox(idx));
  tile.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFacilityBox(idx);
    }
  });
});

// Lightbox: probes photos & videos in the activity folder
const box = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbVideo = document.getElementById('lbVideo');
const lbEmpty = document.getElementById('lbEmpty');
const lbCap = document.querySelector('.lb-cap');
let photos = [], pi = 0;

function fitLightboxToMedia(nw, nh, el) {
  if (!nw || !nh) return;
  const ratio = nw / nh;
  const maxH = Math.min(window.innerHeight * 0.66, 680);
  const maxW = Math.min(window.innerWidth * 0.86, 880);
  let w = maxH * ratio;
  let h = maxH;
  if (w > maxW) {
    w = maxW;
    h = maxW / ratio;
  }
  el.style.width = Math.round(w) + 'px';
  el.style.height = Math.round(h) + 'px';
  if (lbCap) lbCap.style.maxWidth = Math.max(320, Math.round(w)) + 'px';
}
function fitLightboxToImage() {
  fitLightboxToMedia(lbImg.naturalWidth, lbImg.naturalHeight, lbImg);
}
function fitLightboxToVideo() {
  if (!lbVideo.videoWidth || !lbVideo.videoHeight) return;
  fitLightboxToMedia(lbVideo.videoWidth, lbVideo.videoHeight, lbVideo);
}
lbImg.addEventListener('load', fitLightboxToImage);
lbVideo.addEventListener('loadedmetadata', fitLightboxToVideo);
lbVideo.addEventListener('loadeddata', fitLightboxToVideo);
lbVideo.addEventListener('canplay', fitLightboxToVideo);
window.addEventListener('resize', () => {
  if (box.hidden) return;
  if (!lbVideo.hidden) fitLightboxToVideo();
  else if (!lbImg.hidden) fitLightboxToImage();
});

function probe(src) {
  return new Promise(res => {
    const im = new Image();
    im.onload = () => res(src);
    im.onerror = () => res(null);
    im.src = src;
  });
}
async function probeVideo(src) {
  try {
    const r = await fetch(src, { method: 'HEAD' });
    return r.ok ? src : null;
  } catch {
    return null;
  }
}
async function findVideo(basePath) {
  const candidates = [
    'video.mp4', 'video.MP4', 'video.mov', 'video.MOV', 'video.webm',
    '1.mp4', '1.MP4', '1.mov', '1.MOV',
    '2.mp4', '2.MP4', '2.mov', '2.MOV'
  ];
  for (const name of candidates) {
    const res = await probeVideo(`${basePath}/${name}`);
    if (res) return res;
  }
  return null;
}
// Automatically add play badge on program cards that have a video file
document.querySelectorAll('.pcard').forEach(async card => {
  const i = +card.dataset.i;
  const p = PROGRAMS[i];
  if (!p) return;
  const vSrc = await findVideo(`${BASE}${p.f}`);
  if (vSrc) {
    card.dataset.video = vSrc;
    const ph = card.querySelector('.ph');
    if (ph && !ph.querySelector('.video-badge')) {
      const badge = document.createElement('span');
      badge.className = 'video-badge';
      badge.innerHTML = '<i>▶</i>';
      ph.appendChild(badge);
    }
  }
});

async function findImage(basePath, n) {
  const exts = ['.png', '.jpeg', '.jpg', '.JPG', '.JPEG', '.PNG', '.gif', '.GIF'];
  for (const ext of exts) {
    const res = await probe(`${basePath}/${n}${ext}`);
    if (res) return res;
  }
  return null;
}
async function openBox(i) {
  const p = PROGRAMS[i];
  document.getElementById('lbYear').textContent = p.y;
  document.getElementById('lbTitle').textContent = p.t;
  document.getElementById('lbDesc').textContent = p.d;
  box.hidden = false;
  document.body.style.overflow = 'hidden';
  photos = []; pi = 0;
  show();

  // Check if this program folder has a video file first
  const videoSrc = await findVideo(`${BASE}${p.f}`);
  if (videoSrc) {
    photos.push({ type: 'video', src: videoSrc, y: p.y, t: p.t, d: p.d });
    show();
    return;
  }

  for (let n = 1; n <= 12; n++) {
    const validSrc = await findImage(`${BASE}${p.f}`, n);
    if (!validSrc) break;
    photos.push(validSrc);
    if (n === 1) show();
    else updateCount();
  }
  show();
}
async function openProfileBox(startIndex = 0) {
  document.getElementById('lbYear').textContent = 'APSAI & BPD DIY';
  document.getElementById('lbTitle').textContent = 'Fendy Muryawan — Sinergi Sahabat Anak';
  document.getElementById('lbDesc').textContent = 'Dokumentasi kontribusi kepemimpinan Bank BPD DIY Cabang Bantul bersama APSAI Kabupaten Bantul.';
  box.hidden = false;
  document.body.style.overflow = 'hidden';
  photos = []; pi = 0;
  show();
  for (let n = 2; n <= 12; n++) {
    const validSrc = await findImage('assets/foto/00-profil-pak-fendy', n);
    if (validSrc) photos.push(validSrc);
  }
  if (photos.length > 0) {
    pi = Math.min(startIndex, photos.length - 1);
  }
  show();
}
function openFacilityBox(startIndex = 0) {
  photos = fasilitasTiles.map(tile => {
    const vid = tile.querySelector('.ph video');
    const img = tile.querySelector('.ph img');
    const num = tile.querySelector('.num')?.textContent || '';
    const title = tile.querySelector('h3')?.textContent || '';
    const desc = tile.querySelector('p')?.textContent || '';
    return {
      type: vid ? 'video' : 'image',
      src: vid ? vid.getAttribute('src') : (img ? img.getAttribute('src') : ''),
      y: `FASILITAS ${num}`,
      t: title,
      d: desc
    };
  }).filter(item => item.src);
  pi = Math.min(startIndex, Math.max(0, photos.length - 1));
  box.hidden = false;
  document.body.style.overflow = 'hidden';
  show();
}
function updateCount() {
  if (!photos.length) {
    document.getElementById('lbCount').textContent = '';
    return;
  }
  const cur = photos[pi];
  if (typeof cur === 'object' && cur !== null && cur.type === 'video') {
    document.getElementById('lbCount').textContent = 'Video Dokumentasi';
  } else {
    document.getElementById('lbCount').textContent = `Foto ${pi + 1} dari ${photos.length}`;
  }
}
function stopVideo() {
  if (lbVideo) {
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
  }
}
function show() {
  const has = photos.length > 0;
  lbEmpty.hidden = has;
  if (!has) {
    lbImg.hidden = true;
    lbVideo.hidden = true;
    stopVideo();
  } else {
    const cur = photos[pi];
    const isVideo = typeof cur === 'object' && cur !== null && cur.type === 'video';
    if (isVideo) {
      lbImg.hidden = true;
      lbVideo.hidden = false;
      lbVideo.style.width = '';
      lbVideo.style.height = '';
      lbVideo.src = cur.src;
      document.getElementById('lbYear').textContent = cur.y;
      document.getElementById('lbTitle').textContent = cur.t;
      document.getElementById('lbDesc').textContent = cur.d;
      if (lbVideo.readyState >= 1) fitLightboxToVideo();
      lbVideo.play().catch(() => {});
    } else {
      stopVideo();
      lbVideo.hidden = true;
      lbImg.hidden = false;
      lbImg.style.width = '';
      lbImg.style.height = '';
      if (typeof cur === 'object' && cur !== null) {
        lbImg.src = cur.src;
        document.getElementById('lbYear').textContent = cur.y;
        document.getElementById('lbTitle').textContent = cur.t;
        document.getElementById('lbDesc').textContent = cur.d;
      } else {
        lbImg.src = cur;
      }
      if (lbImg.complete) fitLightboxToImage();
    }
  }
  document.getElementById('lbPrev').style.display = photos.length > 1 ? '' : 'none';
  document.getElementById('lbNext').style.display = photos.length > 1 ? '' : 'none';
  updateCount();
}
function closeBox() {
  stopVideo();
  box.hidden = true;
  document.body.style.overflow = '';
}
function move(d) { if (photos.length) { pi = (pi + d + photos.length) % photos.length; show(); } }
document.querySelector('.lb-close').onclick = closeBox;
document.getElementById('lbPrev').onclick = () => move(-1);
document.getElementById('lbNext').onclick = () => move(1);
box.addEventListener('click', e => { if (e.target === box) closeBox(); });
addEventListener('keydown', e => {
  if (box.hidden) return;
  if (e.key === 'Escape') closeBox();
  if (e.key === 'ArrowLeft') move(-1);
  if (e.key === 'ArrowRight') move(1);
});
