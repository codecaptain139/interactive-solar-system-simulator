const planets = document.querySelectorAll('.planet'); // Select all elements with class 'planet' (NodeList of 8 planets)

const modal = document.getElementById('modal'); // Select modal element
const modalTitle = document.getElementById('modal-title'); // Select modal title element
const modalDistance = document.getElementById('modal-distance'); // Select modal distance element
const modalFacts = document.getElementById('modal-facts'); // Select modal facts element
const modalClose = document.getElementById('modal-close'); //Select modal close button
const toggleOrbits = document.getElementById('toggle-orbits');

const planetData = [ // Array storing data for each planet
    { name: 'mercury', distance: '0.39 AU', facts: 'Smallest planet, closest to Sun.' }, // Mercury data
    { name: 'venus', distance: '0.72 AU', facts: 'Hottest planet, rotates backwards.' }, // Venus data
    { name: 'earth', distance: '1 AU', facts: 'Our home, has water and life.' }, // Earth data
    { name: 'mars', distance: '1.52 AU', facts: 'Red planet, has Olympus Mons.' }, // Mars data
    { name: 'jupiter', distance: '5.2 AU', facts: 'Largest planet, has Great Red Spot.' }, // Jupiter data
    { name: 'saturn', distance: '9.58 AU', facts: 'Has beautiful rings made of ice.' }, // Saturn data
    { name: 'uranus', distance: '19.2 AU', facts: 'Ice giant, tilts on its side.' }, // Uranus data
    { name: 'neptune', distance: '30.05 AU', facts: 'Farthest planet, has strongest winds.' } // Neptune data
];

let currentDraggedPlanet = null; // Global: Track which planet is being dragged
let isDragging = false; // Global flag for dragging
let currentX, currentY; // Global mouse positions

// Single document listeners (outside loop!)
document.addEventListener('mousemove', (e) => { // When mouse moves anywhere on document
    if (isDragging && currentDraggedPlanet) { // Only if dragging active and planet selected
        const deltaX = e.clientX - currentX; // Calculate change in X position
        const deltaY = e.clientY - currentY; // Calculate change in Y position
        currentX = e.clientX; // Update current X position
        currentY = e.clientY; // Update current Y position
        currentDraggedPlanet.style.transform = `translate(-50%, -50%) translateZ(50px) translate(${deltaX}px, ${deltaY}px)`; // Move planet based on mouse movement
    }
});

document.addEventListener('mouseup', () => { // When mouse is released anywhere
    if (isDragging && currentDraggedPlanet) { // Only if dragging was active
        isDragging = false; // Reset dragging flag
        currentDraggedPlanet.style.animationPlayState = 'running'; // Resume orbit animation
        currentDraggedPlanet.style.transform = `translate(-50%, -50%) translateZ(50px)`; // Reset to original orbit position
        currentDraggedPlanet.style.cursor = 'grab'; // Reset cursor to grab icon
        currentDraggedPlanet = null; // Clear current planet
    }
});

planets.forEach(planet => { // Loop through each planet element
    // Facts Injection & Orbit speed (single planetInfo)
    const planetInfo = planetData.find(data => data.name === planet.dataset.name); // Find matching planet data from array (once!)
    if (!planetInfo) return; // Safety: Skip if no match
    planet.dataset.facts = planetInfo.facts; // Update data-facts attribute with facts from array

    const baseDuration = 5; // Base animation duration in seconds (for Mercury)
    const distance = parseFloat(planetInfo.distance); // Convert distance (e.g., '0.39 AU') to number
    const duration = baseDuration + (distance * 2); // Calculate duration: farther planets = slower (e.g., Mercury: 5s, Neptune: ~65s)
    planet.style.animationDuration = `${duration}s`; // Set CSS animation-duration property dynamically

    // Hover zoom effect
    let scale = 1; // Initial scale (normal size)
    let translateX = 0; // Initial X translation for centering
    let translateY = 0; // Initial Y translation for centering
    planet.addEventListener('mouseenter', () => { // When mouse hovers over planet
        planet.style.animationPlayState = 'paused'; // Pause orbit animation during hover
        const animate = () => { // Animation function for smooth scaling
            scale += 0.05; // Increase scale gradually (up to 2)
            translateX += (50 - translateX) * 0.1; // Smoothly move to center (50% of screen)
            translateY += (50 - translateY) * 0.1; // Smoothly move to center (50% of screen)
            if (scale < 2) { // Continue until scale reaches 2
                planet.style.transform = `translate(-50%, -50%) translateZ(50px) translate(${translateX}%, ${translateY}%) scale(${scale})`; // Apply transform: center, depth, scale
                requestAnimationFrame(animate); // Call animate again for smooth effect
            }
        };
        requestAnimationFrame(animate); // Start smooth animation
    });

    planet.addEventListener('mouseleave', () => { // When mouse leaves planet
        planet.style.animationPlayState = 'running'; // Resume orbit animation
        scale = 1; // Reset scale
        translateX = 0; // Reset X translation
        translateY = 0; // Reset Y translation
        planet.style.transform = `translate(-50%, -50%) translateZ(50px) scale(1)`; // Reset to original transform
    });

    // Click to open modal (prevent drag start on click)
    planet.addEventListener('click', (e) => { // When planet is clicked
        e.preventDefault(); // Stop drag if click
        modalTitle.textContent = planetInfo.name.charAt(0).toUpperCase() + planetInfo.name.slice(1); // Set modal title (capitalize name)
        modalDistance.textContent = `Distance: ${planetInfo.distance}`; // Set modal distance
        modalFacts.textContent = `Facts: ${planetInfo.facts}`; // Set modal facts
        modal.classList.add('active'); // Add active class to show modal with animation
    });

    // Drag functionality (per-planet mousedown only)
    planet.addEventListener('mousedown', (e) => { // When mouse is pressed on planet
        if (e.button !== 0) return; // Only left click
        currentDraggedPlanet = planet; // Set current planet
        isDragging = true; // Set dragging flag to true
        planet.style.animationPlayState = 'paused'; // Pause orbit animation during drag
        currentX = e.clientX; // Get initial mouse X position
        currentY = e.clientY; // Get initial mouse Y position
        planet.style.cursor = 'grabbing'; // Change cursor to grabbing icon
        e.preventDefault(); // Prevent text selection or other defaults
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active'); // Remove active class to hide modal with animation
});

// Click outside modal to close (Bonus UX)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

toggleOrbits.addEventListener('click', () => {
    const isPaused = planets[0].style.animationPlayState === 'paused'; // Check if planets are paused (check first planet)
    planets.forEach(planet => { // Loop through all planets
        planet.style.animationPlayState = isPaused ? 'running' : 'paused'; // Toggle between running and paused
    });
    toggleOrbits.textContent = isPaused ? 'Pause Orbits' : 'Play Orbits'; // Update button text
});