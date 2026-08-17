const keyCodes = {
    one: 0, two: 1, three: 2, four: 3, five: 4, six: 5, seven: 6, eight: 7, nine: 8, zero: 9, q: 10, w: 11, e: 12,
    r: 13, t: 14, y: 15, u: 16, i: 17, o: 18, p: 19, a: 20, d: 21, f: 22, g: 23, h: 24, j: 25, k: 26, l: 27, z: 28, x: 29,
    c: 30, v: 31, b: 32, n: 33, m: 34, s: 35, arrowUp: 36, arrowDown: 37, arrowLeft: 38, arrowRight: 39, space: 40, shift: 41,
};

var keysHeld = [];
keysHeld.length = 42;
keysHeld.fill(false);

document.addEventListener("keydown", function (e) { 
    if(e.key == "1"){keysHeld[keyCodes.one] = true;}
    if(e.key == "2"){keysHeld[keyCodes.two] = true;}
    if(e.key == "3"){keysHeld[keyCodes.three] = true;}
    if(e.key == "4"){keysHeld[keyCodes.four] = true;}
    if(e.key == "5"){keysHeld[keyCodes.five] = true;}
    if(e.key == "6"){keysHeld[keyCodes.six] = true;}
    if(e.key == "7"){keysHeld[keyCodes.seven] = true;}
    if(e.key == "8"){keysHeld[keyCodes.eight] = true;}
    if(e.key == "9"){keysHeld[keyCodes.nine] = true;}
    if(e.key == "0"){keysHeld[keyCodes.zero] = true;}
    if(e.key == "q"){keysHeld[keyCodes.q] = true;}
    if(e.key == "w"){keysHeld[keyCodes.w] = true;}
    if(e.key == "e"){keysHeld[keyCodes.e] = true;}
    if(e.key == "r"){keysHeld[keyCodes.r] = true;}
    if(e.key == "t"){keysHeld[keyCodes.t] = true;}
    if(e.key == "y"){keysHeld[keyCodes.y] = true;}
    if(e.key == "u"){keysHeld[keyCodes.u] = true;}
    if(e.key == "i"){keysHeld[keyCodes.i] = true;}
    if(e.key == "o"){keysHeld[keyCodes.o] = true;}
    if(e.key == "p"){keysHeld[keyCodes.p] = true;}
    if(e.key == "a"){keysHeld[keyCodes.a] = true;}
    if(e.key == "s"){keysHeld[keyCodes.s] = true;}
    if(e.key == "d"){keysHeld[keyCodes.d] = true;}
    if(e.key == "f"){keysHeld[keyCodes.f] = true;}
    if(e.key == "g"){keysHeld[keyCodes.g] = true;}
    if(e.key == "h"){keysHeld[keyCodes.h] = true;}
    if(e.key == "j"){keysHeld[keyCodes.j] = true;}
    if(e.key == "k"){keysHeld[keyCodes.k] = true;}
    if(e.key == "l"){keysHeld[keyCodes.l] = true;}
    if(e.key == "z"){keysHeld[keyCodes.z] = true;}
    if(e.key == "x"){keysHeld[keyCodes.x] = true;}
    if(e.key == "c"){keysHeld[keyCodes.c] = true;}
    if(e.key == "v"){keysHeld[keyCodes.v] = true;}
    if(e.key == "b"){keysHeld[keyCodes.b] = true;}
    if(e.key == "n"){keysHeld[keyCodes.n] = true;}
    if(e.key == "m"){keysHeld[keyCodes.m] = true;}
    if(e.key == "ArrowUp"){keysHeld[keyCodes.arrowUp] = true;}
    if(e.key == "ArrowDown"){keysHeld[keyCodes.arrowDown] = true;}
    if(e.key == "ArrowRight"){keysHeld[keyCodes.arrowRight] = true;}
    if(e.key == "ArrowLeft"){keysHeld[keyCodes.arrowLeft] = true;}
    if(e.key == " "){keysHeld[keyCodes.space] = true;}
    if(e.key == "Shift"){keysHeld[keyCodes.shift] = true;}
});
document.addEventListener("keyup", function (e) {
    if(e.key == "1"){keysHeld[keyCodes.one] = false;}
    if(e.key == "2"){keysHeld[keyCodes.two] = false;}
    if(e.key == "3"){keysHeld[keyCodes.three] = false;}
    if(e.key == "4"){keysHeld[keyCodes.four] = false;}
    if(e.key == "5"){keysHeld[keyCodes.five] = false;}
    if(e.key == "6"){keysHeld[keyCodes.six] = false;}
    if(e.key == "7"){keysHeld[keyCodes.seven] = false;}
    if(e.key == "8"){keysHeld[keyCodes.eight] = false;}
    if(e.key == "9"){keysHeld[keyCodes.nine] = false;}
    if(e.key == "0"){keysHeld[keyCodes.zero] = false;}
    if(e.key == "q"){keysHeld[keyCodes.q] = false;}
    if(e.key == "w"){keysHeld[keyCodes.w] = false;}
    if(e.key == "e"){keysHeld[keyCodes.e] = false;}
    if(e.key == "r"){keysHeld[keyCodes.r] = false;}
    if(e.key == "t"){keysHeld[keyCodes.t] = false;}
    if(e.key == "y"){keysHeld[keyCodes.y] = false;}
    if(e.key == "u"){keysHeld[keyCodes.u] = false;}
    if(e.key == "i"){keysHeld[keyCodes.i] = false;}
    if(e.key == "o"){keysHeld[keyCodes.o] = false;}
    if(e.key == "p"){keysHeld[keyCodes.p] = false;}
    if(e.key == "a"){keysHeld[keyCodes.a] = false;}
    if(e.key == "s"){keysHeld[keyCodes.s] = false;}
    if(e.key == "d"){keysHeld[keyCodes.d] = false;}
    if(e.key == "f"){keysHeld[keyCodes.f] = false;}
    if(e.key == "g"){keysHeld[keyCodes.g] = false;}
    if(e.key == "h"){keysHeld[keyCodes.h] = false;}
    if(e.key == "j"){keysHeld[keyCodes.j] = false;}
    if(e.key == "k"){keysHeld[keyCodes.k] = false;}
    if(e.key == "l"){keysHeld[keyCodes.l] = false;}
    if(e.key == "z"){keysHeld[keyCodes.z] = false;}
    if(e.key == "x"){keysHeld[keyCodes.x] = false;}
    if(e.key == "c"){keysHeld[keyCodes.c] = false;}
    if(e.key == "v"){keysHeld[keyCodes.v] = false;}
    if(e.key == "b"){keysHeld[keyCodes.b] = false;}
    if(e.key == "n"){keysHeld[keyCodes.n] = false;}
    if(e.key == "m"){keysHeld[keyCodes.m] = false;}
    if(e.key == "ArrowUp"){keysHeld[keyCodes.arrowUp] = false;}
    if(e.key == "ArrowDown"){keysHeld[keyCodes.arrowDown] = false;}
    if(e.key == "ArrowRight"){keysHeld[keyCodes.arrowRight] = false;}
    if(e.key == "ArrowLeft"){keysHeld[keyCodes.arrowLeft] = false;}
    if(e.key == " "){keysHeld[keyCodes.space] = false;}
    if(e.key == "Shift"){keysHeld[keyCodes.shift] = false;}
 });