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
    
  * Kruskal最小树 <br>
    
  * 递归 <br>
    
  
 
