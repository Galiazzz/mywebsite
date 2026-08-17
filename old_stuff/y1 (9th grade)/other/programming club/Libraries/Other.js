class Interpolations {
    static Linear2d(y1, y2, mu) {
        return y1 * (1 - mu) + y2 * mu;
    }
    static Cosine2d(y1, y2, mu) {
        var mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
        return (y1 * (1 - mu2)) + (y2 * mu2);
    }
}

var Numbers = [];
var Size = 300;

for (i = 0; i < Size; i++) {
    Numbers[i] = [];
    for (n = 0; n < Size; n++) {
        Numbers[i][n] = Math.floor(Math.random() * 2) * 255;
    }
}
for (o = 0; o < 3; o++) {
    for (i = 1; i < Numbers.length - 1; i++) {
        for (n = 0; n < 2; n++) {
            var Value = 0;
            for (j = -1; j <= 1; j++) {
                for (k = 0; k <= 1; k++) {
                    Value += Numbers[i + j][n + k];
                }
            }
            Numbers[i][n] = Value / 6;
        }
    }
    for (i = 0; i < Numbers.length - 1; i++) {
        for (n = Numbers.length - 1; n < Numbers.length - 2; n--) {
            var Value = 0;
            for (j = -1; j <= 1; j++) {
                for (k = 0; k <= 0; k++) {
                    Value += Numbers[i + j][n + k];
                }
            }
            Numbers[i][n] = Value / 6;
        }
    }
    for (i = 1; i < Numbers.length - 1; i++) {
        for (n = 1; n < Numbers[i].length - 1; n++) {
            var Value = 0;
            for (j = -1; j <= 1; j++) {
                for (k = -1; k <= 1; k++) {
                    Value += Numbers[i + j][n + k];
                }
            }
            Numbers[i][n] = Value / 9;
        }
    }
}

function TwoDimentionPerlinNoise(x, y) {
    return Numbers[x][y];
}

function Generare2DPerlinNoise(xLength, yLength, bluriness = 2, rangeMin = 0, rangeMax = 255) {
    var Numbers = [];

    for (i = 0; i < xLength; i++) {
        Numbers[i] = [];
        for (n = 0; n < yLength; n++) {
            Numbers[i][n] = Math.floor(Math.random() * (rangeMax - rangeMin)) + rangeMin;
        }
    }
    for (o = 0; o < bluriness; o++) {
        for (i = 1; i < Numbers.length - 1; i++) {
            for (n = 0; n < 2; n++) {
                var Value = 0;
                for (j = -1; j <= 1; j++) {
                    for (k = 0; k <= 1; k++) {
                        Value += Numbers[i + j][n + k];
                    }
                }
                Numbers[i][n] = Value / 6;
            }
        }
        for (i = 0; i < Numbers.length - 1; i++) {
            for (n = Numbers.length - 1; n < Numbers.length - 2; n--) {
                var Value = 0;
                for (j = -1; j <= 1; j++) {
                    for (k = 0; k <= 0; k++) {
                        Value += Numbers[i + j][n + k];
                    }
                }
                Numbers[i][n] = Value / 6;
            }
        }
        for (i = 1; i < Numbers.length - 1; i++) {
            for (n = 1; n < Numbers[i].length - 1; n++) {
                var Value = 0;
                for (j = -1; j <= 1; j++) {
                    for (k = -1; k <= 1; k++) {
                        Value += Numbers[i + j][n + k];
                    }
                }
                Numbers[i][n] = Value / 9;
            }
        }
    }
}

function SetUpAll() {
    var script = document.createElement("script");
    script.src = "C:/users/MRP040/downloads/other/programming club/Libraries/Debug.js";
    document.body.appendChild(script);
    var script2 = document.createElement("script");
    script2.src = "C:/users/MRP040/downloads/other/programming club/Libraries/Vectors.js";
    document.body.appendChild(script2);
}

