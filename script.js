document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS EXISTENTES ---
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const navLinks = nav ? nav.querySelectorAll("a") : [];
  
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const dotsContainer = document.getElementById("slider-dots");
  const prevButton = document.getElementById("prev-testimonial");
  const nextButton = document.getElementById("next-testimonial");

  let currentSlide = 0;
  let testimonialAutoplay;

  // ==========================================
  // 1. HEADER & MENU MOBILE
  // ==========================================
  const setHeaderState = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  };

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle?.classList.toggle("active", isOpen);
  };

  const closeMenu = () => {
    menuToggle?.classList.remove("active");
    nav?.classList.remove("is-open");
  };

  // ==========================================
  // 2. SLIDER DE DEPOIMENTOS
  // ==========================================
  const showSlide = (index) => {
    if (testimonialCards.length === 0) return;
    testimonialCards.forEach((card, i) => card.classList.toggle("active", i === index));
    const dots = dotsContainer?.querySelectorAll("button");
    dots?.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentSlide = index;
  };

  const nextSlide = () => showSlide((currentSlide + 1) % testimonialCards.length);

  const startTestimonialTimer = () => {
    testimonialAutoplay = setInterval(nextSlide, 5000);
  };

  if (dotsContainer) {
    testimonialCards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.addEventListener("click", () => {
        showSlide(i);
        clearInterval(testimonialAutoplay);
        startTestimonialTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  // ==========================================
  // 3. CARROSSEL INFINITO (AUTOMÁTICO + ARRASTE)
  // ==========================================
  const initInfiniteSlider = () => {
    const slider = document.querySelector('.infinite-slider');
    const track = document.getElementById("infinite-track");
    if (!slider || !track) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollPos = 0;
    const speed = 0.8; // Velocidade do movimento automático

    // Função de animação contínua
    const animate = () => {
      if (!isDown) {
        autoScrollPos += speed;
        
        const halfWidth = track.scrollWidth / 2;
        if (autoScrollPos >= halfWidth) {
          autoScrollPos = 0;
        }
        
        slider.scrollLeft = autoScrollPos;
      }
      requestAnimationFrame(animate);
    };

    // --- EVENTOS DE MOUSE ---
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      autoScrollPos = slider.scrollLeft; // Sincroniza o automático com o manual
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Multiplicador de sensibilidade
      slider.scrollLeft = scrollLeft - walk;
    });

    // --- EVENTOS DE TOQUE (MOBILE) ---
    slider.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchend', () => {
      isDown = false;
      autoScrollPos = slider.scrollLeft;
    });

    slider.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });

    requestAnimationFrame(animate);
  };

  // ==========================================
  // 4. INICIALIZAÇÃO GERAL
  // ==========================================
  
  window.addEventListener("scroll", setHeaderState);
  menuToggle?.addEventListener("click", toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = header?.offsetHeight || 0;
        window.scrollTo({
          top: target.offsetTop - offset + 4,
          behavior: "smooth"
        });
        closeMenu();
      }
    });
  });

  nextButton?.addEventListener("click", () => {
    nextSlide();
    clearInterval(testimonialAutoplay);
    startTestimonialTimer();
  });

  prevButton?.addEventListener("click", () => {
    const prevIndex = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
    showSlide(prevIndex);
    clearInterval(testimonialAutoplay);
    startTestimonialTimer();
  });

  // Inicializa tudo
  setHeaderState();
  showSlide(0);
  startTestimonialTimer();
  initInfiniteSlider();
});