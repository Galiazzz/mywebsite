

function LoadStuff() {

}
function DisplayScratchPaper() {
    document.getElementById("scratchPaper").style.display = "block";
}
function CloseScratchPaper() {
    document.getElementById("scratchPaper").style.display = "none";
}

function CalcRoot() {
    var base = document.getElementById("rootBase").value;
    var amount = document.getElementById("rootAmount").value;
    var trueAmound = 1 / amount;
    document.getElementById("rootOutput").value = Math.pow(base, trueAmound);
}

function SineStuff(){
    var answer = null;
    if(document.getElementById("sin").value != ""){
        answer = Math.sin(document.getElementById("sin").value);
    }
    else if(document.getElementById("cos").value != ""){
        answer = Math.cos(document.getElementById("cos").value);
    }
    else if(document.getElementById("tan").value != ""){
        answer = Math.tan(document.getElementById("tan").value);
    }
    document.getElementById("SineStuffOutput").value = answer;
}

function CalcEx(){
    var base = document.getElementById("powerBase").value;
    var exponant = document.getElementById("powerExponant").value;
    document.getElementById("powerOutput").value = Math.pow(base, exponant);
}

function Random(type){
    if(type == "basic"){
        document.getElementById("randBasicOutput").value = Math.random();
    }
    else if(type == "deci"){
        var base = document.getElementById("randDiciBase").value;
        var mult = document.getElementById("randDeciMult").value;
        document.getElementById("randDeciOutput").value = (Math.random() * mult )+ base;
    }
    else if(type == "int"){
        var base = document.getElementById("randIntBase").value;
        var mult = document.getElementById("randIntMult").value;
        document.getElementById("randIntOutput").value = Math.floor((Math.random() * mult) + base);
    }
}