---
title: 'AtCoder Beginner Contest 417'
date: '2025-08-06'
link: 'atcoder-abc417'
description: 'AtCoder Beginner Contest 417 的 A-F 题解与思路。'
tags:
  - 'algorithm'
  - 'atcoder'
categories:
  - 'XCPC'
  - 'Contest'
  - 'AtCoder'
---

> 本题解对应源码见仓库 `solutions/xcpc/atcoder/abc417/`。

## [A Substring](https://atcoder.jp/contests/abc417/tasks/abc417_a)

### 题意

删除字符串前a个和后b个字符后输出s

### 思路

- `substr` 即可
- 或者` for` 遍历

### 示例代码

```cpp
signed main() {
    IOS;

    int n, a, b;
    cin >> n >> a >> b;
    string s;
    cin >> s;
    cout << s.substr(a, n - b - a) << '\n';

    return 0;
}
```

## [B Search and Delete](https://atcoder.jp/contests/abc417/tasks/abc417_b)

### 题意

给出一个非递减序列 a,对其做出序列 b 操作：一次遍历 b中元素，如果 a 中有则删除，否则不做处理。输出最后 a 序列元素。

### 思路

- 因为序列 a 是非递减的，所以可以用 `map` 预处理 a, 然后离线根据序列 b 处理，最后输出 a 序列元素还剩下次数大于 0 的元素 `cnt` 次
- 也可以根据 b 在线处理，如果操作后还有这个元素就输出

### 示例代码

```cpp
signed main() {
    IOS;

    int n, m;
    cin >> n >> m;
    map<int, int> mp;
    fer(i, 0, n) {
    	int x;
    	cin >> x;
    	mp[x]++;
    }
    fer(i, 0, m) {
    	int x;
    	cin >> x;
    	mp[x]--;
    }
    for(auto [x, cnt] : mp) {
    	if(cnt > 0) {
    		while(cnt--) cout << x << ' ';
    	}
    }

    return 0;
}
```

## [C Distance Indicators](https://atcoder.jp/contests/abc417/tasks/abc417_c)

### 题意

给出数组 A ，求序列对的对数 (i, j) 且 $i < j$，满足 $j − i = A_i ​ + A_j$​.

### 思路

在线处理，也即 $A_i + i = A_j - j$，枚举 i，记录此时 $A_i + i$ 次数加 1,然后 $ans += mp[A_j - j]$

### 示例代码

```cpp
signed main() {
    IOS;

    int n;
    cin >> n;
    vector<int> a(n + 1);
    map<int, int> mp;

    fer(i, 1, n + 1) cin >> a[i];

    ll ans = 0;
    fer(i, 1, n + 1) {
    	int s = i - a[i];
    	auto it = mp.find(s);
    	if(it != mp.end()) {
    		ans += it->second;
    	}
    	mp[i + a[i]]++;
    }
    cout << ans << '\n';

    return 0;
}
```

## [D Takahashi's Expectation](https://atcoder.jp/contests/abc417/tasks/abc417_d)

### 题意

高桥将收到 $N$ 件礼物。

他有一个名为心情的参数，是一个非负整数，每次收到礼物时，他的心情都会发生变化。每份礼物都有三个参数：价值 $P$ 、心情上升 $A$ 、心情下降 $B$ ，他的心情会根据这些参数发生如下变化：

- 当收到的礼物的值 $P$ 大于或等于他的心情时，他对礼物感到高兴，心情增加 $A$ 。
- 当收到的礼物的值 $P$ 小于他的心情时，他对礼物感到失望，心情会降低 $B$ 。但是，如果他的心情原本小于 $B$ ，则会变成 $0$ 。

你有 $Q$ 个问题，请回答所有问题。在 $i$ \- $(1\le i\le Q)$ 题中，你得到了一个非负整数 $X_i$ ，请回答下面的问题：

> 当高桥的心情最初为 $X_i$ 时，求他收到所有 $N$ 礼物后的心情。

### 思路

- 注意到 p 最大是 500,也就是说 x 大于 500 的话心情一定是减少的，减少每一个 b,那么可以预处理 b 的前缀和，就可以找到 x <= 500 的位置。这样就用 $log(N)$ 完成了预处理（跳过前面一定减少的部分）
- 找到 x <= 500 的位置后，接下来就是 dp 了
- `dp[i][j]` 表示当前（考虑完 i - 1 件礼物后）的心情值是 j, 经过第 i 件礼物之后的心情值
  - `if j <= p` 心情值增加，`dp[i][j] = dp[i + 1][j + a]`
  - 否则会减少，最低是 0,`dp[i][j] = dp[i + 1][max(0, j - b)]
- 从状态转移我们可以发现遍历顺序是：逆序枚举 i,顺序枚举 j
- 如何初始化呢，就是初始化确定的状态
  - 确定的就是经过 n 件礼物之后当前心情值为j,在往后就还是j
  - `dp[n + 1][j] = j`
- 那么查询如何处理呢
  - 可以注意到我们的 dp 处理的是经过第 i 件礼物后的心情值，这个心情值最大是 500 附近，
  - `if x <= 500` ，答案就是 `dp[1][x]
  - 如果 x 很大，大于 `pref[n]` 了，就直接减去 `pref[n]`
  - 否则，二分找到第一个能把 `x` 降到 500 以内的点，进行 dp 处理

### 示例代码

```cpp
signed main() {
    IOS;

    int n;
    cin >> n;
    vector<array<int, 3>> arr(n + 1);
    fer(i, 1, n + 1) cin >> arr[i][0] >> arr[i][1] >> arr[i][2];

    vector<int> pref(n + 1);
    fer(i, 1, n + 1) pref[i] = pref[i - 1] + arr[i][2];

    vector<vector<int>> dp(n + 2, vector<int> (550));
    iota(all(dp[n + 1]), 0);

    ferd(i, n, 1) {
        auto [p, a, b] = arr[i];
    	fer(j, 0, 501) {
            int x;
            if(j <= p) {
                x = j + a;
            } else {
                x = max(0, j - b);
            }
            if(x <= 500) {
                dp[i][j] = dp[i + 1][x];
            } else {
                auto it = lower_bound(pref.begin() + i, pref.end(), x - 500 + pref[i]);
                if(it == pref.end()) {
                    dp[i][j] = x - pref[n] + pref[i];
                    dp[i][j] = max(0, dp[i][j]);
                } else {
                    dp[i][j] = dp[it - pref.begin() + 1][x - *it + pref[i]];
                }
            }
        }
    }

    int q;
    cin >> q;
    while(q--) {
        int x;
        cin >> x;
        if(x <= 500) {
            cout << dp[1][x] << '\n';
        } else if(x - pref[n] > 500) {
            cout << x - pref[n] << '\n';
        } else {
            auto it = lower_bound(all(pref), x - 500);
            if(x - *it < 0) {
                cout << dp[it - pref.begin() + 1][0];
            } else {
                cout << dp[it - pref.begin() + 1][x - *it] << '\n';
            }
        }
    }

    return 0;
}
```

## [A Path in A Dictionary](https://atcoder.jp/contests/abc417/tasks/abc417_e)

### 题意

给出一个连通图，和 x,y,求 x->y 的最小字典序路径

### 思路

思路1

- 首先当然是可以对每个点的邻接表排个序
- 两次 bfs/dfs,第一次从起点 x 枚举，枚举他的邻接节点，在 bfs 看这个邻接节点能否到达 y

思路2

- 排序
- bfs + 并查集，用并查集判断邻接节点能否到达 y,需要先存每条边

第一次 bfs 也可以不用，直接 `while` 判断当前是否到达了 y

### 示例代码

思路1

```cpp
void solve() {
    int n, m, x, y;
    cin >> n >> m >> x >> y;
    x--, y--;
    vector<vector<int>> g(n);
    fer(i, 0, m) {
    	int u, v;
    	cin >> u >> v;
    	u--, v--;
    	g[u].push_back(v), g[v].push_back(u);
    }
    fer(i, 0, n) sort(all(g[i]));

    vector<int> res = {x};
    queue<int> q;
    q.push(x);
    vector<bool> vis(n);
    vis[x] = true;
    while(!q.empty()) {
    	auto u = q.front(); q.pop();

    	for(auto v : g[u]) {
    		if(vis[v]) continue;
        	vis[v] = true;

    		queue<int> t;
    		t.push(v);
    		vector<bool> st(n);
    		st[v] = true;
    		bool ok = false;

    		while(!t.empty()) {
    			auto z = t.front(); t.pop();
    			if(z == y) {
    				ok = true;
    				break;
    			}
    			for(auto c : g[z]) {
    				if(st[c] || vis[c]) continue;
    				st[c] = true;
    				t.push(c);
    				if(c == y) break;
    			}
    		}
    		if(ok) {
    			vis[v] = true;
    			q.push(v);
    			res.push_back(v);
    			break;
    		}
    	}
    }

    for(auto x : res) cout << x + 1 << ' ';
    cout << '\n';
}
```

思路2

```cpp
struct DSU {
	int n;
	vector<int> fa, sz;

	// 节点编号从 1 开始
	DSU(int n) : n(n) {
		fa.resize(n + 1);
		iota(all(fa), 0);
		sz.resize(n + 1, 1);
	}

	int find(int x) {
		return x == fa[x] ? x : fa[x] = find(fa[x]);
	}

	void merge(int x, int y) {
		int rx = find(x), ry = find(y);
		if(rx != ry) {
			if(sz[rx] < sz[ry]) swap(rx, ry);
			fa[ry] = rx;
			sz[rx] += sz[ry];
		}
	}

	bool same(int x, int y) {
		return find(x) == find(y);
	}

	int size(int x) {
		return sz[find(x)];
	}
};

void solve() {
    int n, m, x, y;
    cin >> n >> m >> x >> y;
    vector<vector<int>> g(n);
    set<pii> e;
    fer(i, 0, m) {
    	int u, v;
    	cin >> u >> v;
    	u--, v--;
    	g[u].push_back(v), g[v].push_back(u);
    	e.insert({u, v});
    }

    fer(i, 0, n) sort(all(g[i]));

    vector<bool> vis(n);
    x--, y--;
    vis[x] = true;
    vector<int> res = {x};

    print(g[0]);

    while(res.back() != y) {
    	DSU uf(n + 1);
    	for(auto [u, v] : e) {
    		if(!vis[u] && !vis[v]) {
    			uf.merge(u, v);
    		}
    	}
    	int u = res.back(); print(u);
    	for(auto v : g[u]) {
    		if(!vis[v] && uf.same(v, y)) {
    			res.push_back(v);
    			vis[v] = true;
    			break;
    		}
    	}
    }
    for(auto x : res) cout << x + 1 << ' ';
    cout << '\n';
}
```

## [Random Gathering](https://atcoder.jp/contests/abc417/tasks/abc417_f)

### 题意

给 n 个盘子，有对应数量的石头。每次操作取出 $[L, R]$ 下标内所有的石头，再随机把总和放在 $[L, R]$ 内随机一个下标的盘子上。求 m 次操作后每个盘子石头的期望数量。

### 思路

区间查询、区间修改，那就是线段树了。

- 区间查询 `sum`
- 区间修改，区间内每一个点修改为 `sum / (r - l + 1)`，注意是直接修改值，不是增加
- 注意逆元处理模意义下的除法

### 示例代码

```cpp
signed main() {
    IOS;

    int n, m;
    cin >> n >> m;
    vector<Z> a(n);
    fer(i, 0, n) cin >> a[i];

    segmentTree seg(a);
    while(m--) {
    	int l, r;
    	cin >> l >> r;
    	l--, r--;
    	Z sum = seg.query(l, r);
    	seg.update(l, r, sum / (Z(r - l) + 1));
    }

    fer(i, 0, n) {
    	cout << seg.query(i, i) << " \n"[i == n - 1];
    }

    return 0;
}
```
