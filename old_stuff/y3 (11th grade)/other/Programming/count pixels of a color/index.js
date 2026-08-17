var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var img = document.getElementById("myimg");
canvas.width = img.width;
canvas.height = img.height;
var imgData;

function LoadStuff(){
    ctx.drawImage(img, 0, 0);
    imgData = ctx.getImageData(0, 0, img.width, img.height);
    console.log(CountPixels(150, 150, 150, 255));
}

function CountPixels(r, g, b, a){
    
    var count = 0;
    for(var i = 0; i < imgData.data.length; i += 4){
        if(imgData.data[i] == r &&imgData.data[i + 1] == g && imgData.data[i + 2] == b && imgData.data[i + 3] == a ){
            count++;
        }
    }
    return count;
}