const socket = io();
let userLocation = null;
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });

        // Convert user location to Leaflet LatLng object
         userLocation = L.latLng(latitude, longitude);

        // Find the nearest hospital
        let minDistance = Infinity;
        let nearestHospital = null;

        hospitals.forEach(hospital => {
            const hospitalLocation = L.latLng(hospital.location[0], hospital.location[1]);
            const distance = userLocation.distanceTo(hospitalLocation);

            if (distance < minDistance) {
                minDistance = distance;
                nearestHospital = hospital;
            }
        });

        // Display the nearest hospital and distance on the screen
        if (nearestHospital) {
            document.getElementById('hospital-name').textContent = `Hospital: ${nearestHospital.name}`;
            document.getElementById('hospital-distance').textContent = `Distance: ${minDistance.toFixed(2)} KM`;
        }
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

// Initialize the map with a neutral starting view
const map = L.map('map').setView([0, 0], 16); // Default to Delhi

// Load and display tile layer on the map (using OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Example: Array of hospital locations within Delhi
const hospitals = [
    { "name": "Acharya Shree Bhikshu Hospital", "location": [28.662405, 77.140278]},
    { "name": "Ambedkar Nagar Hospital", "location": [28.522718, 77.238792]},
    { "name": "Aruna Asaf Ali Govt. Hospital", "location": [28.669912, 77.217858]},
    { "name": "Attar Sain Jain Hospital", "location": [28.682147, 77.150219]},
    { "name": "Ayurvedic & Unani Tibbia College & Hospital", "location": [28.656072, 77.195077]},
    { "name" : "Babu Jagjivan Ram Memorial Hospital", "location" : [28.733987, 77.172795]},
    { "name": "Bhagwan Mahavir Hospital", "location" : [28.688565, 77.117997]},
    { "name": "B R Sur Homeopathic Medical College & Hospital", "location" : [28.586489, 77.168409]},
    { "name" : "Burari Hospital", "location" : [28.761783, 77.190012]},
    { "name" : "Deen Dayal Upadhyay Hospital", "location":[28.628045, 77.112376]},
    { "name" : "Deep Chand Bandhu Hospital", "location":[28.681641, 77.177846]},
    { "name" : "Dr. Baba Saheb Ambedkar Hospital", "location":[28.715217, 77.113433]},
    { "name" : "Dr. Hedgewar Arogya Sansthan", "location" : [28.655972, 77.293182]},
    { "name" : "Dr. N.C. Joshi Memorial Hospital", "location" : [28.653396, 77.199367]},
    { "name" : "G.B. Pant Hospital (GIPMER)", "location" : [28.639433, 77.234471]},
    { "name" : "Guru Govind Singh Govt. Hospital", "location" : [28.653945, 77.107224]},
    { "name" : "Guru Nanak Eye Center", "location" : [28.638589, 77.232706]},
    {"name" : "Guru Teg Bahadur Hospital (GTBH)", "location" : [28.684266, 77.309423]},
    { "name" : "Indira Gandhi Hospital", "location" : [28.580471, 77.061267]},
    {"name" : "Jag Pravesh Chandra Hospital", "location" : [28.676323, 77.263350]},
    {"name" : "Lal Bahadur Shastri Hospital", "location" : [28.618061, 77.311667]},
    { "name" : "Lok Nayak Hospital", "location" : [28.639004, 77.238277]},
    { "name": "Maharishi Valmiki Hospital", "location" : [28.775981, 77.048546]},
    { "name": "	Nehru Homeopathic Medical College and Hospital", "location" : [28.571299, 77.228891]},
    { "name" : "Pt. Madan Mohan Malviya Hospital", "location" : [28.535392, 77.213586]},
    { "name" : "Rao Tula Ram Memorial Hospital", "location" : [28.5948094, 76.9141060]}, 
    { "name" : "Sardar Vallabh Bhai Patel Hospital", "location" : [28.647038, 77.168926]}, 
    { "name" : "Satyawadi Raja Harish Chandra Hospital", "location" : [28.840724, 77.103659]}, 
    { "name" : "Sanjay Gandhi Memorial Hospital", "location" : [28.694498, 77.081821]},
    { "name" : "Shri Dada Dev Matri Avum Shishu Chikitsalaya", "location": [28.609629, 77.082477]}
];

// Loop through the array and add a marker for each hospital in Delhi
hospitals.forEach(function(hospital) {
    L.marker(hospital.location)
        .addTo(map)
        .bindPopup(`<b>${hospital.name}</b>`)
        .on('click', function() {
            if (userLocation) {
                const hospitalLocation = L.latLng(hospital.location[0], hospital.location[1]);
                const distance = userLocation.distanceTo(hospitalLocation) / 1000; // Convert to kilometers
                document.getElementById('hospital-name').textContent = `Hospital: ${hospital.name}`;
                document.getElementById('hospital-distance').textContent = `Distance: ${distance.toFixed(2)} KM`;
            } else {    
                alert('User location is not available.');
            }
        });
});

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    // Center the map on the user's location
    map.setView([latitude, longitude], 16);

    // Convert user location to Leaflet LatLng object
    const userLocation = L.latLng(latitude, longitude);

    // Find the nearest hospital
    let minDistance = Infinity;
    let nearestHospital = null;

    hospitals.forEach(hospital => {
        const hospitalLocation = L.latLng(hospital.location[0], hospital.location[1]);
        const distance = userLocation.distanceTo(hospitalLocation);

        if (distance < minDistance) {
            minDistance = distance/1000;
            nearestHospital = hospital;
        }
    });

    // Display the nearest hospital and distance on the screen
    if (nearestHospital) {
        document.getElementById('hospital-name').textContent = `Hospital: ${nearestHospital.name}`;
        document.getElementById('hospital-distance').textContent = `Distance: ${minDistance.toFixed(2)} KM`;
    }

    // If a marker for this user already exists, update its location
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Otherwise, create a new marker for this user
        markers[id] = L.marker([latitude, longitude]).addTo(map).bindPopup(`<b>You Are Here</b>`);
    }
});

// Handle user disconnection (optional)
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
