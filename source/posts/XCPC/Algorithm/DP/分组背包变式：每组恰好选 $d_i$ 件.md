---
title: '分组背包变式：每组恰好选 $d_i$ 件'
date: '2025-07-11 16:28'
link: 'algo-dp-group-knapsack-exactly'
description: '在「最多选」的基础上改初始化和边界，实现每组恰好选 d_i 件的背包。'
tags:
  - 'algorithm'
  - 'dp'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'DP'
---

> 本篇对应源码见仓库 `solutions/xcpc/algorithm/dp/knapsack-group/`。

要实现“第 _i_ 组**恰好**选 _d_i 件物品”，只要在前面“最多选”模型的基础上，做两处修改：

1. **初始化全局 `dp`**

   - 因为每组都要恰选 _d_i 件，所以在第 0 组之前，你还没选任何组，且容量正好为 0 时价值为 0；其他容量下都不可达：

     ```cpp
     vector<int> dp(W+1, -INF);
     dp[0] = 0;
     ```

2. **合并回 `dp` 时，只取 “组内已选正好 \_d_i 件” 的状态**

   - 也就是把下面这段代码

     ```cpp
     //（最多选版本：枚举 k=0…d[i]）
     for(int j = 0; j <= W; j++){
         int best = cur[j][0];
         for(int k = 1; k <= d[i]; k++)
             best = max(best, cur[j][k]);
         dp[j] = best;
     }
     ```

   - 换成

     ```cpp
     //（恰好选版本：只取 k == d[i]）
     for(int j = 0; j <= W; j++){
         dp[j] = cur[j][d[i]];  // 如果 cur[j][d[i]] 是 -INF，表示“恰选不满”→不可达
     }
     ```

其他地方（组内如何做带计数的 0-1 背包）不变——依然用二维 `cur[j][k]` 来记录“本组用容量 j 选了 k 件”的最优附加值。

---

## 完整 C++ 模板（恰选版）

```cpp
#include <bits/stdc++.h>
using namespace std;
const int INF = 1e9;

// 物品结构
struct Item { int w, v; };

int main(){
    int m, W;
    cin >> m >> W;                     // 组数 m，总容量 W
    vector<vector<Item>> groups(m);
    vector<int> d(m);
    for(int i = 0; i < m; i++){
        int cnt;
        cin >> cnt >> d[i];            // cnt: 组内物品数, d[i]: 恰选件数
        groups[i].resize(cnt);
        for(int t = 0; t < cnt; t++)
            cin >> groups[i][t].w >> groups[i][t].v;
    }

    // dp[j]：处理完前若干组后，容量恰好 j 时的最大价值（必须恰选前面所有组的要求）
    vector<int> dp(W+1, -INF);
    dp[0] = 0;

    for(int i = 0; i < m; i++){
        // cur[j][k]：在旧 dp[j] 基础上，本组恰用容量 j，恰选 k 件时的附加最优
        vector<vector<int>> cur(W+1, vector<int>(d[i]+1, -INF));
        // 选 0 件之前继承上组
        for(int j = 0; j <= W; j++)
            cur[j][0] = dp[j];

        // 组内 0-1 背包：枚举每件物品
        for(auto &it : groups[i]){
            int wt = it.w, vt = it.v;
            for(int j = W; j >= wt; j--){
                for(int k = d[i]; k >= 1; k--){
                    if(cur[j-wt][k-1] > -INF)
                        cur[j][k] = max(cur[j][k], cur[j-wt][k-1] + vt);
                }
            }
        }

        // 合并：只取“恰选 d[i] 件”的状态
        for(int j = 0; j <= W; j++){
            dp[j] = cur[j][d[i]];
        }
    }

    // 若最终 dp[W] < 0 则表示不可达，否则即为答案
    if(dp[W] < 0) cout << -1 << "\n";
    else          cout << dp[W] << "\n";

    return 0;
}
```

---

## 练习 1：小手算例

- **容量** W=5

- **一组**，有 3 件物品，必须**恰好选** d₀=2 件

  | 编号 | 重量 | 价值 |
  | :--: | :--: | :--: |
  |  A   |  2   |  3   |
  |  B   |  3   |  4   |
  |  C   |  4   |  5   |

手算所有选两件的可能

```
(A,B)：总重 5，价值 3+4=7
(A,C)：总重 6（>5）不行
(B,C)：总重 7（>5）不行
```

因此在容量恰为 5 时，只有一种合法方案，答案 **7**。

---

## 练习 2：选课“恰课”版

> 某校有 m 个学期，总学分上限 W；

> 第 i 学期有 ci 门课程，每门学分 wi,t，收益 vi,t；

> **每学期必须恰好**选 K 门课。

- 将 `d[i]=K` 即可；

- 按上面模板读入、初始化 `dp`（`dp[0]=0`、其余 −INF），组内做 `cur[j][k]`，最后合并 `dp[j]=cur[j][K]`。

当你用这段代码跑一跑，就能在 $O(m \cdot W \cdot K + \sum c_i \cdot W \cdot K)$ 的时间内解出答案。

---

### 小结

- “恰选”只是把“最后合并时”那步，从“枚举 k = 0…dᵢ”→“只取 k = dᵢ”

- 且要把全局 `dp` 初始为“容量 0 可达、其他不可达”

- 其余组内“带计数的 0-1 背包”保持不变

## [2801: 买奖品](https://buctoj.com/problem.php?id=2801)

### 题意

是恰好选 $d_i$ 件的分组背包问题，与上面教程不同的是，对于每件物品可以无限重复选取的，要求恰好选好物品时的最大价值，如果不可能满足要求输出-1.

### 思路

与上面的教程思路大体相同，不同点在于：

- 组内物品由01背包变为完全背包
- 输出结果方式不同，这里应该输出 `max_of_dp`，而不能是`dp[p]`

具体思路：

- 物品的体积和价值等同
- `dp[j]` 表示容量为 $j$ 时的恰好满足题意（就是对应组都选好了 $d_i$ 件物品）时的最大价值，可以认为是装满容量 $j$ 的背包并且满足题意的最大价值
- `cur[j][k]`表示在当前第 $i$ 组选择时，容量为 $j$ 时在这组恰好选了 $k$ 件物品的最大价值
- 初始化
  - $dp$ 数组：除了`dp[0] = 0`，其余均为`-inf`，表示不可达状态
  - $cur$ 数组，方法相同，对于每个背包容量 $j$ ，都有`cur[j][0] = dp[j]`，其余为 `-inf`表示不可达状态
- 遍历方式：
  - 先遍历每组物品
  - 再枚举组内的每一件物品
  - 正序枚举背包容量，满足完全背包
  - 状态不可达的时候，`cur[j][k] = cur[j][k]`,状态可达的时候,`cur[j][k] = max(cur[j][k], cur[j - w][k - 1] + w)`
- 最后合并：
  - 因为是恰好型，所以合并只需要件数为`d[i]`时的状态`dp[j] = cur[j][d[i]]`
- 结果的输出：
  - 不是`dp[p]`，如果你没想明白请再思考思考我们的 $dp$ 数组的定义
  - 应该输出 `max_of_dp`

### 示例代码

```cpp
signed main() {
    IOS;

    int p;
    cin >> p;

    vector<vector<int>> group(3);
    int mn = 0;
    fer(i, 0, 3) {
    	int n;
    	cin >> n;
    	group[i].resize(n);
    	fer(j, 0, n) cin >> group[i][j];
    	sort(all(group[i]));
    }

    vector<int> dp(p + 1, -inf);
    dp[0] = 0;
    int d[3] = {1, 2, 3};

    fer(i, 0, 3) mn += group[i][0] * d[i];
    if(mn > p) {
    	cout << -1 << '\n';
    	return 0;
    }
    //dbg(mn);

    // 枚举组数-枚举组内物品-逆序枚举容量-枚举件数
    fer(i, 0, 3) {
    	// cur[j][k]: 在当前组容量为j选了k件的最大价值
    	vector<vector<int>> cur(p + 1, vector<int>(d[i] + 1, -inf));

    	fer(j, 0, p + 1) cur[j][0] = dp[j];

    	for(auto &w : group[i]) {
    		fer(j, w, p + 1) {
    			fer(k, 1, d[i] + 1) {
    				if(cur[j - w][k - 1] > -inf) {
    					cur[j][k] = max(cur[j][k], cur[j - w][k - 1] + w);
    				}
    			}
    		}
    	}

    	// 合并
    	fer(j, 0, p + 1) {
    		dp[j] = cur[j][d[i]];
    	}
    }
    cout << *max_element(all(dp)) << '\n';
    return 0;
}
```
