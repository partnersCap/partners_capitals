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
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
  });
  
  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
            otherItem.querySelector('.faq-question i').classList.remove('fa-chevron-up');
            otherItem.querySelector('.faq-question i').classList.add('fa-chevron-down');
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          question.querySelector('i').classList.remove('fa-chevron-up');
          question.querySelector('i').classList.add('fa-chevron-down');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.querySelector('i').classList.remove('fa-chevron-down');
          question.querySelector('i').classList.add('fa-chevron-up');
        }
      });
    });
  }
  
  // Form submission handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // Here you would typically send the data to a server
      console.log('Form submitted:', data);
      
      // Show success message
      alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
      this.reset();
    });
  }
  
  // Sticky header on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
    }
  });
  
  // Back to top button
  const backToTopButton = document.createElement('button');
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.className = 'back-to-top';
  document.body.appendChild(backToTopButton);
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.opacity = '1';
      backToTopButton.style.visibility = 'visible';
    } else {
      backToTopButton.style.opacity = '0';
      backToTopButton.style.visibility = 'hidden';
    }
  });
  
  // Add styles for back to top button
  const style = document.createElement('style');
  style.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px rgba(6, 119, 200, 0.3);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
    }
    
    .back-to-top:hover {
      background-color: var(--primary-dark);
      transform: translateY(-3px);
    }
  `;
  document.head.appendChild(style);
  
  // Intersection Observer for animations
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
      el.style.opacity = 0;
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      if (el.dataset.aos.includes('fade-up')) {
        el.style.transform = 'translateY(30px)';
      } else if (el.dataset.aos.includes('fade-left')) {
        el.style.transform = 'translateX(-30px)';
      } else if (el.dataset.aos.includes('fade-right')) {
        el.style.transform = 'translateX(30px)';
      }
      
      observer.observe(el);
    });
  };
  
  // Only use if AOS is not loaded
  if (typeof AOS === 'undefined') {
    animateOnScroll();
  }
;