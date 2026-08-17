document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "1":
            Add(1);
            break;
        case "2":
            Add(2);
            break;
        case "3":
            Add(3);
            break;
        case "4":
            Add(4);
            break;
        case "5":
            Add(5);
            break;
        case "6":
            Add(6);
            break;
        case "7":
            Add(7);
            break;
        case "8":
            Add(8);
            break;
        case "9":
            Add(9);
            break;
        case "0":
            Add(0);
            break;
        case "*":
            operation = "multiply";
            Operations("*");
            break;
        case "-":
            operation = "subtract";
            Operations("-");
            break;
        case "+":
            operation = "add"
            Operations("+");
            break;
        case "/":
            operation = "divide";
            Operations("/");
            break;
        case "Enter":
            event.preventDefault();
            Calculate();
            break;
        case ".":
            Add(".")
            break
        case "Backspace":
            Clear();
            break;
        case "_":
            Add("-");
            break
        default: break;
    }
}, true);

var output = document.getElementById("lookingArea");
var operation;
numbers = [];
operationArray = [];
var complexNum;
var outputText = output.value;
var hasEnteredOperation = false;
var numbersEntered = 0;
var smallNumbersEntered = 0;
var isFirstTime = true;
var isOnScratch = false;

function LoadStuff() {
    document.getElementById("lookingArea").value = "";
    numbersEntered = 0;
    numbers.length = numbersEntered;
    console.log(["+", "/", "*", "-", "+", "/", "*", "*", "-"].sort());
    document.getElementById("scatchPaper").style.display = "none";
}
function Clear() {
    numbersEntered = 0;
    numbers.length = numbersEntered;
    isFirstTime = true;
    output.value = "";
    output.style.width = 10.445 + "%";
    operationArray.length = 0;
}
function Add(input) {
    var newInput = input.toString();
    if (isFirstTime) {
        numbers[numbersEntered] = "";
    }
    numbers[numbersEntered] += newInput;
    isFirstTime = false;
    //console.log(numbers);
    if (input == "-") {
        console.log(output.value + input);
        console.log(input + output.value);
        output.value = input + output.value;
    }
    if (input != "-") {
        output.value += input;
    }
    outputText = numbers;
    if (output.value.length > 20) {
        output.style.width = ((output.value.length) * 8) + "px";
    }
    console.log(operationArray);
    console.log(numbers);
}
function Operations(operation) {
    document.getElementById("lookingArea").value += " " + operation + " ";
    operationArray.push(operation);
    console.log(operationArray);
    console.log(numbers);
    numbers.length++;
    numbersEntered++;
    hasEnteredOperation = true;
    isFirstTime = true;
}
function Calculate() {
    for (i = 0; i < numbers.length; i++) {
        numbers[i] = parseFloat(numbers[i]);
    }


    for (n = 0; n < operationArray.length; n++) {
        switch (operationArray[n]) {
            case "+":
                console.log("add");
                numbers[1] = (numbers[0] + numbers[1])//.toFixed(10);
                break;
            case "-":
                console.log("subtract");
                numbers[1] = (numbers[0] - numbers[1])//.toFixed(10);
                break;
            case "*":
                console.log("multiply");
                numbers[1] = (numbers[0] * numbers[1])//.toFixed(10);
                break;
            case "/":
                console.log("divide");
                numbers[1] = (numbers[0] / numbers[1])//.toFixed(10);
                break;
            default: break;
        }
        //operationArray.shift();
        numbers.shift();
        console.log(operationArray);
        console.log(numbers);
    }
    output.value += " = "
    output.value += numbers[0].toFixed(10);
    if (output.value.length > 20) {
        output.style.width = ((output.value.length) * 8) + "px";
    }
}
function DisplayScratchPaper() {

    document.getElementById("scatchPaper").style.display = "block";
    document.getElementById("scatchPaper").style.left = 500 + "px";
}
function CloseScratchPaper() {
    document.getElementById("scatchPaper").style.display = "none";
}
function ScratchIsUsed() {
    isOnScratch = true;
    console.log("on");
}
function ScratchIsNot() {
    isOnScratch = false;
    console.log("not");
}