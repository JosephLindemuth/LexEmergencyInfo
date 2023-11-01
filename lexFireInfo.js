emergencyCodes = {
    "FAA1": "Aircraft Alert 1",
    "FAA2": "Aircraft Alert 2",
    "FAA3": "Aircraft Alert 3",
    "FASB": "AIRCRAFT STANDBY BLUEGRASS STATION",
    "FASB": "Aircraft Standby Bluegrass Station",
    "FASS": "Assistance",
    "FBAS": "Barricaded Subject",
    "FBOT": "Bomb Threat",
    "FBWD": "Bomb Threat with a Device",
    "FBGL": "Brush/Grass/Leaf/Tree Fire",
    "FBERTR": "BERT - Rescue",
    "FBERTH": "BERT - Hazmat - Notify Shift Comndr B4 Dispatch",
    "FCMS": "Carbon Monoxide Sickness",
    "FCAR": "Carbon Monoxide Situation",
    "FCHI": "Chimney Fire",
    "FCOL": "Collapse Rescue",
    "FCSEPP": "Community Emergency - Bluegrass Army Depot",
    "FCSR": "Confined Space Rescue",
    "FDVR": "Dive Rescue Response",
    "FDUM": "Dumpster Fire",
    "FELC": "Electrical Cutoff",
    "FELF": "Electrical Fire",
    "FELS": "Elevator Situation",
    "FEXP": "Explosion",
    "FFIA": "Fire in an Appliance",
    "FDET": "Fire Detail",
    "FFHMR": "Full Hazmat Response",
    "FGAC": "Gas Cutoff",
    "FGAS": "Gasoline/Fuel Leak",
    "FHMC": "Hazardous Material",
    "FSCU": "Hazmat - MVC General Spill Clean",
    "FHCL": "Hazmat - Clandestine Lab",
    "FMERC": "Hazmat - Mercury Spill",
    "FHGEO": "Hazmat - Natural Gas from Geothermal/Water Well",
    "FINV": "Investigation",
    "FLAR": "Large Animal Rescue",
    "FLIFT": "Lift Assist",
    "FLOI": "Lock In / Lock Out",
    "FMAI": "Mailbox Fire",
    "FMDR": "Mass Decon Response - UK Commonwealth Stadium",
    "FMIS": "Missing Person",
    "FNGL": "Natural Gas Leak (Natural Gas & Propane)",
    "FOTF": "Other Fire",
    "FOTS": "Other Service",
    "FPRT": "Private / Telephone Fire Alarm",
    "FSMO": "Smoke in the Area / Strucutre / Odor",
    "FGAO": "Natural Gas Odor (Natural Gas or Propane)",
    "FK9R": "Out of County Investigation K-9 Response",
    "FPLB": "Reduced Response (Plan B)",
    "FWAR": "Remove Water",
    "FROP": "Rope/High Angle Rescue",
    "FSIA": "Smoke in the Area - Outdoors",
    "FSMO": "Smoke in Area / Structure / Odor",
    "FSRCU": "Special Rescue Related to Civil Unrest",
    "FSTR": "Structure Fire",
    "FSTRW": "Structure Fire - Working",
    "FTRA": "Train Accident",
    "FTRN": "Transformer Fire",
    "FTRS": "Trash Fire",
    "FTRE": "Trench Rescue",
    "FUNT": "Unknown Trouble",
    "FVIS": "Vehicle in a Structure",
    "FVAJ": "Vechicle Accident with Jaws",
    "FVEH": "Vehicle Fire",
    "FVNS": "Vehicle Fire Near a Structure",
    "FVLA": "Vehicle Fire Large Vehicle",
    "FWAC": "Water Cutoff",
    "FWTR": "Water Rescue",
    "MED": "Medical Response"
}

emergencyWebAddress = "https://fire.lexingtonky.gov/open/status/status.htm"
api_url = `https://cors-anywhere-proxy-urri.onrender.com/${emergencyWebAddress}`
// api_url = "https://joseph.free.beeceptor.com/fire"


// The good method
// Get data from emergency web address through proxy server and store it in lexData
lexData = null
var req = new XMLHttpRequest(); 
req.open('GET', api_url, false);  
// req.responseType = "document" //wanted to try getting actual HTML from request but site only works synchronously
req.send();  
if(req.status == 200) {  
    console.log("web request succeeded")
    lexData = req.responseText
} else {
    console.log("fire.lexington.gov request failed")
}

// Take HTML from https://fire.lexingtonky.gov/open/status/status.htm and parse it into the actual data that site displays
// Returns an array of the rows of data
function parseHtmltoData(data) {
    dataArray = [];
    dataPoints = data.getElementsByClassName("data");

    for(var i = 0; i < dataPoints.length; i++) {

        dataEntry = {
            incident: "",
            type: "",
            alarm: "",
            enroute: "",
            arrive: "",
            address: "",
            apparatusAssigned: [],
        }

        dataPoint = dataPoints[i];

        dataEntry.incident = dataPoint.getElementsByClassName("incident")[0].textContent;
        dataEntry.type = dataPoint.getElementsByClassName("type")[0].textContent;
        dataEntry.alarm = dataPoint.getElementsByClassName("alarm")[0].textContent;
        dataEntry.enroute = dataPoint.getElementsByClassName("enroute")[0].textContent;
        dataEntry.arrive = dataPoint.getElementsByClassName("arrive")[0].textContent;
        dataEntry.address = dataPoint.getElementsByClassName("address")[0].textContent;

        apparatus = dataPoint.getElementsByClassName("appdata")[0].getElementsByClassName("databox");
        for(var j = 0; j < apparatus.length; j++) {
            dataEntry.apparatusAssigned.push({"apparatus": apparatus[j].textContent, "status": apparatus[j].classList[2]});
        }

        dataArray.push(dataEntry);
    }

    // console.log(dataArray);
    return(dataArray);

}

// Insert data rows into the DOM
function populateData(data) {
    insertDiv = document.getElementById("inserter");

    for (var i = 0; i < data.length; i++) {
        insertDiv.innerHTML += `<div' class='data num${i}'></div>`;
        dataEntry = data[i]

        activeRow = insertDiv.children[i];
        activeRow.innerHTML += `<div class="databox incident">${dataEntry.incident}</div>`;
        activeRow.innerHTML += `<div class="databox type">${emergencyCodes[dataEntry.type]}</div>`;
        activeRow.innerHTML += `<div class="databox alarm">${dataEntry.alarm}</div>`;
        activeRow.innerHTML += `<div class="databox enroute">${dataEntry.enroute}</div>`;
        activeRow.innerHTML += `<div class="databox address">${dataEntry.address}</div>`;
        activeRow.innerHTML += `<div class="databox arrive">${dataEntry.arrive}</div>`;
        activeRow.innerHTML += `<div class="appdata"></div>`;

        apparatusColumn = activeRow.lastChild;
        apparatusAssigned = dataEntry.apparatusAssigned;
        for (var j = 0; j < apparatusAssigned.length; j++) {
            specificApparatus = apparatusAssigned[j];
            apparatus = specificApparatus.apparatus;
            appStatus = specificApparatus.status;
            apparatusColumn.innerHTML += `<div class="databox vehicle ${appStatus}">${apparatus}</div>`;
        }

        activeRow.innerHTML += `<p class="mapButton"><button onclick="showHideMap(${i})">Toggle Map</button></p class="mapButton">`
        activeRow.innerHTML += `<iframe id="map${i}" style="display: none" src='https://maps.google.com/maps?&amp;q=${dataEntry.address}&amp;t=k&amp;output=embed' width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`

        // <div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=k&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.maps.ie/population/">Population calculator map</a></iframe></div>
        // <div style="width: 100%"><iframe width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.maps.ie/population/">Population mapping</a></iframe></div>
    }
}

// Function to toggle map
function showHideMap(index) {
    var mapElement = document.getElementById("map" + index);
    if (mapElement.style.display === "none") {
        mapElement.style.display = "block";
    } else {
        mapElement.style.display = "none";
    }
}

// Insert title and time data into the website header
function setHeaderInfo(data) {
    lines = data.getElementsByClassName("header")[0].innerHTML.split("<br>");
    document.getElementById("headerTitle").textContent = lines[0];
    document.getElementById("headerTime").textContent = lines[1];
    document.getElementById("headerCount").innerHTML = lines[2];
}

//Convert text response to HTML object
const parser = new DOMParser();
lexData = parser.parseFromString(lexData, 'text/html');

// Display info on page
headerInfo = setHeaderInfo(lexData);
dataArray = parseHtmltoData(lexData);
populateData(dataArray);