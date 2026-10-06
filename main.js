const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
    if (e.target.matches('[data-count]')) countUp(e.target);
  });
}, { threshold: 0.18 });
$$('.reveal').forEach((el) => io.observe(el));

// Counters
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const dur = 1400;
  const tick = (t) => {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Rotating words
const words = ['venden', 'cobran', 'escalan', 'automatizan'];
const wordEl = $('#word');
let wi = 0;
setInterval(() => {
  wordEl.classList.add('out');
  setTimeout(() => {
    wi = (wi + 1) % words.length;
    wordEl.textContent = words[wi];
    wordEl.classList.remove('out');
  }, 450);
}, 2400);

// Nav + progress bar
const nav = $('#nav');
const bar = $('#progress');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 30);
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / h) * 100 + '%';
}, { passive: true });

// Cursor glow
const glow = $('#glow');
addEventListener('pointermove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
}, { passive: true });

// 3D tilt + spotlight on cards
$$('.tilt').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', x * 100 + '%');
    card.style.setProperty('--my', y * 100 + '%');
    card.style.transform = `perspective(1100px) rotateY(${(x - 0.5) * 5}deg) rotateX(${(0.5 - y) * 5}deg)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

// Magnetic buttons
$$('.magnetic').forEach((btn) => {
  btn.addEventListener('pointermove', (e) => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
});

// Foto circular: toma el link de data-src en #avatar
const avatar = $('#avatar');
if (avatar && avatar.dataset.src) {
  const img = new Image();
  img.alt = 'Foto de Matías Navarro';
  img.onload = () => { avatar.innerHTML = ''; avatar.appendChild(img); };
  img.src = avatar.dataset.src;
}
