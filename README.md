# maze_p5
Three methods to generate a 2D maze, and draw the constructing process using p5.js.

* 代码架构
* 迷宫生成方法
  * DFS
  * Kruskal最小树
  * 递归

## 代码架构
 * home.html  用浏览器打开，主页
 * maze_dfs_back.js  用dfs+回溯求解
 * maze_kruskal_mst.js  用最小生成树生成
 * maze_recur.js  递归生成

## 迷宫生成方法
  * DFS <br>
    * 迷宫的一个小方格作为一个cell，cell四边称作墙
    * Step1: 选择开始的cell，设置访问过标记
    * Step2: 如果还有未访问过的cell
      * Step2.1: 如果当前cell有一些邻居没有访问过，随机选择一个未访问过的邻居，将当前cell加入栈，拆掉当前cell和选择的邻居之间的墙，将选择的邻居设置为当前cell，设置为已访问
      * Step2.2: 如果当前cell所有邻居都访问过了，且如果栈非空，那么从栈里面pop出一个cell，设置为当前cell
    ![DFS生成迷宫实例](https://github.com/lxcnju/maze_p5/blob/master/maze_dfs.gif)
    
  * Kruskal最小树 <br>
    * 迷宫的一个小方格作为一个cell，cell四边称作墙
    * Step1: 把所有的墙放入一个数组，随机排序
    * Step2: 对所有的cell建立并查集，初始时每个cell是单独一个集合，以本身为父根结点
    * Step3: 按顺序访问墙数组，选择一个墙
    * Step4: 如果该墙连接的两个cell属于同一个集合，那么不做处理；否则拆掉这墙，然后合并两个cell所在的集合
    ![Kruskal生成迷宫实例](https://github.com/lxcnju/maze_p5/blob/master/maze_mst.gif)
    
  * 递归 <br>
    * 迷宫的一个小方格作为一个cell，cell四边称作墙
    * Step1: 把所有x方向的墙构建一个rowWalls矩阵，y方向的墙构建成colWalls矩阵
    * Step2: 递归构建左上角为(i1, j1)，右下角为(i2, j2)的迷宫，方法为：
    * Step3: 随机选择i1 < im < i2, j1 < jm < j2，第im行的墙和第jm行的“十”字将矩形划分为四个部分
      * Step3.1: “十”字从交叉点分别向左右上下四个方向有四条线段，从中随机选择三个，然后每一个线段上随机拆掉一堵墙
      * Step3.2: 递归操作由“十”字划分的四个部分，直至i1 >= i2 - 1 || j1 >= j2 - 1
    ![递归生成迷宫实例](https://github.com/lxcnju/maze_p5/blob/master/maze_recur.gif)
    
  
 
