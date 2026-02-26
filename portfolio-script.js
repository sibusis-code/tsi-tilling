/**
 * Portfolio JavaScript - Image Lightbox and Interactions
 */

// ============================================
// Lightbox Functionality
// ============================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImageIndex = 0;
let imageElements = [];

// Initialize lightbox functionality
function initLightbox() {
    // Get all image items
    imageElements = Array.from(document.querySelectorAll('.image-item img'));
    
    if (imageElements.length === 0) return;

    // Add click event to each image
    imageElements.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Click outside image to close
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Previous image
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreviousImage();
        });
    }

    // Next image
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    if (imageElements.length === 0) return;
    
    const img = imageElements[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    
    // Update caption
    const label = img.parentElement.querySelector('.media-label');
    if (label && lightboxCaption) {
        lightboxCaption.textContent = label.textContent.trim();
    }
}

function showPreviousImage() {
    currentImageIndex--;
    if (currentImageIndex < 0) {
        currentImageIndex = imageElements.length - 1;
    }
    updateLightboxImage();
}

function showNextImage() {
    currentImageIndex++;
    if (currentImageIndex >= imageElements.length) {
        currentImageIndex = 0;
    }
    updateLightboxImage();
}

// ============================================
// Video Controls Enhancement
// ============================================
function initVideoControls() {
    const videos = document.querySelectorAll('.video-item video');
    
    videos.forEach(video => {
        // Pause other videos when one starts playing
        video.addEventListener('play', () => {
            videos.forEach(otherVideo => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });

        // Add loading state
        video.addEventListener('loadstart', () => {
            video.parentElement.classList.add('loading');
        });

        video.addEventListener('loadeddata', () => {
            video.parentElement.classList.remove('loading');
        });
    });
}

// ============================================
// Smooth Scroll to Projects
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Lazy Loading Enhancement
// ============================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// Category Card Animations
// ============================================
function initCategoryAnimations() {
    const cards = document.querySelectorAll('.category-card, .related-card');
    
    if ('IntersectionObserver' in window) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }
}

// ============================================
// Project Media Grid Masonry Effect
// ============================================
function initMasonryLayout() {
    const grids = document.querySelectorAll('.project-media-grid');
    
    grids.forEach(grid => {
        // Add class for loaded state
        const images = grid.querySelectorAll('img');
        let loadedCount = 0;
        
        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        grid.classList.add('loaded');
                    }
                });
            }
        });
        
        if (loadedCount === images.length) {
            grid.classList.add('loaded');
        }
    });
}

// ============================================
// Back to Top Enhancement (if exists)
// ============================================
function enhanceBackToTop() {
    const backToTop = document.getElementById('scrollTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// ============================================
// Initialize All Portfolio Features
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio JavaScript loaded');
    
    // Initialize all features
    initLightbox();
    initVideoControls();
    initSmoothScroll();
    initLazyLoading();
    initCategoryAnimations();
    initMasonryLayout();
    enhanceBackToTop();

    // Add visible class to scroll top after a delay
    setTimeout(() => {
        const scrollTop = document.getElementById('scrollTop');
        if (scrollTop && window.pageYOffset > 300) {
            scrollTop.classList.add('visible');
        }
    }, 1000);
});

// ============================================
// Search/Filter Functionality (Future Enhancement)
// ============================================
function initPortfolioFilter() {
    // This can be expanded in the future to filter projects
    // by category, date, or search terms
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            // Filter logic here
            console.log('Filtering by:', filter);
        });
    });
}

// ============================================
// Share Functionality (Future Enhancement)
// ============================================
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: document.title,
                        text: 'Check out this project!',
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Share cancelled or failed:', err);
                }
            } else {
                // Fallback for browsers that don't support Web Share API
                copyToClipboard(window.location.href);
                showToast('Link copied to clipboard!');
            }
        });
    });
}

// ============================================
// Utility Functions
// ============================================
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showToast(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--dark);
        color: var(--white);
        padding: 1rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ============================================
// Performance Optimization
// ============================================

// Debounce function for scroll/resize events
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

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    // Add any scroll-based functionality here
}, 100));

// Optimize resize events
window.addEventListener('resize', debounce(() => {
    // Add any resize-based functionality here
}, 200));
