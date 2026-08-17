
var boxes = [[], [], [], [], [], [], [], []];
var collems = [];
var context = new AudioContext();

function LoadStuff() {
    rows = document.getElementsByTagName("tr");
    for (i = 0; i < boxes.length; i++) {
        for (n = 0; n < rows.length; n++) {
            boxes[i[n]].innerHTML = "<td onclick='PlaySound(this)'></td>";
            document.getElementById("rows").innerHTML = "<th></th>";
        }
    }
    collems.length++;
    for (i = 0; i < 20; i++) {
        for (n = 0; n < rows.length; n++) {
            rows[n].innerHTML += "<td onclick='PlaySound(this)'></td>";
            document.getElementById("rows").innerHTML += "<th></th>";
        }
        collems.length++;
    }
}
function AddRow() {
    for (i = 0; i < rows.length; i++) {
        rows[i].innerHTML += "<td onclick='PlaySound(this)'></td>";
    }
}
function PlaySound(box) {
    box.style.backgroundColor = "green";
    var o = context.createOscillator();
    var g = context.createGain();
    o.connect(g);
    o.type = "sine";
    g.connect(context.destination);
    o.start(0);
    g.gain.exponentialRampToValueAtTime(0.00000000001, context.currentTime + 3);
}
function Play() {

}