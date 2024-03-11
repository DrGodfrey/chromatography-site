//---------------------------------------//
//    Chromatographic column planning     //
//---------------------------------------//

const form = document.getElementById("form");

let massOfSampleGrams = document.getElementById("massOfSampleGrams").value;
let timesSilica = document.getElementById("timesSilica").value;
let rf = document.getElementById("rf").value;
let silicaDensity = document.getElementById("silicaDensity").value; // will include option to adjust this

let output = ""

// runs main function:
columnSize (massOfSampleGrams, timesSilica, rf);

document.getElementById("output").innerHTML = output;

function print(x) {
    output += x
    output += "<br>";
}

function columnHeight (radius, columnVolume) {
    let height = columnVolume / 
                 (Math.PI * radius ** 2);
    diameter = 2 * radius;
    if (6 < height && height < 25) {
        print(`FOR: column diameter ${diameter} cm<br>
        column height = ${Math.round(height)} cm<br>
        ----------------------------------------`)
    } else {
        return
    }

}

function columnSize (massOfSampleGrams, timesSilica, rf) {
    silicaMass = massOfSampleGrams * timesSilica;
    columnVolume = silicaMass / silicaDensity;

    print(`mass of silica ~ ${silicaMass} grams<br>
    'column volume' ~ ${Math.round(columnVolume)} mL of silica<br>
    ----------------------------------------`);

    let radius = 0.5;
    for (let i = 0; i <= 14; i++) {
        columnHeight(radius, columnVolume);
        radius = radius + 0.5;
    }

    eluteColumnVolume=1/rf;
    eluteVolume=eluteColumnVolume * columnVolume;
    eluteUnit = "mL";
    numberFractions =0.8*(13 + 75*rf**2 + 7*rf); // should convert to integer
    fractionVolume = eluteVolume/numberFractions;

    if (eluteVolume > 1000) {
        eluteUnit = "L";
        eluteVolume = (eluteVolume / 1000).toPrecision(2);
    };
    print(`Suggested:\n     fraction volume ~${Math.round(fractionVolume)} mL<br>
    fractions around which compound starts eluting, somewhere ~${Math.round(numberFractions)}<br>
    total volume around which compound starts eluting ~${Math.round(eluteVolume)} ${eluteUnit}`);
}
