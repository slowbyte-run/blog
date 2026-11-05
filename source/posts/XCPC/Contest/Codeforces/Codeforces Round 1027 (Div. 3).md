---
title: 'Codeforces Round 1027 (Div. 3)'
date: '2025-07-08'
link: 'codeforces-1027-div3'
description: 'Codeforces Round 1027 (Div. 3) 的题解与思路。'
tags:
  - 'algorithm'
  - 'codeforces'
categories:
  - 'XCPC'
  - 'Contest'
  - 'Codeforces'
---

> 本题解对应源码见仓库 `solutions/xcpc/codeforces/1027div3/`。

## [题目链接](https://codeforces.com/contest/2114)

## A. Square Year

### 思路

1. 考虑到年份是四位数，所以在$$1, 40)范围内枚举$a$和$b$即可
2. 也可以直接判断年份是否为完全平方数

### 示例代码

```cpp
void solve() {
   int n;
   cin >> n;

   fer(a, 0, 40) {
       fer(b, 0, 40) {
           if(pow(a + b, 2) == n) {
               cout << a << ' ' << b << '\n';
               return;
           }
       }
   }
   cout << -1 << '\n';
}
```

```cpp
void solve() {
   int n;
   cin >> n;
    
   if(int(sqrt(n)) * int(sqrt(n)) == n) {
       cout << 0 << ' ' << int(sqrt(n)) << '\n';
       return;
   }
   cout << -1 << '\n';
}
```

## B. Not Quite a Palindromic String

### 思路

题意是说将二进制串任意排列后使得恰好有$k$对匹配。我们可以先统计$0$和$1$的个数，将多出来的先匹配，讨论多出来的对数与$k$的大小，$k$更小的话就一定会有多余的匹配，输出`NO`，否则依次同时使$00$匹配和$11$匹配，也就是必须两对两对匹配（否则必然会有多余的匹配），所以只需要判断现在$k$的奇偶性即可。

### 示例代码

```cpp
void solve() {
    int n, k;
    cin >> n >> k;
    string s;
    cin >> s;

    int cnt0 = 0, cnt1 = 0;
    for(char c : s) {
        if(c == '0') cnt0++;
        else cnt1++;
    }

    k -= abs(cnt0 - cnt1) / 2;

    if(k < 0) cout << "NO" << '\n';
    else cout << (k & 1 ? "NO" : "YES") << '\n';
}
```

## C. Need More Arrays

### 思路

题意是将非降序数组中数值相等或相邻的数放入同一个数组中，操作是我们可以删除若干个元素，使得最终得到的数组个数最大化。那么可以贪心，如果后续的数$b$与最新可用的数$a$相邻，则把这个数$b$删除，否则$cnt++$并且更新最后的数。

本题解利用后缀下标巧妙的实现了"删除"这一操作。

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> arr(n);

    fer(i, 0, n) cin >> arr[i];

    int ind = 0, cnt = 0;
    fer(i, 1, n) {
        if(arr[i] > arr[ind] + 1) {
            cnt++;
            ind = i;
        } else {
            continue;
        }
    }
    cout << cnt + 1 << '\n';
}
```

## D. Come a Little Closer

### 思路

1. 题意是指我们可以移动一个方格（怪物），使得框住所有怪物的矩形面积最小化。
   可以查找边界点，分别讨论移动独立的边界点之后面积的变化，最后取$min$即可，要注意的是：有可能在移动边界上的怪物时，其余怪物已经成一个矩形的情况。
2. 另一种思路，用两个`multiset`存`X`和`Y`，遍历每次删除一个点之后的面积变化，取$min$即可。时间复杂度：$O(NlogN)$

### 示例代码

```cpp
void solve() {
   int n;
   cin >> n;
   vector<pii> px(n), py(n);

   fer(i, 0, n) {
       cin >> px[i].first >> py[i].first;
       px[i].second = i;
       py[i].second = i;
   }
   sort(all(px)), sort(all(py));

   if(n == 1) {
       cout << 1 << '\n';
       return;
   }

   ll ans = 1LL * (px[n - 1].first - px[0].first + 1) * (py[n - 1].first - py[0].first + 1);
   int cxmin = 1, cxmax = 1, cymin = 1, cymax = 1;
   int xmin = px[0].first, xmax = px[n - 1].first, ymin = py[0].first, ymax = py[n - 1].first;

   fer(i, 1, n) {
       if(px[i].first == px[0].first) cxmin++;
       else break;
   }
   ferd(i, n - 2, 0) {
       if(px[i].first == px[n - 1].first) cxmax++;
       else break;
   }
   fer(i, 1, n) {
       if(py[i].first == py[0].first) cymin++;
       else break;
   }
   ferd(i, n - 2, 0) {
       if(py[i].first == py[n - 1].first) cymax++;
       else break;
   }
   if(cxmin == 1) {
       xmin = px[1].first;
       xmax = px[n - 1].first;
       ymin = py[0].first;
       ymax = py[n - 1].first;
       for(auto& [y, ind] : py) {
           if(ind != px[0].second) {
               ymin = y;
               break;
           }
       }
       for(int i = n - 1; i >= 0; --i) {
           auto [y, ind] = py[i];
           if(ind != px[0].second) {
               ymax = y;
               break;
           }
       }
       ll res = 1LL * (xmax - xmin + 1) * (ymax - ymin + 1);
       if(res == n - 1) res += min(xmax - xmin + 1, ymax - ymin + 1);
       ans = min(ans, res);
   }
   if(cxmax == 1) {
       xmin = px[0].first;
       xmax = px[n - 2].first;
       ymin = py[0].first;
       ymax = py[n - 1].first;
       for(auto& [y, ind] : py) {
           if(ind != px[n - 1].second) {
               ymin = y;
               break;
           }
       }
       for(int i = n - 1; i >= 0; --i) {
           auto [y, ind] = py[i];
           if(ind != px[n - 1].second) {
               ymax = y;
               break;
           }
       }
       ll res = 1LL * (xmax - xmin + 1) * (ymax - ymin + 1);
       if(res == n - 1) res += min(xmax - xmin + 1, ymax - ymin + 1);
       ans = min(ans, res);
   }
   if(cymin == 1) {
       xmin = px[0].first;
       xmax = px[n - 1].first;
       ymin = py[1].first;
       ymax = py[n - 1].first;
       for(auto& [x, ind] : px) {
           if(ind != py[0].second) {
               xmin = x;
               break;
           }
       }
       for(int i = n - 1; i >= 0; --i) {
           auto [x, ind] = px[i];
           if(ind != py[0].second) {
               xmax = x;
               break;
           }
       }
       ll res = 1LL * (xmax - xmin + 1) * (ymax - ymin + 1);
       if(res == n - 1) res += min(xmax - xmin + 1, ymax - ymin + 1);
       ans = min(ans, res);
   }
   if(cymax == 1) {
       xmin = px[0].first;
       xmax = px[n - 1].first;
       ymin = py[0].first;
       ymax = py[n - 2].first;
       for(auto& [x, ind] : px) {
           if(ind != py[n - 1].second) {
               xmin = x;
               break;
           }
       }
       for(int i = n - 1; i >= 0; --i) {
           auto [x, ind] = px[i];
           if(ind != py[n - 1].second) {
               xmax = x;
               break;
           }
       }
       ll res = 1LL * (xmax - xmin + 1) * (ymax - ymin + 1);
       if(res == n - 1) res += min(xmax - xmin + 1, ymax - ymin + 1);
       ans = min(ans, res);
   }
   cout << ans << '\n';
}
```

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> X(n), Y(n);
    multiset<int> msx, msy;
    fer(i, 0, n) {
        cin >> X[i] >> Y[i];
        msx.insert(X[i]);
        msy.insert(Y[i]);
    }

    if(n == 1) {
        cout << 1 << '\n';
        return;
    }

    int x_max = *msx.rbegin(), x_min = *msx.begin();
    int y_max = *msy.rbegin(), y_min = *msy.begin();

    ll ans = 1LL * (x_max - x_min + 1) * (y_max - y_min + 1);

    fer(i, 0, n) {
        msx.erase(msx.find(X[i])), msy.erase(msy.find(Y[i]));
        x_max = *msx.rbegin(), x_min = *msx.begin();
        y_max = *msy.rbegin(), y_min = *msy.begin();
        ll cur = 1LL * (x_max - x_min + 1) * (y_max - y_min + 1);
        ans = min(ans, cur + (cur == n - 1 ? min(x_max - x_min + 1, y_max - y_min + 1) : 0));
        msx.insert(X[i]), msy.insert(Y[i]);
    }
    cout << ans << '\n';
}
```

## E. Kirei Attacks the Estate

### 思路

$dfs + dp$ ，自身节点对后一个节点产生与自身相反的影响，所以我们需要用两个$dp$数组记录本节点的正影响和负影响。

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<vector<int>> adjlist(n + 1);
    vector<ll> w(n + 1);

    fer(i, 1, n + 1) cin >> w[i];
    fer(i, 0, n - 1) {
        int u, v;
        cin >> u >> v;
        adjlist[u].push_back(v);
        adjlist[v].push_back(u);
    }
    vector<bool> vis(n + 1, false);
    vector<ll> dpmin(n + 1, 0), dpmax(n + 1, 0);
    fer(i, 1, n + 1) {
        dpmin[i] = dpmax[i] = w[i];
    }

    vis[1] = true;
    auto dfs = [&](auto self, int u) -> void {
        for(int v : adjlist[u]) {
            if(!vis[v]) {
                vis[v] = true;
                dpmax[v] = max(dpmax[v], w[v] - dpmin[u]);
                dpmin[v] = min(dpmin[v], w[v] - dpmax[u]);
                self(self, v);
            }
        }
    };

    dfs(dfs, 1);
    fer(i, 1, n + 1) cout << dpmax[i] << ' ';

    cout << '\n';
}
```

## F. Small Operations

### 思路1

1. 题意指给定$x, y, k$需要将$x$转化为$y$，可以有两种操作：将$x$乘一个在$[1, k]$范围内的数、将$x$除以一个在$[1, k]$范围内$x$的因子，操作不限次数，要求输出最小的操作次数，无法转换输出$-1$。
2. 可以发现，将$x$转化为$y$需要将各自独有的因子进行转换，所以可以先预处理`x / gcd(x, y), y / gcd(x, y)`，然后进行转换操作
3. 转换过程就是$dp$了，我们思路就是将$x$的所有因子转化为$1$，再转化为$y$的因子，其实就是将$x$和$y$都转化为$1$
4. 转化的$dp$如何定义呢？对于一个数$n$，我们需要将$n$的所有因子都转化为$1$（可以将多个因子合并成一次共同除以$[1, k]$内的一个因子，那么$dp[i]$就是考虑到将$n$的第$i$个因子转化为$1$时的最小操作次数
5. 遍历方式为：第一层从先往后，第二层从当前位置往后
6. 如果$n$的第$j$个因子是（前面）第$i$个因子的倍数，那么就有$dp[j] = min(dp[j], dp[i] + 1)$
7. 注意本题时间限制为$per test : 3s$，$1e6$以内因子个数最多仅有$240$个，时间是够的
8. 当然对于 $dp$ 数组的定义的不唯一的，$dp[i]$ 也可以定义为将 $n$ 转化为他的第 $i$ 个因子所需要的最小操作数，那么遍历的方式发生的变化：第一层从后往前，第二层从当前位置往后。

### 示例代码1

```cpp
#include<bits/stdc++.h>

using namespace std;

#define ll long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << char(61) << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 1e6 + 2;
const int inf = 1e9;

vector<vector<int>> fac(N);

void init() {
    fer(i, 1, N) {
        for(int j = i; j < N; j += i) {
            fac[j].push_back(i);
        }
    }
}

void solve() {
    int x, y, k;
    cin >> x >> y >> k;

    if(k == 1) {
        cout << (x == y ? 0 : -1) << '\n';
        return;
    }

    int d = gcd(x, y);
    x /= d, y /= d;

    auto work = [&](int n) {
        int m = fac[n].size();
        vector<int> dp(m, inf);
        // dp[i] : 考虑到将 n 的第 i 个因子转化为 1 时的最小操作次数
        dp[0] = 0;
        fer(i, 0, m) {
            fer(j, i + 1, m) {
                if(fac[n][j] % fac[n][i] == 0 && fac[n][j] / fac[n][i] <= k) {
                    dp[j] = min(dp[j], dp[i] + 1);
                } else if(fac[n][j] / fac[n][i] > k) {
                    break;
                }
            }
        }
        return dp[m - 1] == inf ? -1 : dp[m - 1];
    };
    cout << (work(x) == -1 || work(y) == -1 ? -1 : work(x) + work(y)) << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    init();
    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}
```

### 示例代码2

```cpp
#include<bits/stdc++.h>

using namespace std;

#define IOS cin.tie(nullptr) -> ios::sync_with_stdio(false)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cerr << #x << char(61) << x << " ###\n"
#define dbg_arr(a, i) cerr << #a << '[' << #i << "]=" << a[i] << " ###\n";

#define lowbit(x)  ((x) & -(x))
#define popcount(x)  __builtin_popcount(x)
#define popcountll(x)  __builtin_popcountll(x)
#define clz(x)  __builtin_clz(x)
#define ctz(x)  __builtin_ctz(x)

using u32 = unsigned;
using i64 = ll;
using u64 = ull;
using i128 = __int128;
using u128 = unsigned __int128;

const int MOD = 1e9 + 7;
const int N = 1e6 + 2;
const int inf = 1e9;

vector<int> g[N];

void prework() {
	fer(i, 1, N) {
		for(int j = i; j < N; j += i) {
			g[j].push_back(i);
		}
	}
}

void solve() {
    int x, y, k;
    cin >> x >> y >> k;
    if(k == 1) {
    	cout << (x == y ? 0 : -1) << '\n';
    	return;
    }

    int d = gcd(x, y);
    x /= d, y /= d;

    auto get = [&](int n) -> int {
    	int m = g[n].size();
    	vector<int> dp(m, inf); // 将 n 转化为他的第 i 个因子
    	dp[m - 1] = 0;

    	ferd(i, m - 2, 0) {
    		fer(j, i + 1, m) {
    			if(g[n][j] % g[n][i] == 0 && g[n][j] / g[n][i] <= k) {
    				dp[i] = min(dp[i], dp[j] + 1);
    			} else if(g[n][j] / g[n][i] > k) {
    				break;
    			}
    		}
    	}
    	return dp[0];
    };
    int res = get(x) + get(y);
    cout << (res >= inf ? -1 : res) << '\n';
}

signed main() {
    IOS;
    prework();

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}
```

### 思路2

- 值域 $bfs$ （值空间上的 $bfs$ ），对于 $x, y$ ，我们找到两条分别使得 $x, y$ 都转化为 $1$ 的最短路径，然后将两条路径的长度相加即可。
- 这个路径是什么意思呢？其实就是从 $x$ (或 $y$ )开始，通过在 $k$ 以内整除来连接他的因子，放入队列中，进行 $bfs$ ，直到找到 $1$ 为止。

### 示例代码3

```cpp
vector<vector<int>> fac(N);

void init() {
    fer(i, 1, N) {
        for(int j = i; j < N; j += i) {
            fac[j].push_back(i);
        }
    }
}

void solve() {
    int x, y, k;
    cin >> x >> y >> k;
    if(k == 1) {
        cout << (x == y ? 0 : -1) << '\n';
        return;
    }
    int d = gcd(x, y);
    x /= d, y /= d;

    auto bfs = [&](int n) -> int {
        int dist[n + 1];
        fill(dist, dist + n, inf);
        dist[n] = 0;

        queue<pii> q;
        q.push({n, 0}); // n转化为x时需要y步

        while(!q.empty()) {
            auto [x, y] = q.front(); q.pop();
            if(dist[x] < y) continue;

            for(auto it = next(fac[x].rbegin()); it != fac[x].rend(); ++it) {
                if(x / *it > k) break;
                if(dist[*it] > y + 1) {
                    dist[*it] = y + 1;
                    q.push({*it, y + 1});
                }
            }
        }
        return dist[1];
    };
    int res = bfs(x) + bfs(y);
    cout << (res >= inf ? -1 : res) << '\n';
}
```
