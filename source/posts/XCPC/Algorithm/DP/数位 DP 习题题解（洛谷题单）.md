---
title: '数位 DP 习题题解（洛谷题单）'
date: '2025-07-11 16:28'
link: 'algo-dp-digit-problems'
description: '数位 DP 的洛谷题单题解：烦人的数学作业、windy 数、数字计数、Round Numbers。'
tags:
  - 'algorithm'
  - 'dp'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'DP'
---

> 本篇对应源码见仓库 `solutions/xcpc/algorithm/dp/digit/`。

难点在于状态转移上的处理的细节，也是极易错的点

## [P4999 烦人的数学作业](https://www.luogu.com.cn/problem/P4999)

### 题意

给出一个区间 $[L, R]$，求区间内**每个数的数字和**，如 $123$ 这个数的数字和为 $1+2+3=6$。$（1 ≤ L ≤ R ≤ 10^{18}）$

### 思路

- $dp[pos][sum]$: 表示当前处理到第 $pos$ 位，数字和为 $sum$ 的所有情况的数位之和；
- $ans$： 所有满足情况的数字的数位之和；
- $dfs(pos, s, limit, lead)$: 处理第 $pos$ 位数字，当前数字和为 $s$，`limit` 表示是否受限于上界，`lead` 表示是否允许前导零；
- $dfs$ 递归出口: $s$。

### 示例代码

```cpp
// dp[pos][sum] : pos 之前数字之和为 sum 的所有情况的数位之和
vector<vector<int>> dp(20, vector<int>(200, -1));
vector<int> num(20);

int dfs(int pos, int s, bool limit, bool lead) {
	if(pos == 0) return s;

	if(!limit && !lead && dp[pos][s] != -1) return dp[pos][s];
	int up = limit ? num[pos] : 9;
	int ans = 0;

	fer(i, 0, up + 1) {
		ans = (ans + dfs(pos - 1, s + i, limit && i == up, lead && !i)) % MOD;
	}

	if(!limit && !lead) dp[pos][s] = ans;
	return ans;
}

void solve() {
    ll l, r;
    cin >> l >> r;

    auto get = [&](ll n) -> int {
    	int len = 0;
    	dp.assign(20, vector<int> (200, -1));
    	while(n) {
    		num[++len] = n % 10;
    		n /= 10;
    	}
    	return dfs(len, 0, true, true);
    };
    cout << (get(r) - get(l - 1) + MOD) % MOD << '\n';
}
```

## [P6218 [USACO06NOV] Round Numbers S](https://www.luogu.com.cn/problem/P6218)

### 题意

如果一个正整数的二进制表示中，$0$ 的数目不小于 $1$ 的数目，那么它就被称为「圆数」。
例如，9 的二进制表示为 1001，其中有 2 个 0 与 2 个 1。因此，9 是一个「圆数」。
计算区间 $[l,r]$ 中有多少个「圆数」。

### 思路

- $dp[pos][cnt0][cnt1]$: 表示当前处理到第 $pos$ 位，$0$ 的个数为 $cnt0$，$1$ 的个数为 $cnt1$ 的所有情况的满足条件的数字个数；
- $ans$： 所有满足情况的数字的个数；
- $dfs(pos, cnt0, cnt1, limit, lead)$: 处理第 $pos$ 位数字，当前 $0$ 的个数为 $cnt0$，$1$ 的个数为 $cnt1$，`limit` 表示是否受限于上界，`lead` 表示是否处于前导零状态；
- 注意： 处于前导零状态时的 $0$ 不能计入 $cnt0$ 。

### 示例代码

```cpp
// dp[pos][cnt0][cnt1]
int dp[40][40][40];
vector<int> num(40);

int dfs(int pos, int cnt0, int cnt1, bool limit, bool lead) {
	if(pos == 0) return lead || cnt0 >= cnt1;

	if(!limit && !lead && ~dp[pos][cnt0][cnt1]) return dp[pos][cnt0][cnt1];

	int up = limit ? num[pos] : 1;
	int ans = 0;

	fer(i, 0, up + 1) {
		int new_lead = lead && !i;
		ans += dfs(pos - 1, cnt0 + (!new_lead && !i), cnt1 + i, limit && i == up, new_lead);
	}

	if(!limit && !lead) dp[pos][cnt0][cnt1] = ans;
	return ans;
}

signed main() {
    IOS;

    int l, r;
    cin >> l >> r;

    auto get = [&](int n) -> int {
    	int len = 0;
    	memset(dp, -1, sizeof dp);
    	while(n) {
    		num[++len] = n & 1;
    		n >>= 1;
    	}
    	return dfs(len, 0, 0, true, true);
    };

    cout << get(r) - get(l - 1) << '\n';

    return 0;
}
```

## [P2602 [ZJOI2010]数字计数](https://www.luogu.com.cn/problem/P2602)

### 题意

不含前导零且相邻两个数字之差至少为 2 的正整数被称为 windy 数。求在 $[a, b]$ 总共有多少个 windy 数？

### 思路

- $dp[pos][pre]$: 表示当前处理到第 $pos$ 位，前一位数字为 $pre$ 的windy数总个数
- $ans$： 所有满足情况的数字的个数；
- $dfs(pos, pre, limit, lead)$： 处理第 $pos$ 位数字，前一位数字为 $pre$，`limit` 表示是否受限于上界，`lead` 表示是否处于前导零状态；
- 重点在于，在 $for$ 内枚举当前位时什么时候才能进行 $ans\ += dfs(...)$ 递归调用？
  - 当然我们可以有多个角度来思考这个问题
  - 角度一：根据 $pre$ 是否为 $0$ 进行讨论。是，则考虑是否处于前导零阶段，是则可以递归调用，否则需要再考虑当前枚举的第 $pos$ 位是否 $>=2$ ；$pre$ 不为 $0$，则直接考虑是否有 `abs(i - pre) >= 2`
  - 角度二：根据当前是否处于前导零阶段。是，则可以直接递归调用；否，则需要考虑是否有 `abs(i - pre) >= 2`
- 如果你 $WA$ 了，请仔细思考思考你的思路有哪些情况未考虑完整.

### 示例代码

```cpp
// dp[pos][pre]
int dp[12][10];
vector<int> num(12);

int dfs(int pos, int pre, bool limit, bool lead) {
	if(pos == 0) return lead ? 0 : 1;

	if(!limit && !lead && dp[pos][pre] != -1) return dp[pos][pre];

	int up = limit ? num[pos] : 9;
	int ans = 0;
	fer(i, 0, up + 1) {
		// 角度一：pre是否为0
		// if(pre == 0) {
		// 	if(!lead && i < 2) continue;
		// 	ans += dfs(pos - 1, i, limit && i == up, lead && !i);
		// } else {
		// 	if(abs(i - pre) < 2) continue;
		// 	ans += dfs(pos - 1, i, limit && i == up, lead && !i);
		// }
		// 角度二：是否处于前导零阶段
		if(lead || abs(i - pre) >= 2) {
			ans += dfs(pos - 1, i, limit && i == up, lead && !i);
		}
	}

	if(!limit && !lead) dp[pos][pre] = ans;
	return ans;
}

signed main() {
    IOS;

    int l, r;
    cin >> l >> r;

    auto get = [&](int n) -> int {
    	memset(dp, -1, sizeof dp);
    	num[0] = 0;
    	while(n) {
    		num[++num[0]] = n % 10;
    		n /= 10;
    	}
    	return dfs(num[0], 0, true, true);
    };
    cout << get(r) - get(l - 1) << '\n';

    return 0;
}
```

## [P2602 [ZJOI2010]数字计数](https://www.luogu.com.cn/problem/P2602)

### 题意

给定两个正整数 $a$ 和 $b$，求在 $[a,b]$ 中的所有整数中，每个数码(digit)各出现的次数。

### 思路

- 依次枚举数码 $d$ ，每一次都进行数位dp
- $dp[pos][cnt]$: 表示当前处理到第 $pos$ 位，当前枚举的数码 $d$ 出现次数为 $cnt$ 时数码 $d$ 出现的总次数；
- $ans$： 数码 $d$ 出现次数；
- dfs(pos, d, cnt, limit, lead)): 处理第 $pos$ 位数字，当前数码 $d$ 出现次数为 $cnt$，`limit` 表示是否受限于上界，`lead` 表示是否处于前导零状态；
- 状态的转移：`ans` 常规处理，`cnt`呢？
  - 考虑到 $a >= 1$，我们不必管 0000 的情形对 0 的统计
  - 在非前导零阶段时，只需要 `cnt + (i == d)`
  - 在前导零阶段时，只需要 `cnt + ( d && i == d)`

思考：为什么在下面的示例代码中的注释部分进行状态转移是错误的？为什么 $cnt3$ 的状态转移是错误的？

### 示例代码

```cpp
// dp[pos][cnt]: 枚举到pos时出现了cnt次时总共出现的次数
ll dp[15][15];
vector<int> num(15);

ll dfs(int pos, int d, int cnt, bool limit, bool lead) {
	if(pos == 0) return cnt;

	if(!limit && !lead && ~dp[pos][cnt]) return dp[pos][cnt];

	int up = limit ? num[pos] : 9;
	ll ans = 0;

	fer(i, 0, up + 1) {
		// if(!lead) {
		// 	if(i == d) cnt++;
		// } else {
		// 	if(d && i == d) cnt++;
		// 	else if(pos == 1 && i == d) cnt++;
		// }
		int cnt1 = cnt + (lead && !i ? 0 : i == d);
		int cnt2 = cnt + (!lead && i == d || lead && d && i == d);
		int cnt3 = cnt + (!lead && i == d || d && i == d || pos == 1 && i == d);
		ans += dfs(pos - 1, d, cnt3, limit && i == up, lead && !i);
	}
	if(!limit && !lead) dp[pos][cnt] = ans;
	return ans;
}

signed main() {
    IOS;

    ll l, r;
    cin >> l >> r;

    auto get = [&](ll n, int d) {
    	memset(dp, -1, sizeof dp);
    	num[0] = 0;
    	while(n) {
    		num[++num[0]] = n % 10;
    		n /= 10;
    	}
    	return dfs(num[0], d, 0, true, true);
    };

    fer(i, 0, 10) {
    	cout << get(r, i) - get(l - 1, i) << ' ';
    }

    return 0;
}
```
