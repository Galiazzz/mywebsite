
var graph = document.getElementById("graphArea");
var ctx = graph.getContext("2d");
graph.width = window.innerWidth - 190;
graph.height = window.innerHeight - 30;

function LoadStuff() {
    document.getElementById("scatchPaper").style.display = "none";
}

function DisplayScratchPaper() {
    document.getElementById("scatchPaper").style.display = "block";
    document.getElementById("scatchPaper").style.left = 500 + "px";
}

function CloseScratchPaper() {
    document.getElementById("scatchPaper").style.display = "none";
}

function ColorChange() {
    graph.style.background = document.getElementById("colorInput").value;
}

function CreateGraph() {
    ctx.clearRect(0, 0, graph.width, graph.height);
    if (document.getElementById("createGraph") != null) {
        document.getElementById("createGraph").remove();
    }
    var graphing = document.createElement("script");
    graphing.id = "createGraph";
    graphing.innerHTML = "for(x = -graph.width / 2; x < graph.width / 2; x++){ctx.fillRect(graph.width / 2 + x, graph.height / 2 - ((" + document.getElementById("equastion").value + ")), 5, 5);}";
    document.body.appendChild(graphing);
}

document.addEventListener("keydown", function (e) {
    var zoomer = null;
    if (e.key == "z") {
        var i = 1;
        zoomer = setInterval(function () {
            i+=i/300 + 1;
            ctx.clearRect(0, 0, graph.width, graph.height);
            if (document.getElementById("createGraph") != null) {
                document.getElementById("createGraph").remove();
            }
            var graphing = document.createElement("script");
            graphing.id = "createGraph";
            graphing.innerHTML = "for(x = -graph.width / 2; x < graph.width / 2; x++){ctx.fillRect(graph.width / 2 + x, graph.height / 2 - ((" + i + "%x  )), 5, 5);}";
            document.body.appendChild(graphing);
        }, 10);
    }
    if(e.key == "s"){
        clearInterval(zoomer);
    }
})