// Admin Panel JavaScript

let portfolioData = null;
let currentEditType = null;
let currentEditId = null;
let techTags = [];

// Load data - check localStorage first, then JSON file
async function loadData() {
  try {
    // First check localStorage
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      portfolioData = JSON.parse(savedData);
      console.log('Loaded from localStorage');
    } else {
      // Load from JSON file
      const response = await fetch('data/portfolio-data.json');
      portfolioData = await response.json();
      console.log('Loaded from JSON file');
    }
    renderAll();
  } catch (error) {
    console.error('Error loading data:', error);
    showToast('Error loading data', true);
  }
}

// Render all sections
function renderAll() {
  renderPersonalForm();
  renderSkillsList();
  renderProjectsList();
  renderExperienceList();
  renderSocialForm();
  renderContactForm();
  renderMessagesList();
}

// Render messages list
function renderMessagesList() {
  const container = document.getElementById('messagesList');
  if (!container) return;

  const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');

  if (messages.length === 0) {
    container.innerHTML = '<div class="empty-state">No messages yet. When visitors contact you, messages will appear here.</div>';
    return;
  }

  container.innerHTML = messages.map((msg, index) => `
    <div class="item-card" style="flex-direction: column; align-items: flex-start;">
      <div class="item-info" style="width: 100%;">
        <div class="item-title">${msg.name}</div>
        <div class="item-subtitle">${msg.email} - ${msg.date}</div>
        <div style="margin-top: 12px; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${msg.message}</div>
      </div>
      <div class="item-actions" style="width: 100%; margin-top: 12px; justify-content: flex-end;">
        <button class="btn-icon btn-icon-delete" onclick="deleteMessage(${index})" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Delete message
function deleteMessage(index) {
  if (confirm('Delete this message?')) {
    let messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
    messages.splice(index, 1);
    localStorage.setItem('portfolioMessages', JSON.stringify(messages));
    renderMessagesList();
  }
}

// Render personal info form
function renderPersonalForm() {
  const form = document.getElementById('personalForm');
  if (!form) return;
  form.name.value = portfolioData.personal.name || '';
  form.title.value = portfolioData.personal.title || '';
  form.tagline.value = portfolioData.personal.tagline || '';
  form.bio.value = portfolioData.personal.bio || '';
  form.profileImage.value = portfolioData.personal.profileImage || '';
  form.aboutTitle.value = portfolioData.personal.aboutTitle || '';
  form.expYears.value = portfolioData.personal.expYears || '';
  form.projectCount.value = portfolioData.personal.projectCount || '';
  form.degree.value = portfolioData.personal.degree || '';
}

// Render social form
function renderSocialForm() {
  const form = document.getElementById('socialForm');
  if (!form) return;
  form.linkedin.value = portfolioData.social.linkedin || '';
  form.github.value = portfolioData.social.github || '';
  form.twitter.value = portfolioData.social.twitter || '';
  form.email.value = portfolioData.social.email || '';
}

// Render contact form
function renderContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.contactEmail.value = portfolioData.contact.email || '';
  form.contactPhone.value = portfolioData.contact.phone || '';
  form.contactAddress.value = portfolioData.contact.address || '';
}

// Render skills list (without proficiency level)
function renderSkillsList() {
  const container = document.getElementById('skillsList');
  if (!container) return;

  if (!portfolioData.skills || portfolioData.skills.length === 0) {
    container.innerHTML = '<div class="empty-state">No skills added yet</div>';
    return;
  }

  container.innerHTML = portfolioData.skills.map((skill, index) => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-title">${skill.name}</div>
      </div>
      <div class="item-actions">
        <button class="btn-icon btn-icon-edit" onclick="editSkill(${index})" title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn-icon btn-icon-delete" onclick="deleteSkill(${index})" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Render projects list
function renderProjectsList() {
  const container = document.getElementById('projectsList');
  if (!container) return;

  if (!portfolioData.projects || portfolioData.projects.length === 0) {
    container.innerHTML = '<div class="empty-state">No projects added yet</div>';
    return;
  }

  container.innerHTML = portfolioData.projects.map((project, index) => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-title">${project.title}</div>
        <div class="item-subtitle">${project.tech ? project.tech.join(', ') : ''}</div>
      </div>
      <div class="item-actions">
        <button class="btn-icon btn-icon-edit" onclick="editProject(${index})" title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn-icon btn-icon-delete" onclick="deleteProject(${index})" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Render experience list
function renderExperienceList() {
  const container = document.getElementById('experienceList');
  if (!container) return;

  if (!portfolioData.experience || portfolioData.experience.length === 0) {
    container.innerHTML = '<div class="empty-state">No experience added yet</div>';
    return;
  }

  container.innerHTML = portfolioData.experience.map((exp, index) => `
    <div class="item-card">
      <div class="item-info">
        <div class="item-title">${exp.role} at ${exp.company}</div>
        <div class="item-subtitle">${exp.duration}</div>
      </div>
      <div class="item-actions">
        <button class="btn-icon btn-icon-edit" onclick="editExperience(${index})" title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn-icon btn-icon-delete" onclick="deleteExperience(${index})" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Save data to localStorage
function saveData() {
  try {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    showToast('Changes saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
    showToast('Error saving changes', true);
  }
}

// Show toast notification
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast' + (isError ? ' error' : '') + ' active';

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Initialize forms when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Personal info form
  const personalForm = document.getElementById('personalForm');
  if (personalForm) {
    personalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      portfolioData.personal.name = personalForm.name.value;
      portfolioData.personal.title = personalForm.title.value;
      portfolioData.personal.tagline = personalForm.tagline.value;
      portfolioData.personal.bio = personalForm.bio.value;
      portfolioData.personal.profileImage = personalForm.profileImage.value;
      portfolioData.personal.aboutTitle = personalForm.aboutTitle.value;
      portfolioData.personal.expYears = personalForm.expYears.value;
      portfolioData.personal.projectCount = parseInt(personalForm.projectCount.value) || 0;
      portfolioData.personal.degree = personalForm.degree.value;
      saveData();
    });
  }

  // Social form
  const socialForm = document.getElementById('socialForm');
  if (socialForm) {
    socialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      portfolioData.social.linkedin = socialForm.linkedin.value;
      portfolioData.social.github = socialForm.github.value;
      portfolioData.social.twitter = socialForm.twitter.value;
      portfolioData.social.email = socialForm.email.value;
      saveData();
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      portfolioData.contact.email = contactForm.contactEmail.value;
      portfolioData.contact.phone = contactForm.contactPhone.value;
      portfolioData.contact.address = contactForm.contactAddress.value;
      saveData();
    });
  }

  // Skill form
  const skillForm = document.getElementById('skillForm');
  if (skillForm) {
    skillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const skillName = skillForm.skillName.value;
      const skillLevel = parseInt(skillForm.skillLevel.value);

      if (!portfolioData.skills) portfolioData.skills = [];
      portfolioData.skills.push({ name: skillName, level: skillLevel });

      skillForm.reset();
      skillForm.skillLevel.parentElement.querySelector('.range-value').textContent = '50%';
      renderSkillsList();
      saveData();
    });

    // Skill level slider
    const skillLevelInput = skillForm.querySelector('input[name="skillLevel"]');
    if (skillLevelInput) {
      skillLevelInput.addEventListener('input', (e) => {
        const rangeValue = skillForm.querySelector('.range-value');
        if (rangeValue) rangeValue.textContent = e.target.value + '%';
      });
    }
  }

  // Project form
  const projectForm = document.getElementById('projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newProject = {
        id: Date.now(),
        title: projectForm.projectTitle.value,
        description: projectForm.projectDescription.value,
        image: projectForm.projectImage.value || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
        tech: [...techTags],
        liveUrl: projectForm.projectLiveUrl.value,
        githubUrl: projectForm.projectGithubUrl.value
      };

      if (!portfolioData.projects) portfolioData.projects = [];
      portfolioData.projects.push(newProject);

      projectForm.reset();
      techTags = [];
      renderTechTags();
      renderProjectsList();
      saveData();
    });
  }

  // Experience form
  const experienceForm = document.getElementById('experienceForm');
  if (experienceForm) {
    experienceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newExperience = {
        id: Date.now(),
        company: experienceForm.expCompany.value,
        role: experienceForm.expRole.value,
        duration: experienceForm.expDuration.value,
        description: experienceForm.expDescription.value
      };

      if (!portfolioData.experience) portfolioData.experience = [];
      portfolioData.experience.push(newExperience);

      experienceForm.reset();
      renderExperienceList();
      saveData();
    });
  }

  // Initialize tech tags input
  initTechTagsInput();
});

// Delete functions
function deleteSkill(index) {
  if (confirm('Are you sure you want to delete this skill?')) {
    portfolioData.skills.splice(index, 1);
    renderSkillsList();
    saveData();
  }
}

function deleteProject(index) {
  if (confirm('Are you sure you want to delete this project?')) {
    portfolioData.projects.splice(index, 1);
    renderProjectsList();
    saveData();
  }
}

function deleteExperience(index) {
  if (confirm('Are you sure you want to delete this experience?')) {
    portfolioData.experience.splice(index, 1);
    renderExperienceList();
    saveData();
  }
}

// Edit functions
function editSkill(index) {
  const skill = portfolioData.skills[index];
  currentEditType = 'skill';
  currentEditId = index;

  const modalBody = document.getElementById('modalBody');
  document.getElementById('modalTitle').textContent = 'Edit Skill';

  modalBody.innerHTML = `
    <div class="form-group">
      <label class="form-label">Skill Name</label>
      <input type="text" class="form-input" id="editSkillName" value="${skill.name}">
    </div>
    <div class="form-group">
      <label class="form-label">Proficiency Level</label>
      <div class="range-wrapper">
        <input type="range" id="editSkillLevel" min="0" max="100" value="${skill.level}">
        <span class="range-value">${skill.level}%</span>
      </div>
    </div>
  `;

  document.getElementById('editSkillLevel').addEventListener('input', (e) => {
    e.target.parentElement.querySelector('.range-value').textContent = e.target.value + '%';
  });

  document.getElementById('modalSaveBtn').onclick = () => saveEdit();
  openModal();
}

function editProject(index) {
  const project = portfolioData.projects[index];
  currentEditType = 'project';
  currentEditId = index;
  techTags = project.tech ? [...project.tech] : [];

  const modalBody = document.getElementById('modalBody');
  document.getElementById('modalTitle').textContent = 'Edit Project';

  modalBody.innerHTML = `
    <div class="form-group">
      <label class="form-label">Project Title</label>
      <input type="text" class="form-input" id="editProjectTitle" value="${project.title}">
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-input" id="editProjectDescription">${project.description}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Image URL</label>
      <input type="url" class="form-input" id="editProjectImage" value="${project.image}">
    </div>
    <div class="form-group">
      <label class="form-label">Technologies</label>
      <div class="tags-input" id="editTechTagsInput">
        ${techTags.map(tag => `<span class="tag">${tag}<span class="tag-remove" onclick="removeEditTag(this)">&times;</span></span>`).join('')}
        <input type="text" placeholder="Add technology...">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Live Demo URL</label>
      <input type="url" class="form-input" id="editProjectLiveUrl" value="${project.liveUrl || ''}">
    </div>
    <div class="form-group">
      <label class="form-label">GitHub URL</label>
      <input type="url" class="form-input" id="editProjectGithubUrl" value="${project.githubUrl || ''}">
    </div>
  `;

  initEditTagsInput();
  document.getElementById('modalSaveBtn').onclick = () => saveEdit();
  openModal();
}

function editExperience(index) {
  const exp = portfolioData.experience[index];
  currentEditType = 'experience';
  currentEditId = index;

  const modalBody = document.getElementById('modalBody');
  document.getElementById('modalTitle').textContent = 'Edit Experience';

  modalBody.innerHTML = `
    <div class="form-group">
      <label class="form-label">Company Name</label>
      <input type="text" class="form-input" id="editExpCompany" value="${exp.company}">
    </div>
    <div class="form-group">
      <label class="form-label">Role / Position</label>
      <input type="text" class="form-input" id="editExpRole" value="${exp.role}">
    </div>
    <div class="form-group">
      <label class="form-label">Duration</label>
      <input type="text" class="form-input" id="editExpDuration" value="${exp.duration}">
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-input" id="editExpDescription">${exp.description}</textarea>
    </div>
  `;

  document.getElementById('modalSaveBtn').onclick = () => saveEdit();
  openModal();
}

// Save edit
function saveEdit() {
  if (currentEditType === 'skill') {
    portfolioData.skills[currentEditId].name = document.getElementById('editSkillName').value;
    portfolioData.skills[currentEditId].level = parseInt(document.getElementById('editSkillLevel').value);
    renderSkillsList();
  } else if (currentEditType === 'project') {
    portfolioData.projects[currentEditId].title = document.getElementById('editProjectTitle').value;
    portfolioData.projects[currentEditId].description = document.getElementById('editProjectDescription').value;
    portfolioData.projects[currentEditId].image = document.getElementById('editProjectImage').value;
    portfolioData.projects[currentEditId].tech = techTags;
    portfolioData.projects[currentEditId].liveUrl = document.getElementById('editProjectLiveUrl').value;
    portfolioData.projects[currentEditId].githubUrl = document.getElementById('editProjectGithubUrl').value;
    renderProjectsList();
  } else if (currentEditType === 'experience') {
    portfolioData.experience[currentEditId].company = document.getElementById('editExpCompany').value;
    portfolioData.experience[currentEditId].role = document.getElementById('editExpRole').value;
    portfolioData.experience[currentEditId].duration = document.getElementById('editExpDuration').value;
    portfolioData.experience[currentEditId].description = document.getElementById('editExpDescription').value;
    renderExperienceList();
  }

  closeModal();
  saveData();
}

// Tech tags input handling
function initTechTagsInput() {
  const container = document.getElementById('techTagsInput');
  if (!container) return;

  const input = container.querySelector('input');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      techTags.push(input.value.trim());
      input.value = '';
      renderTechTags();
    }
  });
}

function renderTechTags() {
  const container = document.getElementById('techTagsInput');
  if (!container) return;

  const input = container.querySelector('input');
  const existingTags = container.querySelectorAll('.tag');

  existingTags.forEach(tag => tag.remove());

  techTags.forEach((tag) => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.innerHTML = `${tag}<span class="tag-remove" onclick="removeTechTag(this)">&times;</span>`;
    container.insertBefore(tagEl, input);
  });
}

function removeTechTag(el) {
  const tag = el.parentElement;
  const container = tag.parentElement;
  const input = container.querySelector('input');
  const index = Array.from(container.children).indexOf(tag) - 1;
  if (index >= 0 && index < techTags.length) {
    techTags.splice(index, 1);
    renderTechTags();
  }
}

function initEditTagsInput() {
  const container = document.getElementById('editTechTagsInput');
  if (!container) return;

  const input = container.querySelector('input');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      techTags.push(input.value.trim());
      input.value = '';
      renderEditTechTags();
    }
  });
}

function renderEditTechTags() {
  const container = document.getElementById('editTechTagsInput');
  if (!container) return;

  const input = container.querySelector('input');
  const existingTags = container.querySelectorAll('.tag');

  existingTags.forEach(tag => tag.remove());

  techTags.forEach((tag) => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.innerHTML = `${tag}<span class="tag-remove" onclick="removeEditTag(this)">&times;</span>`;
    container.insertBefore(tagEl, input);
  });
}

function removeEditTag(el) {
  const tag = el.parentElement;
  const container = tag.parentElement;
  const index = Array.from(container.children).indexOf(tag) - 1;
  if (index >= 0 && index < techTags.length) {
    techTags.splice(index, 1);
    renderEditTechTags();
  }
}

// Modal functions
function openModal() {
  document.getElementById('editModal').classList.add('active');
}

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  currentEditType = null;
  currentEditId = null;
  techTags = [];
}

// Close modal on overlay click
document.getElementById('editModal').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
});

// Navigation
document.querySelectorAll('.admin-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Update active nav
    document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Show corresponding section
    const section = link.dataset.section;
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
  });
});