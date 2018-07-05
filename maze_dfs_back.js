// 采用DFS + Back的方法构建
// 迷宫的一个小方格作为一个cell，cell四边称作墙
// Step1: 选择开始的cell，设置访问过标记
// Step2: 如果还有未访问过的cell
// Step2.1: 如果当前cell有一些邻居没有访问过，随机选择一个未访问过的邻居，将当前cell加入栈，拆掉当前cell和选择的邻居之间的墙，将选择的邻居设置为当前cell，设置为已访问
// Step2.2: 如果当前cell所有邻居都访问过了，且如果栈非空，那么从栈里面pop出一个cell，设置为当前cell
 

var mp;           // mazePanel 保存迷宫的方格cell相关数据结构
var maze;         // constructMaze 构建迷宫

function setup(){
    createCanvas(500, 500);
	var s = 20;                     // 小方格大小
	var m = floor(height / s);
	var n = floor(width / s);
	mp = new mazePanel(s, m, n);    // mp mp.grids是个二维数组
	for(var i = 0; i < m; i++){
		var rowGrids = [];
		for(var j = 0; j < n; j++){
			rowGrids.push(new cell(i, j, s));
		}
		mp.grids.push(rowGrids);
	}
	maze = new constructMaze(mp, 0, 0);
}

function draw() {
	background(255);
	
	maze.constructOneStep();    // 逐步构建
	
	displayMaze();              // 显示
}


// 每个小方格cell
function cell(i, j, s){
	this.i = i;      // 行坐标
	this.j = j;      // 列坐标
	this.size = s;   // 大小
	this.visited = false;  // 是否访问过
	this.visible = [true, true, true, true];   // 上 右 下 左
	this.display = function(){
		stroke(0);
		strokeWeight(2);
		if(this.visible[0]){
			line(this.j * this.size, this.i * this.size, (this.j + 1) * this.size, this.i * this.size);
		}
		if(this.visible[1]){
			line((this.j + 1) * this.size, this.i * this.size, (this.j + 1) * this.size, (this.i + 1) * this.size);
		}
		if(this.visible[2]){
			line(this.j * this.size, (this.i + 1) * this.size, (this.j + 1) * this.size, (this.i + 1) * this.size);
		}
		if(this.visible[3]){
			line(this.j * this.size, this.i * this.size, this.j * this.size, (this.i + 1) * this.size);
		}
	}
	this.paint = function(){
		fill(255, 0, 0);
		rect(this.j * this.size, this.i * this.size, this.size, this.size);
	}
	this.setInvisible = function(d){
		this.visible[d] = false;
	}
	this.setVisited = function(){
		this.visited = true;
	}
}

// 迷宫数据结构
function mazePanel(s, m, n){
	this.size = s;
	this.rows = m;
	this.cols = n;
	this.grids = [];
}

// 展示
function displayMaze(){
	for(var i = 0; i < mp.rows; i++){
		for(var j = 0; j < mp.cols; j++){
			mp.grids[i][j].display();
		}
	}
	maze.mp.grids[maze.starti][maze.startj].paint();
}


// 构建迷宫的数据结构
function constructMaze(mazePanel, i, j){
	this.mp = mazePanel;
	this.starti = i;
	this.startj = j;
	this.stack = [new cell(i, j, mazePanel.size)];        // 栈，DFS的关键，用于回溯
	this.xstep = [0, 0, 1, -1];
	this.ystep = [-1, 1, 0, 0];
	this.finished = false;
	// 下一步
	this.constructOneStep = function(){
		if(this.finished){
			return;
		}
		var candiNeis = [];                               // 未访问过的邻居
		var hasNeis = false;
		for(var k = 0; k < 4; k++){
			var nei = this.starti + this.xstep[k];
			var nej = this.startj + this.ystep[k];
			if(nei >= 0 && nei < this.mp.rows && nej >= 0 && nej < this.mp.cols && this.mp.grids[nei][nej].visited == false){
				hasNeis = true;
				candiNeis.push(this.mp.grids[nei][nej]);
			}
		}
		
		if(hasNeis == false){
			var len = this.stack.length;
			if(len > 1){
				this.starti = this.stack[len - 1].i;
				this.startj = this.stack[len - 1].j;
				this.stack.splice(len - 1, 1);           // 出栈
			}else{
				this.finished = true;
			}
		}else{
			var ri = floor(random(candiNeis.length));
			var neiCell = candiNeis[ri];
			this.stack.push(neiCell);
			this.breakWall(this.starti, this.startj, neiCell.i, neiCell.j);   // 拆墙
			this.starti = neiCell.i;
			this.startj = neiCell.j;
			this.mp.grids[neiCell.i][neiCell.j].setVisited();                 // 设置为已访问
		}
	}
	// 拆掉两个方格之间的墙
	this.breakWall = function(i1, j1, i2, j2){
		if(i2 == i1 - 1 && j1 == j2){
			this.mp.grids[i1][j1].setInvisible(0);
			this.mp.grids[i2][j2].setInvisible(2);
		}
		if(i2 == i1 + 1 && j1 == j2){
			this.mp.grids[i1][j1].setInvisible(2);
			this.mp.grids[i2][j2].setInvisible(0);
		}
		if(i2 == i1 && j2 == j1 - 1){
			this.mp.grids[i1][j1].setInvisible(3);
			this.mp.grids[i2][j2].setInvisible(1);
		}
		if(i2 == i1 && j2 == j1 + 1){
			this.mp.grids[i1][j1].setInvisible(1);
			this.mp.grids[i2][j2].setInvisible(3);
		}
	}
}