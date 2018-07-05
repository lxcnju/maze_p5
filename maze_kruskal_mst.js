// 采用Kruskal方法构建最小树
// 迷宫的一个小方格作为一个cell，cell四边称作墙
// Step1: 把所有的墙放入一个数组，随机排序
// Step2: 对所有的cell建立并查集，初始时每个cell是单独一个集合，以本身为父根结点
// Step3: 按顺序访问墙数组，选择一个墙
// Step4: 如果该墙连接的两个cell属于同一个集合，那么不做处理；否则拆掉这墙，然后合并两个cell所在的集合

var maze;

function setup(){
    createCanvas(500, 500);
	var s = 20;
	var rows = floor(height / s);
	var cols = floor(width / s);
	
	maze = new mazeSolve(rows, cols, s);
	maze.initialize();
	frameRate(10);
}

function draw() {
	background(255);
	maze.constructOneStep();
	maze.display();
}

// 迷宫求解
function mazeSolve(rows, cols, s){
	this.rows = rows;
	this.cols = cols;
	this.size = s;                        // 方格大小
	this.walls = [];                      // 墙的数组   
	this.uSet = new unionSet();           // 方格的并查集
	this.wallIndex = 0;
	this.initialize = function(){
		// x与y方向的墙
		for(var i = 0; i <= this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.walls.push(new wall(i, j, i, j + 1, this.size));
			}
		}
		for(var j = 0; j <= this.cols; j++){
			for(var i = 0; i < this.rows; i++){
				this.walls.push(new wall(i, j, i + 1, j, this.size));
			}
		}
		// 随机排序
		this.walls.sort(function randomSort(a, b){return Math.random() > 0.5 ? -1 : 1;});
		for(var i = 0; i < this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.uSet.uset.push(new cell(i, j, this.rows, this.cols));
			}
		}
	}
	// 绘制
	this.display = function(){
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].isHighlight(false);
		}
		this.walls[this.wallIndex].isHighlight(true);
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].show();
		}
	}
	// 逐步构建
	this.constructOneStep = function(){
		var wall = this.walls[this.wallIndex];          // 按顺序选择墙
		var isBorder = (wall.i1 == wall.i2 && (wall.i1 == 0 || wall.i1 == this.rows)) || (wall.j1 == wall.j2 && (wall.j1 == 0 || wall.j1 == this.cols));
		// 不是边界
		if(isBorder == false){
			var c1Index, c2Index;
			if(wall.i1 == wall.i2){
				c1Index = (wall.i1 - 1) * this.cols + wall.j1;
				c2Index = wall.i1 * this.cols + wall.j1;
			}else if(wall.j1 == wall.j2){
				c1Index = wall.i1 * this.cols + wall.j1 - 1;
				c2Index = wall.i1 * this.cols + wall.j1;
			}
			var p1 = this.uSet.findParent(c1Index);          // 并查集里面寻找父根结点
			var p2 = this.uSet.findParent(c2Index);
			if (p1 != p2){
				this.walls[this.wallIndex].breaked = true;   // 拆除
				this.uSet.unionTwo(c1Index, c2Index);        // 合并
			}
		}
		this.wallIndex++;
		if(this.wallIndex >= this.walls.length){
			this.wallIndex = this.walls.length - 1;
		}
	}
}

// 并查集
function unionSet(){
	this.uset = [];
	this.findParent= function(ind){
		var pind = this.uset[ind].parent;
		if(pind == ind){
			return ind;
		}
		var res = this.findParent(pind);
		this.uset[ind].parent = res;
		return res;
	}
	this.unionTwo = function(ind1, ind2){
		var p1 = this.findParent(ind1);
		var p2 = this.findParent(ind2);
		this.uset[p1].parent = p2;
	}
}

// cell
function cell(i, j, rows, cols){
	this.i = i;      // 行坐标
	this.j = j;      // 列坐标
	this.rows = rows;
	this.cols = cols;
	this.parent = i * cols + j;
	this.index = i * cols + j;
}

// wall
function wall(i1, j1, i2, j2, s){
	this.i1 = i1;
	this.j1 = j1;
	this.i2 = i2;
	this.j2 = j2;
	this.s = s;
	this.breaked = false;
	this.ishigh = false;                  // 是否高亮显示，当前处理的墙才高亮显示
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