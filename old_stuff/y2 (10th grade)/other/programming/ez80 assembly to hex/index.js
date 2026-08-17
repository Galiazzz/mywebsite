var input = document.getElementById("inputText");
var output = document.getElementById("outputHex");
var textArea = document.getElementById("textArea");
var useCanvas = true;
var ctx = textArea.getContext("2d");
var sourceString = "\t";
var cursorPos = 1;
var isSelectingTextArea = true;
var hilightedTextBounds = [];
var scrollOff = 0;

var UserMemStart = "D1A881"
var memValues = [];

var UseTutorialText = true;

function LoadStuff() {
    if (useCanvas) {
        input.style.display = "none";
        textArea.style.display = "block";
        textArea.width = window.innerWidth;
        textArea.height = window.innerHeight;
        ctx.font = "20px Arial";
        setInterval(function () {
            ctx.clearRect(0, 0, textArea.width, textArea.height);
            ctx.fillStyle = "white";
            var x = 0;
            var y = 20;
            var isInComment = false;
            var isInNewLine = true;
            var isInString = false;
            if(hilightedTextBounds.length == 2 && hilightedTextBounds[0] > hilightedTextBounds[1]){
                var stepArr = [hilightedTextBounds[1], hilightedTextBounds[0]];
                hilightedTextBounds = stepArr;
            }

            for (var i = 0; i < sourceString.length; i++) {
                var char = sourceString[i];

                if (char == ";") {
                    isInComment = true;
                }

                if (char == "\"" && !isInComment) {
                    switch (isInString) {
                        case true: isInString = false; ctx.fillStyle = "#ffffff"; break;
                        case false: isInString = true; ctx.fillStyle = "#00cc00"; break;
                    }
                }

                if (isInNewLine) {
                    var first3 = sourceString.slice(i, i + 3).toUpperCase();
                    if (sourceString.slice(i, i + 4).toUpperCase() == "CALL") {
                        ctx.fillStyle = "#00e0e0";
                    }
                    else if (first3 == "RET") {
                        ctx.fillStyle = "#bb00bb"
                    }
                    else if (first3 == "ADD" || first3 == "SUB" || first3 == "ADC" || first3 == "SBC" || first3 == "INC" || first3 == "DEC") {
                        ctx.fillStyle = "#000088"
                    }
                    else if (sourceString.slice(i, i + 2).toUpperCase() == "LD") {
                        ctx.fillStyle = "#05b06f";
                    }
                    else if (sourceString.slice(i, i + 2).toUpperCase() == "JP") {
                        ctx.fillStyle = "#888888";
                    }
                }
                if (char == " ") {
                    if (ctx.fillStyle == "#00e0e0") {
                        ctx.fillStyle = "#e0e000";
                    }
                    if (ctx.fillStyle == "#05b06f" || ctx.fillStyle == "#000088") {
                        ctx.fillStyle = "#b57d14";
                    }
                }
                if (isInComment) {
                    ctx.fillStyle = "#208020";
                }

                ctx.fillText(char, x, y)
                if (i == cursorPos) {
                    var previousColor = ctx.fillStyle;
                    ctx.fillStyle = "white";
                    ctx.fillRect(x, y - 20, 2, 20);
                    ctx.fillStyle = previousColor;
                }
                x += ctx.measureText(char).width;
                if (hilightedTextBounds.length == 2 && i >= hilightedTextBounds[0] && i <= hilightedTextBounds[1]) {
                    var previousColor = ctx.fillStyle;
                    ctx.fillStyle = "rgba(0, 0, 255, .25)";
                    ctx.fillRect(x - ctx.measureText(char).width, y - 20, ctx.measureText(char).width, 20);
                    ctx.fillStyle = previousColor;
                }
                isInNewLine = false
                if (char == "\t") {
                    x += 25;
                    isInNewLine = true;
                }
                if (char == "\n") {
                    y += 20;
                    x = 0;
                    isInComment = false;
                    isInNewLine = true;
                    isInString = false;
                    ctx.fillStyle = "white";
                }

            }
        }, 10);
    }
    else {
        textArea.style.display = "none";
    }
    if (UseTutorialText) {
        var tutorialText = ";Welcome to Ti-84 Plus CE Assembly to Hex :) \n" +
            ";Provided below is an tutorial program that will print \"Hello world.\" on the screen \n" +
            "\tcall HomeUp ; makes the calculator go to home screen\n" +
            "\tcall ClrScreenFull ; Makes the calculator\'s screen go white\n" +
            "\tcall NewLine ; Creates a new line on the home screen\n" +
            "\tld hl Text ; Loads the location of the text into the hl register\n" +
            "\tcall PutS ; puts the text located at the memory address stored in hl onto the screen\n" +
            "\tret ; Ends the program\n" +
            "Text:; The location of memory where the text is stored\n" +
            "\t\"Hello world.\" ; the text to be displayed\n\n" +
            ";You may have noticed semicolons all over place. These are comments which have a \";\" in front of them\n" +
            ";Hope this tutorial was helpful, happy assembly coding ;)";
        if (useCanvas) {
            sourceString = tutorialText;
        }
        else {
            input.value = tutorialText;
        }
    }

}

function CalculateHex() {
    memValues = [];
    if (useCanvas) {
        str = sourceString;
    }
    else {
        var str = input.value;
    }
    var lines = str.split("\n");

    for (var i = 0; i < lines.length; i++) {
        while (lines[i].includes("\t")) {
            lines[i] = lines[i].replace("\t", "");
        }
    }

    //takes care of comments
    for (var i = 0; i < lines.length; i++) {
        var arr = lines[i].split("");
        for (var n = 0; n < arr.length; n++) {
            if (arr[n] == ";") {
                arr.splice(n, arr.length - n);
            }
        }
        lines[i] = arr.join("");
    }

    for(var i = 0; i < lines.length; i++){
        if(lines[i].includes("#")){
            var arr = lines[i].split("#");
            var string = "";
            for(var n = 0; n < arr[1].length; n++){
                string += arr[1][n];
                if(string == "lcdWidth"){
                    arr[1] = arr[1].replace(string, "0140");
                    lines[i] = arr.join("");
                }
                if(string == "lcdHeight"){
                    arr[1] = arr[1].replace(string, "00F0");
                    lines[i] = arr.join("");
                }
                if(string == "define"){
                    arr[1] = arr[1].replace(string, "");
                    var arr2 = arr[1].split(" ");
                    for(var j = 0; j < lines.length; j++){
                        if(lines[j].includes(arr2[1])){
                            lines[j] = lines[j].replace(arr2[1], arr2[2]);
                        }
                    }
                    lines[i] = "";
                }
            }
        }
    }

    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (l[l.length - 1] == ":") {
            var name = l.split("").splice(0, l.length - 1).join("")
            var index = memValues.push(name) - 1;
            for (var n = 0; n < lines.length; n++) {
                if (lines[n].includes(name) && n != i) {

                    var stepStr = ";" + index;
                    if (stepStr.length < 6) {
                        while (stepStr.length < 6) {
                            stepStr += ";";
                        }
                    }

                    lines[n] = lines[n].replace(name, stepStr);
                }
                else if (lines[n].includes(name) && n == i) {
                    lines[n] = lines[n].replace(name + ":", name);
                }
            }
        }
    }

    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        var arr = l.split(" ");
        arr[0] = arr[0].toUpperCase();
        if (arr[0] != "CALL" && arr[0] != "JP") {
            for (var n = 0; n < arr.length; n++) {
                arr[n] = arr[n].toUpperCase();
            }
        }

        if (arr[0] == "LD") {
            if (arr[1] == "HL") {
                if (arr[2][0] == "(") {
                    arr[2] = arr[2].replace("(", "");
                    arr[2] = arr[2].replace(")", "");
                    lines[i] = "2A" + arr[2];
                }
                else {
                    lines[i] = "21" + arr[2];
                }
            }
            else if (arr[1] == "(HL)") {
                switch (arr[2]) {
                    case "B": lines[i] = "70"; break;
                    case "C": lines[i] = "71"; break;
                    case "D": lines[i] = "72"; break;
                    case "E": lines[i] = "73"; break;
                    case "H": lines[i] = "74"; break;
                    case "L": lines[i] = "75"; break;
                    case "A": lines[i] = "77"; break;
                    default: lines[i] = "36" + arr[2]; break;
                }
            }
            else if (arr[1] == "BC") {
                lines[i] = "01" + arr[2];
            }
            else if (arr[1] == "(BC)" && arr[2] == "A") {
                lines[i] = "02";
            }
            else if (arr[1] == "A") {
                if (arr[2][0] == "(") {
                    arr[2] = arr[2].replace("(", "");
                    arr[2] = arr[2].replace(")", "");
                    lines[i] = "3A" + arr[2];
                }
                switch (arr[2]) {
                    case "(BC)": lines[i] = "0A"; break;
                    case "(DE)": lines[i] = "1A"; break;
                    case "B": lines[i] = "78"; break;
                    case "C": lines[i] = "79"; break;
                    case "D": lines[i] = "7A"; break;
                    case "E": lines[i] = "7B"; break;
                    case "H": lines[i] = "7C"; break;
                    case "L": lines[i] = "7D"; break;
                    case "(HL)": lines[i] = "7E"; break;
                    case "A": lines[i] = "7F"; break;
                    default: lines[i] = "3E" + arr[2]; break;
                }
            }
            else if (arr[1] == "B") {
                switch (arr[2]) {
                    case "C": lines[i] = "41"; break;
                    case "D": lines[i] = "42"; break;
                    case "E": lines[i] = "43"; break;
                    case "H": lines[i] = "44"; break;
                    case "L": lines[i] = "45"; break;
                    case "(HL)": lines[i] = "46"; break;
                    case "A": lines[i] = "47"; break;
                    default: lines[i] = "06" + arr[2]; break;
                }
            }
            else if (arr[1] == "C") {
                switch (arr[2]) {
                    case "B": lines[i] = "48"; break;
                    case "D": lines[i] = "4A"; break;
                    case "E": lines[i] = "4B"; break;
                    case "H": lines[i] = "4C"; break;
                    case "L": lines[i] = "4D"; break;
                    case "(HL)": lines[i] = "4E"; break;
                    case "A": lines[i] = "4F"; break;
                    default: lines[i] = "0E" + arr[2]; break;
                }
            }
            else if (arr[1] == "D") {
                switch (arr[2]) {
                    case "B": lines[i] = "50"; break;
                    case "C": lines[i] = "51"; break;
                    case "E": lines[i] = "53"; break;
                    case "H": lines[i] = "54"; break;
                    case "L": lines[i] = "55"; break;
                    case "(HL)": lines[i] = "56"; break;
                    case "A": lines[i] = "57"; break;
                    default: lines[i] = "16" + arr[2]; break;
                }
            }
            else if (arr[1] == "DE") {
                lines[i] = "11" + arr[2];
            }
            else if (arr[1] == "(DE)" && arr[2] == "A") {
                lines[i] = "12";
            }
            else if (arr[1] == "E") {
                switch (arr[2]) {
                    case "E": lines[i] = "58"; break;
                    case "C": lines[i] = "59"; break;
                    case "D": lines[i] = "5A"; break;
                    case "H": lines[i] = "5C"; break;
                    case "L": lines[i] = "5D"; break;
                    case "(HL)": lines[i] = "5E"; break;
                    case "A": lines[i] = "5F"; break;
                    default: lines[i] = "1E" + arr[2]; break;
                }
            }
            else if (arr[1] == "H") {
                switch (arr[2]) {
                    case "B": lines[i] = "60"; break;
                    case "C": lines[i] = "61"; break;
                    case "D": lines[i] = "62"; break;
                    case "E": lines[i] = "63"; break;
                    case "H": lines[i] = "64"; break;
                    case "L": lines[i] = "65"; break;
                    case "(HL)": lines[i] = "66"; break;
                    case "A": lines[i] = "67"; break;
                    default: lines[i] = "26" + arr[2]; break;
                }
            }
            else if (arr[1] == "L") {
                switch (arr[2]) {
                    case "B": lines[i] = "68"; break;
                    case "C": lines[i] = "69"; break;
                    case "D": lines[i] = "6A"; break;
                    case "E": lines[i] = "6B"; break;
                    case "H": lines[i] = "6C"; break;
                    case "L": lines[i] = "6D"; break;
                    case "(HL)": lines[i] = "6E"; break;
                    case "A": lines[i] = "6F"; break;
                    default: lines[i] = "2E" + arr[2]; break;
                }
            }
            else if (arr[1] == "SP") {
                if (arr[2] == "HL") {
                    lines[i] = "F9";
                }
                else {
                    lines[i] = "31" + arr[2];
                }
            }
            else {
                lines[i] = "LOAD UNKNOWN";
            }
        }
        else if (arr[0] == "INC") {
            switch (arr[1]) {
                case "BC": lines[i] = "03"; break;
                case "DE": lines[i] = "13"; break;
                case "HL": lines[i] = "23"; break;
                case "SP": lines[i] = "33"; break;
                case "B": lines[i] = "04"; break;
                case "D": lines[i] = "14"; break;
                case "H": lines[i] = "24"; break;
                case "(HL)": lines[i] = "34"; break;
                case "C": lines[i] = "0C"; break;
                case "E": lines[i] = "1C"; break;
                case "L": lines[i] = "2C"; break;
                case "A": lines[i] = "3C"; break;
                default: lines[i] = "INC UNKNOWN"; break;
            }
        }
        else if (arr[0] == "DEC") {
            switch (arr[1]) {
                case "B": lines[i] = "05"; break;
                case "D": lines[i] = "15"; break;
                case "H": lines[i] = "25"; break;
                case "(HL)": lines[i] = "35"; break;
                case "BC": lines[i] = "0B"; break;
                case "DE": lines[i] = "1B"; break;
                case "HL": lines[i] = "2B"; break;
                case "SP": lines[i] = "3B"; break;
                case "C": lines[i] = "0D"; break;
                case "E": lines[i] = "1D"; break;
                case "L": lines[i] = "2D"; break;
                case "A": lines[i] = "3D"; break;
                default: lines[i] = "DEC UNKNOWN"; break;
            }
        }
        else if (arr[0] == "ADD") {
            if (arr[1] == "HL") {
                switch (arr[2]) {
                    case "BC": lines[i] = "09"; break;
                    case "DE": lines[i] = "19"; break;
                    case "HL": lines[i] = "29"; break;
                    case "SP": lines[i] = "39"; break;
                    default: break;
                }
            }
            else if (arr[1] == "A") {
                switch (arr[2]) {
                    case "B": lines[i] = "80"; break;
                    case "C": lines[i] = "81"; break;
                    case "D": lines[i] = "82"; break;
                    case "E": lines[i] = "83"; break;
                    case "H": lines[i] = "84"; break;
                    case "L": lines[i] = "85"; break;
                    case "(HL)": lines[i] = "86"; break;
                    case "A": lines[i] = "87"; break;
                    default: lines[i] = "C6" + arr[2]; break;
                }
            }
        }
        else if (arr[0] == "ADC" && arr[1] == "A") {
            switch (arr[2]) {
                case "B": lines[i] = "88"; break;
                case "C": lines[i] = "89"; break;
                case "D": lines[i] = "8A"; break;
                case "E": lines[i] = "8B"; break;
                case "H": lines[i] = "8C"; break;
                case "L": lines[i] = "8D"; break;
                case "(HL)": lines[i] = "8E"; break;
                case "A": lines[i] = "8F"; break;
                default: lines[i] = "CE" + arr[2]; break;
            }
        }
        else if (arr[0] == "SUB" && arr[1] == "A") {
            switch (arr[2]) {
                case "B": lines[i] = "90"; break;
                case "C": lines[i] = "91"; break;
                case "D": lines[i] = "92"; break;
                case "E": lines[i] = "93"; break;
                case "H": lines[i] = "94"; break;
                case "L": lines[i] = "95"; break;
                case "(HL)": lines[i] = "96"; break;
                case "A": lines[i] = "97"; break;
                default: lines[i] = "D6" + arr[2]; break;
            }
        }
        else if (arr[0] == "SBC" && arr[1] == "A") {
            switch (arr[2]) {
                case "B": lines[i] = "98"; break;
                case "C": lines[i] = "99"; break;
                case "D": lines[i] = "9A"; break;
                case "E": lines[i] = "9B"; break;
                case "H": lines[i] = "9C"; break;
                case "L": lines[i] = "9D"; break;
                case "(HL)": lines[i] = "9E"; break;
                case "A": lines[i] = "9F"; break;
                default: lines[i] = "DE" + arr[2]; break;
            }
        }
        else if (arr[0] == "JP") {
            switch (arr[1]) {
                case "NZ": lines[i] = "C2" + arr[2]; break;
                case "NC": lines[i] = "D2" + arr[2]; break;
                case "PO": lines[i] = "E2" + arr[2]; break;
                case "P": lines[i] = "F2" + arr[2]; break;
                case "Z": lines[i] = "CA" + arr[2]; break;
                case "C": lines[i] = "DA" + arr[2]; break;
                case "PE": lines[i] = "EA" + arr[2]; break;
                case "M": lines[i] = "FA" + arr[2]; break;
                case "(HL)": lines[i] = "E9"; break;
                default: lines[i] = "C3" + arr[1]; break;
            }
        }
        else if(arr[0] == "JR"){
            switch(arr[1]){
                case "NZ": lines[i] = "20" + arr[2]; break;
                case "NC": lines[i] = "30" + arr[2]; break;
                case "Z": lines[i] = "28" + arr[2]; break;
                case "C": lines[i] = "38" + arr[2]; break;
                default: lines[i] = "18" + arr[1]; break;
            }
        }
        else if (arr[0] == "AND" && arr[1] == "A") {
            switch (arr[2]) {
                case "B": lines[i] = "A0"; break;
                case "C": lines[i] = "A1"; break;
                case "D": lines[i] = "A2"; break;
                case "E": lines[i] = "A3"; break;
                case "H": lines[i] = "A4"; break;
                case "L": lines[i] = "A5"; break;
                case "(HL)": lines[i] = "A6"; break;
                case "A": lines[i] = "A7"; break;
                default: lines[i] = "E6" + arr[2]; break;
            }
        }
        else if (arr[0] == "XOR" && arr[1] == "A") {
            switch (arr[2]) {
                case "B": lines[i] = "A8"; break;
                case "C": lines[i] = "A9"; break;
                case "D": lines[i] = "AA"; break;
                case "E": lines[i] = "AB"; break;
                case "H": lines[i] = "AC"; break;
                case "L": lines[i] = "AD"; break;
                case "(HL)": lines[i] = "AE"; break;
                case "A": lines[i] = "AF"; break;
                default: lines[i] = "EE" + arr[2]; break;
            }
        }
        else if (arr[0] == "OR" && arr[1] == "A") {
            switch (arr[2]) {
                case "B": lines[i] = "B0"; break;
                case "C": lines[i] = "B1"; break;
                case "D": lines[i] = "B2"; break;
                case "E": lines[i] = "B3"; break;
                case "H": lines[i] = "B4"; break;
                case "L": lines[i] = "B5"; break;
                case "(HL)": lines[i] = "B6"; break;
                case "A": lines[i] = "B7"; break;
                default: lines[i] = "F6" + arr[2]; break;
            }
        }
        else if (arr[0] == "CP" && arr[1] == "A") {
            switch (arr[2]) {
                case "B": lines[i] = "B8"; break;
                case "C": lines[i] = "B9"; break;
                case "D": lines[i] = "BA"; break;
                case "E": lines[i] = "BB"; break;
                case "H": lines[i] = "BC"; break;
                case "L": lines[i] = "BD"; break;
                case "(HL)": lines[i] = "BE"; break;
                case "A": lines[i] = "BF"; break;
                default: lines[i] = "FE" + arr[2]; break;
            }
        }
        else if (arr[0] == "CALL") {
            switch(arr[1]){
                case "NZ": lines[i] = "C4" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                case "NC": lines[i] = "D4" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                case "PO": lines[i] = "E4" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                case "P": lines[i] = "F4" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                case "Z": lines[i] = "CC" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                case "C": lines[i] = "DC" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                case "PE": lines[i] = "EC" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                case "M": lines[i] = "FC" + ToLittleEndian(SystemCallToHex(arr[2])); break;
                default: lines[i] = "CD" + ToLittleEndian(SystemCallToHex(arr[1])); break;
            }

        }
        else if (arr[0] == "RET") {
            switch(arr[1]){
                case "NZ": lines[i] = "C0"; break;
                case "NC": lines[i] = "D0"; break;
                case "PO": lines[i] = "E0"; break;
                case "P": lines[i] = "F0"; break;
                case "Z": lines[i] = "C8"; break;
                case "C": lines[i] = "D8"; break;
                case "PE": lines[i] = "E8"; break;
                case "M": lines[i] = "F8"; break;
                default: lines[i] = "C9"; break;
            }
        }
        else if(arr[0] == "NOP"){
            lines[i] = "00";
        }
        else if(arr[0] == "DJNZ"){
            lines[i] = "10" + arr[1];
        }
        else if(arr[0] == "DI"){
            lines[i] = "F3";
        }
        else if(arr[0] == "RLCA"){
            lines[i] = "07";
        }
        else if(arr[0] == "RLA"){
            lines[i] = "17";
        }
        else if(arr[0] == "DAA"){
            lines[i] = "27";
        }
        else if(arr[0] == "SCF"){
            lines[i] = "37";
        }
        else if(arr[0] == "EI"){
            lines[i] = "FB";
        }
        else if(arr[0] == "RRCA"){
            lines[i] = "0F";
        }
        else if(arr[0] == "RRA"){
            lines[i] = "1F";
        }
        else if(arr[0] == "CPL"){
            lines[i] = "2F";
        }
        else if(arr[0] == "CCF"){
            lines[i] = "3F";
        }
        else if(arr[0] == "EXX"){
            lines[i] = "D9";
        }
    }

    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (l.includes("\"")) {
            var arr = l.split("");
            var isInString = false;
            var isInSpecialString = false;
            var specialCharacter = "";

            var stepArr = [];
            for (var n = 0; n < arr.length; n++) {
                if (arr[n] == "\"") {
                    switch (isInString) {
                        case true: isInString = false; stepArr.push("00"); break;
                        case false: isInString = true; continue; break;
                    }

                }
                if (isInString) {
                    if (arr[n] == "\\") {
                        switch (isInSpecialString) {
                            case true: isInSpecialString = false; break;
                            case false: isInSpecialString = true; continue; break;
                        }
                    }
                    if (isInSpecialString) {
                        specialCharacter += arr[n];
                    }
                    else {
                        if (specialCharacter == "") {
                            stepArr.push(CharToTICalcChar(arr[n]));
                        }
                        else {
                            var specialChar = CharToTICalcChar(specialCharacter);
                            if (specialChar != "00") {
                                stepArr.push(specialChar);
                            }
                            specialCharacter = "";
                        }
                    }
                }
            }
            lines[i] = stepArr.join("");
        }
    }

    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (l.includes(".")) {//deciamal
            var arr = lines[i].split(".");
            var origValue = [];
            for (var n = 0; n < arr[1].length; n++) {
                if (parseInt(arr[1][n]) != NaN) {
                    origValue.push(arr[1][n]);
                }
                else {
                    break;
                }
            }
            origValue = origValue.join("");
            var value = DecimalToHex(parseInt(origValue, 10));
            if (value.length < 6) {
                var string = "";
                for (var n = 0; n < 6 - value.length; n++) {
                    string += "0";
                }
                string += arr[1];
                value = string;
            }
            if (value.length > 6) {
                var stepArr = value.split("");
                for (var n = 0; n < value - 6; n++) {
                    stepArr.splice(0, 1);
                }
                value = stepArr.join("");
            }
            arr[1] = arr[1].replace(origValue, value);
            lines[i] = arr.join("");
        }
        if (l.includes("$")) { //Hexadecimal
            if (lines[i].split("$")[1][6] == "M" && lines[i].split("$")[1][7] == "e" && lines[i].split("$")[1][8] == "m") {
                var arr = lines[i].split("$");
                var arr2 = arr[1].split("Mem");
                arr2[0] = ToLittleEndian(arr2[0]);
                lines[i] = arr[0] + arr2[0];
            }
            else {
                lines[i] = lines[i].replace("$", "");
            }
        }

        if (l.includes("%")) {//binary
            if (lines[i].split("%")[1][24] == "M" && lines[i].split("%")[1][25] == "e" && lines[i].split("%")[1][26] == "m") {
                var arr = lines[i].split("%");
                var restArr = arr[1].split(" ");
                var outputArr = [];
                for (var n = 0; n < 6; n++) {
                    outputArr.push(BinaryToHex(arr[1][n * 4 + 0] + arr[1][n * 4 + 1] + arr[1][n * 4 + 2] + arr[1][n * 4 + 3]));
                }
                outputArr = ToLittleEndian(outputArr.join("")).split("");
                if (arr[1].length > 27) {
                    lines[i] = arr[0] + outputArr.join("") + restArr[1];
                }
                else {
                    lines[i] = arr[0] + outputArr.join("");
                }
            }
            else {
                var arr = lines[i].split("%");
                var restArr = arr[1].split(" ");
                var outputArr = [];
                for (var n = 0; n < 6; n++) {
                    outputArr.push(BinaryToHex(arr[1][n * 4 + 0] + arr[1][n * 4 + 1] + arr[1][n * 4 + 2] + arr[1][n * 4 + 3]));
                }
                if (arr[1].length > 24) {
                    lines[i] = arr[0] + outputArr.join("") + restArr[1];
                }
                else {
                    lines[i] = arr[0] + outputArr.join("");
                }
            }

        }
    }

    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        for (var n = 0; n < memValues.length; n++) {
            if (l.includes(memValues[n])) {
                var bytes = 0;
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j] == memValues[n]) {
                        lines.splice(j, 1);
                        break;
                    }
                    for (var k = 0; k < lines[j].length; k++) {
                        bytes++;
                    }
                }
                bytes /= 2;
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j].includes(";")) {
                        var section = lines[j][lines[j].indexOf(";")];
                        for (var m = 0; m < n.toString(10).length; m++) {
                            section += n.toString(10)[m];
                        }
                        while (section.length < 6) {
                            section += ";";
                        }
                        if (!lines[j].includes(section)) {
                            continue;
                        }
                        lines[j] = lines[j].replace(section, ToLittleEndian(AddHex(UserMemStart, DecimalToHex(bytes))));
                    }

                }
            }
        }
    }

    var stepArr = [];
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] != "") {
            stepArr.push(lines[i]);
        }
    }
    lines = stepArr;

    output.value = "Asm84CEPrgm\n";
    output.value += lines.join("\n");
}

function DecimalToHex(numDecimal) {
    return numDecimal.toString(16).toUpperCase();
}

function BinaryToHex(binaryString) {
    return parseInt(binaryString, 2).toString(16).toUpperCase();
}

function AddHex(h1, h2) {
    var value = (parseInt(h1, 16) + parseInt(h2, 16)).toString(16);
    if (value.length > 6) {
        var arr = value.split("");
        arr.splice(0, 1);
        value = arr.join("");
    }
    return value.toUpperCase();
}

function ToLittleEndian(str) {
    return str[4] + str[5] + str[2] + str[3] + str[0] + str[1];
}

function CopyTextToClipboard() {
    var copyText = document.getElementById("clipboardCopy");
    var text = ""
    if (useCanvas) {
        text = sourceString;
    }
    else {
        text = input.value;
    }
    copyText.value = text;
    console.log(copyText.value);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}


function GetCursorPos(x, y) {
    var _CursorPos;
    for (var posY = 0; posY < sourceString.split("\n").length; posY++) {
        if (Math.floor(y / 16) == posY) {
            var cPos = 0;
            for (var i = 0; i < posY; i++) {
                cPos += sourceString.split("\n")[i].length + 1;
            }
            _CursorPos = cPos;
            var xPos = 0;
            for (_CursorPos; sourceString[_CursorPos] != "\n" && _CursorPos < sourceString.length; _CursorPos++) {
                if (Math.abs(xPos - x) < ctx.measureText(sourceString[_CursorPos]).width) {
                    break;
                }
                xPos += ctx.measureText(sourceString[_CursorPos]).width;
            }
            break;
        }
    }
    return _CursorPos;
}

var isDragging = false;
document.addEventListener("mousedown", function (e) {
    var rect = textArea.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = (e.clientY - rect.top) - 10;
    if (x > 0 && x < textArea.width && y > 0 && y < textArea.height) {
        isSelectingTextArea = true;
        hilightedTextBounds[0] = GetCursorPos(x, y);
        cursorPos = hilightedTextBounds[0];
        isDragging = true;
    }
    else {
        isSelectingTextArea = false;
    }
})
document.addEventListener("mousemove", function (e) {
    if (isDragging) {
        var rect = textArea.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = (e.clientY - rect.top) - 10;
        var pos = GetCursorPos(x, y);
        if (hilightedTextBounds[0] != pos) {
            hilightedTextBounds[1] = pos;
        }
    }
})
document.addEventListener("mouseup", function (e) {
    var rect = textArea.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = (e.clientY - rect.top) - 10;
    var pos = GetCursorPos(x, y);
    if (hilightedTextBounds[0] != pos) {
        hilightedTextBounds[1] = pos;
    }
    else {
        hilightedTextBounds = [];
    }
    isDragging = false;
})

var hasControlDown = false;
document.addEventListener("keydown", function (e) { if (e.key == "Control") { hasControlDown = true; } })
document.addEventListener("keyup", function (e) { if (e.key == "Control") { hasControlDown = false; } })

document.addEventListener("keydown", function (e) {

    if (isSelectingTextArea) {
        if (hasControlDown) {
            if (e.key == "v") {
                navigator.clipboard.readText().then(clipText => sourceString = clipText);
            }
        }
        var doPreventDefault = true;
        switch (e.key) {
            case "ArrowRight": cursorPos += cursorPos < sourceString.length - 1 ? 1 : 0; break;
            case "ArrowLeft": cursorPos -= cursorPos > 0 ? 1 : 0; break;
            case "ArrowUp": if (cursorPos > 0) { while (sourceString[cursorPos] != "\n" && cursorPos > 0) { cursorPos--; } cursorPos--; } break;
            case "ArrowDown": if (cursorPos < sourceString.length - 1) { while (sourceString[cursorPos] != "\n" && cursorPos < sourceString.length - 1) { cursorPos++; } cursorPos++; } break;
            case "ArrowDown": break;
            case "Backspace": var arr = sourceString.split(""); arr.splice(cursorPos - 1, 1); sourceString = arr.join(""); cursorPos--; break;
            case "Tab": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "\t"); sourceString = arr.join(""); cursorPos++; break;
            case " ": var arr = sourceString.split(""); arr.splice(cursorPos, 0, " "); sourceString = arr.join(""); cursorPos++; break;
            case "Enter": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "\n"); cursorPos++; arr.splice(cursorPos + 1, 0, "\t"); sourceString = arr.join(""); cursorPos++; break;
            case ";": var arr = sourceString.split(""); arr.splice(cursorPos, 0, ";"); sourceString = arr.join(""); cursorPos++; break;
            case "\"": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "\""); sourceString = arr.join(""); cursorPos++; break;
            case "#": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "#"); sourceString = arr.join(""); cursorPos++; break;
            case "$": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "$"); sourceString = arr.join(""); cursorPos++; break;
            case "%": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "%"); sourceString = arr.join(""); cursorPos++; break;
            case ".": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "."); sourceString = arr.join(""); cursorPos++; break;
            case ":": var arr = sourceString.split(""); arr.splice(cursorPos, 0, ":");
                for (var i = cursorPos; i > 0; i--) { if (arr[i] == "\t") { arr[i] = ""; break; } }
                sourceString = arr.join(""); cursorPos++; break;
            case "0": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "0"); sourceString = arr.join(""); cursorPos++; break;
            case "1": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "1"); sourceString = arr.join(""); cursorPos++; break;
            case "2": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "2"); sourceString = arr.join(""); cursorPos++; break;
            case "3": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "3"); sourceString = arr.join(""); cursorPos++; break;
            case "4": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "4"); sourceString = arr.join(""); cursorPos++; break;
            case "5": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "5"); sourceString = arr.join(""); cursorPos++; break;
            case "6": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "6"); sourceString = arr.join(""); cursorPos++; break;
            case "7": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "7"); sourceString = arr.join(""); cursorPos++; break;
            case "8": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "8"); sourceString = arr.join(""); cursorPos++; break;
            case "9": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "9"); sourceString = arr.join(""); cursorPos++; break;
            case "(": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "("); sourceString = arr.join(""); cursorPos++; break;
            case ")": var arr = sourceString.split(""); arr.splice(cursorPos, 0, ")"); sourceString = arr.join(""); cursorPos++; break;


            case "a": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "a"); sourceString = arr.join(""); cursorPos++; break;
            case "b": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "b"); sourceString = arr.join(""); cursorPos++; break;
            case "c": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "c"); sourceString = arr.join(""); cursorPos++; break;
            case "d": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "d"); sourceString = arr.join(""); cursorPos++; break;
            case "e": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "e"); sourceString = arr.join(""); cursorPos++; break;
            case "f": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "f"); sourceString = arr.join(""); cursorPos++; break;
            case "g": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "g"); sourceString = arr.join(""); cursorPos++; break;
            case "h": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "h"); sourceString = arr.join(""); cursorPos++; break;
            case "i": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "i"); sourceString = arr.join(""); cursorPos++; break;
            case "j": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "j"); sourceString = arr.join(""); cursorPos++; break;
            case "k": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "k"); sourceString = arr.join(""); cursorPos++; break;
            case "l": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "l"); sourceString = arr.join(""); cursorPos++; break;
            case "m": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "m"); sourceString = arr.join(""); cursorPos++; break;
            case "n": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "n"); sourceString = arr.join(""); cursorPos++; break;
            case "o": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "o"); sourceString = arr.join(""); cursorPos++; break;
            case "p": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "p"); sourceString = arr.join(""); cursorPos++; break;
            case "q": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "q"); sourceString = arr.join(""); cursorPos++; break;
            case "r": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "r"); sourceString = arr.join(""); cursorPos++; break;
            case "s": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "s"); sourceString = arr.join(""); cursorPos++; break;
            case "t": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "t"); sourceString = arr.join(""); cursorPos++; break;
            case "u": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "u"); sourceString = arr.join(""); cursorPos++; break;
            case "v": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "v"); sourceString = arr.join(""); cursorPos++; break;
            case "w": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "w"); sourceString = arr.join(""); cursorPos++; break;
            case "x": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "x"); sourceString = arr.join(""); cursorPos++; break;
            case "y": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "y"); sourceString = arr.join(""); cursorPos++; break;
            case "z": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "z"); sourceString = arr.join(""); cursorPos++; break;
            case "A": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "A"); sourceString = arr.join(""); cursorPos++; break;
            case "B": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "B"); sourceString = arr.join(""); cursorPos++; break;
            case "C": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "C"); sourceString = arr.join(""); cursorPos++; break;
            case "D": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "D"); sourceString = arr.join(""); cursorPos++; break;
            case "E": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "E"); sourceString = arr.join(""); cursorPos++; break;
            case "F": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "F"); sourceString = arr.join(""); cursorPos++; break;
            case "G": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "G"); sourceString = arr.join(""); cursorPos++; break;
            case "H": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "H"); sourceString = arr.join(""); cursorPos++; break;
            case "I": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "I"); sourceString = arr.join(""); cursorPos++; break;
            case "J": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "J"); sourceString = arr.join(""); cursorPos++; break;
            case "K": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "K"); sourceString = arr.join(""); cursorPos++; break;
            case "L": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "L"); sourceString = arr.join(""); cursorPos++; break;
            case "M": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "M"); sourceString = arr.join(""); cursorPos++; break;
            case "N": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "N"); sourceString = arr.join(""); cursorPos++; break;
            case "O": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "O"); sourceString = arr.join(""); cursorPos++; break;
            case "P": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "P"); sourceString = arr.join(""); cursorPos++; break;
            case "Q": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "Q"); sourceString = arr.join(""); cursorPos++; break;
            case "R": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "R"); sourceString = arr.join(""); cursorPos++; break;
            case "S": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "S"); sourceString = arr.join(""); cursorPos++; break;
            case "T": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "T"); sourceString = arr.join(""); cursorPos++; break;
            case "U": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "U"); sourceString = arr.join(""); cursorPos++; break;
            case "V": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "V"); sourceString = arr.join(""); cursorPos++; break;
            case "W": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "W"); sourceString = arr.join(""); cursorPos++; break;
            case "X": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "X"); sourceString = arr.join(""); cursorPos++; break;
            case "Y": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "Y"); sourceString = arr.join(""); cursorPos++; break;
            case "Z": var arr = sourceString.split(""); arr.splice(cursorPos, 0, "Z"); sourceString = arr.join(""); cursorPos++; break;
            default:
                doPreventDefault = false;
                break;
        }
        if (doPreventDefault) {
            e.preventDefault();
        }
        if (cursorPos < 0) {
            cursorPos = 0;
        }
        if (cursorPos > sourceString.length - 1) {
            cursorPos = sourceString.length - 1
        }
    }

});