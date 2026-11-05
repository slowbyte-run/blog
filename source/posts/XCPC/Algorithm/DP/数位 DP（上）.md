---
title: '数位 DP（上）'
date: '2025-07-08 21:34'
link: 'algo-dp-digit-1'
description: '数位 DP 入门：前缀和转换、DFS + 记忆化的实现框架，以及不含 49 的数的计数。'
tags:
  - 'algorithm'
  - 'dp'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'DP'
---

> 本篇对应源码见仓库 `solutions/xcpc/algorithm/dp/digit/`。

别灰心，一点都不笨！数位 DP (Digit DP) 确实是很多初学者，甚至是一些有经验的选手都会觉得棘手的一个知识点。它的模式相对固定，一旦理解了核心思想，就会发现它是一类很优美的暴力。

我们一步一步来拆解它，保证你能学会！

## 1. 数位 DP 是干什么的？

数位 DP 通常用来解决这样一类问题：

**求在某个区间 `[L, R]` 内，满足某种“和数位有关”的性质的数的个数。**

例如：

- 求 `[L, R]` 中不含数字 '4' 的数的个数。
- 求 `[L, R]` 中不含连续的 '62' 的数的个数。
- 求 `[L, R]` 中各位数字之和是 `K` 的倍数的数的个数。

## 2. 核心思想：前缀和转换

直接在 `[L, R]` 区间上统计非常困难。一个经典的处理方法是利用**前缀和**思想，将问题转换为：

`count(L, R) = count(0, R) - count(0, L-1)`

其中 `count(0, x)` 表示在 `[0, x]` 区间内满足条件的数的个数。这样，我们只需要实现一个函数 `solve(x)` 来计算 `[0, x]` 的答案即可。

## 3. 如何实现 `solve(x)`？—— DFS + 记忆化

`solve(x)` 的核心是**按位填数**。我们把数字 `x` 转换成一个数位数组（比如 `123` -> `[1, 2, 3]`），然后从高位到低位（从左到右）去构造一个不大于 `x` 的数。

为了实现这个过程，我们通常使用一个带有记忆化的深度优先搜索（DFS）函数。这个 DFS 函数的形态通常是这样的：

`dfs(pos, state, limit, lead_zero)`

我们来解释一下这几个参数的含义：

- `pos`: **当前正在处理第几位**（从高位往低位，比如第 0 位，第 1 位...）。这是递归的深度。
- `state`: **当前状态**。这是数位 DP 的精髓，它记录了从高位到 `pos-1` 位为止，我们构造的数字已经满足了哪些“性质”。这个参数根据题意而定。
  - 比如，要统计不含 '49' 的数，`state` 可以是一个布尔值，表示前一位是不是 '4'。
  - 比如，要统计各位数字之和，`state` 可以是当前的数字和。
- `limit`: **是否受限**。这是一个布尔值，非常非常关键！
  - `limit = true`: 表示我们当前构造的数字的前缀和 `x` 的前缀完全一样。那么我们当前 `pos` 位能填的数字范围就是 `0` 到 `x` 的第 `pos` 位数字。比如 `x = 543`，我们前两位填了 `54`，那么第 3 位最多只能填 `3`。
  - `limit = false`: 表示我们当前构造的数字的前缀已经比 `x` 的前缀小了。那么我们当前 `pos` 位以及之后的所有位，都可以随便填 `0` 到 `9`。比如 `x = 543`，我们第一位填了 `4`，那么后面两位就可以随便填 `00` 到 `99` 了。
- `lead_zero`: **是否有前导零**。这也是一个布尔值。
  - `lead_zero = true`: 表示我们当前在填的数字前面都是 0（比如一个 5 位数，我们现在要填第 3 位，但前两位都是 0，那么这个数实际上还没开始）。这对于某些题目很重要，比如要求不能有重复的相邻数字，前导零就不应该被算作一个“数字”。
  - `lead_zero = false`: 表示已经填过非零数字了。

## 4. 实战演练：【模板题】不含 '49' 的数的个数

我们来解决这个问题：求 `[L, R]` 中，不包含连续的 '49' 这两个数字的数的个数。

### 第一步：定义 `solve(x)` 和 `dfs`

```cpp
long long dp[20][2]; // dp[pos][state]
int num[20]; // 存放 x 的每一位数字

// dfs(当前位数, 前一位是否是4, 是否受限, 是否有前导零)
long long dfs(int pos, bool pre_is_4, bool limit, bool lead_zero) {
    // ...
}

long long solve(long long x) {
    int len = 0;
    while (x) {
        num[len++] = x % 10;
        x /= 10;
    }
    // 注意我们是倒着存的，num[0]是个位，num[len-1]是最高位
    // 所以我们从 len-1 开始递归
    return dfs(len - 1, false, true, true);
}
```

### 第二步：实现 `dfs` 函数

```cpp
// dfs(当前位数, 前一位是否是4, 是否受限, 是否有前导零)
long long dfs(int pos, bool pre_is_4, bool limit, bool lead_zero) {
    // 1. 递归基：所有位都填完了，说明构造出了一个合法的数，返回 1
    if (pos < 0) {
        return 1;
    }

    // 2. 记忆化：只有在不受限且没有前导零的情况下，dp状态才能复用
    // 为什么？因为 limit 和 lead_zero 会影响后续位的选择，状态不唯一
    if (!limit && !lead_zero && dp[pos][pre_is_4] != -1) {
        return dp[pos][pre_is_4];
    }

    long long ans = 0;
    // 确定当前位能填的数字的上界
    int up = limit ? num[pos] : 9;

    // 3. 循环遍历当前位可以填的数字 i
    for (int i = 0; i <= up; ++i) {
        // 剪枝：如果前一位是4，当前位是9，那么就构成了'49'，不合法，跳过
        if (pre_is_4 && i == 9) {
            continue;
        }

        // 4. 递归到下一位
        ans += dfs(
            pos - 1,
            // 如果没有前导零且当前位是4，那么下一位的 pre_is_4 就是 true
            !lead_zero && i == 4,
            // 如果当前位已经受限，并且填了上界的数，那么下一位仍然受限
            limit && (i == up),
            // 如果当前位仍然是前导零（即之前都是前导零且当前位填0），那么下一位还是前导零
            lead_zero && (i == 0)
        );
    }

    // 5. 记录答案到 dp 数组
    if (!limit && !lead_zero) {
        dp[pos][pre_is_4] = ans;
    }

    return ans;
}
```

### 第三步：完整代码

这是一个可以直接提交的模板。

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cstring>

using namespace std;

long long dp[20][2]; // dp[pos][pre_is_4]
int num[20];

// dfs(当前位数, 前一位是否是4, 是否受限, 是否有前导零)
long long dfs(int pos, bool pre_is_4, bool limit, bool lead_zero) {
    // 递归基：所有位都填完了，说明构造出了一个合法的数，返回 1
    if (pos < 0) {
        return 1;
    }

    // 记忆化：只有在不受限且没有前导零的情况下，dp状态才能复用
    if (!limit && !lead_zero && dp[pos][pre_is_4] != -1) {
        return dp[pos][pre_is_4];
    }

    long long ans = 0;
    // 确定当前位能填的数字的上界
    int up = limit ? num[pos] : 9;

    // 循环遍历当前位可以填的数字 i
    for (int i = 0; i <= up; ++i) {
        // 剪枝：如果前一位是4，当前位是9，那么就构成了'49'，不合法
        if (pre_is_4 && i == 9) {
            continue;
        }

        // 递归到下一位
        ans += dfs(
            pos - 1,
            !lead_zero && i == 4, // 下一位的 pre_is_4 状态
            limit && (i == up),   // 下一位的 limit 状态
            lead_zero && (i == 0) // 下一位的 lead_zero 状态
        );
    }

    // 记录答案到 dp 数组
    if (!limit && !lead_zero) {
        dp[pos][pre_is_4] = ans;
    }

    return ans;
}

long long solve(long long x) {
    if (x < 0) return 0;
    if (x == 0) return 1; // 0 是一个合法的数

    int len = 0;
    while (x > 0) {
        num[len++] = x % 10;
        x /= 10;
    }

    // 初始化dp数组
    memset(dp, -1, sizeof(dp));

    // 从最高位 len-1 开始递归
    return dfs(len - 1, false, true, true);
}

int main() {
    long long L, R;
    while (cin >> L >> R) {
        cout << solve(R) - solve(L - 1) << endl;
    }
    return 0;
}
```

## 总结一下数位 DP 的解题步骤：

1.  **转换问题**：将 `[L, R]` 的询问转换为 `solve(R) - solve(L-1)`。
2.  **设计 `dfs` 函数**：确定 `dfs(pos, state, limit, lead_zero)` 的参数，尤其是 `state`。`state` 需要包含所有解题需要的信息。
3.  **`dfs` 内部逻辑**：
    - **递归出口**：`pos < 0` 时，根据题意返回 1 或 0。
    - **记忆化**：在 `!limit && !lead_zero` 的条件下，检查并返回 `dp` 表中的值。
    - **确定上界**：`up = limit ? num[pos] : 9;`
    - **循环填数**：`for (int i = 0; i <= up; ++i)`
    - **剪枝**：在循环内部，根据题意判断当前填的数字 `i` 是否合法。
    - **递归调用**：`dfs(pos-1, new_state, new_limit, new_lead_zero)`，正确地更新所有状态。
    - **记录 DP**：在 `!limit && !lead_zero` 的条件下，将结果存入 `dp` 表。
4.  **编写 `solve(x)` 函数**：
    - 将数字 `x` 拆解到数组 `num` 中。
    - 调用 `dfs` 启动搜索，初始调用时 `limit` 和 `lead_zero` 通常都是 `true`。

数位 DP 的题目万变不离其宗，都是这个框架。关键在于根据题意，正确地设计 `state` 以及在 `dfs` 中更新 `state` 的逻辑。

多找几道经典的题目练习一下，比如 "Windy数"、"数字游戏"，把这个模板敲熟，你很快就能掌握它了！加油！你一定可以的！
