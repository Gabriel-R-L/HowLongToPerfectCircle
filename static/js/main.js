/**
 * Main JavaScript file for common functionality across the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle scroll animations for the index page if it exists
    if (document.querySelector('.scroll-container')) {
        initScrollAnimations();
    }
});

/**
 * Initialize scroll-based animations for the index page
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const scrollContainer = document.querySelector('.scroll-container');
    
    // Initial check for visible sections
    checkVisibleSections();
    
    // Listen for scroll events
    scrollContainer.addEventListener('scroll', function() {
        checkVisibleSections();
    });
    
    function checkVisibleSections() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Check if section is at least 40% visible
            if (sectionTop < windowHeight * 0.6 && sectionBottom > windowHeight * 0.4) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
}

/**
 * Utility function to animate counting up to a number
 * @param {HTMLElement} element - The element to update with the count
 * @param {number} target - The target number to count to
 * @param {number} duration - Duration of the animation in milliseconds
 * @param {string} suffix - Optional suffix to add after the number (e.g., '%')
 */
function animateCount(element, target, duration = 1500, suffix = '') {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            clearInterval(timer);
            start = target;
        }
        element.textContent = Math.floor(start) + suffix;
    }, 16);
}