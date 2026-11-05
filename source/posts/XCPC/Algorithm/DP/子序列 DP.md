---
title: '子序列 DP'
date: '2025-08-02 22:29'
link: 'algo-dp-subsequence'
description: '最长公共子序列、最长上升子序列、编辑距离、最大子段和等子序列类 DP 的整理。'
tags:
  - 'algorithm'
  - 'dp'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'DP'
---

> 本篇对应源码见仓库 `solutions/xcpc/algorithm/dp/subsequence/`。

## 最长公共子序列(LCS)

### 问题描述

"abcde","ace" => "ace"(3)

### 思路1 二维dp

- 状态定义：`dp[i][j]`: 表示 `a[1..i]` 和 `b[1..j]` 的最长公共子序列长度
- 初始化：均为 0
- 状态转移方程：
  - 如果 `a[i] == b[j]`，则 `dp[i][j] = dp[i-1][j-1] + 1`
  - 否则，`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

时间复杂度 $O(nm))$
空间复杂度 $O(nm)$

**示例代码**

```cpp
	int n;
    cin >> n;
    vector<int> a(n + 1), b(n + 1);
    fer(i, 1, n + 1) cin >> a[i];
    fer(i, 1, n + 1) cin >> b[i];

    vector<vector<int>> dp(n + 1, vector<int>(n + 1));
    fer(i, 1, n + 1) {
    	fer(j, 1, n + 1) {
    		if(a[i] == a[j]) {
    			dp[i][j] = dp[i - 1][j - 1] + 1;
    		} else {
    			dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    		}
    	}
    }
    cout << dp[n][n] << '\n';
```

## 最长上升子序列

### 思路1 一维dp二重循环

- 状态定义：`dp[i]`: 表示以 `a[i]` 结尾的最长上升子序列的长度
- 初始化：均为 1
- 状态转移方程：
  - `if(a[i] > a[j]) dp[i] = dp[j] + 1`（其中 `j < i`）

时间复杂度 $O(n^2)$
空间复杂度 $O(n)$

**示例代码**

```cpp
	int n;
    cin >> n;
    vector<int> a(n + 1), dp(n + 1, 1);

    fer(i, 1, n + 1) cin >> a[i];
    fer(i, 1, n + 1) {
    	fer(j, 1, i) {
    		if(a[i] > a[j]) {
    			dp[i] = dp[j] + 1;
    		}
    	}
    }
    cout << *max_element(all(dp)) << '\n';
```

### 思路2 一维dp单循环(贪心+二分)

- 状态定义：`dp[i]`: 表示长度为 `i` 的最长上升子序列的末尾元素的最小值
- 初始化：dp 数组为空
- 状态转移：
  - 对于每个 `a[i]`，使用二分查找找到 `dp` 中第一个大于等于 `a[i]` 的位置 `j`，然后更新 `dp[j] = a[i]`
  - 因为如果找到了的话，说明这个位置(it)的前一个位置(it - 1)的值小于 `a[i]` ，所以可以由(it - 1)这个状态进行转移

时间复杂度 $O(n \log n)$
空间复杂度 $O(n)$

**示例代码**

```cpp
signed main() {
    IOS;

    int n;
    cin >> n;
    vector<int> a(n), dp;
    fer(i, 0, n) cin >> a[i];

    fer(i, 0, n) {
    	auto it = lower_bound(all(dp), a[i]);
    	if(it != dp.end()) {
    		*it = a[i];
    	} else {
    		dp.push_back(a[i]);
    	}
    }
    cout << dp.size() << '\n';

    return 0;
}
```

## [编辑距离](https://www.luogu.com.cn/problem/P2758)

### P2758 编辑距离

#### 题目描述

设 $A$ 和 $B$ 是两个字符串。我们要用最少的字符操作次数，将字符串 $A$ 转换为字符串 $B$。这里所说的字符操作共有三种：

1. 删除一个字符；
2. 插入一个字符；
3. 将一个字符改为另一个字符。

$A, B$ 均只包含小写字母。

#### 输入格式

第一行为字符串 $A$；第二行为字符串 $B$；字符串 $A, B$ 的长度均小于 $2000$。

#### 输出格式

只有一个正整数，为最少字符操作次数。

#### 输入输出样例 #1

##### 输入 #1

```
sfdqxbw
gfdgw
```

##### 输出 #1

```
4
```

#### 说明/提示

对于 $100 \%$ 的数据，$1 \le |A|, |B| \le 2000$。

### 思路

- 状态定义：`dp[i][j]`: 表示将字符串 `A[1..i]` 转换为 `B[1..j]` 的最少操作次数
- 初始化：`dp[0][0] = 0`，`dp[i][0] = i` (删除操作)，`dp[0][j] = j` (插入操作)
- 状态转移方程：
  - 如果 `A[i] == B[j]`，则 `dp[i][j] = dp[i-1][j-1]`
  - 否则，`dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + 1)` (删除、插入、替换操作)

- 时间复杂度 $O(nm)$
- 空间复杂度 $O(nm)$

- 使用删除操作为什么是`dp[i - 1][j]`？因为相当于是说 A 的 前 i - 1 个字符已经和 B 的前 j 个字符匹配好了，那么现在只需要删除 A 的第 i 个字符就可以了。
- 使用插入操作为什么是`dp[i][j - 1]`？因为相当于是说 A 的 前 i 个字符已经和 B 的前 j - 1 个字符匹配好了，那么现在只需要在 A 的后面插入 B 的第 j 个字符就可以了。
- 使用替换操作为什么是`dp[i - 1][j - 1]`？因为相当于是说 A 的 前 i - 1 个字符已经和 B 的前 j - 1 个字符匹配好了，那么现在只需要将 A 的第 i 个字符替换为 B 的第 j 个字符就可以了。

也可以用滚动数组优化

### 示例代码1

```cpp
signed main() {
    IOS;

    string s1, s2;
    cin >> s1 >> s2;
    int n = s1.size(), m = s2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));

    s1 = " " + s1, s2 = " " + s2;
    fer(i, 0, n + 1) dp[i][0] = i;
    fer(j, 0, m + 1) dp[0][j] = j;

    fer(i, 1, n + 1) {
    	fer(j, 1, m + 1) {
    		if(s1[i] == s2[j]) {
    			dp[i][j] = dp[i - 1][j - 1];
    		} else {
    			dp[i][j] = min({dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]}) + 1;
    		}
    	}
    }
    cout << dp[n][m] << '\n';

    return 0;
}
```

### 示例代码2

```cpp
int minDistance(string word1, string word2) {
    if(word1.size() < word2.size()) return minDistance(word2, word1);

    int m = word1.size(), n = word2.size();
    vector<int> dp(n+1);
    iota(dp.begin(), dp.end(), 0);  // 初始化0,1,2,...,n

    for(int i = 1; i <= m; i++) {
        int prev = dp[0];  // dp[i-1][j-1]
        dp[0] = i;  // dp[i][0] = i

        for(int j = 1; j <= n; j++) {
            int temp = dp[j];  // 保存dp[i-1][j]

            if(word1[i-1] == word2[j-1]) {
                dp[j] = prev;
            } else {
                dp[j] = min({dp[j], dp[j-1], prev}) + 1;
            }

            prev = temp;  // 下一轮循环时prev就是dp[i-1][j-1]
        }
    }

    return dp[n];
}
```
