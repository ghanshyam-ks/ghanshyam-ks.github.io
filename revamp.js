/*
  REVAMP.JS
  Handles Case Study Modals, Horizontal Carousels, and Single Page Navigation
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. MODAL / OVERLAY ENGINE ---
  const body = document.body;
  const overlay = document.createElement('div');
  overlay.className = 'case-modal-overlay';
  overlay.id = 'case-modal-overlay';
  
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'case-modal-content';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close-btn';
  closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalBody.id = 'modal-body-content';
  
  contentWrapper.appendChild(closeBtn);
  contentWrapper.appendChild(modalBody);
  overlay.appendChild(contentWrapper);
  body.appendChild(overlay);

  // Close Logic
  const closeModal = () => {
    overlay.classList.remove('active');
    body.classList.remove('modal-open');
    setTimeout(() => {
      modalBody.innerHTML = ''; // clear content after transition
    }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) closeModal();
  });

  // Open Logic
  window.openCaseModal = (modalId) => {
    const template = document.getElementById(modalId);
    if(template) {
      modalBody.innerHTML = template.innerHTML;
      overlay.classList.add('active');
      body.classList.add('modal-open');
      contentWrapper.scrollTop = 0;
    }
  };


  // --- 2. HORIZONTAL CAROUSEL DRAG LOGIC (Optional UX enhancement) ---
  const carousels = document.querySelectorAll('.carousel-container');
  let isDown = false;
  let startX;
  let scrollLeft;

  carousels.forEach(carousel => {
    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.style.cursor = 'pointer';
    });
    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = 'pointer';
    });
    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast
      carousel.scrollLeft = scrollLeft - walk;
    });
  });

  // --- 3. FLOATING NAV HIGHLIGHTING ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.floating-nav a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  // --- 5. DYNAMIC TEXT ROTATOR ---
  const rotatorWords = document.querySelectorAll('.rotator-word');
  if (rotatorWords.length > 0) {
    let currentIndex = 0;
    
    setInterval(() => {
      // Current word exits up
      rotatorWords[currentIndex].classList.remove('active');
      rotatorWords[currentIndex].classList.add('exit');
      
      // Calculate next word index
      let nextIndex = (currentIndex + 1) % rotatorWords.length;
      
      // Reset the next word to the bottom before bringing it in
      rotatorWords[nextIndex].classList.remove('exit');
      
      // Small timeout to allow the exit animation before the new one enters
      setTimeout(() => {
        rotatorWords[nextIndex].classList.add('active');
      }, 50);
      
      currentIndex = nextIndex;
    }, 2500); // Rotate every 2.5 seconds
  }

  // --- 6. 3D CARD TILT TRACKING ---
  const cards3D = document.querySelectorAll('.card-3d-wrapper');
  cards3D.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPct = (x / rect.width) - 0.5; // -0.5 to 0.5
      const yPct = (y / rect.height) - 0.5; // -0.5 to 0.5
      
      // Calculate rotation degrees (max 20deg)
      const rotateX = yPct * -20; 
      const rotateY = xPct * 20;  
      
      card.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(2000px) rotateX(0deg) rotateY(0deg)`;
    });
  });

});

// Global function for carousel buttons
window.scrollCarousel = function(direction) {
  const carousel = document.getElementById('works-carousel');
  if (carousel) {
    const scrollAmount = window.innerWidth * 0.75;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
};
