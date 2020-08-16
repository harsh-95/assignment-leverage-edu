const fs = require("fs");
const readline = require('readline');

const customersArray = [];

//some constants
const latitudeDublin = 53.339428;
const longitudeDublin = -6.257664;
const RADIUS_OF_EARTH = 6378.8;

const latitudeDublinRadian = latitudeDublin * Math.PI / 180;

const longitudeDublinRadian = longitudeDublin * Math.PI / 180;


//populate customers array
createArrayFromFile();

// function to populate customers array
function createArrayFromFile() {

    var rd = readline.createInterface({
        input: fs.createReadStream('customers.txt'),
        console: false
    });

    rd.on('line', function (line) {

        const record = JSON.parse(line);
        customersArray.push(record);

    }).on('close', function () {

        //sort the customers array
        sortArrayOfObjects();

        //traverse the array and find distance
        customersArray.forEach((record) => {
            const latitudeRadian = record.latitude * Math.PI / 180;
            const longitudeRadian = record.longitude * Math.PI / 180;

            const distance = getDistance(latitudeRadian, longitudeRadian);

            //within 100 Km
            if (distance < 100) {
                console.log(record.user_id, record.name, distance);
            }
        })

    });
}

//function to sort the array of objects
function sortArrayOfObjects() {
    customersArray.sort(function (obj1, obj2) {
        const uid1 = obj1.user_id;
        const uid2 = obj2.user_id;
        if (uid1 < uid2) { return -1; }
        if (uid1 > uid2) { return 1; }
        return 0;
    });
}

//function to get distance between two point coordinates
function getDistance(latitude, longitude) {

    // Haversine Formula 
    const latitudeDiff = latitude - latitudeDublinRadian;
    const longitudeDiff = longitude - longitudeDublinRadian;

    let distance = Math.pow(Math.sin(latitudeDiff / 2), 2) +
        Math.cos(latitudeDublinRadian) * Math.cos(latitude) *
        Math.pow(Math.sin(longitudeDiff / 2), 2);

    distance = 2 * RADIUS_OF_EARTH * Math.asin(Math.sqrt(distance));

    return distance;
}



