---
title: 'Codeforces Round 1037 (Div. 3)'
date: '2025-07-21'
link: 'codeforces-1037-div3'
description: 'Codeforces Round 1037 (Div. 3) 的 A-F 题解与思路。'
tags:
  - 'algorithm'
  - 'codeforces'
categories:
  - 'XCPC'
  - 'Contest'
  - 'Codeforces'
---

> 本题解对应源码见仓库 `solutions/xcpc/codeforces/1037div3/`。

## [题目链接](https://codeforces.com/contest/2126)

## A. Only One Digit

### 题意

给你一个整数 $x$ 。你需要找出最小的非负整数 $y$ ，使得数字 $x$ 和 $y$ 至少有一个共同的数位。换句话说，必须有一个十进制数字 $d$ 同时出现在数字 $x$ 和数字 $y$ 的表示中。

### 思路

找 $x$ 的最小数位值

### 示例代码

```cpp
void solve() {
    string s;
    cin >> s;
    cout << *min_element(all(s)) << '\n';
}
```

## B. No Casino in the Mountains

### 题意

给你一个由 $n$ 个数字组成的数组 $a$ 和一个数字 $k$ 。数值 $a_i$ 描述了第 $i$ 天的天气情况：如果第 $i$ 天下雨，则为 $a_i = 1$ ；否则，如果第 $i$ 天天气晴朗，则为 $a_i = 0$ 。

让想尽可能多地游览山峰。徒步登顶一座山峰正好需要 $k$ 天，而在这些天中，每一天的天气都必须很好（ $a_i = 0$ ）。也就是说，从形式上看，只有当所有 $j$ 的所有 $a_j = 0$ 都是好天气时，他才能在 $i$ 这一天开始远足。 $(i \leq j \leq i + k - 1)$ .

每次远足后，在开始下一次远足前，让必须休息至少一天，也就是说，在远足后的第二天，他不能再去远足。

求让最多可以游览的山峰数。

### 思路

$O(N)$ 时间内模拟，遇到下雨计数器归零，否则直到达到 $k$ 天，再空一天

### 示例代码

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    vector<int> arr(n);
    fer(i, 0, n) cin >> arr[i];

    int res = 0;
    int cnt = 0;

    fer(i, 0, n) {
    	if(arr[i] == 0) cnt++;
    	else cnt = 0;
    	if(cnt == k) {
    		cnt = 0;
    		i++;
    		res++;
    	}
    }
    cout << res << '\n';
}
```

## C. I Will Definitely Make It

### 题意

你得到了 $n$ 座塔，编号从 $1$ 到 $n$ 。塔楼 $i$ 的高度为 $h_i$ 。在时间 $0$ ，你位于指数为 $k$ 的塔上，当前水位为 $1$ 。

每秒，水位上升 $1$ 个单位。在任何时刻，如果水位的**严格大于你所在高塔的高度，你就会灭亡。

你有一个神奇的能力：在 $x$ 时刻，你可以开始从塔楼 $i$ 传送到塔楼 $j$ ，需要 $\lvert h_i - h_j \rvert$ 秒。也就是说，在 $x + \lvert h_i - h_j \rvert$ 时刻之前，您将在塔楼 $i$ ，而在 $x + \lvert h_i - h_j \rvert$ 时刻，您将移动到塔楼 $j$ 。您可以在刚刚到达塔楼 $j$ 的同一时刻开始新的传送。

例如，如果 $n=k=4$ ， $h=[4, 4, 4, 2]$ ，那么如果您在 $0$ 时刻从塔楼 $4$ 开始传送到塔楼 $1$ ，移动过程如下：

![](https://espresso.codeforces.com/dfb14a7906b1e5521424451d3c08c6a96aafc89d.png)

请注意，如果塔楼 $1$ 的高度为 $5$ ，您将无法立即传送到塔楼，因为您将在 $2$ 时刻被淹没。

您的目标是在被水淹没之前到达高度最大的塔楼。

确定这是否可行。

### 思路

排序，然后依次往上爬，每次和如果爬能上去后的水位进行判断

### 示例代码

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    vector<int> arr(n);
    fer(i, 0, n) cin >> arr[i];

    int ori = arr[k - 1];

    sort(all(arr));
    if(ori == arr.back()) {
    	cout << "YES\n";
    	return;
    }

    //fer(i, 0, n) dbg_arr(arr, i);

    int id = upper_bound(all(arr), ori) - arr.begin();
    int t = 1;

    fer(i, id, n) {
    	int d = arr[i] - ori;
    	if(t + d <= ori + 1 && ori + d >= arr[i]) {
    		ori = arr[i];
    		t += d;
    	} else {
    		cout << "NO\n";
    		return;
    	}
    }
    cout << "YES\n";
}
```

## D. This Is the Last Time

### 题意

您会得到 $n$ 个赌场，编号从 $1$ 到 $n$ 。每个赌场由三个整数描述： $l_i$ 、 $r_i$ 和 $real_i$ （ $l_i \le real_i \le r_i$ ）。您最初有 $k$ 枚硬币。

只有当当前的硬币数 $x$ 满足 $l_i \le x \le r_i$ 时，您才能在赌场 $i$ 下注。下注后，您的金币数变为 $real_i$ 。

您可以按照任意顺序游览赌场，无需游览所有赌场。每个赌场不能访问超过一次。

您的任务是找到最终能获得的最大金币数。

### 思路

思路1：

- 按照 $w$ 排序，然后贪心，能取到更大的 $w$ 则取，最终的 $w$ 即答案

思路2：

- $bfs$，先按照 $l$ 排序，将能达到条件的区间放入队列，然后取 $max$ 后删除这个节点，因为只能用一次
- 注意 `map` 内置的二分查找函数是 `log(N)` 的

### 示例代码1

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    vector<array<int, 3>> arr(n);
    fer(i, 0, n) cin >> arr[i][1] >> arr[i][2] >> arr[i][0];

    sort(all(arr));

    for(auto [w, l, r] : arr) {
    	if(w <= k) continue;
    	if(l <= k && k <= r) {
    		k = max(k, w);
    	}
    }
    cout << k << '\n';
}
```

### 示例代码2

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    vector<array<int, 3>> arr(n);

    fer(i, 0, n) cin >> arr[i][0] >> arr[i][1] >> arr[i][2];

    sort(all(arr));

    int ind = 0;
    multimap<int, int> mp;
   	queue<int> q;
   	q.push(k);
    int res = k;

    while(!q.empty()) {
    	int u = q.front(); q.pop();

    	while(ind < arr.size() && arr[ind][0] <= u) {
    		mp.emplace(arr[ind][1], arr[ind][2]);
    		ind++;
    	}

    	auto it = mp.lower_bound(u);
    	while(it != mp.end()) {
    		res = max(res, it->second);
    		q.push(it->second);
    		mp.erase(it);
    		it = mp.lower_bound(u);
    	}
    }
    cout << res << '\n';
}
```

## E. G-C-D, Unlucky!

### 题意

判断是否存在一个数组，使得满足它的前缀 $gcd$ 数组是 $p$ ，后缀 $gcd$ 数组是 $s$ 。

### 思路

需要满足一下条件：

- `p.back() == s.front()`
- `p`是非递增的，并且严格有`p[i + 1] % p[i] == 0`
- `s`是非递减的，并且严格有`s[i] % s[i + 1] == 0`
- 对于每个`i`，必须有全局 $gcd(g) = gcd(p[i], s[i + 1])$

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> p(n), s(n);

    fer(i, 0, n) cin >> p[i];
    fer(i, 0, n) cin >> s[i];

    if(p.back() != s.front()) {
    	cout << "NO" << '\n';
    	return;
    }

    int g = p.back();
    fer(i, 0, n - 1) {
    	if(p[i] % p[i + 1] || s[i + 1] % s[i]) {
    		cout << "NO" << '\n';
    		return;
    	}
    	if(gcd(p[i], s[i + 1]) != g) {
    		cout << "NO" << '\n';
    		return;
    	}
    }
    cout << "YES" << '\n';
}
```

## F. 1-1-1, Free Tree!

### 题意

给定一棵树 ∗ ，其中有 n 个顶点，编号从 1 到 n 。每个顶点的初始颜色为 ai 。

树的每条边由三个数字定义： ui 、 vi 和 ci ，其中 ui 和 vi 是边的端点， ci 是边的参数。边的代价定义如下：如果顶点 ui 和 vi 的颜色相同，代价为 0 ；否则，代价为 ci 。

我们还给出了 q 个查询。每个查询的形式都是：将顶点 v 重绘为颜色 x 。这些查询相互依赖(每次查询后，颜色变化都会保留)。每次查询后，都需要输出树中所有边的成本总和。

∗ 树是没有循环的连通图。

### 思路

建树之后需要维护一下信息：

- 邻接表`vector<vector<pii>> g(n + 1, vector<pii>());`
- 每个节点的父节点`fa`表
- 节点`i`指向父节点的边权重（不管颜色是否相同）`vector<int> w(n + 1)`
- 每个节点的所有某种颜色的子节点的总权值`vector<map<int, ll>> mp(n + 1);`

步骤：

- `dfs`可以解决`fa`表,`w`表，`mp`表的初始状态
- 对于每次查询，都分别讨论对父节点的影响（贡献）变化，和子节点的关系（贡献变化）

### 示例代码

```cpp
void solve() {
    int n, q;
    cin >> n >> q;
    vector<int> col(n + 1);
    fer(i, 1, n + 1) cin >> col[i];
    //vector<pii> g[n + 1];
    vector<vector<pii>> g(n + 1, vector<pii>());

    fer(i, 0, n - 1) {
        int u, v, c;
        cin >> u >> v >> c;
        g[u].push_back({v, c});
        g[v].push_back({u, c});
    }

    // mp[i][col]: 节点i的col颜色子节点总权值
    vector<map<int, ll>> mp(n + 1);
    vector<int> fa(n + 1, -1);
    // w[i]:i指向其父节点的边权值
    vector<int> w(n + 1);

    ll ans = 0;

    auto dfs = [&](this auto &&self, int u) -> void {
        for(auto [v, c] : g[u]) {
            if(v == fa[u]) continue;
            fa[v] = u;
            w[v] = c;
            mp[u][col[v]] += c;
            if(col[u] != col[v]) ans += c;
            self(v);
        }
    };
    dfs(1);

    // function<void(int)> dfs = [&](int u) -> void {
    //     for(auto [v, c] : g[u]) {
    //         if(v == fa[u]) continue;
    //         fa[v] = u;
    //         w[v] = c;
    //         mp[u][col[v]] += c;
    //         if(col[u] != col[v]) ans += c;
    //         dfs(v);
    //     }
    // };

    //dfs(1);

    while(q--) {
        int u, x;
        cin >> u >> x;

        if(fa[u] != -1) {
            if(col[u] == col[fa[u]]) {
                ans += w[u];
            }
            if(x == col[fa[u]]) ans -= w[u];

            mp[fa[u]][col[u]] -= w[u];
            mp[fa[u]][x] += w[u];
        }

        if(mp[u].count(col[u])) ans += mp[u][col[u]];
        if(mp[u].count(x)) ans -= mp[u][x];

        col[u] = x;
        cout << ans << '\n';
    }
}
```
