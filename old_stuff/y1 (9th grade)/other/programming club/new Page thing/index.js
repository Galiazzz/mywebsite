console.log("this is an amazing message");
var testCount = 0;
function DoStuff(){
    testCount++;
    document.getElementById("firstHeader").innerHTML = "the first header" + testCount;
}
function OnActivateStuff(){
    var header = document.getElementById("firstHeader");
    //header.innerText = "not test";
}