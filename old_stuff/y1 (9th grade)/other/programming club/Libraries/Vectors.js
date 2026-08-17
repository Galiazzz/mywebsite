class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Equals(num) {
        this.x = num;
        this.y = num;
    }
    Add(num) {
        if (typeof num == "number") {
            this.x += num;
            this.x += num;
        }
        else if (typeof num == "object") {
            this.x += num.x;
            this.y += num.y;
        }
    }
    Sub(num) {
        if (typeof num == "number") {
            this.x -= num;
            this.x -= num;
        }
        else if (typeof num == "object") {
            this.x -= num.x;
            this.y -= num.y;
        }
    }
    Mult(num) {
        if (typeof num == "number") {
            this.x *= num;
            this.x *= num;
        }
        else if (typeof num == "object") {
            this.x *= num.x;
            this.y *= num.y;
        }
    }
    Divide(num) {
        if (typeof num == "number") {
            this.x /= num;
            this.x /= num;
        }
        else if (typeof num == "object") {
            this.x /= num.x;
            this.y /= num.y;
        }
    }
    Mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    Normalize() {
        var m = this.Mag();
        this.Divide(m);
    }

    Clamp(xMax, xMin, yMax, yMin) {
        if (this.x > xMax) {
            this.x = xMax;
        }
        if (this.x < xMin) {
            this.x = xMin;
        }
        if (this.y > yMax) {
            this.y = yMax
        }
        if (this.y < yMin) {
            this.y = yMin;
        }
    }

    CalcVelocity(x, y, xSpeed, ySpeed) {
        return [x + xSpeed, y + ySpeed];
    }

    ToSlope(x1, y1, x2, y2) {
        return (y2 - y1) / (x2 - x1);
    }
}

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Equals(num) {
        this.x = num;
        this.y = num;
        this.z = num;
    }
    Add(num) {
        if (typeof num == "number") {
            this.x += num;
            this.x += num;
            this.z += num;
        }
        else if (typeof num == "object") {
            this.x += num.x;
            this.y += num.y;
            this.z += num.z;
        }
        //return new Vector3(this.x, this.y, this.z);
    }
    Sub(num) {
        if (typeof num == "number") {
            this.x -= num;
            this.x -= num;
            this.z -= num;
        }
        else if (typeof num == "object") {
            this.x -= num.x;
            this.y -= num.y;
            this.z -= num.z;
        }
        //return new Vector3(this.x, this.y, this.z);
    }
    Mult(num) {
        if (typeof num == "number") {
            this.x *= num;
            this.x *= num;
            this.z *= num;
        }
        else if (typeof num == "object") {
            this.x *= num.x;
            this.y *= num.y;
            this.z *= num.z;
        }
        //return new Vector3(this.x, this.y, this.z);
    }
    Divide(num) {
        if (typeof num == "number") {
            this.x /= num;
            this.x /= num;
            this.z /= num;
        }
        else if (typeof num == "object") {
            this.x /= num.x;
            this.y /= num.y;
            this.z /= num.z;
        }
        //return new Vector3(this.x, this.y, this.z);
    }
}

function DistanceVec3(vec1, vec2) {
    return Math.sqrt((vec1.x - vec2.x) * (vec1.x - vec2.x) + (vec1.y - vec2.y) * (vec1.y - vec2.y) + (vec1.z - vec2.z) * (vec1.z - vec2.z));
}

function DistanceVec2(vec1, vec2) {
    return Math.sqrt((vec1.x - vec2.x) * (vec1.x - vec2.x) + (vec1.y - vec2.y) * (vec1.y - vec2.y));
}