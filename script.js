/**
 * TSI Tiling and Patterns - Main JavaScript
 * Pure JavaScript - No Frameworks
 */

// ============================================
// DOM Elements
// ============================================
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileToggle = document.getElementById('mobileToggle');
const scrollTopBtn = document.getElementById('scrollTop');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Admin Panel Elements
const adminToggleBtn = document.getElementById('adminToggleBtn');
const adminPanel = document.getElementById('adminPanel');
const closeAdmin = document.getElementById('closeAdmin');
const passwordModal = document.getElementById('passwordModal');
const adminPassword = document.getElementById('adminPassword');
const submitPassword = document.getElementById('submitPassword');
const cancelPassword = document.getElementById('cancelPassword');
const updateForm = document.getElementById('updateForm');
const updateProgress = document.getElementById('updateProgress');
const progressValue = document.getElementById('progressValue');

// Updates Container
const updatesContainer = document.getElementById('updatesContainer');
const emptyState = document.getElementById('emptyState');

// Contact Form
const contactForm = document.getElementById('contactForm');

// ============================================
// Configuration
// ============================================
const ADMIN_PASSWORD = 'tsi2026'; // Simple password for admin access
const STORAGE_KEY = 'tsi_weekly_updates';

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollTop();
    initMobileMenu();
    initSmoothScroll();
    initAdminPanel();
    initContactForm();
    loadUpdates();
    initScrollAnimations();
    setDefaultDate();
});

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        const spans = mobileToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ============================================
// Scroll to Top Button
// ============================================
function initScrollTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Admin Panel & Weekly Updates
// ============================================
function initAdminPanel() {
    // Toggle admin panel with password
    adminToggleBtn.addEventListener('click', () => {
        passwordModal.classList.remove('hidden');
        adminPassword.focus();
    });
    
    // Close password modal
    cancelPassword.addEventListener('click', () => {
        passwordModal.classList.add('hidden');
        adminPassword.value = '';
    });
    
    // Submit password
    submitPassword.addEventListener('click', checkPassword);
    adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });
    
    // Close admin panel
    closeAdmin.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
        adminToggleBtn.innerHTML = '<i class="fas fa-lock"></i> Admin Access';
    });
    
    // Progress slider
    updateProgress.addEventListener('input', () => {
        progressValue.textContent = `${updateProgress.value}%`;
    });
    
    // Form submission
    updateForm.addEventListener('submit', handleUpdateSubmit);
}

function checkPassword() {
    if (adminPassword.value === ADMIN_PASSWORD) {
        passwordModal.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        adminToggleBtn.innerHTML = '<i class="fas fa-unlock"></i> Close Admin';
        adminPassword.value = '';
        showToast('Admin access granted!');
    } else {
        showToast('Incorrect password!', 'error');
        adminPassword.value = '';
        adminPassword.focus();
    }
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('updateDate').value = today;
}

function handleUpdateSubmit(e) {
    e.preventDefault();
    
    const update = {
        id: Date.now(),
        title: document.getElementById('updateTitle').value,
        category: document.getElementById('updateCategory').value,
        description: document.getElementById('updateDescription').value,
        progress: parseInt(document.getElementById('updateProgress').value),
        date: document.getElementById('updateDate').value,
        image: document.getElementById('updateImage').value || null
    };
    
    // Save to localStorage
    const updates = getUpdates();
    updates.unshift(update); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
    
    // Reset form
    updateForm.reset();
    setDefaultDate();
    progressValue.textContent = '0%';
    
    // Reload updates
    loadUpdates();
    
    showToast('Update added successfully!');
}

function getUpdates() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultUpdates();
}

function getDefaultUpdates() {
    // Default updates to show when no updates are stored
    return [
        {
            id: 1,
            title: 'Kitchen Renovation - Tiling Complete',
            category: 'tiling',
            description: 'Completed the kitchen floor tiling with premium ceramic tiles. The client is very satisfied with the finish and precision of the work.',
            progress: 100,
            date: '2026-02-20',
            image: 'assets/img/tiling_work.jpeg'
        },
        {
            id: 2,
            title: 'Wooden Flooring Installation',
            category: 'flooring',
            description: 'Installing high-quality wooden flooring in the master bedroom. The laminate flooring looks stunning and adds warmth to the room.',
            progress: 75,
            date: '2026-02-18',
            image: 'assets/img/woodenfloor_work.jpeg'
        },
        {
            id: 3,
            title: 'Custom Cabinetry Project',
            category: 'carpentry',
            description: 'Building custom wardrobes for a client\'s bedroom. The white finish cabinets are coming along beautifully with modern handles.',
            progress: 60,
            date: '2026-02-15',
            image: 'assets/img/carpentry_work.jpeg'
        }
    ];
}

function loadUpdates() {
    const updates = getUpdates();
    
    if (updates.length === 0) {
        updatesContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    updatesContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    updatesContainer.innerHTML = updates.map(update => createUpdateCard(update)).join('');
    
    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => editUpdate(e.target.dataset.id));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => deleteUpdate(e.target.dataset.id));
    });
    
    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.dataset.progress;
            bar.style.width = `${width}%`;
        });
    }, 100);
}

function createUpdateCard(update) {
    const categoryLabels = {
        tiling: 'Tiling',
        plumbing: 'Plumbing',
        flooring: 'Flooring',
        carpentry: 'Carpentry',
        building: 'Building',
        painting: 'Painting'
    };
    
    const categoryIcons = {
        tiling: 'fa-th-large',
        plumbing: 'fa-faucet',
        flooring: 'fa-wood',
        carpentry: 'fa-tools',
        building: 'fa-hammer',
        painting: 'fa-paint-roller'
    };
    
    const formattedDate = new Date(update.date).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const imageHtml = update.image 
        ? `<img src="${update.image}" alt="${update.title}">`
        : `<i class="fas ${categoryIcons[update.category] || 'fa-hard-hat'}"></i>`;
    
    const isAdmin = !adminPanel.classList.contains('hidden');
    const adminActions = isAdmin ? `
        <div class="update-actions">
            <button class="btn-edit" data-id="${update.id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn-delete" data-id="${update.id}"><i class="fas fa-trash"></i> Delete</button>
        </div>
    ` : '';
    
    return `
        <div class="update-card" data-id="${update.id}">
            <div class="update-image">
                ${imageHtml}
            </div>
            <div class="update-content">
                <div class="update-header">
                    <span class="update-category ${update.category}">${categoryLabels[update.category]}</span>
                    <span class="update-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                </div>
                <h3>${update.title}</h3>
                <p>${update.description}</p>
                <div class="progress-bar">
                    <div class="progress-fill" data-progress="${update.progress}" style="width: 0%"></div>
                </div>
                <div class="progress-text">${update.progress}% Complete</div>
                ${adminActions}
            </div>
        </div>
    `;
}

function editUpdate(id) {
    const updates = getUpdates();
    const update = updates.find(u => u.id == id);
    
    if (update) {
        document.getElementById('updateTitle').value = update.title;
        document.getElementById('updateCategory').value = update.category;
        document.getElementById('updateDescription').value = update.description;
        document.getElementById('updateProgress').value = update.progress;
        document.getElementById('progressValue').textContent = `${update.progress}%`;
        document.getElementById('updateDate').value = update.date;
        document.getElementById('updateImage').value = update.image || '';
        
        // Delete the old update
        deleteUpdate(id, false);
        
        // Scroll to form
        adminPanel.scrollIntoView({ behavior: 'smooth' });
        showToast('Edit the update and submit');
    }
}

function deleteUpdate(id, showNotification = true) {
    let updates = getUpdates();
    updates = updates.filter(u => u.id != id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
    loadUpdates();
    
    if (showNotification) {
        showToast('Update deleted successfully!');
    }
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };
        
        // In a real application, you would send this to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        showToast('Quote request sent successfully! We will contact you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    const icon = toast.querySelector('i');
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#ef4444';
    } else {
        icon.className = 'fas fa-check-circle';
        icon.style.color = 'var(--accent)';
    }
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .team-card, .portfolio-item, .update-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ============================================
// Utility Functions
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Export Functions for Global Access
// ============================================
window.TSI = {
    showToast,
    loadUpdates,
    getUpdates,
    deleteUpdate
};
