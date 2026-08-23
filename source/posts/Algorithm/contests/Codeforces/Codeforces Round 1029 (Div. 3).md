---
title: 'Codeforces Round 1029 (Div. 3)'
date: '2025-06-10 15:47'
link: 'cnblogs-18922296'
description: 'Codeforces Round 1029 (Div.3) 的 A-G 题解，覆盖贪心、构造、并查集与 LCA，含 C++ 实现。'
tags:
  - 'algorithm'
  - 'codeforces'
categories:
  - 'Algorithm'
---

[题目链接](https://codeforces.com/contest/2117)

## A. False Alarm

### 题意

需要通过 \(n\) 扇门，给出一定数量已经开的门（一定存在没开的门），有一次机会使得所有门都开通 \(x\) 分钟，问能否通过所有门。

### 思路

求出第一扇和最后一扇关着的门的间距与 \(x\) 相比即可。

### 示例代码

```cpp
void solve() {
    int n, x;
    cin >> n >> x;
    vector<int> arr(n);

    fer(i, 0, n) cin >> arr[i];
    int a = -1, b = -1;

    fer(i, 0, n) {
        if(arr[i] == 1) {
            a = i;
            break;
        }
    }
    ferd(i, n - 1, 0) {
        if(arr[i] == 1) {
            b = i;
            break;
        }
    }
    cout << (b - a + 1 <= x ? "YES" : "NO") << '\n';
}
```

## B. Shrink

### 题意

构造一个长度为 \(n\) 的数组，每次的操作为：如果连续三个元素中中间的元素为最大值，则可将其删除。输出构造的数组，使得可操作次数最大。

### 思路

贪心

1.  思路1：将 \([1, n]\) 首尾首尾依次摆放
2.  将 \(1\) 放最前面，然后剩余的数逆序摆放

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;

    vector<int> arr(n);
    int cnt = 1;
    int i = 0, j = n - 1;
    while(i <= j) {
        if(cnt & 1) {
            arr[i++] = cnt++;
        } else {
            arr[j--] = cnt++;
        }
    }
    for(int x : arr) {
        cout << x << ' ';
    }
    cout << '\n';
}
```

```cpp
void solve() {
    int n;
    cin >> n;
    cout << 1 << ' ';
    ferd(i, n, 2) cout << i << ' ';
    cout << '\n';
}
```

## C. Cool Partition

### 题意

对数组进行分区，每个元素在且只能在一个区间内，并且相邻的两个区间前区间为后区间的子集。要求满足条件的区间个数最大值。

### 思路

将第一个数为单独一个区间，用两个 `set` 存前后区间，遇到可覆盖情况重置两个 `set` 即可

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> arr(n);
    fer(i, 0, n) cin >> arr[i];

    int ans = 1;
    set<int> st1, st2;
    st1.insert(arr.front());

    int cnt = 0;
    fer(i, 1, n) {
        if(st1.count(arr[i]) && !st2.count(arr[i])) {
            cnt++;
        }
        st2.insert(arr[i]);
        if(cnt == st1.size()) {
            ans++, cnt = 0;
            st1 = st2;
            st2.clear();
        }
    }
    cout << ans << '\n';
}
```

## D. Retaliation

### 题意

给定一个数组，对每个索引 \(i\) ，可以对所有 \(a_i\) 同时进行减 \(i\) 或者减 \(n - i + 1\) 的操作，问能否使得最终数组所有元素变为 \(0\) 。

### 思路

高斯消元，数组每个元素都是 \(i, n - i + 1\) 的线性组合，因此计算相邻两个二元一次方程组的 \(x, y\) 是否都相等即可。注意处理特殊情况。

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> arr(n + 1);
    vector<pii> p(n + 1);

    fer(i, 1, n + 1) {
    	cin >> arr[i];
    	p[i].first = i, p[i].second = n - i + 1;
    }

    int yy = -1, xx = -1;
    fer(i, 2, n + 1) {
    	int a = p[i - 1].first, b = p[i - 1].second;
    	int c = p[i].first, d = p[i].second;

    	if(b * c == a * d) continue;

    	if((c * arr[i - 1] - a * arr[i]) % (b * c - a * d) != 0) {
    		cout << "NO" << '\n';
    		return;
    	}
    	if((c * arr[i - 1] - a * arr[i]) / (b * c - a * d) < 0) {
    		cout << "NO" << '\n';
    		return;
    	}
    	int y = (c * arr[i - 1] - a * arr[i]) / (b * c - a * d);
    	if(arr[i - 1] - b * y < 0 || (arr[i - 1] - b * y) % a) {
    		cout << "NO" << '\n';
    		return;
    	}
    	int x = (arr[i - 1] - b * y) / a;
    	if(yy == -1) {
    		yy = y, xx = x;
    		continue;
    	} else if(y != yy || x != xx) {
    		cout << "NO" <<'\n';
    		return;
    	}
    }
    cout << "YES" << '\n';
}
```

## E. Lost Soul

### 题意

给两个数组 \(a, b\) ，有两种操作可以执行无限次：\(a_i = b_{i + 1}\) ，或者 \(b_i = a_{i + 1}\) 。再进行所有操作前可以选择性执行一次删除一对 \(a_i, b_i\) 的操作。求操作后最多有多少对 \(a_i = b_i\) 。

### 思路

> 怎么样才能使得数组对应元素匹配呢？实际上就是在进行操作之后能够使得两数组出现下面这种情况：  
> \_ \_ x \_ \_  
> \_ \_ x \_ \_  
> 这样就可以将两个 \(x\) 往前跳，操作之后可以使得在 \(x\) 之前的所有元素都变为 \(x\)

下面给出在不同情况下如何得出 a: \_ \_ x \_ \_ , b: \_ \_ x \_ \_ 的分析：\_

- 考虑单个数组：
  - xx -> 将后面的 x 跳跃即可
  - x\_x -> 删除中间一对后变为上面的情况
  - x \_ \_ x -> 将后面的 x 跳跃3步即可
  - 也就是说 x \_ \_ ... \_ \_ x -> 均可以
- 考虑两个数组
  - 下面这种都行：
    - a: x \_ ... \_ \_
    - b: \_ \_ ... x \_ （跳跃或者删除后跳跃）
  - 但是下面这种相邻的不行：
    - a: x \_ \_
    - b: \_ x \_

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1), b(n + 1);

    map<int, int> mp1, mp2;
    fer(i, 1, n + 1) cin >> a[i];
    fer(i, 1, n + 1) cin >> b[i];

    int ans = 0;
    fer(i, 1, n + 1) {
        if(mp1[a[i]]) ans = max(ans, mp1[a[i]]);
        if(mp2[b[i]]) ans = max(ans, mp2[b[i]]);
        if(a[i] == b[i]) ans = max(ans, i);

        if(mp1[b[i]] && i - mp1[b[i]] != 1) ans = max(ans, mp1[b[i]]);
        if(mp2[a[i]] && i - mp2[a[i]] != 1) ans = max(ans, mp2[a[i]]);

        mp1[a[i]] = i;
        mp2[b[i]] = i;
    }
    cout << ans << '\n';
}
```

## F. Wildflower

### 题意

给一棵树，根节点编号为1，每个节点的值为 \(1\) 或 \(2\) ，所有值按照节点编号构成数组。现在要求所有子树包含的节点权值之和要两两不同，求有多少种方法给节点赋值（有多少种数组给节点赋值）。

### 思路

分为以下几种情况：

1.  如果有多余两个叶子节点，那么方案数一定为 \(0\)，因为叶子节点权值一定会有重复的情况
2.  如果叶子节点只有一个，那么所有节点权值均有两种情况，方案数为 \(2^n\) ;
3.  如果有两个叶子节点，那么需要考虑两个方面：深度是否相同、\(1\) 放在深度较大的和放在深度较小的叶子节点上产生的方案数是否相同
    - 记叶子节点为 \(u, v\) ，最近公共祖先为 \(p\)，根节点深度为 \(0\)
    - 如果深度相同：那么根据题意画一画，就能发现方案数是 \(2^{depth[p] + 1} \times 2\) ，后面乘2是因为两个叶子节点是对称的，权值可以交换
    - 如果深度不同
      - 深度较大的叶子节点给 \(1\): 方案数为 \(2^{depth[u] - depth[v] + depth[p]}\)
      - 深度较大的叶子节点给 2: 方案书为 \(2^{depth[u] - depth[v] + depth[p] + 1}\)
      - 两者加起来，总方案数为 \(3 \times 2^{depth[u] - depth[v] + depth[p]}\)
4.  注意题目要求取模
5.  取模前的计算应用 `long long` 防止溢出
6.  可以学习使用自动取模类，模板可以自行搜索

### 算法思想

LCA(最近公共祖先)算法，可以解决很多树上问题。  
LCA算法实现方法有多种（\(O(N)、O(logN)、O(1)\)），括号内的复杂度指的是单次查询两个节点的最近公共祖先的时间复杂度。  
建议掌握 \(O(logN)\) 的倍增（二分提升）实现方法，本题亦采用倍增的LCA实现。

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> adjlist[n + 1];
    int LOG = 18;
    vector<int> depth(n + 1);
    vector<vector<int>> fa(LOG + 1, vector<int>(n + 1));

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

        fer(k, 1, LOG) {
            fer(i, 1, n + 1) {
                int mid = fa[k - 1][i];
                fa[k][i] = mid ? fa[k - 1][mid] : 0;
            }
        }
    };

    auto lca = [&](int u, int v) -> int {
        if(depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];

        fer(k, 0, LOG) {
            if(diff & (1 << k)) {
                u = fa[k][u];
            }
        }
        if(u == v) return u;

        ferd(k, LOG, 0) {
            if(fa[k][u] && fa[k][u] != fa[k][v]) {
                u = fa[k][u];
                v = fa[k][v];
            }
        }
        return fa[0][u];
    };

    auto fpow = [&](ll a, int b) -> ll {
        ll res = 1 % MOD;
        while(b) {
            if(b & 1) res = res * a % MOD;
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

## G. Omg Graph

### 题意

给出一个无向连通图，在所有 \(1-n\) 的路径中，每条路径都是由一些权值的边组成的，题目要求所有可选的路径之中，路径中权值最小的边权和最大的边权之和。

### 思路

将所有边按照权值大小排序，然后从小到大枚举边权值，这样就是在枚举路径中边的最大权值，接着处理边的最小权值：在枚举每一条边时，采用并查集维护每个集合中的点、边的最小权值、边的最大权值，当每次 \(1, n\) 在一个集合时，\(ans\) 取一下较小值。

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
#define dbg(x) cout << #x << ' ' << char(61) << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 2e9;

class DSU {
private:
	int n;
	vector<int> parent, rank;
	vector<pii> W;

public:
	// 节点编号从 0 开始
	DSU(int n) : n(n), parent(n), rank(n, 0) {
		iota(all(parent), 0);
		W.resize(n, {inf, -inf});
	}

	int find(int x) {
		if(x != parent[x]) {
			parent[x] = find(parent[x]);
		}
		return parent[x];
	}

	// merge还需要维护每个集合的边权最小值和最大值
	void merge(int x, int y, int w) {
		int rootx = find(x), rooty = find(y);
		if(rootx == rooty) {
			W[rootx].first = min(W[rootx].first, w);
			W[rootx].second = max(W[rootx].second, w);
			return;
		}

		if(rank[rootx] < rank[rooty]) {
			parent[rootx] = rooty;
			W[rooty].first = min({W[rooty].first, w, W[rootx].first});
			W[rooty].second = max({W[rooty].second, w, W[rootx].second});
		} else if(rank[rootx] > rank[rooty]) {
			parent[rooty] = rootx;
			W[rootx].first = min({W[rootx].first, w, W[rooty].first});
			W[rootx].second = max({W[rootx].second, w, W[rooty].second});
		} else {
			parent[rooty] = rootx;
			rank[rootx]++;
			W[rootx].first = min({W[rootx].first, w, W[rooty].first});
			W[rootx].second = max({W[rootx].second, w, W[rooty].second});
		}
	}

	bool same(int x, int y) {
		return find(x) == find(y);
	}

	int getAns() {
		return W[find(0)].first + W[find(0)].second;
	}
};

void solve() {
    int n, m;
    cin >> n >> m;
   	vector<array<int, 3>> adges(m);
   	fer(i, 0, m) {
   		int u, v, w;
   		cin >> u >> v >> w;
		u--, v--;
   		adges[i] = {w, u, v};
   	}
   	sort(all(adges));

   	DSU dsu(n);
   	int ans = inf;
   	for(auto& [w, u, v] : adges) {
   		dsu.merge(u, v, w);
		if(dsu.same(0, n - 1)) {
   			ans = min(ans, dsu.getAns());
		}
   	}
   	cout << ans << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}
```
