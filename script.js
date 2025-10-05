const planets = document.querySelectorAll('.planet');
// console.log(planets);

planets.forEach(planet => {
    planet.addEventListener('click', () => {
        const planetName = planet.dataset.name;
        console.log(`Clicked on ${planetName}`);
    });
});

const planetData = [
    {name: 'mercury', distance: '0.39AU', facts: 'Smallest planet, closest to the Sun.'},
    {name: 'venus', distance: '0.72AU', facts: 'Hottest planet, rotates backwards.'},
    {name: 'earth', distance: '1 AU', facts: 'Our home, has water and life.'},
    {name: 'mars', distance: '1.52 AU', facts: 'Red planet, has Olympus Mons.'},
    {name: 'jupiter', distance: '5.2 AU', facts: 'Largest planet, has Great Red Spot.'},
    {name: 'saturn', distance: '9.58 AU', facts: 'Has beautiful rings made of ice.'},
    {name: 'uranus', distance: '19.2 AU', facts: 'Ice giant, tilts on its side.'},
    {name: 'neptune', distance: '30.05 AU', facts: 'Farthest planet, has strongest winds.'}
]

// console.log(planetData);

.planet.forEach(planet => {
    const planetInfo = planetData.find(data => data.name === planet.dataset.name);
    planet.dataset.facts = planetInfo.facts;
});