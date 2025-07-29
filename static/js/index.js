/**
 * JavaScript for the index page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Animate stats when the stats section becomes visible
    const statsSection = document.querySelector('.section.stats');
    let statsAnimated = false;
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            });
        }, { threshold: 0.7 });
        
        observer.observe(statsSection);
    }
    
    /**
     * Animate the statistics with counting effect
     */
    function animateStats() {
        const totalAttemptsEl = document.getElementById('total-attempts');
        const successRateEl = document.getElementById('success-rate');
        const avgSimilarityEl = document.getElementById('avg-similarity');
        
        // Get the actual values from the elements
        const totalAttempts = parseInt(totalAttemptsEl.textContent, 10);
        const successRate = parseInt(successRateEl.textContent, 10);
        const avgSimilarity = parseInt(avgSimilarityEl.textContent, 10);
        
        // Animate counting up to these values
        animateCount(totalAttemptsEl, totalAttempts);
        animateCount(successRateEl, successRate, 2000, '%');
        animateCount(avgSimilarityEl, avgSimilarity, 2000, '%');
    }
});