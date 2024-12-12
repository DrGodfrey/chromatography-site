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

    // updatees the graph
    update_graph()
}

// used to format text
function spacer(n) {
    spacerString = ""
    for (let i=0; i <= n; i++) {
        spacerString += "&nbsp;"
    }
    return spacerString;
}

// CODE for feedback form:
console.log('feedback form loaded')
emailjs.init('4_6bvvUpXKVW3eqXP');

// // initial test??
// document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
//     e.preventDefault();

//     try {
//         const result = await emailjs.send('service_3c54n2v', 'template_ou001x8', {
//             email: 'test@example.com',
//             message: 'This is a test message.',
//         });
//         console.log('Email sent:', result);
//         alert('Feedback sent successfully!');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         alert('Error: Unable to send feedback. Check console for details.');
//     }
// });


document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const statusElement = document.getElementById('feedbackStatus');

    try {
        // Send email using EmailJS
        const result = await emailjs.send('service_3c54n2v', 'template_ou001x8', {
            email,
            message,
        });

        console.log('Email sent:', result);
        statusElement.textContent = 'Feedback sent successfully. Thank you!';
        statusElement.style.color = 'green';
        document.getElementById('feedbackForm').reset();
    } catch (error) {
        console.error('Error sending email:', error);
        statusElement.textContent = 'Error: Unable to send feedback. Please try again later.';
        statusElement.style.color = 'red';
    }
});



// CHART using chart.js - https://www.chartjs.org/

// to track chart instance:
let chartInstance = null;

function update_graph(){
    const xValues = [];
    const yValues = [];

    // Generate Skewed Gaussian data
    const xMode = Math.round(numberFractions);      // PEAK (mode) value of distribution
    const stdDev = 3;     // Standard deviation
    const alpha = 5;      // Skewness parameter (>0: right-skewed, <0: left-skewed)

    var mean = calculateMean(xMode, stdDev, alpha);      // Mean of the distribution
    var locationParameter = approximateLocationParameter(xMode, stdDev, alpha);

    console.log("mean:", mean, "xMode:", xMode, "locationParameter:", locationParameter)
    mean = locationParameter


    const i1 = 0;         // Starting x value
    const i2 = 25;        // Ending x value
    const step = 0.1;     // Step size

    generateSkewedGaussian(mean, stdDev, alpha, i1, i2, step);

    if (chartInstance) {
        chartInstance.destroy();
    }

    console.log("xValues:", xValues);
    console.log("yValues:", yValues);

    chartInstance = new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: `Starts eluting ~${Math.round(eluteVolume)} ${eluteUnit}`,
                fill: true,
                backgroundColor: "rgba(0, 123, 255, 0.2)", // Shading color (semi-transparent)
                pointRadius: 1,
                borderColor: "rgba(0, 123, 255, 0.8)",
                data: yValues
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Skewed Gaussian Distribution",
                fontSize: 16
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    ticks: {
                        callback: function (value, index, values) {
                            const correspondingLabel = Math.round(xValues[index]);
                            return correspondingLabel === xMode ? "Fraction: " + correspondingLabel : ""; // Show label only at mean
                        }
                    }
                }
            }
        }
    });
}

// // Adding chart to visualise the elution of compound
Math.erf = Math.erf || function (x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
};

function calculateMean(xMode, stdDev, alpha) {
    var mean = xMode + stdDev * alpha / (1 + alpha ** 2);
    return mean;
    // delta = alpha / Math.sqrt(1 + alpha ** 2);
    // mean = xMode + (stdDev + delta)/(1 + delta ** 2);
    // return mean;
}

function approximateLocationParameter(xMode, stdDev, alpha) {
    // Calculate δ (delta)
    const delta = alpha / Math.sqrt(1 + alpha ** 2);
    
    // Approximate m_o(α) using the provided formula
    const sqrt2Pi = Math.sqrt(2 / Math.PI);
    const deltaSquared = delta ** 2;
    const moAlpha = sqrt2Pi * delta - (1 - Math.PI / 4) * ((sqrt2Pi * delta) ** 3) / (1 - (2 / Math.PI) * deltaSquared);
    
    // Calculate the location parameter ξ
    const locationParameter = xMode - stdDev * moAlpha;
    
    return locationParameter;
}

// Function to generate Skewed Gaussian data
function generateSkewedGaussian(mean, stdDev, alpha, i1, i2, step = 0.1) {
    for (let x = i1; x <= i2; x += step) {
        const gaussian = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) / (stdDev * Math.sqrt(2 * Math.PI));
        const skewFactor = 1 + Math.erf((alpha * (x - mean)) / (stdDev * Math.sqrt(2)));
        const skewedGaussian = gaussian * skewFactor;
        yValues.push(skewedGaussian);
        xValues.push(x);
    }
}

// // Example usage in Skewed Gaussian generation
// const xValues = [];
// const yValues = [];

// // Generate Skewed Gaussian data
// const xMode = Math.round(numberFractions);      // PEAK (mode) value of distribution
// const stdDev = 3;     // Standard deviation
// const alpha = 5;      // Skewness parameter (>0: right-skewed, <0: left-skewed)

// var mean = calculateMean(xMode, stdDev, alpha);      // Mean of the distribution
// var locationParameter = approximateLocationParameter(xMode, stdDev, alpha);

// console.log("mean:", mean, "xMode:", xMode, "locationParameter:", locationParameter)
// mean = locationParameter


// const i1 = 0;         // Starting x value
// const i2 = 25;        // Ending x value
// const step = 0.1;     // Step size

// generateSkewedGaussian(mean, stdDev, alpha, i1, i2, step);

// chartInstance = new Chart("myChart", {
//     type: "line",
//     data: {
//         labels: xValues,
//         datasets: [{
//             label: `Starts eluting ~${Math.round(eluteVolume)} ${eluteUnit}`,
//             fill: true,
//             backgroundColor: "rgba(0, 123, 255, 0.2)", // Shading color (semi-transparent)
//             pointRadius: 1,
//             borderColor: "rgba(0, 123, 255, 0.8)",
//             data: yValues
//         }]
//     },
//     options: {
//         legend: { display: false },
//         title: {
//             display: true,
//             text: "Skewed Gaussian Distribution",
//             fontSize: 16
//         },
//         scales: {
//             y: {
//                 display: false
//             },
//             x: {
//                 ticks: {
//                     callback: function (value, index, values) {
//                         const correspondingLabel = Math.round(xValues[index]);
//                         return correspondingLabel === xMode ? "Fraction: " + correspondingLabel : ""; // Show label only at mean
//                     }
//                 }
//             }
//         }
//     }
// });

