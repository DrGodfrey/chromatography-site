//__________________________________
`          Class Notation          `
//__________________________________

class RabbitClass {
    constructor (type) { // method named constructor is special => constructor function!
        this.type = type;
    }
    // other methods packaged into constructor's prototype (property)
    speak(line) {
        console.log(`The ${this.type} rabbit says '${line}'`);
    }
    // currently, only methods can be added to prototype
}

let killerRabbit = new RabbitClass("killer");
let blackRabbit = new RabbitClass ("black");

// can also write as:
let object = new class {getWord() {return "hello";} };
console.log(object.getWord());

//----------------------------------------------------------------

function printSolvents(text, parentId="solventOutput", indent=false) {
    let parent = document.getElementById(parentId);
    let newDiv = document.createElement("div");
    newDiv.innerHTML = text;
    newDiv.setAttribute("id", "generatedOutput");
    newDiv.setAttribute("class", "container child");
    if (indent) newDiv.setAttribute("class", "indented container child")
    parent.appendChild(newDiv);
}

let solventsSolvatochromicParameters = {
    source: {"Solvatochromic Parameters": "A. de Juan, G. Fonrodona, E. Casassas, pg 52, trends in analytical chemistry, vol. 1, no. 1, 1997", isSolvent: false},
    description: {"Solvatochromic Parameters": "'α, β, and π* are assumed to represent the hydrogen-bond acidity, hydrogen-bond basicity and polarity-polarizability [of the solvent] respectively' (Juan et. al 1997)", isSolvent: false},
    "diisopropyl ether": {α: 0, β: 0.49, "π*": 0.27},
    "di-n-butyl ether": {α: 0, β: 0.46, "π*": 0.24},
    "diethyl ether": {α: 0, β: 0.47, "π*": 0.27},
    "dioxane": {α: 0, β: 0.37, "π*": 0.55},
    "tetrahydrofuran": {α: 0, β: 0.55, "π*": 0.58},
    "anisole": {α: 0, β: 0.22, "π*": 0.73},
    "dibenzyl ether": {α: 0, β: 0.41, "π*": 0.80},
    //------------------------------
    // some solvents omitted

    "acetone": {α: 0.08, β: 0.48, "π*": 0.71},
    "ethyl acetate": {α: 0, β: 0.45, "π*": 0.55},
    "dimethyl formamide": {α: 0, β: 0.69, "π*": 0.88},
    "triethylamine": {α: 0, β: 0.71, "π*": 0.14},
    "dimethyl sulfoxide": {α: 0, β: 0.76, "π*": 1.00},
    "acetonitrile": {α: 0.19, β: 0.31, "π*": 0.75},
    "toluene": {α: 0, β: 0.11, "π*": 0.54},
    "benzene": {α: 0, β: 0.10, "π*": 0.59},
    "chlorobenzene": {α: 0, β: 0.07, "π*": 0.71},
    "1,2-dichloroethane": {α: 0, β: 0, "π*": 0.81},
    "dichloromethane": {α: 0.30, β: 0, "π*": 0.82},
    "chloroform": {α: 0.44, β: 0, "π*": 0.58},
    "isopropanol": {α: 0.76, β: 0.95, "π*": 0.48},
    "ethanol": {α: 0.83, β: 0.77, "π*": 0.54},
    "methanol": {α: 0.93, β: 0.62, "π*": 0.60},
    "water": {α: 1.17, β: 0.18, "π*": 1.09},
}

let solventsEleuotropicValues = {
    source: {"Eleuotropic Values": "V. Barwick, Trends in analytical chemistry, pg. 293 vol. 16, no. 6, 1997", isSolvent: false},
    description: {"Eluotropic values": "(ε°) on silica", isSolvent: false},
    "acetone": {"ε°": 0.53},
    "acetonitrile": {"ε°": 0.52},
    "chloroform": {"ε°": 0.26},
    "ethyl acetate": {"ε°": 0.48},
    "ethyl ether": {"ε°": 0.43},
    "heptane": {"ε°": 0},
    "hexane": {"ε°": 0},
    "isopropanol": {"ε°": 0.6},
    "methanol": {"ε°": 0.7},
    "dichloromethane": {"ε°": 0.30},
    "pentane": {"ε°": 0},
    "tetrahydrofuran": {"ε°": 0.53},    
}

let solventsHildebrandSolubilityParameters = {
    source: {"Hildebrand Solubility Parameters": "V. Barwick, Trends in analytical chemistry, pg. 293 vol. 16, no. 6, 1997", isSolvent: false},
    description: {"Hildebrand Solubility Parameter": "δ: acts as a useful measure for maximising solubility 'solute solubility is at a maximum when the solute and solvent have the same δ value. Two solvents who's δ values are higher and lower than taht of a given solute can be blended to give a mixture with a δ value equal to that of the solute, thus maximising solute solubility' (Barwick, 1997)", isSolvent: false},
    // placeholder values below: "ε°"
    "acetone": {"δ": 9.6},
    "acetonitrile": {"δ": 12.1},
    "chloroform": {"δ": 9.3},
    "ethyl acetate": {"δ": 8.9},
    "ethyl ether": {"δ": 7.5},
    "heptane": {"δ": 8},
    "hexane": {"δ": 8},
    "isopropanol": {"δ": 11.4},
    "methanol": {"δ": 14.5},
    "dichloromethane": {"δ": 9.6},
    "pentane": {"δ": 8},
    "tetrahydrofuran": {"δ": 9.1},
    "dimethyl sulfoxide": {"δ": 12.0},
    "water": {"δ": 23.4}       
}


let mergedObjectTest = {
    ...solventsEleuotropicValues,
    ...solventsSolvatochromicParameters
}

function mergeObjects (object1, object2) {
    let newObject = {}
    for (key in object1) {
        newObject[key] = {
            ...object1[key],
            ...object2[key]
        }

        
        // console.log(key, object1[key], object2.key, newObject)
    };
    for (key in object2) {
        newObject[key] = {
            ...object1[key],
            ...object2[key]
        }
    };
    return newObject;
}

// combines all data into a single object!
let solventSuperLibrary = mergeObjects(mergeObjects(solventsEleuotropicValues, solventsSolvatochromicParameters), solventsHildebrandSolubilityParameters)

function outputData (solventObject) {
    for (solvent in solventObject) {
        // console.log(solvent);
        if (solventObject[solvent].isSolvent === false) console.log(solvent, "isn't a solvent")
        else {
            let newString = "";
            if (typeof solventObject[solvent].δ == "number"){
                printSolvents(
                    "<b>" + solvent + "</b>"
                    + "<br>δ = " + solventObject[solvent].δ
                    + "<br>ε° = " + solventObject[solvent]["ε°"]
                    + "<br>α = " + solventObject[solvent]["α"]
                    + "<br>β = " + solventObject[solvent]["β"]
                    + "<br>π* = " + solventObject[solvent]["π*"]
                    );
            }
            
        }
    }
}

function importHtml(text, parentId) {
    let parent = document.getElementById(parentId);
    parent.innerHTML += `
    ` + text;
}

function loadSolventOptions (solventLibrary=solventSuperLibrary, parentId) {
    for (solventName in solventLibrary) {
        if (solventLibrary[solventName].isSolvent !== false) {
            let htmlText = `<option value="${solventName}">${solventName}</option>`;
            console.log(htmlText);
            importHtml (htmlText, parentId);
        };
        
    }
}


outputData(solventSuperLibrary);
loadSolventOptions (solventSuperLibrary, "solventSelection");
importHtml ("<p>test text></p>","solventSelection");
