
/*
 Aufgabe:
 Berechnen des CosPhi der drei Phasen eines Drehstroms-AnschLusses. Die Geräte sind dabei wir foLgt auf die Phasen verteiLt:
 L1: Moving-Head + Amp + Moving-Head
 L2: Pult + Amp
 L3: Amp + Amp + Amp
 
WirkLeistung - P [W]
BLindLeistung - Q [VAr]
ScheinLeistung - S [VA]

 Dabei ist bei den Geräten "Moving-Head" und "Amp" nur der CosPhi und die WirkLeistung gegeben. Das Gerät "Pult" hat die ScheinLeistung gegeben.
 */



//Objekt mit den Geräten und ihren Attributen. Es muss immer mindestens zwei Attribute enthalten. Typischerweise sind dies Wirkleistung mit cosPhi. 
const devices = {
    "Moving-Head":{
        p:100,
        cosphi: 1,
    },
    "Amp":{
        p:100,
        cosphi:1,
    },
    "Pult":{
        s:150,
        cosphi:1,
    },
    "Test":{
        q:150,
        s:150,
    }

}


/**
 * Berechnet den cosPhi mit den angegebenen werten.
 * @param {number} p Wirkleistung
 * @param {number} s Scheinleistung
 * @returns {number} cosPhi 0 <= cosPhi <= 1
 */
function calcCosPhi(p, s){
    return p / s;
}

/**
 * Berechnet den Betrag der Wirkleistung
 * @param {number} s Scheinleistung
 * @param {number} phi Phasenverschiebungswinkel Phi 0 <= phi <= 90
 * @returns {number} Wirkleistung
 */
function calcP(s, phi){
    return Math.abs(s * Math.cos(phi));
}

/**
 * Berechnet die Blindleistung
 * @param {number} p Wirkleistung
 * @param {number} phi Phasenverschiebungswinkel Phi 0 <= phi <= 90
 * @returns {number} Blindleistung
 */
function calcQ(p, phi){
    return p * Math.tan(phi);
}

/**
 * Berechnet die Scheinleistung
 * @param {number} q Blindleistung
 * @param {number} p Wirkleistung
 * @returns {number} Scheinleistung
 */
function calcS(q, p){
    return Math.sqrt(q*q + p*p);
}

/**
 * Alternativmethode um die Scheinleistung zu berechnen.
 * @param {number} q Blindleistung
 * @param {number} phi Phasenverschiebungswinkel Phi 0 <= phi <= 90
 * @returns {number} Scheinleistung
 */
function calcSPhi(q, phi){
    return q / Math.abs(Math.sin(phi));
}

/**
 * Berechnet die Stromstärke anhand der Scheinleistung.
 * @param {number} s Scheinleistung
 * @returns {number} Stromstärke
 */
function calcI(s){
    return s / 230;
}

/**
 * Berechnet den Phasenverschiebungswinkel mit dem cosPhi Wert
 * @param {number} cosPhi cosPhi - 0 <= cosPhi <= 1
 * @returns {number} Phasenverschiebungswinkel phi
 */
function calcPhi(cosPhi){
    return Math.acos(cosPhi) * (180/Math.PI);
}

/**
 * Berechnet alle Werte eines Device-Objektes anhand der vorhandenen Werte.
 * @param {device} device Device-Objekt mit mindestens der cosPhi Angabe und einer der Werte von Wirkleistung (p), Scheinleistung (s) und Blindleistung (q).
 */
function calcAllValues(device){

    if(device.p != null && device.cosphi != null){
        device.phi = calcPhi(device.cosphi);
        device.q = calcQ(device.p, device.phi);
        device.s = calcS(device.q, device.p);

    } else if(device.s != null && device.cosphi != null){
        device.phi = calcPhi(device.cosphi);
        device.p = calcP(device.s, device.phi);
        device.q = calcQ(device.p, device.phi)

    } else if(device.q != null && device.cosphi != null){
        
        if(device.cosphi == 1){
            throw "Das Gerät ist fehlerhaft! Der CosPhi kann nicht '1' sein, wenn die BLindLeistung nicht '0' ist.";
        }

        device.phi = calcPhi(device.cosphi);
        device.s = calcSPhi(device.q, device.phi);
        device.p = calcP(device.s, device.phi);

    } else if(device.q != null && device.s != null){

        device.phi = Math.sin(device.q / device.s) * (180/Math.PI);
        device.cosphi = Math.abs(Math.cos(device.phi));
        device.p = calcP(device.s, device.phi);
    } else {
        throw "Das Gerät ist fehlerhaft! Es muss mindestens der cosPhi und einer der Werte von Wirkleistung (p), Scheinleistung (s) und Blindleistung (q) angegeben sein.";
    }
    
    console.log(device);
}

function calcNeutralI(pS){

    return (
        Math.sqrt(
            Math.pow( (pS.i_L1 * Math.sin(pS.phi_L1 * (Math.PI / 180))) + (pS.i_L2 * Math.cos((30 + pS.phi_L2) * (Math.PI / 180))) - (pS.i_L3 * Math.cos((30 - pS.phi_L3) * (Math.PI / 180))) , 2) + 
            Math.pow( (pS.i_L1 * Math.cos(pS.phi_L1* (Math.PI / 180))) - (pS.i_L2 * Math.sin((30 + pS.phi_L2) * (Math.PI / 180))) - (pS.i_L3 * Math.sin((30 - pS.phi_L3) * (Math.PI / 180))) , 2)
        )
    );


}

function getPowerSourceValues(deviceDistribution){
const powerSource = {};

//Anlegen der Werte von Blind- und Wirkleistung für die Phase L1
powerSource.p_L1 = 0;
powerSource.q_L1 = 0;
//Aufsummieren der Werte der einzelenen Geräte auf der Phase L1
deviceDistribution.L1.forEach(device => {
    powerSource.p_L1 = powerSource.p_L1 + devices[device].p;
    powerSource.q_L1 = powerSource.q_L1 + devices[device].q;
});


//Anlegen der Werte von Blind- und Wirkleistung für die Phase L1
powerSource.p_L2 = 0;
powerSource.q_L2 = 0;
//Aufsummieren der Werte der einzelenen Geräte auf der Phase L1
deviceDistribution.L2.forEach(device => {
    powerSource.p_L2 = powerSource.p_L2 + devices[device].p;
    powerSource.q_L2 = powerSource.q_L2 + devices[device].q;
});

//Anlegen der Werte von Blind- und Wirkleistung für die Phase L1
powerSource.p_L3 = 0;
powerSource.q_L3 = 0;
//Aufsummieren der Werte der einzelenen Geräte auf der Phase L1
deviceDistribution.L3.forEach(device => {
    powerSource.p_L3 = powerSource.p_L3 + devices[device].p;
    powerSource.q_L3 = powerSource.q_L3 + devices[device].q;
});

//Berechnen der Scheinleistung der einzelnen Phasen
powerSource.s_L1 = calcS(powerSource.q_L1, powerSource.p_L1);
powerSource.s_L2 = calcS(powerSource.q_L2, powerSource.p_L2);
powerSource.s_L3 = calcS(powerSource.q_L3, powerSource.p_L3);

//Berechnen des cosPhi der einzelnen Phasen
powerSource.cosPhi_L1 = calcCosPhi(powerSource.p_L1, powerSource.s_L1);
powerSource.cosPhi_L2 = calcCosPhi(powerSource.p_L2, powerSource.s_L2);
powerSource.cosPhi_L3 = calcCosPhi(powerSource.p_L3, powerSource.s_L3);

//Berechnen des Phasenverschiebungswinkels für die einzelnen Phasen
powerSource.phi_L1 = calcPhi(powerSource.cosPhi_L1);
powerSource.phi_L2 = calcPhi(powerSource.cosPhi_L2);
powerSource.phi_L3 = calcPhi(powerSource.cosPhi_L3);

//Berechnen der Stromstärke der einzelnen Phasen
powerSource.i_L1 = calcI(powerSource.s_L1);
powerSource.i_L2 = calcI(powerSource.s_L2);
powerSource.i_L3 = calcI(powerSource.s_L3);

//Berechnen des Neutralleiterstroms
powerSource.neutraLI = calcNeutralI(powerSource);
return powerSource;
}

//Array der Geräte die auf den einzelnen Phasen liegen.
const L1 = ["Moving-Head", "Amp", "Moving-Head"];
const L2 = ["Pult", "Amp"];
const L3 = ["Amp", "Amp", "Amp"];

/* const L1 = ["Moving-Head", "Amp", "Moving-Head"];
const L2 = ["Moving-Head", "Amp", "Moving-Head"];
const L3 = ["Moving-Head", "Amp", "Moving-Head"]; */

//Berechnet alle Werte der Geräte, um sicherzustellen, dass alle Werte vorhanden sind.
calcAllValues(devices["Moving-Head"]);
calcAllValues(devices["Pult"]);
calcAllValues(devices["Amp"]);
calcAllValues(devices["Test"]);

//Objekt um die Werte der Stromquelle zu halten.
const powerSource = {};

//Anlegen der Werte von Blind- und Wirkleistung für die Phase L1
powerSource.p_L1 = 0;
powerSource.q_L1 = 0;
//Aufsummieren der Werte der einzelenen Geräte auf der Phase L1
L1.forEach(device => {
    powerSource.p_L1 = powerSource.p_L1 + devices[device].p;
    powerSource.q_L1 = powerSource.q_L1 + devices[device].q;
});


//Anlegen der Werte von Blind- und Wirkleistung für die Phase L1
powerSource.p_L2 = 0;
powerSource.q_L2 = 0;
//Aufsummieren der Werte der einzelenen Geräte auf der Phase L1
L2.forEach(device => {
    powerSource.p_L2 = powerSource.p_L2 + devices[device].p;
    powerSource.q_L2 = powerSource.q_L2 + devices[device].q;
});

//Anlegen der Werte von Blind- und Wirkleistung für die Phase L1
powerSource.p_L3 = 0;
powerSource.q_L3 = 0;
//Aufsummieren der Werte der einzelenen Geräte auf der Phase L1
L3.forEach(device => {
    powerSource.p_L3 = powerSource.p_L3 + devices[device].p;
    powerSource.q_L3 = powerSource.q_L3 + devices[device].q;
});

//Berechnen der Scheinleistung der einzelnen Phasen
powerSource.s_L1 = calcS(powerSource.q_L1, powerSource.p_L1);
powerSource.s_L2 = calcS(powerSource.q_L2, powerSource.p_L2);
powerSource.s_L3 = calcS(powerSource.q_L3, powerSource.p_L3);

//Berechnen des cosPhi der einzelnen Phasen
powerSource.cosPhi_L1 = calcCosPhi(powerSource.p_L1, powerSource.s_L1);
powerSource.cosPhi_L2 = calcCosPhi(powerSource.p_L2, powerSource.s_L2);
powerSource.cosPhi_L3 = calcCosPhi(powerSource.p_L3, powerSource.s_L3);

//Berechnen des Phasenverschiebungswinkels für die einzelnen Phasen
powerSource.phi_L1 = calcPhi(powerSource.cosPhi_L1);
powerSource.phi_L2 = calcPhi(powerSource.cosPhi_L2);
powerSource.phi_L3 = calcPhi(powerSource.cosPhi_L3);

//Berechnen der Stromstärke der einzelnen Phasen
powerSource.i_L1 = calcI(powerSource.s_L1);
powerSource.i_L2 = calcI(powerSource.s_L2);
powerSource.i_L3 = calcI(powerSource.s_L3);

//Berechnen des Neutralleiterstroms
powerSource.neutraLI = calcNeutralI(powerSource);

console.log(powerSource);


const deviceDistributon = {
L1: ["Moving-Head", "Amp", "Moving-Head"],
L2: ["Pult", "Amp"],
L3: ["Amp", "Amp", "Amp"]
}
console.log(getPowerSourceValues(deviceDistribution));