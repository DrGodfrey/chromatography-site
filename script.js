//---------------------------------------//
//    Chromatographic column planning     //
//---------------------------------------//

// inputs:
let massOfSampleGrams = document.getElementById("massOfSampleGrams").value;
let timesSilica = document.getElementById("timesSilica").value;
let rf = document.getElementById("rf").value;
let silicaDensity = document.getElementById("silicaDensity").value;

// run main function - runs on-loading to show an example column
columnSize (massOfSampleGrams, timesSilica, rf);

// onClickFunction() is called when user presses run

function columnSize (massOfSampleGrams, timesSilica, rf) {
    silicaMass = massOfSampleGrams * timesSilica;
    volumeOfSilica = silicaMass / silicaDensity;
    columnVolume = volumeOfSilica * 0.8; 
    // note: column volume = dead space in column, apparently appx 70-80% of silica

    eluteColumnVolume=1/rf;
    eluteVolume=eluteColumnVolume * columnVolume;
    eluteUnit = "mL";
    numberFractions =0.6*(13 + 75*rf**2 + 7*rf); // should convert to integer
    fractionVolume = eluteVolume/numberFractions;

    // outputs main values to first div
    print(`<nobr><strong>Mass of silica</strong>${spacer(35)}~ ${silicaMass} grams</nobr>
    <nobr><strong>Volume of silica</strong>${spacer(29)}~ ${Math.round(volumeOfSilica)} mL of silica</nobr>
    <nobr><strong>Suggested fraction volume</strong>${spacer(4)}~ ${Math.round(fractionVolume)} mL</nobr>`);

    let radius = 0.5;
    let option = 1;

    for (let i = 0; i <= 14; i++) {
        // cycles through the range of column radiuses, if the columnHeight() function confirms the height is reasonable and calls the print() function, the 'if' statement updates the option number
        if (columnHeight(radius, volumeOfSilica, option)) option ++;
        radius = radius + 0.5;
    }


    if (eluteVolume > 1000) {
        // Checks which units are appropriate & formats elution volume
        eluteUnit = "L";
        eluteVolume = (eluteVolume / 1000).toPrecision(2);
    };

    // outputs last values to final div
    print(`
    <b>As a <u><em>very</em></u> rough guideline</b><br>
    You might expect your sample to elute somewhere on the order of fraction ${Math.round(numberFractions)}<br>
    Which corresponds to a very approximate elution volume of around ~${Math.round(eluteVolume)} ${eluteUnit}`);
}

function columnHeight (radius, columnVolume, option=1) {
    let height = columnVolume / 
                 (Math.PI * radius ** 2);
    diameter = 2 * radius;
    if (6 < height && height < 25) {
        print(`<b>Option ${option}:</b>Column diameter${spacer(9)}&#8960; = ${diameter} cm<br>
        Silica height${spacer(22)}h = ${Math.round(height)} cm<br>`, true)
        return true;
    } else {
        return false;
    }

}

function print(text, indent=false) {
    // print function: adds the "text" in a new div as a child of the "output" div
    let parentId = "output";
    let parent = document.getElementById(parentId);
    let newDiv = document.createElement("div");
    newDiv.innerHTML = text;
    newDiv.setAttribute("class", "container child");
    if (indent) newDiv.setAttribute("class", "indented container child")
    parent.appendChild(newDiv);
}


// runs when user presses "run"
function onClickFunction() {    
    // clears old output:
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    // changes title to Your Column
    let yourColumnTitle = document.getElementById("yourColumnTitle");
    yourColumnTitle.innerHTML = "Your Column";

    // resets input values to current values of page
    massOfSampleGrams = document.getElementById("massOfSampleGrams").value;
    timesSilica = document.getElementById("timesSilica").value;
    rf = document.getElementById("rf").value;
    silicaDensity = document.getElementById("silicaDensity").value; // will include option to adjust this

    // runs main function:
    columnSize (massOfSampleGrams, timesSilica, rf);
}

// used to format text
function spacer(n) {
    spacerString = ""
    for (let i=0; i <= n; i++) {
        spacerString += "&nbsp;"
    }
    return spacerString;
}
