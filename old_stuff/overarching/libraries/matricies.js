function CopyMatrix(matrix){
    var copied = new Matrix(matrix.rows, matrix.columns);
    for(var i = 0; i < matrix.rows; i++){
        for(var n = 0; n < matrix.columns; n++){
            copied.SetValue(i, n, matrix.GetValue(i, n));
        }
    }
}
class Matrix {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.values = [];
        for (var i = 0; i < columns; i++) {
            this.values[i] = [];
            for (var n = 0; n < rows; n++) {
                this.values[i][n] = 0;
            }
        }
    }

    /*
       [[1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]]
    */

    SetToValues(values) {
        var isDifferent = false;
        if (values.length != this.rows) {
            isDifferent = true;
        }
        for (var i = 0; i < values.length; i++) {
            if (values[i].length != this.columns) {
                isDifferent = true;
            }
        }
        if (!isDifferent) {
            for (var i = 0; i < this.rows; i++) {
                for (var n = 0; n < this.columns; n++) {
                    this.values[n][i] = values[i][n];
                }
            }
        }
        else {
            console.error("Provided arrays have different lengths than matrix dimentions");
        }
    }

    Fill(value) {
        for (var i = 0; i < this.columns; i++) {
            for (var n = 0; n < this.rows; n++) {
                this.values[i][n] = value;
            }
        }
    }

    GetValue(row, column) {
        return this.values[column][row];
    }

    SetValue(row, column, value) {
        this.values[column][row] = value;
    }

    GetVectorOfColumn(column) {
        if (this.rows == 2) {
            return new Vec2(this.GetValue(0, column), this.GetValue(1, column));
        }
        else if (this.rows == 3) {
            return new Vec3(this.GetValue(0, column), this.GetValue(1, column), this.GetValue(2, column));
        }
        else {
            var values = [];
            for (var i = 0; i < this.rows; i++) {
                values.push(this.GetValue(i, column));
            }
            return new VecN(this.rows, values);
        }
    }

    Eval(vec) {
        if (vec.dim == this.columns) {
            if (vec.dim == 2) {
                return this.GetVectorOfColumn(0).Mul(vec.x).Add(this.GetVectorOfColumn(1).Mul(vec.y));
            }
            else if (vec.dim == 3) {
                return this.GetVectorOfColumn(0).Mul(vec.x).Add(this.GetVectorOfColumn(1).Mul(vec.y)).Add(this.GetVectorOfColumn(2).Mul(vec.z));
            }
            else {
                var Vec;
                if (this.rows == 2) {
                    Vec = new Vec2(0, 0);
                }
                else if (this.rows == 3) {
                    Vec = new Vec3(0, 0, 0);
                }
                else {
                    Vec = new VecN(this.rows, null);
                }

                for (var i = 0; i < this.columns; i++) {
                    Vec.AddE(this.GetVectorOfColumn(i).Mul(vec.values[i]));
                }
                return Vec;
            }
        }
    }

    PrintMatrix() {
        var line = ""
        for (var i = 0; i < this.rows; i++) {
            line += "[";
            for (var n = 0; n < this.columns; n++) {
                line += this.values[n][i] + ", ";
            }
            line += "],\n";
        }
        console.log(line);
    }
}