/**
 * JavaScript for the drawing page
 * Handles canvas drawing and circle similarity calculation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const canvasOverlay = document.getElementById('canvasOverlay');
    const resultContainer = document.getElementById('resultContainer');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const similarityBar = document.getElementById('similarityBar');
    const similarityText = document.getElementById('similarityText');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const clearBtn = document.getElementById('clearBtn');
    const submitBtn = document.getElementById('submitBtn');
    const attemptCountEl = document.getElementById('attemptCount');
    
    // Drawing state
    let isDrawing = false;
    let points = [];
    let attemptCount = parseInt(localStorage.getItem('userAttempts') || '0') + 1;
    
    // Update attempt counter
    attemptCountEl.textContent = attemptCount;
    
    // Canvas size adjustment
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Clear and redraw if needed
        if (points.length > 0) {
            redrawCanvas();
        }
    }
    
    // Initial resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Drawing event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouch(startDrawing));
    canvas.addEventListener('touchmove', handleTouch(draw));
    canvas.addEventListener('touchend', stopDrawing);
    
    // Button event listeners
    clearBtn.addEventListener('click', clearCanvas);
    submitBtn.addEventListener('click', evaluateCircle);
    tryAgainBtn.addEventListener('click', resetDrawing);
    
    /**
     * Start drawing when mouse is pressed
     */
    function startDrawing(e) {
        isDrawing = true;
        points = [];
        addPoint(e);
        ctx.beginPath();
        ctx.moveTo(e.offsetX || e.clientX, e.offsetY || e.clientY);
    }
    
    /**
     * Draw as mouse moves
     */
    function draw(e) {
        if (!isDrawing) return;
        
        addPoint(e);
        
        ctx.lineTo(e.offsetX || e.clientX, e.offsetY || e.clientY);
        ctx.stroke();
    }
    
    /**
     * Stop drawing when mouse is released or leaves canvas
     */
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.closePath();
            
            // Connect the last point to the first to close the shape
            if (points.length > 2) {
                ctx.beginPath();
                ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
                ctx.lineTo(points[0].x, points[0].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    /**
     * Handle touch events
     */
    function handleTouch(eventHandler) {
        return function(e) {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const offsetX = touch.clientX - rect.left;
                const offsetY = touch.clientY - rect.top;
                
                const touchEvent = {
                    offsetX: offsetX,
                    offsetY: offsetY,
                    clientX: offsetX,
                    clientY: offsetY
                };
                
                eventHandler(touchEvent);
            }
        };
    }
    
    /**
     * Add a point to the points array
     */
    function addPoint(e) {
        const x = e.offsetX || e.clientX;
        const y = e.offsetY || e.clientY;
        points.push({ x, y });
    }
    
    /**
     * Clear the canvas
     */
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
    }
    
    /**
     * Redraw the canvas (used after resize)
     */
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        // Connect back to the first point
        ctx.lineTo(points[0].x, points[0].y);
        ctx.stroke();
        ctx.closePath();
    }
    
    /**
     * Reset for a new drawing attempt
     */
    function resetDrawing() {
        clearCanvas();
        canvasOverlay.classList.remove('visible');
        attemptCount++;
        attemptCountEl.textContent = attemptCount;
        localStorage.setItem('userAttempts', attemptCount);
    }
    
    /**
     * Evaluate how close the drawing is to a perfect circle
     */
    function evaluateCircle() {
        if (points.length < 10) {
            alert('Please draw a complete circle before submitting.');
            return;
        }
        
        // Calculate center of the drawn shape
        let centerX = 0, centerY = 0;
        for (const point of points) {
            centerX += point.x;
            centerY += point.y;
        }
        centerX /= points.length;
        centerY /= points.length;
        
        // Calculate average radius and standard deviation
        let totalRadius = 0;
        let radii = [];
        
        for (const point of points) {
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            const radius = Math.sqrt(dx * dx + dy * dy);
            radii.push(radius);
            totalRadius += radius;
        }
        
        const avgRadius = totalRadius / points.length;
        
        // Calculate standard deviation of radii
        let totalDeviation = 0;
        for (const radius of radii) {
            totalDeviation += Math.pow(radius - avgRadius, 2);
        }
        
        const stdDeviation = Math.sqrt(totalDeviation / radii.length);
        
        // Calculate similarity as a percentage (lower deviation = higher similarity)
        // Normalize to a 0-100 scale where 0 is terrible and 100 is perfect
        const maxDeviation = avgRadius * 0.5; // 50% deviation is considered terrible
        const normalizedDeviation = Math.min(stdDeviation / maxDeviation, 1);
        const similarity = Math.round((1 - normalizedDeviation) * 100);
        
        // Show results
        showResults(similarity);
        
        // Save best similarity
        const bestSimilarity = Math.max(similarity, parseInt(localStorage.getItem('bestSimilarity') || '0'));
        localStorage.setItem('bestSimilarity', bestSimilarity);
        
        // Update success status
        if (similarity >= 80) {
            localStorage.setItem('hasSucceeded', 'true');
        }
        
        // Submit to server
        submitAttempt(similarity);
    }
    
    /**
     * Show the results overlay
     */
    function showResults(similarity) {
        // Update result elements
        if (similarity >= 80) {
            resultTitle.textContent = translations.draw.perfect_circle;
            resultText.textContent = translations.draw.congratulations;
        } else if (similarity >= 60) {
            resultTitle.textContent = translations.draw.almost_there;
            resultText.textContent = translations.draw.good_not_perfect;
        } else {
            resultTitle.textContent = translations.draw.keep_practicing;
            resultText.textContent = translations.draw.harder_than_seems;
        }
        
        // Show the overlay
        canvasOverlay.classList.add('visible');
        
        // Animate the similarity bar
        setTimeout(() => {
            similarityBar.style.width = similarity + '%';
            similarityText.textContent = similarity + '%';
        }, 300);
    }
    
    /**
     * Submit the attempt to the server
     */
    function submitAttempt(similarity) {
        fetch('/api/submit-attempt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ similarity })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Attempt submitted:', data);
        })
        .catch(error => {
            console.error('Error submitting attempt:', error);
        });
    }
});