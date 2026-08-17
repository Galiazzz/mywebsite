
function CopyVec2(vec) { return new Vec2(vec.x, vec.y); }
class Vec2 {
    constructor(x, y) { this.x = x; this.y = y; this.dim = 2; }

    Magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    Normalize() { var v = this.Magnitude(); return new Vec2(this.x / v, this.y / v); }
    Dot(vec) { return this.x * vec.x + this.y * vec.y; }

    Add(vec) { return new Vec2(this.x + vec.x, this.y + vec.y); }
    Sub(vec) { return new Vec2(this.x - vec.x, this.y - vec.y); }
    Mul(val) { return new Vec2(this.x * val, this.y * val); }
    Div(val) { return new Vec2(this.x / val, this.y / val); }

    AddE(vec) { this.x += vec.x; this.y += vec.y; }
    SubE(vec) { this.x -= vec.x; this.y -= vec.y; }
    MulE(val) { this.x *= val; this.y *= val; }
    DivE(val) { this.x /= val; this.y /= val; }
}

function CopyVec3(vec) { return new Vec3(vec.x, vec.y, vec.z); }
class Vec3 {
    constructor(x, y, z) { this.x = x; this.y = y; this.z = z; this.dim = 3; }

    Magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    Normalize() { var v = this.Magnitude(); return new Vec3(this.x / v, this.y / v, this.z / v); }
    Dot(vec) { return this.x * vec.x + this.y * vec.y + this.z * vec.z; }

    Add(vec) { return new Vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z); }
    Sub(vec) { return new Vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z); }
    Mul(val) { return new Vec3(this.x * val, this.y * val, this.z * val); }
    Div(val) { return new Vec3(this.x / val, this.y / val, this.z / val); }

    AddE(vec) { this.x += vec.x; this.y += vec.y; this.z += vec.z; }
    SubE(vec) { this.x -= vec.x; this.y -= vec.y; this.z -= vec.z; }
    MulE(val) { this.x *= val; this.y *= val; this.z *= val; }
    DivE(val) { this.x /= val; this.y /= val; this.z /= val; }
}

function CopyVec4(vec) {return new Vec4(vec.x, vec.y, vec.z, vec.w);}
class Vec4 {
    constructor(x, y, z, w) { this.x = x, this.y = y, this.z = z; this.w = w; this.dim = 4; }

    Magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w); }
    Normalize() { var v = this.Magnitude(); return new Vec4(this.x / v, this.y / v, this.z / v, this.w / v); }
    Dot() { return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w; }

    Add(vec) { return new Vec4(this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w); }
    Sub(vec) { return new Vec4(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w); }
    Mul(val) { return new Vec4(this.x * val, this.y * val, this.z * val, this.w * val); }
    Div(val) { return new Vec4(this.x / val, this.y / val, this.z / val, this.w / val); }

    AddE(vec) { this.x += vec.x; this.y += vec.y; this.z += vec.z; this.w += vec.w; }
    SubE(vec) { this.x -= vec.x; this.y -= vec.y; this.z -= vec.z; this.w -= vec.w; }
    MulE(val) { this.x *= val; this.y *= val; this.z *= val; this.w *= val; }
    DivE(val) { this.x /= val; this.y /= val; this.z /= val; this.w /= val; }
}

function CopyVecN(vec) {
    return new VecN(vec.dim, [...vec.values]);
}
class VecN {
    constructor(dim, values) {
        if (values == null || values == undefined) {
            this.dim = dim;
            this.values = [];
            for (var i = 0; i < this.dim; i++) {
                this.values.push(0);
            }
        }
        else {
            if (dim != values.length) {
                if (dim < values.length) {
                    this.dim = dim;
                    this.values = [];
                    for (var i = 0; i < dim; i++) {
                        this.values.push(values[i]);
                    }
                }
                else {
                    this.values = [...values];
                    this.dim = values.length;
                }
            }
            else {
                this.dim = dim;
                this.values = [...values];
            }
        }
    }

    Magnitude() {
        var sum = 0;
        for (var i = 0; i < this.dim; i++) {
            sum += this.values[i] * this.values[i];
        }
        return Math.sqrt(sum);
    }
    Normalize() {
        var v = this.Magnitude();
        var copyValues = [];
        for (var i = 0; i < this.dim; i++) {
            copyValues.push(this.values[i] / v);
        }
        return new VecN(this.dim, copyValues);
    }
    Dot(vec) {
        if (this.dim == vec.dim) {
            var sum = 0;
            for (var i = 0; i < this.dim; i++) {
                sum += this.values[i] * vec.values[i];
            }
            return sum;
        }
        else {
            console.error("VectorN dimention mismatch when calculating dot product");
        }
    }

    Add(vec) {
        if (this.dim == vec.dim) {
            var copyValues = [...this.values];
            for (var i = 0; i < this.dim; i++) {
                copyValues[i] += vec.values[i];
            }
            return new VecN(this.dim, copyValues);
        }
        else {
            console.error("VectorN dimention mismatch when adding");
        }
    }
    Sub(vec) {
        if (this.dim == vec.dim) {
            var copyValues = [...this.values];
            for (var i = 0; i < this.dim; i++) {
                copyValues[i] -= vec.values[i];
            }
            return new VecN(this.dim, copyValues);
        }
        else {
            console.error("VectorN dimention mismatch when subtracting");
        }
    }
    Mul(val) {
        var copyValues = [...this.values];
        for (var i = 0; i < this.dim; i++) {
            copyValues[i] *= val;
        }
        return new VecN(this.dim, copyValues);
    }
    Div(val) {
        var copyValues = [...this.values];
        for (var i = 0; i < this.dim; i++) {
            copyValues[i] /= val;
        }
        return new VecN(this.dim, copyValues);
    }

    AddE(vec) {
        if (this.dim == vec.dim) {
            for (var i = 0; i < this.dim; i++) {
                this.values[i] += vec.values[i];
            }
        }
        else {
            console.error("VectorN dimention mismatch when calculating +=");
        }
    }
    SubE(vec) {
        if (this.dim == vec.dim) {
            for (var i = 0; i < this.dim; i++) {
                this.values[i] -= vec.values[i];
            }
        }
        else {
            console.error("VectorN dimention mismatch when calculating -=");
        }
    }
    MulE(val) {
        for (var i = 0; i < this.dim; i++) {
            this.values[i] *= val;
        }
    }
    DivE(val) {
        for (var i = 0; i < this.dim; i++) {
            this.values[i] /= val;
        }
    }
}