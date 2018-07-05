// 采用递归方法构建迷宫
// 迷宫的一个小方格作为一个cell，cell四边称作墙
// Step1: 把所有x方向的墙构建一个rowWalls矩阵，y方向的墙构建成colWalls矩阵
// Step2: 递归构建左上角为(i1, j1)，右下角为(i2, j2)的迷宫，方法为：
// Step3: 随机选择i1 < im < i2, j1 < jm < j2，第im行的墙和第jm行的“十”字将矩形划分为四个部分
// Step3.1: “十”字从交叉点分别向左右上下四个方向有四条线段，从中随机选择三个，然后每一个线段上随机拆掉一堵墙
// Step3.2: 递归操作由“十”字划分的四个部分，直至i1 >= i2 - 1 || j1 >= j2 - 1


var maze;

function setup(){
    createCanvas(500, 500);
	var s = 20;
	var rows = floor(height / s);
	var cols = floor(width / s);
	
	maze = new mazeSolve(rows, cols, s);
	maze.initialize();
	maze.construct(0, 0, rows, cols);
	frameRate(5);
}

function draw() {
	background(255);
	maze.display();
}

// 迷宫求解
function mazeSolve(rows, cols, s){
	this.rows = rows;
	this.cols = cols;
	this.size = s;
	this.rowWalls = [];               // 每一行的墙
	this.colWalls = [];               // 每一列的墙
	this.res = [];                    // 保存计算的步骤
	this.index = 0;
	this.finished = false;
	// 初始化
	this.initialize = function(){
		for(var i = 0; i <= this.rows; i++){
			walls = [];
			for(var j = 0; j < this.cols; j++){
				walls.push(new wall(i, j, i, j + 1, this.size));
			}
			this.rowWalls.push(walls);
		}
		for(var j = 0; j <= this.cols; j++){
			walls = [];
			for(var i = 0; i < this.rows; i++){
				walls.push(new wall(i, j, i + 1, j, this.size));
			}
			this.colWalls.push(walls);
		}
	}
	// 递归构造
	this.construct = function(i1, j1, i2, j2){
		// 递归停止条件
		if(i1 + 1 >= i2 || j1 + 1 >= j2){
			return;
		}
		// 随机选择im,jm
		var jm = floor(random(j1 + 1, j2));
		var im = floor(random(i1 + 1, i2));
		// 选择候选的墙，即在im行和jm列的墙
		var candiWalls = [];
		for(var j = j1; j < j2; j++){
			candiWalls.push(this.rowWalls[im][j]);
		}
		for(var i = i1; i < i2; i++){
			candiWalls.push(this.colWalls[jm][i]);
		}
		// 选择四条线段里面的三条，每一条上面随机选择一个拆掉
		var selectedType = [];
		while(selectedType.length < 3){
			var randIndex = floor(random(0, candiWalls.length));
			var selWall = candiWalls[randIndex];
			var selType;            // 选择的类型，即在候选墙里面随机选一个，属于哪个线段
			if(selWall.i1 == selWall.i2){
				if(selWall.j1 < jm){
					selType = 0;
				}else if(selWall.j1 >= jm){
					selType = 1;
				}
			}
			if(selWall.j1 == selWall.j2){
				if(selWall.i1 < im){
					selType = 2;
				}else if(selWall.i1 >= im){
					selType = 3;
				}
			}
			var sameType = false;
			for(var k = 0; k < selectedType.length; k++){
				if(selectedType[k] == selType){
					sameType = true;
				}
			}
			// 如果该线段以经选过了，则重新选
			if(sameType){
				continue;
			}
			// 设置该线段类型已经访问过，拆掉这个墙，保存结果
			selectedType.push(selType);
			if(selWall.i1 == selWall.i2){
				var resw = new resWall(this.rowWalls[selWall.i1][selWall.j1], im, jm, i1, i2, j1, j2);
				this.res.push(resw);
			}else if(selWall.j1 == selWall.j2){
				var resw = new resWall(this.colWalls[selWall.j1][selWall.i1], im, jm, i1, i2, j1, j2);
				this.res.push(resw);
			}
		}
		// 递归构建
		this.construct(i1, j1, im, jm);
		this.construct(i1, jm, im, j2);
		this.construct(im, j1, i2, jm);
		this.construct(im, jm, i2, j2);
	}
	// 根据保存的计算结果绘制
	this.display = function(){
		var reswall = this.res[this.index];
		
		reswall.wall.breaked = true;
		reswall.wall.visited = true;
		for(var j = reswall.j1; j < reswall.j2; j++){
			if(this.rowWalls[reswall.row][j].visited == false){
				this.rowWalls[reswall.row][j].breaked = false;
			}
			this.rowWalls[reswall.row][j].isHighlight(true);
		}
		for(var i = reswall.i1; i < reswall.i2; i++){
			if(this.colWalls[reswall.col][i].visited == false){
				this.colWalls[reswall.col][i].breaked = false
			}
			this.colWalls[reswall.col][i].isHighlight(true);
		}
		
		for(var i = 0; i <= this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.rowWalls[i][j].show();
			}
		}
		for(var j = 0; j <= this.cols; j++){
			for(var i = 0; i < this.rows; i++){
			    this.colWalls[j][i].show();
			}
		}
		
		this.index++;
		if(this.index == this.res.length){
			this.finished = true;
			this.index = this.res.length - 1;
		}
	}
}

function resWall(wall, row, col, i1, i2, j1, j2){
	this.wall = wall;
	this.row = row;
	this.col = col;
	this.i1 = i1;
	this.i2 = i2;
	this.j1 = j1;
	this.j2 = j2;
}

function wall(i1, j1, i2, j2, s){
	this.i1 = i1;
	this.j1 = j1;
	this.i2 = i2;
	this.j2 = j2;
	this.s = s;
	this.breaked = true;
	this.ishigh = false;
	this.visited = false;
	this.isHighlight = function(ishigh){
		this.ishigh = ishigh;
	}
	this.show = function(){
		if(this.breaked == false){
			if(this.ishigh){
				stroke(255, 0, 0);
				strokeWeight(4);
			}else{
				stroke(0);
				strokeWeight(2);
			}
			line(this.j1 * this.s, this.i1 * this.s, this.j2 * this.s, this.i2 * s);
		}
	}
}