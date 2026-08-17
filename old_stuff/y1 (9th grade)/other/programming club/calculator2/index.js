document.addEventListener("keydown", function (e) {
    switch (e.key) {

    }
}, true);

var output = document.getElementById("screen");

function AddNum(character) {
    output.value += character;
}