

class Node {
	constructor(CenterX, CenterY, CenterZ, Radius, Level) {
		this.numPoints = 0;
		this.centerX = CenterX;
		this.centerY = CenterY;
		this.centerZ = CenterZ;
		this.radius = Radius;
		this.level = Level
		this.isLowestLevel = true;
		this.children = [];
		this.corners = [];
		for (var x = -1; x <= 1; x+=2) {
			for (var y = -1; y <= 1; y+=2) {
				for (var z = -1; z <= 1; z+=2) {
					this.corners.push({ x: this.centerX + x * this.radius, y: this.centerY + y * this.radius, z: this.centerZ + z * this.radius });
				}
			}
		}
		this.positionBuffer;
		this.colorBuffer;
		this.VAO;
	}

	finishSetUp() {
		var positionData = [
			this.corners[XYZToIndex(0, 0, 0)].x, this.corners[XYZToIndex(0, 0, 0)].y, this.corners[XYZToIndex(0, 0, 0)].z,
			this.corners[XYZToIndex(1, 0, 0)].x, this.corners[XYZToIndex(1, 0, 0)].y, this.corners[XYZToIndex(1, 0, 0)].z,

			this.corners[XYZToIndex(0, 0, 0)].x, this.corners[XYZToIndex(0, 0, 0)].y, this.corners[XYZToIndex(0, 0, 0)].z,
			this.corners[XYZToIndex(0, 1, 0)].x, this.corners[XYZToIndex(0, 1, 0)].y, this.corners[XYZToIndex(0, 1, 0)].z,

			this.corners[XYZToIndex(0, 0, 0)].x, this.corners[XYZToIndex(0, 0, 0)].y, this.corners[XYZToIndex(0, 0, 0)].z,
			this.corners[XYZToIndex(0, 0, 1)].x, this.corners[XYZToIndex(0, 0, 1)].y, this.corners[XYZToIndex(0, 0, 1)].z,

			this.corners[XYZToIndex(1, 0, 0)].x, this.corners[XYZToIndex(1, 0, 0)].y, this.corners[XYZToIndex(1, 0, 0)].z,
			this.corners[XYZToIndex(1, 1, 0)].x, this.corners[XYZToIndex(1, 1, 0)].y, this.corners[XYZToIndex(1, 1, 0)].z,

			this.corners[XYZToIndex(1, 0, 0)].x, this.corners[XYZToIndex(1, 0, 0)].y, this.corners[XYZToIndex(1, 0, 0)].z,
			this.corners[XYZToIndex(1, 0, 1)].x, this.corners[XYZToIndex(1, 0, 1)].y, this.corners[XYZToIndex(1, 0, 1)].z,

			this.corners[XYZToIndex(0, 0, 1)].x, this.corners[XYZToIndex(0, 0, 1)].y, this.corners[XYZToIndex(0, 0, 1)].z,
			this.corners[XYZToIndex(1, 0, 1)].x, this.corners[XYZToIndex(1, 0, 1)].y, this.corners[XYZToIndex(1, 0, 1)].z,

			this.corners[XYZToIndex(0, 0, 1)].x, this.corners[XYZToIndex(0, 0, 1)].y, this.corners[XYZToIndex(0, 0, 1)].z,
			this.corners[XYZToIndex(0, 1, 1)].x, this.corners[XYZToIndex(0, 1, 1)].y, this.corners[XYZToIndex(0, 1, 1)].z,

			this.corners[XYZToIndex(0, 1, 0)].x, this.corners[XYZToIndex(0, 1, 0)].y, this.corners[XYZToIndex(0, 1, 0)].z,
			this.corners[XYZToIndex(0, 1, 1)].x, this.corners[XYZToIndex(0, 1, 1)].y, this.corners[XYZToIndex(0, 1, 1)].z,

			this.corners[XYZToIndex(0, 1, 0)].x, this.corners[XYZToIndex(0, 1, 0)].y, this.corners[XYZToIndex(0, 1, 0)].z,
			this.corners[XYZToIndex(1, 1, 0)].x, this.corners[XYZToIndex(1, 1, 0)].y, this.corners[XYZToIndex(1, 1, 0)].z,

			this.corners[XYZToIndex(1, 1, 1)].x, this.corners[XYZToIndex(1, 1, 1)].y, this.corners[XYZToIndex(1, 1, 1)].z,
			this.corners[XYZToIndex(1, 0, 1)].x, this.corners[XYZToIndex(1, 0, 1)].y, this.corners[XYZToIndex(1, 0, 1)].z,

			this.corners[XYZToIndex(1, 1, 1)].x, this.corners[XYZToIndex(1, 1, 1)].y, this.corners[XYZToIndex(1, 1, 1)].z,
			this.corners[XYZToIndex(1, 1, 0)].x, this.corners[XYZToIndex(1, 1, 0)].y, this.corners[XYZToIndex(1, 1, 0)].z,

			this.corners[XYZToIndex(1, 1, 1)].x, this.corners[XYZToIndex(1, 1, 1)].y, this.corners[XYZToIndex(1, 1, 1)].z,
			this.corners[XYZToIndex(0, 1, 1)].x, this.corners[XYZToIndex(0, 1, 1)].y, this.corners[XYZToIndex(0, 1, 1)].z
		];
		if (this.isLowestLevel) {
			for (var star of this.children) {
				positionData.push(star.x);
				positionData.push(star.y);
				positionData.push(star.z);
			}
		}

		this.VAO = gl.createVertexArray();
		gl.bindVertexArray(this.VAO);
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

		var colorData = [];
		for(var i = 0; i < 24; i++){
			colorData.push((this.level + 1) & 4);
			colorData.push((this.level + 1) & 2);
			colorData.push((this.level + 1) & 1);
			colorData.push(1);
		}
		if (this.isLowestLevel) {
			for (var star of this.children) {
				colorData.push(star.r);
				colorData.push(star.g);
				colorData.push(star.b);
				colorData.push(1);
			}
		}

			gl.bindVertexArray(this.VAO);
			this.colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(1);
			gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

		if(!this.isLowestLevel){
			for(var i = 0; i < this.children.length; i++){
				this.children[i].finishSetUp();
			}
		}

	}

	draw(){
		if(this.isVisible()){
			
			if(this.isLowestLevel){
				gl.useProgram(starProgram);
				gl.bindVertexArray(this.VAO);
				if(drawOctreeNodeBoundaries){
					gl.drawArrays(gl.LINES, 0, 24);
				}
				gl.drawArrays(gl.POINTS, 24, this.numPoints);
			}
			else{
				if(drawOctreeNodeBoundaries){
					gl.useProgram(starProgram);
					gl.bindVertexArray(this.VAO);
					gl.drawArrays(gl.LINES, 0, 24);
				}
				for(var i = 0; i < this.children.length; i++){
					this.children[i].draw();
				}
			}
		}
	}

	addPoint(x, y, z, r, g, b) {
		if (x > this.centerX - this.radius && x < this.centerX + this.radius &&
			  y > this.centerY - this.radius && y < this.centerY + this.radius &&
			  z > this.centerZ - this.radius && z < this.centerZ + this.radius) {
			this.numPoints++;
			if(this.isLowestLevel){
				this.children.push({ x: x, y: y, z: z, r: r, g: g, b: b });
			}
			else{
				var octantX = x > this.centerX;
				var octantY = y > this.centerY;
				var octantZ = z > this.centerZ;
				this.children[XYZToIndex(octantX, octantY, octantZ)].addPoint(x, y, z, r, g, b);
			}
			this.reconstructTree();
			return true;
		}
		return false;
	}

	reconstructTree() {
		if (this.children.length >= 40000) {
			var newNodes = [];
			var smallerSize = this.radius / 2;
			for (var z = -1; z <= 1; z+=2) {
				for (var y = -1; y <= 1; y+=2) {
					for (var x = -1; x <= 1; x+=2) {
						newNodes.push(new Node(this.centerX + x * smallerSize, this.centerY + y * smallerSize, this.centerZ + z * smallerSize, smallerSize, this.level + 1));
					}
				}
			}
			for (var point of this.children) {
				var octantX = point.x > this.centerX;
				var octantY = point.y > this.centerY;
				var octantZ = point.z > this.centerZ;
				newNodes[XYZToIndex(octantX, octantY, octantZ)].addPoint(point.x, point.y, point.z, point.r, point.g, point.b);
			}
			this.children.length = 0;
			this.children = [...newNodes];
			this.isLowestLevel = false;
		}
	}

	isVisible() {

		var distance = Math.hypot(Math.max(Math.abs(camX - this.centerX) - this.radius, 0), Math.max(Math.abs(camY - this.centerY) - this.radius, 0), Math.max(Math.abs(camZ - this.centerZ) - this.radius, 0));
		if(distance > chunkRenderDistance) {return false};
		
		var screen = [];
		for (var point of this.corners) {
			var transformed = applyMatrix3x3ToPoint(rot3, {x:point.x - camX, y:point.y - camY, z:point.z - camZ});
			var xPos = transformed.x / Math.abs(transformed.z);
			var yPos = transformed.y / Math.abs(transformed.z) 
			screen.push({ x: xPos, y: yPos});
			if(-1 <= xPos && xPos <= 1 && -1 <= yPos && yPos <= 1){
				return true;
			}
		}
		for (var x = 0; x <= 1; x++) {
			for (var y = 0; y <= 1; y++) {
				for (var z = 0; z <= 1; z++) {
					var currentIndex = XYZToIndex(x, y, z);
					var oppositeIndex = XYZToIndex(1 - x, 1 - y, 1 - z);
					var tx1 = (1 - screen[currentIndex].x) / (screen[oppositeIndex].x - screen[currentIndex].x);
					var tx2 = (-1 - screen[currentIndex].x) / (screen[oppositeIndex].x - screen[currentIndex].x);
					var ty1 = (1 - screen[currentIndex].y) / (screen[oppositeIndex].y - screen[currentIndex].y);
					var ty2 = (-1 - screen[currentIndex].y) / (screen[oppositeIndex].y - screen[currentIndex].y);
					if ((tx1 >= 0 && tx1 <= 1) || (tx2 >= 0 && tx2 <= 1) || (ty1 >= 0 && ty1 <= 1) || (ty2 >= 0 && ty2 <= 1)) {
						return true;
					}
				}
			}
		}
		return false;
	}
}

function XYZToIndex(x, y, z) {
	return z * 4 + y * 2 + x;
}

function applyMatrix3x3ToPoint(mat, point) {
	return {
		x: point.x * mat[0] + point.y * mat[1] + point.z * mat[2],
		y: point.x * mat[3] + point.y * mat[4] + point.z * mat[5],
		z: point.x * mat[6] + point.y * mat[7] + point.z * mat[8]
	};
}

function inScreen(point) {
	return point.x > -1 && point.x < 1 && point.y > -1 && point.y < 1;
}