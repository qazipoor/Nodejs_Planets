const { parse } = require('csv-parse');
const fs = require('fs');

const parser = parse(
    {
        comment: '#',
        columns: true,
        delimiter: ','
    }
);
const csvFilePath = "./kepler_data.csv";
const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' &&
            planet['koi_insol'] > 0.36 && 
            planet['koi_insol'] < 1.11 &&
            planet['koi_prad'] < 1.6;
}

fs.createReadStream(csvFilePath)
    .pipe(parser)
    .on('data', (data)  => {
        if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.error(`Error reading file: ${err.message}`);
    })
    .on('end', () => {
        habitablePlanets.forEach((planet, idx) => {
            console.log(idx+1, planet['kepler_name']);
        })
        console.log(`${habitablePlanets.length} habitable planets found.`);
    })




