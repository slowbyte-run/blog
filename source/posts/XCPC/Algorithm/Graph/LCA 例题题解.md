---
title: 'LCA 例题题解'
date: '2025-07-24 10:21'
link: 'algo-graph-lca-problems'
description: 'LCA 相关例题题解，包含洛谷模板题与 SP14932。'
tags:
  - 'algorithm'
  - 'graph'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'Graph'
---

> 本篇对应源码见仓库 `solutions/xcpc/algorithm/graph/lca/`。

## [P3379 【模板】最近公共祖先（LCA）](https://www.luogu.com.cn/problem/P3379)

### 题意

LCA 模板题

### 示例代码

```cpp
#include<bits/stdc++.h>

using namespace std;

#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << '=' << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;
const int K = 19;

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int n, m, s;
    cin >> n >> m >> s;
    vector<int> adjlist[n + 1];
    vector<int> depth(n + 1);
    vector<vector<int>> fa(K, vector<int>(n + 1));

    fer(i, 0, n - 1) {
        int u, v;
        cin >> u >> v;
        adjlist[u].push_back(v);
        adjlist[v].push_back(u);
    }

    // 处理父亲、深度
    // auto dfs = [&](auto&& self, int u, int par) {
    //     fa[0][u] = par;
    //     depth[u] = (par ? depth[par] + 1 : 0);

    //     for(auto v : adjlist[u]) {
    //         if(v != par) {
    //             self(self, v, u);
    //         }
    //     }
    // };
    function<void(int, int)> dfs = [&](int u, int par) {
        fa[0][u] = par;
        depth[u] = (par ? depth[par] + 1 : 0);

        for(auto v : adjlist[u]) {
            if(v != par) {
                dfs(v, u);
            }
        }
    };

    // 处理 i 的 2^k 级父亲
    auto init_lca = [&]() {
        dfs(s, 0);

        fer(k, 1, K) {
            fer(i, 1, n + 1) {
                int mid = fa[k - 1][i];
                fa[k][i] = (mid ? fa[k - 1][mid] : 0);
            }
        }
    };

    auto lca = [&](int u, int v) -> int {
        if(depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];

        // 深度对齐
        fer(k, 0, K) {
            if(diff & (1 << k)) {
                u = fa[k][u];
            }
        }
        if(u == v) return u;

        // 二分提升
        ferd(k, K - 1, 0) {
            if(fa[k][u] && fa[k][u] != fa[k][v]) {
                u = fa[k][u];
                v = fa[k][v];
            }
        }
        return fa[0][u];
    };

    init_lca();
    while(m--) {
        int a, b;
        cin >> a >> b;
        cout << lca(a, b) << '\n';
    }

    return 0;
}
```

## [F. Wildflower(1029div3)](https://codeforces.com/contest/2117/problem/F)

### 题意

给一棵树，根节点编号为1，每个节点的值为 $1$ 或 $2$ ，所有值按照节点编号构成数组。现在要求所有子树包含的节点权值之和两两不同，求有多少重方法给节点赋值。

### 思路

分为以下几种情况：

1. 如果有多余两个叶子节点，那么方案数一定为 $0$，因为叶子节点权值一定会有重复的情况
2. 如果叶子节点只有一个，那么所有节点权值均有两种情况，方案数为 $2^n$ ;
3. 如果有两个叶子节点，那么需要考虑两个方面：深度是否相同、$1$ 放在深度较大的和放在深度较小的叶子节点上产生的方案数是否相同
   - 记叶子节点为 $u, v$ ，最近公共祖先为 $p$，根节点深度为 $0$
   - 如果深度相同：那么根据题意画一画，就能发现方案数是 $2^{depth[p] + 1} * 2$ ，后面乘2是因为两个叶子节点是对称的，权值可以交换
   - 如果深度不同
     - 深度较大的叶子节点给 $1$: 方案数为 $2^{depth[u] - depth[v] + depth[p]}$
     - 深度较大的叶子节点给 2: 方案书为 $2^{depth[u] - depth[v] + depth[p] + 1}$
     - 两者加起来，总方案数为 $3 * 2^{depth[u] - depth[v] + depth[p]}$
4. 注意题目要求取模
5. 取模前的计算应用 `long long` 防止溢出
6. 可以学习使用自动取模类，模板可以自行搜索

### 算法思想

LCA(最近公共祖先)算法，可以解决很多树上问题。
LCA算法实现方法有多种（$O(N)、O(logN)、O(1)$），括号内的复杂度指的是单次查询两个节点的最近公共祖先的时间复杂度。
建议掌握 $O(logN)$ 的倍增（二分提升）实现方法，本题亦采用倍增的LCA实现。

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<vector<int>> adjlist(n + 1);
    int max_k = 18;
    vector<int> depth(n + 1);
    vector<vector<int>> fa(max_k + 1, vector<int>(n + 1));

    fer(i, 0, n - 1) {
    	int u, v;
    	cin >> u >> v;
    	adjlist[u].push_back(v);
    	adjlist[v].push_back(u);
    }

    function<void(int, int)> dfs = [&](int u, int p) {
    	fa[0][u] = p;
    	depth[u] = p ? depth[p] + 1 : 0;

    	for(int v : adjlist[u]) {
    		if(v != p) {
    			dfs(v, u);
    		}
    	}
    };

    auto init_lca = [&]() -> void {
    	dfs(1, 0);

    	fer(k, 1, max_k) {
    		fer(i, 1, n + 1) {
    			int mid = fa[k - 1][i];
    			fa[k][i] = mid ? fa[k - 1][mid] : 0;
    		}
    	}
    };

    auto lca = [&](int u, int v) -> int {
    	if(depth[u] < depth[v]) swap(u, v);
    	int diff = depth[u] - depth[v];

    	fer(k, 0, max_k) {
    		if(diff & (1 << k)) {
    			u = fa[k][u];
    		}
    	}
    	if(u == v) return u;

    	ferd(k, max_k, 0) {
    		if(fa[k][u] && fa[k][u] != fa[k][v]) {
    			u = fa[k][u];
    			v = fa[k][v];
    		}
    	}
    	return fa[0][u];
    };

    auto fpow = [&](ll a, int b)  {
    	ll res = 1 % MOD;
    	while(b) {
    		if(b & 1) res = 1LL * res * a % MOD;
    		a = a * a % MOD;
    		b >>= 1;
    	}
    	return res;
    };

    vector<int> leaf;
    fer(i, 2, n + 1) {
    	if(adjlist[i].size() == 1) leaf.push_back(i);
    }

    if(leaf.size() > 2) {
    	cout << 0 << '\n';
    	return;
    } else if(leaf.size() == 1) {
    	cout << fpow(2, n) << '\n';
    	return;
    }

    init_lca();
    int u = leaf[0], v = leaf[1];
    int ans = 0, d = depth[lca(u, v)];
    if(depth[u] == depth[v]) {
    	ans = fpow(2, d + 2);
    } else {
    	ans = 3 * fpow(2, abs(depth[u] - depth[v]) + d) % MOD;
    }
    cout << ans << '\n';
}
```

## [SP14932 最近公共祖先（LCA）](https://www.luogu.com.cn/problem/SP14932)

### 题意

模板题

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<vector<int>> adjlist(n + 1);
    int max_k = 11;
    vector<int> depth(n + 1);
    vector<vector<int>> fa(max_k + 1, vector<int>(n + 1));

    fer(i, 1, n + 1) {
    	int t;
    	cin >> t;
    	while(t--) {
    		int v;
    		cin >> v;
    		adjlist[i].push_back(v);
    		adjlist[v].push_back(i);
    	}
    }

    function<void(int, int)> dfs = [&](int u, int p) {
    	fa[0][u] = p;
    	depth[u] = p ? depth[p] + 1 : 0;

    	for(int v : adjlist[u]) {
    		if(v != p) {
    			dfs(v, u);
    		}
    	}
    };
    auto init_lca = [&]() -> void {
    	dfs(1, 0);
    	fer(k, 1, max_k) {
    		fer(i, 1, n + 1) {
    			int mid = fa[k - 1][i];
    			fa[k][i] = mid ? fa[k - 1][mid] : 0;
    		}
    	}
    };
    auto lca = [&](int u, int v) -> int {
    	if(depth[u] < depth[v]) swap(u, v);
    	int diff = depth[u] - depth[v];

    	fer(k, 0, max_k) {
    		if(diff & (1 << k)) {
    			u = fa[k][u];
    		}
    	}
    	if(u == v) return u;

    	ferd(k, max_k, 0) {
    		if(fa[k][u] && fa[k][u] != fa[k][v]) {
    			u = fa[k][u];
    			v = fa[k][v];
    		}
    	}
    	return fa[0][u];
    };

    init_lca();
    int q;
    cin >> q;
    while(q--) {
    	int u, v;
    	cin >> u >> v;
    	cout << lca(u, v) << '\n';
    }
}
```
