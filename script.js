// Scroll progress bar
const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = scrolled + '%';
}, { passive: true });

// Ticket cards: cursor-reactive glow + subtle 3D tilt (pointer devices only)
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (supportsHover) {
  document.querySelectorAll('.ticket').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Animated stat counters in hero
document.querySelectorAll('.hero-meta strong').forEach(el => {
  const raw = el.textContent;
  const match = raw.match(/[\d.]+/);
  if (!match) return;
  const target = parseFloat(match[0]);
  const suffix = raw.replace(match[0], '');
  let started = false;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        let current = 0;
        const step = Math.max(target / 30, 0.5);
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = raw;
          } else {
            el.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
            requestAnimationFrame(tick);
          }
        };
        tick();
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
});

// Keep mobile dropdown perfectly aligned under the header at any breakpoint
const siteHeader = document.querySelector('.site-header');
function syncHeaderHeight(){
  if(siteHeader){
    document.documentElement.style.setProperty('--header-h', siteHeader.offsetHeight + 'px');
  }
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight);

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if(navToggle){
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if(other !== item){
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    if(isOpen){
      item.classList.remove('open');
      a.style.maxHeight = null;
    } else {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});
