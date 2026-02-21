// Cinematic Portfolio JavaScript

let portfolioData = null;

// Initialize particles
function initParticles() {
  const container = document.getElementById('particles');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

// Fetch and load data from JSON file (always fresh)
async function loadData() {
  try {
    // Clear localStorage cache for fresh data
    localStorage.removeItem('portfolioData');

    const response = await fetch('data/portfolio-data.json');
    portfolioData = await response.json();
    console.log('Loaded from JSON file');
    renderPortfolio();
  } catch (error) {
    console.error('Error loading portfolio data:', error);
  }
}

// Render all portfolio sections
function renderPortfolio() {
  if (!portfolioData) return;

  // Personal info
  document.querySelectorAll('[data-field="name"]').forEach(el => {
    el.textContent = portfolioData.personal.name;
  });

  document.querySelectorAll('[data-field="title"]').forEach(el => {
    el.textContent = portfolioData.personal.title;
  });

  document.querySelectorAll('[data-field="tagline"]').forEach(el => {
    el.textContent = portfolioData.personal.tagline;
  });

  document.querySelectorAll('[data-field="bio"]').forEach(el => {
    el.textContent = portfolioData.personal.bio;
  });

  document.querySelectorAll('[data-field="profileImage"]').forEach(el => {
    el.src = portfolioData.personal.profileImage;
  });

  document.querySelectorAll('[data-field="aboutImage"]').forEach(el => {
    el.src = portfolioData.personal.profileImage;
  });

  // About section - project count
  const projectCountEl = document.querySelector('[data-field="projectCount"]');
  if (projectCountEl && portfolioData.personal.projectCount) {
    projectCountEl.textContent = portfolioData.personal.projectCount;
  }

  // About section - degree
  const degreeEl = document.querySelector('[data-field="degree"]');
  if (degreeEl && portfolioData.personal.degree) {
    degreeEl.textContent = portfolioData.personal.degree;
  }

  // About section - exp years
  const expYearsEl = document.querySelector('[data-field="expYears"]');
  if (expYearsEl && portfolioData.personal.expYears) {
    expYearsEl.textContent = portfolioData.personal.expYears;
  }

  // About section - title
  const aboutTitleEl = document.querySelector('[data-field="aboutTitle"]');
  if (aboutTitleEl && portfolioData.personal.aboutTitle) {
    aboutTitleEl.textContent = portfolioData.personal.aboutTitle;
  }

  document.querySelectorAll('[data-field="contactEmail"]').forEach(el => {
    el.textContent = portfolioData.contact.email;
  });

  document.querySelectorAll('[data-field="contactPhone"]').forEach(el => {
    el.textContent = portfolioData.contact.phone;
  });

  document.querySelectorAll('[data-field="contactAddress"]').forEach(el => {
    el.textContent = portfolioData.contact.address;
  });

  document.querySelectorAll('[data-field="footerName"]').forEach(el => {
    el.textContent = portfolioData.personal.name;
  });

  // Social links
  const linkedinLink = document.querySelector('[data-field="linkedin"]');
  if (linkedinLink) linkedinLink.href = portfolioData.social.linkedin;

  const githubLink = document.querySelector('[data-field="github"]');
  if (githubLink) githubLink.href = portfolioData.social.github;

  const twitterLink = document.querySelector('[data-field="twitter"]');
  if (twitterLink) twitterLink.href = portfolioData.social.twitter;

  // Render dynamic sections
  renderSkills();
  renderProjects();
  renderExperience();
}

// Render skills (without proficiency level - just skill names)
function renderSkills() {
  const skillsContainer = document.getElementById('skillsContainer');
  if (!skillsContainer) return;

  skillsContainer.innerHTML = portfolioData.skills.map(skill => `
    <div class="skill-card">
      <div class="skill-header">
        <span class="skill-name">${skill.name}</span>
      </div>
      <div class="skill-bar">
        <div class="skill-progress" style="width: 0%" data-level="${skill.level}"></div>
      </div>
    </div>
  `).join('');

  setTimeout(() => {
    document.querySelectorAll('.skill-progress').forEach(bar => {
      bar.style.width = bar.dataset.level + '%';
    });
  }, 400);
}

// Render projects
function renderProjects() {
  const projectsContainer = document.getElementById('projectsContainer');
  if (!projectsContainer) return;

  projectsContainer.innerHTML = portfolioData.projects.map(project => `
    <div class="project-card">
      <div class="project-image-wrapper">
        <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
        <div class="project-overlay">
          <div class="project-links">
            ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link primary" target="_blank">Live Demo</a>` : ''}
            ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link secondary" target="_blank">Code</a>` : ''}
          </div>
        </div>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// Render experience
function renderExperience() {
  const experienceContainer = document.getElementById('experienceContainer');
  if (!experienceContainer) return;

  experienceContainer.innerHTML = portfolioData.experience.map(exp => `
    <div class="experience-item">
      <div class="experience-content">
        <p class="experience-duration">${exp.duration}</p>
        <h3 class="experience-title">${exp.role}</h3>
        <p class="experience-company">${exp.company}</p>
        <p class="experience-description">${exp.description}</p>
      </div>
    </div>
  `).join('');
}

// Reveal animations with Intersection Observer
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile menu
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Contact form - saves to localStorage, viewable in admin
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    const status = document.getElementById('form-status');

    // Create message object
    const msgData = {
      id: Date.now(),
      name: name,
      email: email,
      message: message,
      date: new Date().toLocaleString()
    };

    // Get existing messages
    let messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
    messages.unshift(msgData); // Add to beginning
    localStorage.setItem('portfolioMessages', JSON.stringify(messages));

    // Show success
    status.textContent = 'Thank you! Your message has been sent.';
    status.style.color = '#10b981';
    status.style.display = 'block';
    form.reset();
  });
}

// Parallax effect on mouse move
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      heroImage.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
}

// Cursor trail effect
function initCursorTrail() {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(212, 175, 55, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease, opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(trail);

  document.addEventListener('mousemove', (e) => {
    trail.style.opacity = '1';
    trail.style.left = e.clientX - 10 + 'px';
    trail.style.top = e.clientY - 10 + 'px';
  });

  document.addEventListener('mouseout', () => {
    trail.style.opacity = '0';
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initParticles();
  initRevealAnimations();
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initContactForm();
  initParallax();
  initCursorTrail();
});