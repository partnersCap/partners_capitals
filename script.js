// ======= GLOBALES =======
const IS_MOBILE = window.innerWidth <= 768;
const SCROLL_THRESHOLD = 100;

// ======= MENÚ MÓVIL =======
// ===== PARTNERS CAPITAL NAVBAR FUNCTIONALITY =====



const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('show');

  document.body.style.overflow = nav.classList.contains('show') ? 'hidden' : 'auto';
});

// Opcional: Cerrar menú mobile al hacer clic en un enlace
document.querySelectorAll('.nav-link, .dropdown-menu a, .btn-primary').forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
    }
  });
});


// ======= ANIMACIONES AL SCROLL =======
function initScrollAnimations() {
  const animateOnScroll = (elements, className) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(className);
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  };

  // Elementos que aparecen
  animateOnScroll(document.querySelectorAll('.fade-slide'), 'show');
  animateOnScroll(document.querySelectorAll('.animate-fade'), 'animate');

  // Animación de contadores
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000; // ms
  const step = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// ======= CARRUSEL INFINITO =======
function initInfiniteCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const items = document.querySelectorAll('.carousel-item');
  const itemWidth = items[0].offsetWidth + 40; // Ancho + gap
  let position = 0;
  let speed = IS_MOBILE ? 0.5 : 1;
  let isPaused = false;
  let animationId;

  // Clonar elementos para efecto infinito
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  const animate = () => {
    if (!isPaused) {
      position -= speed;
      
      // Reiniciar posición cuando llega al final
      if (position < -itemWidth * items.length) {
        position = 0;
      }
      
      track.style.transform = `translateX(${position}px)`;
    }
    
    animationId = requestAnimationFrame(animate);
  };

  // Pausar al interactuar
  track.addEventListener('mouseenter', () => {
    if (!IS_MOBILE) {
      isPaused = true;
      track.style.transition = 'transform 0.4s ease';
    }
  });

  track.addEventListener('mouseleave', () => {
    if (!IS_MOBILE) {
      isPaused = false;
      track.style.transition = 'none';
    }
  });

  // Optimización para móvil
  if (IS_MOBILE) {
    let startX, moveX;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      cancelAnimationFrame(animationId);
      track.style.transition = 'none';
    });
    
    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveX = e.touches[0].clientX;
      const diff = moveX - startX;
      position += diff;
      track.style.transform = `translateX(${position}px)`;
      startX = moveX;
    });
    
    track.addEventListener('touchend', () => {
      isDragging = false;
      animate();
    });
  }

  animate();
}

// ======= ANIMACIÓN DE BURBUJAS =======
function initBubblesAnimation() {
  const canvas = document.getElementById('bubblesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const bubbles = Array.from({ length: 20 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 10 + 5,
    speed: Math.random() * 1.2 + 0.5,
    opacity: Math.random() * 0.3 + 0.2,
    angle: Math.random() * Math.PI * 2,
    wobble: Math.random() * 2 + 1
  }));

  function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bubbles.forEach(bubble => {
      // Movimiento vertical con ligero movimiento horizontal (wobble)
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(bubble.angle) * 0.3;
      bubble.angle += 0.02;
      
      // Reiniciar posición cuando sale de la pantalla
      if (bubble.y + bubble.radius < 0) {
        bubble.y = canvas.height + bubble.radius;
        bubble.x = Math.random() * canvas.width;
      }
      
      // Dibujar burbuja con brillo
      const gradient = ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, bubble.radius
      );
      gradient.addColorStop(0, `rgba(0, 225, 255, ${bubble.opacity + 0.2})`);
      gradient.addColorStop(1, `rgba(0, 180, 255, ${bubble.opacity})`);
      
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Destello aleatorio
      if (Math.random() > 0.98) {
        ctx.beginPath();
        ctx.arc(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.4,
          0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 1.5})`;
        ctx.fill();
      }
    });
    
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
}

// ======= ANIMACIÓN SVG FLOTANTE =======
function initFloatingSvg() {
  const svg = document.getElementById('floatingSvg');
  if (!svg) return;

  let angle = 0;
  const amplitude = 5;
  const duration = 10000; // 10 segundos para una oscilación completa
  
  function animate(timestamp) {
    const progress = (timestamp % duration) / duration;
    const x = Math.sin(progress * Math.PI * 2) * amplitude;
    const y = Math.cos(progress * Math.PI * 2) * amplitude * 0.7;
    
    svg.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${progress * 10}deg)`;
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
}

// ======= ANIMACIÓN DE ONDA =======
function initWaveAnimation() {
  const wavePath = document.querySelector('.wave-path');
  if (!wavePath) return;

  let wavePhase = 0;
  const waveContainer = document.querySelector('.wave-container');
  
  function generateWavePath(width, height, amplitude, frequency, phase) {
    let path = `M0,${height / 2}`;
    const points = 30;
    
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = height / 2 - amplitude * Math.sin((x * frequency * 0.01) + phase);
      path += `L${x},${y}`;
    }
    
    path += `L${width},${height}L0,${height}Z`;
    return path;
  }

  function animate() {
    wavePhase += 0.02;
    const width = waveContainer.clientWidth;
    const height = waveContainer.clientHeight;
    
    const waveData = generateWavePath(width, height, 25, 4, wavePhase);
    wavePath.setAttribute('d', waveData);
    wavePath.setAttribute('fill', `url(#wave-gradient)`);
    
    requestAnimationFrame(animate);
  }

  // Crear gradiente dinámico
  const svg = document.querySelector('.wave-svg');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'wave-gradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '0%');
  gradient.setAttribute('y2', '100%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'var(--primary)');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', 'var(--primary-dark)');
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.appendChild(gradient);
  svg.insertBefore(defs, svg.firstChild);

  animate();
}

// ======= SCROLL SUAVE =======
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ======= STICKY HEADER =======
function initStickyHeader() {
  const header = document.querySelector('.sticky-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ======= EFECTO BRILO EN BOTONES =======
function initGlowEffects() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      button.style.setProperty('--glow-x', `${x}px`);
      button.style.setProperty('--glow-y', `${y}px`);
    });
    
    button.addEventListener('mouseenter', () => {
      button.classList.add('glow-active');
    });
    
    button.addEventListener('mouseleave', () => {
      button.classList.remove('glow-active');
    });
  });
}

// ======= INICIALIZACIÓN =======
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initInfiniteCarousel();
  initBubblesAnimation();
  initFloatingSvg();
  initWaveAnimation();
  initSmoothScroll();
  initStickyHeader();
  initGlowEffects();
  
  // Efecto hover en la sección de cierre
  const closingSection = document.querySelector('.closing-wave');
  if (closingSection) {
    closingSection.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      document.querySelector('.wave-path').style.opacity = 0.7 + (y * 0.3);
      document.querySelector('.wave-path').style.transform = `translateX(${(x - 0.5) * 10}px)`;
    });
  }
});

// ======= OPTIMIZACIONES PARA REDIMENSIONAMIENTO =======
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recalcular elementos que dependen del tamaño de la pantalla
    if (typeof initInfiniteCarousel === 'function') {
      initInfiniteCarousel();
    }
  }, 200);
});

document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200; // menor = más rápido

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect(); // solo una vez
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.querySelector('.stats-section'));
});


