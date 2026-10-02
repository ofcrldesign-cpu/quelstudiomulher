/**
 * QUEL STUDIO — MULHER ATIVA
 * Script Principal: Animações de Scroll, Lazy Loading, Filtros de Serviços,
 * Integração WhatsApp com Emojis, Indicador de Progresso e Voltar ao Topo.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Configurações do Studio
  const STUDIO_PHONE = '5511915606194'; // WhatsApp oficial
  const STUDIO_ADDRESS = 'R. Francisco José da Cruz, 46 - Vila Ema, São Paulo - SP, 03283-010';

  /* -------------------------------------------------------------------------
   * 0. HERO SLIDER — 3 BANNERS ROTATIVOS (5 segundos cada)
   * ------------------------------------------------------------------------- */
  (function initHeroSlider() {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-slider-prev');
    const nextBtn = document.getElementById('hero-slider-next');
    const progressFill = document.getElementById('hero-progress-fill');

    const SLIDE_DURATION = 5000; // 5 segundos
    let currentIndex = 0;
    let autoTimer = null;
    let progressTimer = null;

    function goToSlide(index) {
      // Desativa slide atual
      slides[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');
      dots[currentIndex].setAttribute('aria-selected', 'false');

      // Ativa novo slide
      currentIndex = (index + slides.length) % slides.length;
      slides[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
      dots[currentIndex].setAttribute('aria-selected', 'true');

      // Reinicia barra de progresso
      resetProgress();
    }

    function resetProgress() {
      if (progressFill) {
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        // Força repaint
        progressFill.offsetWidth; // eslint-disable-line no-unused-expressions
        progressFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
        progressFill.style.width = '100%';
      }
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, SLIDE_DURATION);
    }

    function restartAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // Inicializa
    goToSlide(0);
    startAuto();

    // Botão anterior
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        restartAuto();
      });
    }

    // Botão próximo
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        restartAuto();
      });
    }

    // Dots clicáveis
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartAuto();
      });
    });

    // Suporte a teclado (← →)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goToSlide(currentIndex - 1); restartAuto(); }
      if (e.key === 'ArrowRight') { goToSlide(currentIndex + 1); restartAuto(); }
    });

    // Suporte a swipe touch
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { goToSlide(currentIndex + 1); } else { goToSlide(currentIndex - 1); }
        restartAuto();
      }
    }, { passive: true });

    // Pausa no hover
    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', () => { restartAuto(); });
  })();

  /* -------------------------------------------------------------------------
   * 1. HEADER FIXO, SCROLLSPY & MENU MOBILE
   * ------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll class
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar ao clicar em link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ScrollSpy para navegação ativa
  const handleScrollSpy = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  /* -------------------------------------------------------------------------
   * 2. LAZY LOADING DE IMAGENS COM INTERSECTION OBSERVER
   * ------------------------------------------------------------------------- */
  const lazyImages = document.querySelectorAll('img.lazy-img, img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback para navegadores legados
    lazyImages.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }

  /* -------------------------------------------------------------------------
   * 3. ANIMAÇÕES DE SCROLL ([data-animate])
   * ------------------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  /* -------------------------------------------------------------------------
   * 4. CONTADORES NUMÉRICOS ANIMADOS ([data-count])
   * ------------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseFloat(target.dataset.count);
          const isDecimal = target.dataset.decimal === 'true';
          const prefix = target.dataset.prefix || '';
          const suffix = target.dataset.suffix || '';
          const duration = 1800; // 1.8s
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing suave cubic-bezier out
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeProgress * endValue;

            if (isDecimal) {
              target.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
            } else {
              target.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              if (isDecimal) {
                target.textContent = `${prefix}${endValue.toFixed(1)}${suffix}`;
              } else {
                target.textContent = `${prefix}${endValue}${suffix}`;
              }
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /* -------------------------------------------------------------------------
   * 5. SESSÕES ANIMADAS DOS SERVIÇOS (MODALIDADES & FILTROS)
   * ------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      serviceCards.forEach(card => {
        const cardCategory = card.dataset.category || '';
        const shouldShow = category === 'all' || cardCategory.includes(category);

        if (shouldShow) {
          card.classList.remove('hidden');
          // Re-trigger visual animation
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'cardAppear 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Modal de Detalhes da Modalidade
  const modal = document.getElementById('service-modal');
  const modalClose = document.querySelector('.modal-close-btn');
  const modalTitle = document.getElementById('modal-service-title');
  const modalDesc = document.getElementById('modal-service-desc');
  const modalImg = document.getElementById('modal-service-img');
  const modalWppBtn = document.getElementById('modal-wpp-btn');
  const detailButtons = document.querySelectorAll('[data-open-modal]');

  // Base de dados das modalidades com detalhes ricos
  const servicesData = {
    'funcional': {
      title: 'Treino Funcional',
      desc: 'Treinos dinâmicos e adaptados para trabalhar força, resistência muscular, coordenação motora, agilidade e condicionamento cardiovascular. Perfeito para mulheres que buscam fortalecimento do corpo para as tarefas diárias e gasto calórico em um ambiente motivador e acolhedor.',
      img: 'assets/images/img02.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de agendar uma aula experimental de *Treino Funcional*! 💪✨'
    },
    'jump': {
      title: 'JUMP',
      desc: 'Aulas ultra dinâmicas e energéticas utilizando mini trampolins individuais. Proporciona alto gasto calórico, queima intensa de gordura, melhora do sistema cardiorrespiratório e fortalecimento de pernas e glúteos, com baixíssimo impacto sobre as articulações.',
      img: 'assets/images/img-info.png',
      whatsappMsg: 'Olá Quel Studio! Tenho interesse na aula de *JUMP* e quero agendar uma aula experimental! ⚡🤸‍♀️'
    },
    'step': {
      title: 'Step',
      desc: 'Exercícios coreografados combinando ritmo, música e subidas/descidas na plataforma de Step. Desenvolve a coordenação motora, queima calorias com diversão e tonifica pernas, panturrilhas e glúteos com a supervisão atenta das nossas professoras.',
      img: 'assets/images/img05.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de saber mais e agendar uma aula de *Step*! 🎵👟'
    },
    'gap': {
      title: 'GAP (Glúteos, Abdômen e Pernas)',
      desc: 'Aula com foco específico no fortalecimento e tonificação dos grupos musculares mais desejados: glúteos, abdômen e pernas. Utiliza caneleiras, elásticos e pesos moderados para resultados visíveis em postura, firmeza e definição.',
      img: 'assets/images/img03.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de agendar uma aula experimental de *GAP*! 🍑🔥'
    },
    'hiit': {
      title: 'HIIT (Treino Intervalado de Alta Intensidade)',
      desc: 'Treinos intervalados de alta intensidade que alternam picos de esforço com pequenos períodos de descanso. Excelente para quem tem pouco tempo e busca acelerar o metabolismo, queimar gordura até horas após o treino e aumentar a disposição.',
      img: 'assets/images/img02.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de conhecer o treino de *HIIT* e fazer uma aula! ⚡⏱️'
    },
    'ritbox': {
      title: 'RitBox',
      desc: 'Uma modalidade apaixonante que combina movimento corporal, música contagiante, exercícios funcionais e muita energia. É uma verdadeira festa de endorfina onde você queima calorias enquanto se diverte com outras mulheres!',
      img: 'assets/images/img-info.png',
      whatsappMsg: 'Olá Quel Studio! Amei a proposta do *RitBox* e quero agendar uma aula experimental! 💃🎶'
    },
    'yoga': {
      title: 'Yoga',
      desc: 'Prática milenar voltada para o equilíbrio, flexibilidade, controle respiratório e conexão profunda entre mente e corpo. Reduz a ansiedade e o estresse diário, melhora a postura e proporciona profunda sensação de paz e relaxamento.',
      img: 'assets/images/img04.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de conhecer a aula de *Yoga* e agendar um horário! 🧘‍♀️🌿'
    },
    'pilates': {
      title: 'Pilates Solo (Mat Pilates)',
      desc: 'Exercícios precisos que trabalham o centro de força (core), fortalecendo os músculos estabilizadores da coluna, prevenindo dores lombares, melhorando a postura corporal e promovendo controle consciente da respiração e dos movimentos.',
      img: 'assets/images/img04.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de agendar uma aula de *Pilates Solo*! 🌸🤸'
    },
    'alongamento': {
      title: 'Alongamento',
      desc: 'Sessões dedicadas a devolver a flexibilidade muscular, ampliar a amplitude das articulações e aliviar tensões acumuladas da rotina. Essencial para prevenção de lesões, melhora da circulação e relaxamento físico.',
      img: 'assets/images/img03.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de informações sobre as aulas de *Alongamento*! 🌸✨'
    },
    'baby-class': {
      title: 'Baby Class (Ballet Infantil)',
      desc: 'Atividade desenvolvida com imenso carinho para crianças, unindo os fundamentos lúdicos do ballet clássico, consciência corporal, musicalidade, postura e sociabilização. Um ambiente seguro, doce e acolhedor para as pequenas!',
      img: 'assets/images/img01.png',
      whatsappMsg: 'Olá Quel Studio! Gostaria de informações e agendar uma aula de *Baby Class* para minha filha! 🩰🎀'
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.dataset.service;
      const data = servicesData[serviceId];

      if (data && modal) {
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalImg.src = data.img;
        modalImg.alt = data.title;
        modalWppBtn.href = `https://wa.me/${STUDIO_PHONE}?text=${encodeURIComponent(data.whatsappMsg)}`;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  /* -------------------------------------------------------------------------
   * 6. HORÁRIO EM TEMPO REAL (ABERTO / FECHADO)
   * ------------------------------------------------------------------------- */
  const updateStudioStatus = () => {
    const statusBadge = document.querySelector('.live-status-badge');
    if (!statusBadge) return;

    // Horário local de São Paulo
    const now = new Date();
    // Converter para fuso horário de SP se necessário
    const spTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const day = spTime.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hour = spTime.getHours();
    const minute = spTime.getMinutes();
    const timeDec = hour + minute / 60;

    let isOpen = false;

    // Segunda a Sexta: 08:00 - 20:00
    if (day >= 1 && day <= 5) {
      if (timeDec >= 8 && timeDec < 20) {
        isOpen = true;
      }
    }
    // Sábado: 09:00 - 14:00
    else if (day === 6) {
      if (timeDec >= 9 && timeDec < 14) {
        isOpen = true;
      }
    }
    // Domingo: Fechado

    if (isOpen) {
      statusBadge.className = 'live-status-badge open';
      statusBadge.innerHTML = '<span class="status-dot"></span> Aberto Agora — Venha nos visitar!';
    } else {
      statusBadge.className = 'live-status-badge closed';
      statusBadge.innerHTML = '<span class="status-dot"></span> Fechado Agora — Atendimento a partir das 08h';
    }

    // Destacar o dia da semana na tabela de horários
    const rows = document.querySelectorAll('.hours-table tr[data-day]');
    rows.forEach(row => {
      if (parseInt(row.dataset.day, 10) === day) {
        row.classList.add('today');
      } else {
        row.classList.remove('today');
      }
    });
  };
  updateStudioStatus();

  /* -------------------------------------------------------------------------
   * 7. COPIAR ENDEREÇO & TOAST NOTIFICATION
   * ------------------------------------------------------------------------- */
  const copyAddressBtn = document.getElementById('copy-address-btn');
  const toast = document.getElementById('toast-notice');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(STUDIO_ADDRESS).then(() => {
          showToast('📍 Endereço copiado para a área de transferência!');
        }).catch(() => {
          showToast('📍 Endereço: ' + STUDIO_ADDRESS);
        });
      } else {
        showToast('📍 Endereço: ' + STUDIO_ADDRESS);
      }
    });
  }

  /* -------------------------------------------------------------------------
   * 8. FAQ ACCORDION INTERATIVO
   * ------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');

    if (questionBtn && answerDiv) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fechar outros
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Alternar atual
        if (isActive) {
          item.classList.remove('active');
          answerDiv.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
        }
      });
    }
  });

  /* -------------------------------------------------------------------------
   * 9. FORMULÁRIO DE CONTATO INTELIGENTE COM ENVIO AO WHATSAPP & EMOJIS
   * ------------------------------------------------------------------------- */
  const contactForm = document.getElementById('whatsapp-contact-form');
  const phoneInput = document.getElementById('form-phone');

  // Máscara de telefone/WhatsApp: (00) 00000-0000
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.substring(0, 11);

      if (val.length > 10) {
        val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (val.length > 6) {
        val = val.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (val.length > 2) {
        val = val.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (val.length > 0) {
        val = val.replace(/^(\d*)$/, '($1');
      }
      e.target.value = val;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const interest = document.getElementById('form-interest').value;
      const period = document.getElementById('form-period').value;
      const message = document.getElementById('form-message').value.trim();

      // Validação básica
      if (!name || !phone) {
        showToast('⚠️ Por favor, preencha seu nome e WhatsApp.');
        return;
      }

      // Montagem da mensagem formatada com emojis
      let compiledMessage = `✨ *NOVO CONTATO VIA SITE — QUEL STUDIO* ✨\n\n`;
      compiledMessage += `👋 *Olá Raquel e equipe Quel Studio! Gostaria de informações para agendar uma aula experimental!*\n\n`;
      compiledMessage += `👤 *Nome:* ${name}\n`;
      compiledMessage += `📱 *WhatsApp:* ${phone}\n`;
      compiledMessage += `🎯 *Interesse:* ${interest}\n`;
      compiledMessage += `⏰ *Melhor Horário:* ${period}\n`;
      
      if (message) {
        compiledMessage += `💬 *Observação:* ${message}\n`;
      }

      compiledMessage += `\n📍 _Mensagem enviada através do site oficial Quel Studio Mulher Ativa_`;

      // Codificação para URL do WhatsApp
      const encodedMessage = encodeURIComponent(compiledMessage);
      const whatsappUrl = `https://wa.me/${STUDIO_PHONE}?text=${encodedMessage}`;

      showToast('🚀 Abrindo WhatsApp com suas informações...');

      // Abrir em nova aba
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 400);

      // Limpar formulário suavemente
      contactForm.reset();
    });
  }

  /* -------------------------------------------------------------------------
   * 10. BOTÃO VOLTAR AO TOPO (BACK TO TOP) COM ANEL DE PROGRESSO SVG
   * ------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring__circle');

  if (backToTopBtn && progressCircle) {
    const circleRadius = 23;
    const circumference = 2 * Math.PI * circleRadius; // ~144.5px
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      const offset = circumference - (scrollPercent * circumference);

      progressCircle.style.strokeDashoffset = offset;

      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
