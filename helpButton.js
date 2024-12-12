function helpButton(contentID) {
    // function to toggle help text between visible and hidden
    helpContent = document.getElementById(contentID)
    if (helpContent.className === "help visible") {
        helpContent.className = "help";
    } else {
        helpContent.setAttribute("class", "help visible");
    }
}