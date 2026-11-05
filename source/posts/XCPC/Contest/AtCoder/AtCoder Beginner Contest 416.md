---
title: 'AtCoder Beginner Contest 416'
date: '2025-08-06'
link: 'atcoder-abc416'
description: 'AtCoder Beginner Contest 416 的 A-E 题解与思路。'
tags:
  - 'algorithm'
  - 'atcoder'
categories:
  - 'XCPC'
  - 'Contest'
  - 'AtCoder'
---

> 本题解对应源码见仓库 `solutions/xcpc/atcoder/abc416/`。

## A - Vacation Validation

### 题意

给你一个长度为 $N$ 的字符串 $S$ ，由 `o` 和 `x` 组成

请判断从 $S$ 的 $L$ -th 到 $R$ -th 的所有字符是否都是 `o`。

### 思路

模拟即可

### 示例代码

```cpp
signed main() {
    IOS;

    int n, l, r;
    cin >> n >> l >> r;
    string s;
    cin >> s;
    fer(i, l - 1, r) {
    	if(s[i] != 'o') {
    		cout << "No" << '\n';
    		return 0;
    	}
    }
    cout << "Yes" << '\n';
    return 0;
}
```

## B - 1D Akari

### 题意

给你一个由 `.` 和 `#` 组成的字符串 S 。
在满足以下所有条件的所有字符串 T 中，找出一个 `o` 数量最多的字符串T。

- len(T) = len(S)
- T 由 {. # 0 } 组成
- $T_i == \#$ 当且仅当 $S_i == \#$
- T 中每两个 o 之间必须有 # 隔开

### 思路

直接遍历，判断当前的 . 是否可以变为 o，注意 S 中的 # 在 T 中也必须是 #

### 示例代码

```cpp
signed main() {
    IOS;

    string s;
    cin >> s;
    string ans;
    bool ok = true;

    fer(i, 0, s.size()) {
    	if(s[i] == '.') {
    		if(ok) {
    			ans += 'o';
    			ok = false;
    		} else {
    			ans += s[i];
    		}
    	} else if(s[i] == '#') {
    		ok = true;
    		ans += '#';
    	}
    }
    cout << ans << '\n';

    return 0;
}
```

## C - Concat (X-th)

### 题意

给出 n 个字符串和一个 k,需要从 n 个顺序选择 k 个顺序组合，求第 x 大的组合起来的字符串

### 思路

注意到数据范围 $1 <= n <= 10, 1 <= k <= 5$ ，直接 dfs 暴力枚举即可

### 示例代码

```cpp
signed main() {
    IOS;

    int n, k, x;
    cin >> n >> k >> x;
    vector<string> arr(n);

    fer(i, 0, n) cin >> arr[i];

    vector<string> res;

    auto dfs = [&](auto &&self, int cnt, string s) -> void {
        if(cnt == k) {
            res.push_back(s);
            return;
        }
        fer(i, 0, n) {
            self(self, cnt + 1, s + arr[i]);
        }
    };
    dfs(dfs, 0, "");
    sort(all(res));
    cout << res[x - 1] << '\n';

    return 0;
}
```

## D - Match, Mod, Minimize 2

### 题意

给出两个序列 a, b,和一个模数 M,可以任意打乱 a 序列的元素顺序，使得  $i=∑_i^N​((A_i ​+ B_i​) mod M)$ 最小。

### 思路

- 注意题目说明 $a_i, b_i <= M$
- 将 a 放入 `multiset`，把 b 逆序
- 枚举 b，二分查找在 multiset 中是否有最小的 x 满足可以将 $b_i + x$ 模数化，可以的化记录一下可以模，否则从这里开始所有未遍历的元素都不可能进行模数化了，因为后面 $b_i$ 离 M 越来越远了，需要的 x 越来越大，显然更不可能找到可以模数化的 x

### 示例代码

```cpp
void solve() {
    int n, m;
    cin >> n >> m;
    vector<int> a(n), b(n);

    fer(i, 0, n) {
    	cin >> a[i];
    }
    fer(i, 0, n) {
    	cin >> b[i];
    }

    ll ans = accumulate(all(a), 0LL) + accumulate(all(b), 0LL);
    sort(all(a));
    sort(all(b), greater());

    multiset<int> st(all(a));

    int cnt = 0;
    for(auto x : b) {
    	auto it = st.lower_bound(m - x);
    	if(it != st.end()) {
    		cnt++;
    		st.erase(it);
    	} else {
    		st.erase(st.begin());
    	}
    }
    cout << ans - 1LL * cnt * m << '\n';
}
```

## E - Development

### 题意

n 个城市，m 条边，其中k 个城市有飞机场。给出时间定义，每条道路对应一个时间，通往两个城市，通过机场连接的两个城市时间固定。
对每个查询：

1. 查询1,在 x-y 建立新的道路，给出对应的时间
2. 查询2,在 x 城市建立机场
3. 查询3,求每两两个城市之间通往的最短时间之和

### 思路

需要处理：

- 两个城市之间只通过道路需要的时间 -> floyd
- 通过机场 + 道路的形式如何处理呢
  - 那就得需要得出 x, y分别到最近的机场需要的时间之和 + t
- 对于操作1,新建立道路之后需要重新处理两个城市之间只通过道路的形式到达的最短时间，$O(N^2)$处理即可，只需要更新每每两个城市通过 x-y 这条新建立的道路是否可以缩短时间
- 对应操作2,相应的，只需要更新每个城市到达最近的机场需要的最短时间。
- 操作3,$O(N^2)$ 处理即可，$1 <= N <= 500$

### 示例代码

```cpp
signed main() {
    IOS;

    int n, m;
    cin >> n >> m;
    vector<vector<ll>> adj(n, vector<ll> (n, inf));

    fer(i, 0, m) {
        int u, v, w;
        cin >> u >> v >> w;
        u--, v--;
        adj[u][v] = adj[v][u] = min(adj[u][v], w + 0LL);
    }

    int k, t;
    cin >> k >> t;

    vector<bool> air(n);
    vector<int> vec;
    fer(i, 0, k) {
        int u;
        cin >> u;
        u--;
        air[u] = true;
        vec.push_back(u);
    }

    fer(k, 0, n) {
        fer(i, 0, n) {
            adj[i][i] = 0;
            if(adj[i][k] < inf) {
                fer(j, 0, n) {
                    if(adj[k][j] < inf && adj[i][k] + adj[k][j] < adj[i][j]) {
                        adj[i][j] = adj[j][i] = adj[i][k] + adj[k][j];
                    }
                }
            }
        }
    }

    vector<ll> dist(n, inf);
    fer(i, 0, n) {
        for(auto x : vec) {
            dist[i] = min(dist[i], adj[i][x]);
        }
    }

    int q;
    cin >> q;
    while(q--) {
        int op;
        cin >> op;
        if(op == 1) {
            int x, y; ll w;
            cin >> x >> y >> w;
            x--, y--;
            if(adj[x][y] <= w) continue;
            adj[x][y] = adj[y][x] = w;

            fer(i, 0, n) {
                fer(j, 0, n) {
                    if(adj[i][x] + w + adj[y][j] < adj[i][j]) {
                        adj[i][j] = adj[j][i] = adj[i][x] + w + adj[y][j];
                    }
                    if(adj[i][y] + w + adj[x][j] < adj[i][j]) {
                        adj[i][j] = adj[j][i] = adj[i][y] + w + adj[x][j];
                    }
                }
            }
            fer(i, 0, n) {
                for(auto x : vec) {
                    dist[i] = min(dist[i], adj[i][x]);
                }
            }
        } else if(op == 2) {
            int x;
            cin >> x;
            x--;
            if(air[x]) continue;
            air[x] = true;
            vec.push_back(x);

            fer(i, 0, n) {
                for(auto x : vec) {
                    dist[i] = min(dist[i], adj[i][x]);
                }
            }
        } else {
            ll ans = 0;
            fer(i, 0, n) {
                fer(j, 0, n) {
                    ll s = adj[i][j];
                    if(dist[i] < inf && dist[j] < inf){
                        s = min(adj[i][j], dist[i] + t + dist[j]);
                    }
                    if(s < inf) ans += s;
                }
            }
            cout << ans << '\n';
        }
    }

    return 0;
}
```
