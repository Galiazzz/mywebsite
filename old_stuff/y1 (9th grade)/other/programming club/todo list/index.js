var input = document.getElementById("input");
var lists = document.getElementById("things");
var hasDone = [];
var things = [];
var thingsAdded = 0;

function Add() {
    lists.innerHTML += "<button class='done' onclick='finished(this," + thingsAdded + ")'>Do Soon!</button>" + "<p style='display:inline;margin-left:20px;' class='item'>" + input.value + "</p>";
    lists.innerHTML += "<br><br>";
    hasDone = document.getElementsByClassName("done");
    things = document.getElementsByClassName("item");
    thingsAdded++;
    input.value = "";
}

function finished(which, done) {
    which.style.backgroundColor = "green";
    which.innerText = "Done!";
    things[done].style.textDecoration = "line-through";
}