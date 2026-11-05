---
title: '完全背包：恰好装满（BUCTOJ 3522）'
date: '2025-07-16 23:55'
link: 'algo-dp-complete-knapsack-exact-fill'
description: '恰好装满型完全背包的例题题解，用 -inf 标记不可达状态。'
tags:
  - 'algorithm'
  - 'dp'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'DP'
---

> 本篇对应源码见仓库 `solutions/xcpc/algorithm/dp/knapsack-complete/`。

## [3522: 完全背包](https://buctoj.com/problem.php?id=3522)

### 题意

是一个标准的恰好装满的完全背包问题

### 思路

按照完全背包写法与恰好装满型写法，两者结合即可。具体如下

- 状态定义：$dp[j]$ 表示恰好装满背包容量为 $j$ 时的最大价值
- 初始化：`dp[j for j in 0 .. max] = -inf`，`dp[0] = 0`，`-inf`表示状态不可达
- 遍历方式：
  - 先枚举每件物品
  - 再正序枚举背包容量
- 状态转移：`if(dp[j - w[i]] > -inf) dp[j] = max(dp[j], dp[j - w[i]] + v[i]);`

- 结果输出: 可达即为 $dp[W]$，否则为 `NO`

### 示例代码

```cpp
void solve() {
    int n, W;
    cin >> n >> W;
    vector<int> dp(W + 1, -inf);
    dp[0] = 0;

    vector<int> w(n + 1), v(n + 1);
    fer(i, 1, n + 1) cin >> w[i] >> v[i];

    fer(i, 1, n + 1) {
    	fer(j, w[i], W + 1) {
            if(dp[j - w[i]] > -inf) {
                dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
            }
        }
    }
    if(dp[W] == -inf) cout << "NO\n";
    else cout << dp[W] << '\n';
}
```
