/* ============================================================
   ClawBot — Main JavaScript
   ============================================================ */

/* ============ CUSTOM CURSOR ============ */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .toggle, .faq-q').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursorRing.style.width = '60px';
    cursorRing.style.height = '60px';
    cursorRing.style.borderColor = 'rgba(0,245,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursorRing.style.width = '40px';
    cursorRing.style.height = '40px';
    cursorRing.style.borderColor = 'rgba(0,245,255,0.5)';
  });
});


/* ============ NAVBAR ============ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('open');
});

function closeMobile() {
  document.getElementById('mobile-menu').classList.remove('open');
}


/* ============ HERO PARTICLE CANVAS ============ */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Particle() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.vx = (Math.random() - 0.5) * 0.3;
  this.vy = (Math.random() - 0.5) * 0.3;
  this.r = Math.random() * 1.5 + 0.5;
  this.a = Math.random();
  this.da = 0.005 * (Math.random() > 0.5 ? 1 : -1);
  const cols = ['#00f5ff', '#bf00ff', '#ff0090', '#00ff88'];
  this.c = cols[Math.floor(Math.random() * cols.length)];
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

let mouseX = W / 2, mouseY = H / 2;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.a += p.da;
    if (p.a <= 0 || p.a >= 1) p.da *= -1;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.globalAlpha = p.a * 0.7;
    ctx.fill();

    particles.forEach(p2 => {
      const dx = p.x - p2.x, dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = p.c;
        ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
  });

  // Mouse parallax on hero visual
  const heroVis = document.getElementById('hero-visual');
  if (heroVis) {
    const rx = (mouseX / W - 0.5) * 10;
    const ry = (mouseY / H - 0.5) * -10;
    heroVis.style.transform = `translateY(-50%) rotateY(${rx}deg) rotateX(${ry}deg)`;
    heroVis.style.transition = 'transform 0.3s ease';
  }

  requestAnimationFrame(drawParticles);
}
drawParticles();


/* ============ TYPEWRITER EFFECT ============ */
const words = ['That Grips', 'That Never Lets Go', 'That Converts', 'That Works 24/7'];
let wi = 0, ci = 0, deleting = false;
const twEl = document.getElementById('typewriter-text');

function typeWriter() {
  const w = words[wi];
  if (!deleting) {
    twEl.textContent = w.slice(0, ci++);
    if (ci > w.length) { deleting = true; setTimeout(typeWriter, 1800); return; }
  } else {
    twEl.textContent = w.slice(0, ci--);
    if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; setTimeout(typeWriter, 400); return; }
  }
  setTimeout(typeWriter, deleting ? 60 : 90);
}
typeWriter();


/* ============ SCROLL REVEAL ============ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ============ STAT COUNTER ANIMATION ============ */
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal) || 0;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const dur = 2000, step = 16;
  const inc = target / (dur / step);
  const t = setInterval(() => {
    start += inc;
    if (start >= target) { start = target; clearInterval(t); }
    el.textContent = prefix + (decimal ? start.toFixed(decimal) : Math.floor(start)) + suffix;
  }, step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCount);
      e.target.querySelectorAll('.stat-card').forEach((c, i) => {
        setTimeout(() => c.classList.add('visible'), i * 120);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
statsObs.observe(document.getElementById('stats'));


/* ============ FEATURE CARDS REVEAL ============ */
const featObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.feat-card').forEach((c, i) => {
        setTimeout(() => c.classList.add('visible'), i * 100);
      });
      featObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
featObs.observe(document.getElementById('features'));


/* ============ STEPS REVEAL ============ */
const howObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.step').forEach(s => s.classList.add('visible'));
      howObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
howObs.observe(document.getElementById('how'));


/* ============ PRICING REVEAL ============ */
const priceObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.price-card').forEach((c, i) => {
        setTimeout(() => c.classList.add('visible'), i * 150);
      });
      priceObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
priceObs.observe(document.getElementById('pricing'));


/* ============ 3D CARD TILT ============ */
document.querySelectorAll('.feat-card, .price-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


/* ============ CHAT DEMO ANIMATION ============ */
const msgs = [
  { type: 'bot',  text: '👋 Hi! I\'m ClawBot. How can I help you today?' },
  { type: 'user', text: 'Do you integrate with Shopify?' },
  { type: 'bot',  text: 'Absolutely! ClawBot integrates natively with Shopify — setup takes under 5 minutes. I can handle product questions, order tracking, returns, and more automatically.' },
  { type: 'user', text: 'What about pricing? I\'m a small business.' },
  { type: 'bot',  text: 'Great news — our Starter plan is completely free with 1,000 messages/month. Our Pro plan at $49/month covers most growing businesses. Want me to help you pick the right plan?' },
  { type: 'user', text: 'Yes please!' },
  { type: 'bot',  text: 'Based on what you\'ve told me, I\'d recommend starting on the Free plan to explore the platform, then upgrading to Pro as your volume grows. Ready to get started? 🚀' },
];

let msgIdx = 0;
const chatBody = document.getElementById('chat-body');

function showNextMsg() {
  if (msgIdx >= msgs.length) return;
  const m = msgs[msgIdx++];

  const typing = document.createElement('div');
  typing.className = 'chat-msg';
  const tAva = document.createElement('div'); tAva.className = 'msg-ava bot-ava'; tAva.textContent = '🤖';
  const tBub = document.createElement('div'); tBub.className = 'typing';
  tBub.innerHTML = '<span></span><span></span><span></span>';
  typing.appendChild(tAva); typing.appendChild(tBub);

  if (m.type === 'bot') { chatBody.appendChild(typing); setTimeout(() => typing.classList.add('show'), 50); }

  setTimeout(() => {
    if (m.type === 'bot') chatBody.removeChild(typing);
    const div = document.createElement('div');
    div.className = 'chat-msg' + (m.type === 'user' ? ' user' : '');
    const ava = document.createElement('div');
    ava.className = 'msg-ava ' + (m.type === 'bot' ? 'bot-ava' : 'user-ava');
    ava.textContent = m.type === 'bot' ? '🤖' : '👤';
    const bub = document.createElement('div');
    bub.className = 'msg-bubble'; bub.textContent = m.text;
    div.appendChild(ava); div.appendChild(bub);
    chatBody.appendChild(div);
    setTimeout(() => div.classList.add('show'), 50);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (msgIdx < msgs.length) setTimeout(showNextMsg, m.type === 'bot' ? 2200 : 1400);
  }, m.type === 'bot' ? 1000 : 300);
}

const demoObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { setTimeout(showNextMsg, 600); demoObs.unobserve(e.target); }
  });
}, { threshold: 0.4 });
demoObs.observe(document.getElementById('chat-demo'));


/* ============ INTEGRATIONS MARQUEE ============ */
const integrations = [
  { name: 'Slack',       color: '#4A154B', icon: 'S' },
  { name: 'WhatsApp',    color: '#25D366', icon: 'W' },
  { name: 'Shopify',     color: '#96bf48', icon: 'S' },
  { name: 'WordPress',   color: '#21759b', icon: 'W' },
  { name: 'Zapier',      color: '#ff4a00', icon: 'Z' },
  { name: 'HubSpot',     color: '#ff7a59', icon: 'H' },
  { name: 'Telegram',    color: '#0088cc', icon: 'T' },
  { name: 'Instagram',   color: '#E1306C', icon: 'I' },
  { name: 'Gmail',       color: '#EA4335', icon: 'G' },
  { name: 'Notion',      color: '#ffffff', icon: 'N' },
  { name: 'Stripe',      color: '#635bff', icon: 'S' },
  { name: 'Salesforce',  color: '#00a1e0', icon: 'S' },
];

function buildPills(list) {
  return list.map(i => `
    <div class="integration-pill">
      <div class="int-icon" style="width:22px;height:22px;border-radius:6px;background:${i.color}20;border:1px solid ${i.color}40;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${i.color}">${i.icon}</div>
      ${i.name}
    </div>`).join('');
}

const t1 = document.getElementById('track1');
const t2 = document.getElementById('track2');
const pills = buildPills(integrations);
t1.innerHTML = pills + pills;
const revInt = [...integrations].reverse();
t2.innerHTML = buildPills(revInt) + buildPills(revInt);


/* ============ TESTIMONIALS ============ */
const testimonials = [
  { name: 'Talha Khan', role: 'Head of CX, NovaTech',          text: 'ClawBot reduced our support backlog by 72% in the first two weeks. Our team can now focus on complex cases while ClawBot handles everything routine — perfectly.',          stars: 5, bg: 'linear-gradient(135deg,#00f5ff,#00b4cc)', initials: 'TK' },
  { name: 'Bilal Ahmed',  role: 'Founder, Shopwave Africa',       text: 'We deployed ClawBot on WhatsApp for our Nigerian e-commerce customers. Response times dropped from 6 hours to under a second. The revenue impact was immediate.',           stars: 5, bg: 'linear-gradient(135deg,#bf00ff,#7b00cc)', initials: 'BA' },
  { name: 'Ahtisham Rajput',    role: 'VP Engineering, FinEdge',        text: 'The API integration was cleaner than anything we\'ve worked with. SOC 2 certification gave our compliance team confidence. ClawBot is production-ready out of the box.',       stars: 5, bg: 'linear-gradient(135deg,#ff0090,#cc0073)', initials: 'AR' },
  { name: 'Talha Bajwa',  role: 'CEO, Scandinavian Retail Group', text: 'We\'re live in Swedish, Norwegian, Danish, and Finnish simultaneously. ClawBot handles all four with zero quality drop. Language support is genuinely impressive.',         stars: 5, bg: 'linear-gradient(135deg,#00ff88,#00cc6a)', initials: 'TB' },
  { name: 'Ahad Gujjar',   role: 'Growth Director, LeadPulse',     text: 'A/B testing conversation flows inside ClawBot\'s dashboard helped us improve lead capture rate by 38%. The analytics are deep and actionable.',                             stars: 5, bg: 'linear-gradient(135deg,#ffaa00,#ff8c00)', initials: 'AG' },
];

const testiTrack = document.getElementById('testi-track');
const testitHtml = testimonials.map(t => `
  <div class="testi-card">
    <div class="testi-stars">${'★'.repeat(t.stars)}</div>
    <p class="testi-text">"${t.text}"</p>
    <div class="testi-author">
      <div class="testi-avatar" style="background:${t.bg}">${t.initials}</div>
      <div>
        <div class="testi-name">${t.name}</div>
        <div class="testi-role">${t.role}</div>
      </div>
    </div>
  </div>`).join('');
testiTrack.innerHTML = testitHtml + testitHtml;


/* ============ FAQ ACCORDION ============ */
const faqs = [
  {
    q: 'How long does it take to set up ClawBot?',
    a: 'Most users are live in under 30 minutes. Connect your platform, upload your training data (PDFs, URLs, or FAQs), customize the personality, and deploy. Our guided onboarding walks you through every step with no coding required.'
  },
  {
    q: 'Which platforms and channels does ClawBot support?',
    a: 'ClawBot integrates with websites (JavaScript snippet), WhatsApp Business, Telegram, Instagram DMs, Facebook Messenger, Slack, Shopify, WordPress, and any custom platform via REST API or webhooks. New integrations are added monthly.'
  },
  {
    q: 'What AI model powers ClawBot?',
    a: 'ClawBot is built on state-of-the-art large language model technology — combining retrieval-augmented generation (RAG) with your custom training data. This means responses are grounded in your actual business information, not just general AI knowledge.'
  },
  {
    q: 'How is my data protected?',
    a: 'All conversations are encrypted end-to-end. Your data is never used to train public models. ClawBot is GDPR-compliant, SOC 2 Type II certified, and supports role-based access control. Enterprise plans include dedicated infrastructure with data residency options.'
  },
  {
    q: "Can I fully customize ClawBot's personality and branding?",
    a: "Yes. You can set ClawBot's name, avatar, tone, language style, and response templates. Enterprise and Pro plans support full white-labeling — your brand, your domain, zero ClawBot attribution. Train it on your voice guidelines for consistent brand communication."
  },
  {
    q: "What happens if ClawBot can't answer a question?",
    a: "ClawBot uses confidence thresholds to detect when a query is outside its knowledge base. It gracefully escalates to a human agent via your preferred channel, shares the full conversation context, and notifies your team in real-time — ensuring zero frustrating dead-ends for your customers."
  },
];

const faqList = document.getElementById('faq-list');
faqList.innerHTML = faqs.map((f, i) => `
  <div class="faq-item" id="faq-${i}">
    <div class="faq-q" onclick="toggleFaq(${i})">
      <span>${f.q}</span>
      <span class="faq-toggle">+</span>
    </div>
    <div class="faq-a">${f.a}</div>
  </div>`).join('');

function toggleFaq(i) {
  const item = document.getElementById('faq-' + i);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}


/* ============ PRICING BILLING TOGGLE ============ */
let annual = false;

function toggleBilling() {
  annual = !annual;
  document.getElementById('billing-toggle').classList.toggle('active', annual);
  document.getElementById('price-starter').textContent = '0';
  document.getElementById('price-pro').textContent = annual ? '34' : '49';
  document.getElementById('billing-period').textContent = annual ? 'annually' : 'monthly';
}


/* ============ NEWSLETTER SUBSCRIBE ============ */
document.querySelector('.newsletter-btn').addEventListener('click', function () {
  const inp = document.querySelector('.newsletter-input');
  if (inp.value.includes('@')) {
    this.textContent = '✓ Subscribed!';
    this.style.background = 'linear-gradient(135deg,var(--emerald),#00cc6a)';
    inp.value = '';
    setTimeout(() => { this.textContent = 'Subscribe →'; this.style.background = ''; }, 3000);
  } else {
    inp.style.borderColor = 'var(--magenta)';
    inp.placeholder = 'Enter a valid email';
    setTimeout(() => { inp.style.borderColor = ''; inp.placeholder = 'your@email.com'; }, 2000);
  }
});


/* ============ SMOOTH SCROLL ============ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
