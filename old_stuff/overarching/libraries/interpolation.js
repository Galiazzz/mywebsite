//points are read left to right and mu is the percentage of the way from y1 to y2
//from http://paulbourke.net/miscellaneous/interpolation/

function LinearInterpolate(y1, y2, mu) {
    return (y1 * (1 - mu) + y2 * mu);
}

function CosineInterpolate(y1, y2, mu) {
    var mu2;
    mu2 = (1 - cos(mu * PI)) / 2;
    return (y1 * (1 - mu2) + y2 * mu2);
}

function CubicInterpolate(y0, y1, y2, y3, mu) {
    var a0, a1, a2, a3, mu2;

    mu2 = mu * mu;
    a0 = y3 - y2 - y0 + y1;
    a1 = y0 - y1 - a0;
    a2 = y2 - y0;
    a3 = y1;

    return (a0 * mu * mu2 + a1 * mu2 + a2 * mu + a3);
}

function SmootherCubicInterpolate(y0, y1, y2, y3, mu) {
    var a0, a1, a2, a3, mu2;

    mu2 = mu * mu;
    a0 = -0.5 * y0 + 1.5 * y1 - 1.5 * y2 + 0.5 * y3;
    a1 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3;
    a2 = -0.5 * y0 + 0.5 * y2;
    a3 = y1;

    return (a0 * mu * mu2 + a1 * mu2 + a2 * mu + a3);
}

/*
   Tension: 1 is high, 0 normal, -1 is low
   Bias: 0 is even,
         positive is towards first segment,
         negative towards the other
*/
function HermiteInterpolate(y0, y1, y2, y3, mu, tension, bias) {
    var m0, m1, mu2, mu3;
    var a0, a1, a2, a3;

    mu2 = mu * mu;
    mu3 = mu2 * mu;
    m0 = (y1 - y0) * (1 + bias) * (1 - tension) / 2;
    m0 += (y2 - y1) * (1 - bias) * (1 - tension) / 2;
    m1 = (y2 - y1) * (1 + bias) * (1 - tension) / 2;
    m1 += (y3 - y2) * (1 - bias) * (1 - tension) / 2;
    a0 = 2 * mu3 - 3 * mu2 + 1;
    a1 = mu3 - 2 * mu2 + mu;
    a2 = mu3 - mu2;
    a3 = -2 * mu3 + 3 * mu2;

    return (a0 * y1 + a1 * m0 + a2 * m1 + a3 * y2);
}