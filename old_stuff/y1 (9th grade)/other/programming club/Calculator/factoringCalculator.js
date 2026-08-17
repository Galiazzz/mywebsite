

function LoadStuff() {
    document.getElementById("scatchPaper").style.display = "none";
}
function DisplayScratchPaper() {
    document.getElementById("scatchPaper").style.display = "inline";
}
function CloseScratchPaper() {
    document.getElementById("scatchPaper").style.display = "none";
}

function Factor(number) {
    for(i = 1; i <= Math.sqrt(number); i++){
        if(number / i == Math.trunc(number/ i)){
            document.getElementById("numberArea").innerHTML += "<div>" + i + "," + number / i + "</div>";
        }
    }
}
function Clear() {
    document.getElementById("numberArea").innerHTML = "";
}