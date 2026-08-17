var gameArea = document.getElementById("gameArea");
var ctx = gameArea.getContext("2d");

function LoadStuff() {
    gameArea.height = window.innerHeight - 20;
    gameArea.width = window.innerWidth - 20;

    setInterval(100, function(){
        ctx.rect(20,20,20,20)
        ctx.fill();
    })

}