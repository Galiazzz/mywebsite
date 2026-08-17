var debug = document.createElement("div");
debug.id = "DEBUG";
debug.style = null;
debug.style.position = "absolute";
debug.style.width = "300px";
debug.style.transition = "2s";
debug.style.backgroundColor = "lightGrey";
debug.style.right = "-300px";
debug.style.zIndex = "100";
debug.style.top = "0px";
debug.innerHTML = "<p id='LOG'></p><br><textarea id='CodeInput'></textarea><br><button id='RunCode' onclick='Debug.RunCode()'>Run Code</button>";
document.body.appendChild(debug);

var code = document.createElement("script");
code.id = "DEBUGCode";
document.body.appendChild(code);

var Logs = [];
var AmountSame = 0;

document.body.style.overflowX = "hidden";
document.getElementById("LOG").style = null;
document.getElementById("LOG").style.height = "16em";
document.getElementById("LOG").style.width = "300px";
document.getElementById("LOG").style.overflowY = "auto";
document.getElementById("CodeInput").style = null;
document.getElementById("CodeInput").style.height = "300px";
document.getElementById("CodeInput").style.width = "300px";
document.getElementById("CodeInput").spellcheck = false;
document.getElementById("RunCode").style = null;
document.getElementById("RunCode").style.height = "auto";
document.getElementById("RunCode").style.width = "auto";


document.addEventListener("keydown", function (e) {
    if (e.code == "ControlRight") {
        switch (document.getElementById("DEBUG").style.right) {
            case "-300px":
                document.getElementById("DEBUG").style.right = "0px";
                break;
            case "0px":
                document.getElementById("DEBUG").style.right = "-300px";
                break;
            default: break;
        }
    }
});


class Debug {
    static Log(message) {
        Logs.push(message);
        document.getElementById("LOG").innerText = Logs.join("\n");
    }
    static RunCode() {
        document.getElementById("DEBUGCode").innerHTML = document.getElementById("CodeInput").value;
        document.getElementById("DEBUGCode").remove();
        var code = document.createElement("script");
        code.id = "DEBUGCode";
        document.body.appendChild(code);

        Logs.push("");
    }
    static Clear() {
        Logs = [];
        document.getElementById("LOG").innerText = "";
    }

}