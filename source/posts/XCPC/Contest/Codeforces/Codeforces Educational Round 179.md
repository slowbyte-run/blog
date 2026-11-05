---
title: 'Codeforces Educational Round 179'
date: '2025-07-08'
link: 'codeforces-edu179'
description: 'Codeforces Educational Round 179 的题解与思路。'
tags:
  - 'algorithm'
  - 'codeforces'
categories:
  - 'XCPC'
  - 'Contest'
  - 'Codeforces'
---

> 本题解对应源码见仓库 `solutions/xcpc/codeforces/edu179/`。

## [题目链接](https://codeforces.com/contest/2111)

## [A. Energy Crystals](https://codeforces.com/contest/2111/problem/A)

### 题意

给三个数，初始值为 $0$ ，每次操作可以将其中一个数加上任意正数，在执行操作前必须满足任意一个数都小于等于任意其他数的一半（向下取整），求将三个数均变为 $x$ 的最少操作数。

### 思路

可以发现，第一步肯定是将两个 $0$ 变为 $1$ ，剩下一个 $0$ 可变为 $2/3$ ，可以发现在相同的 $2$ 的幂次区间内变为 $x$ 需要的操作数是相同的，通过枚举则可得出规律 $res = ({\lfloor} log_2x{\rfloor} + 1) * 2 + 1$

### 示例代码

```cpp
void solve() {
    int x;
    cin >> x;
    int a = __lg(x);
    cout << (a + 1) * 2 + 1 << '\n';
}
```

## [B. Fibonacci Cubes](https://codeforces.com/contest/2111/problem/B)

### 题意

有 $n$ 个立方体，其中第 $i$ 个边长为 $fi$ ，$f$ 是斐波拉契数列的值。$m$ 次询问，问一个 $w×l×h$ 的盒子能不能放下所有立方体。每个立方体不能有地方悬空，要么放在地面上要么放在另一个立方体上。

### 思路

先考虑最大的方块， $min(w, l, h) >= f[n]$，并且得满足可以将第 $n - 1$ 块能够放在他的上面，即 $max(w, l, h) >= f[n] + f[n - 1]$。其他方块可以通过迭代以相同的方式放置

### 算法思想

贪心

### 示例代码

```cpp
void solve() {
    int n, m;
    cin >> n >> m;

    fer(i, 0, m) {
        int mn = inf, mx = -inf;
        int a, b, c;
        cin >> a >> b >> c;
        mn = min({mn, a, b, c});
        mx = max({mx, a, b, c});

        if(mx < f[n] + f[n - 1] || mn < f[n]) {
            cout << '0';
        } else {
            cout << '1';
        }
    }
    cout << '\n';
}
```

## [C. Equal Values](https://codeforces.com/contest/2111/problem/C)

### 题意

对一个数组，一次操作是选一个下标 $i$ ，将其所有左边的数变为 $a_i$ ，代价为 $(i - 1) * a_i$ ，并且将其所有右边的数变为 $a_i$ ，代价为 $(n - i) * a_i$ 。求将数组变为相同值的最小代价。

### 思路

双指针，枚举每个相同数的区间，计算区间对应的代价，线性时间复杂度。

### 算法思想

快慢指针

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    ll res = LLONG_MAX;
    vector<int> arr(n + 1);

    fer(i, 1, n + 1) cin >> arr[i];

    int l = 1, r = 1;
    fer(i, 2, n + 1) {
        if(arr[i] != arr[i - 1]) {
            ll s = 1LL * (l - 1) * arr[l] + 1LL * (n - r) * arr[r];
            res = min(res, s);
            l = i, r = i;
        } else {
            r++;
        }
    }
    res = min(res, 1LL * (l - 1) * arr[l] + 1LL * (n - r) * arr[r]);
    cout << res << '\n';
}
```

## [D. Creating a Schedule](https://codeforces.com/contest/2111/problem/D)

### 题意

有$n$ 个小组，每组 $6$ 节课，有 $m$ 间教室，教室都在不同楼层上，需要安排每个小组每节课的教室位置，使得所需要爬的楼层数总和最大。

### 思路

贪心，将楼层排序后，取前 $n/2$ 和后 $n/2$ 处的教室，然后需要考虑 $n$ 为奇数的情况，将落单的组跟随前 $n/2$ 或后 $n/2$ 组。

### 算法思想

贪心

### 示例代码

```cpp
void solve() {
    int n, m;
    cin >> n >> m;
    vector<int> arr(m);

    fer(i, 0, m) cin >> arr[i];
    sort(all(arr));

    int res = 0;
    fer(i, 0, n / 2) {
        fer(j, 0, 6) {
            if(j & 1) {
                cout << arr[i] << ' ';
            } else {
                cout << arr[m - 1 - i] << ' ';
            }
        }
        cout << '\n';
    }

    fer(i, 0, n / 2) {
        fer(j, 0, 6) {
            if(j & 1) {
                cout << arr[m - 1 - i] << ' ';
            } else {
                cout << arr[i] << ' ';
            }
        }
        cout << '\n';
    }
    if(n & 1) {
        fer(i, 0, 6) {
            if(i & 1) cout << arr[n / 2] << ' ';
            else cout << arr[m - 1 - n / 2] << ' ';
        }
        cout << '\n';
    }
}
```

## [E. Changing the String](https://codeforces.com/contest/2111/problem/E)

### 题意

给你一个只包含 $a,b,c$ 的字符串，有 $m$ 次操作，每次让你把一类字符的一个变成另一个字符。你也可以无视任意这个操作。求最小字典序。

### 思路

用 `set` 记录每次操作，注意一定要记录操作的顺序，然后考虑什么时候需要替换。

- 对于 $a$ 无需进行操作
- 对 $b$ ，优先考虑 $b => a$ ，否则考虑 $b => c => a $
- 对 $c$ ，优先考虑 $c => a$ ，其次考虑 $c => b => a$ ，否则考虑 $c => b$

> 为什么采用 `set` 而不是`vector`呢，因为后续的`erase`和查找操作时间复杂度为 $O(logN)$ ，效率相比之下高许多。

### 示例代码

```cpp
void solve() {
    int n, q;
    cin >> n >> q;
    string s;
    cin >> s;
    set<int> st[3][3];

    fer(i, 0, q) {
        char x, y;
        cin >> x >> y;
        st[x - 'a'][y - 'a'].insert(i);
    }
    fer(i, 0, n) {
        if(s[i] == 'a') continue;

        if(s[i] == 'b') {
            if(st[1][0].size()) {
                st[1][0].erase(st[1][0].begin());
                s[i] = 'a';
            } else if(st[1][2].size()) {
                if(st[2][0].size()) {
                    auto it = st[2][0].upper_bound(*st[1][2].begin());
                    if(it != st[2][0].end()) {
                        st[1][2].erase(st[1][2].begin());
                        st[2][0].erase(it);
                        s[i] = 'a';
                    }
                }
            }
        } else if(s[i] == 'c') {
            if(st[2][0].size()) {
                st[2][0].erase(st[2][0].begin());
                s[i] = 'a';
            } else if(st[2][1].size()) {
                if(st[1][0].size()) {
                    auto it = st[1][0].upper_bound(*st[2][1].begin());
                    if(it != st[1][0].end()) {
                        st[2][1].erase(st[2][1].begin());
                        st[1][0].erase(it);
                        s[i] = 'a';
                    } else {
                        st[2][1].erase(st[2][1].begin());
                        s[i] = 'b';
                    }
                } else {
                    st[2][1].erase(st[2][1].begin());
                    s[i] = 'b';
                }
            }
        }
    }
    cout << s << '\n';
}
```
