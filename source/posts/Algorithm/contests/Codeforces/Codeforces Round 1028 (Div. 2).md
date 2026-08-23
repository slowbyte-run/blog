---
title: 'Codeforces Round 1028 (Div. 2)'
date: '2025-06-04 17:01'
link: 'cnblogs-18910584'
description: 'Codeforces Round 1028 (Div.2) 的题解与思路。'
tags:
  - 'algorithm'
  - 'codeforces'
categories:
  - 'Algorithm'
---

## [题目链接](https://codeforces.com/contest/2116)

## A. [Gellyfish and Tricolor Pansy](https://codeforces.com/contest/2116/problem/A)

### 题意

两个人有各自的生命值和武器（也有生命值），两个人都以最优的方案攻击对方或者对方的武器，轮流攻击，问最后的赢家是谁。

### 思路

贪心，每个人都优先攻击对方与对方武器生命值较小的，这样的话要么对方直接死亡，要么对方没有武器攻击己方。注意较小生命值相同的情况应该是第一方胜

### 算法思想

贪心，博弈论

### 示例代码

```cpp
void solve() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;

    cout << (min(a, c) < min(b, d) ? "Flower" : "Gellyfish") << '\n';
}
```

## B. [Gellyfish and Baby's Breath](https://codeforces.com/contest/2116/problem/B)

### 题意

给出两个\(n\)的排列\([0, n - 1]\)的数组， 对于所有 \(i\)( \(0 \leq i \leq n-1\)), \(r_i = \max\limits_{j=0}^{i}2^{p_j} + 2^{q_{i-j}}\)  
输出\(r\)数组中的每个元素

### 思路

- 因为\(2 ^ n >= 2 ^ {n - 1} + 2 ^ {n - 1}\)，所以对于每次遍历的\(i\)来说，\(r_i\)对应的取法就是：在\(p\)数组取最大，然后在\(q\)数组取对应的位置；或者在\(q\)数组取最大，\(p\)取对应的位置。\(r_i\)就是这两种取法的较大者，如何每次都能在较短的时间内获取到\(p\)数组和\(q\)数组的最大值呢？很显然就是用前缀数组了。

> [!Caution]

- 注意题目要求对\(r_i\)取模，并且是在比较完两种情况后再取模！！！如果你是在取模之后再比较就喜提WA3了！！！
- 下面给出解释：
  - 第一种先每一步取模再取较大者：\((2 ^ a + 2 ^ b) \% MOD\)与\((2^c + 2^d)\%MOD\)
  - 第二种先取较大者再取模（也就是题目的意思）：\(max(2 ^ a + 2 ^ b, 2^c + 2^d)\%MOD\)
  - 这两中做法之所以不等价，关键点在于，\((2 ^ a + 2 ^ b) \% MOD\)与\((2 ^ a + 2 ^ b)\)（包括另一对）他们只是同余关系，并非等价关系，也就是说当出现溢出\(MOD\)的情况时，会影响到取\(max\)的操作！！！

### 算法思想

数学，前缀数组

### 示例代码

```cpp
ll arr[N];

void init() {
    arr[0] = 1, arr[1] = 2;
    fer(i, 2, N) {
        arr[i] = arr[i - 1] * 2 % MOD;
    }
}

void solve() {
    int n;
    cin >> n;
    vector<int> p(n + 1), q(n + 1);
    vector<pii> prep(n + 1), preq(n + 1);

    fer(i, 1, n + 1) cin >> p[i];
    fer(i, 1, n + 1) cin >> q[i];

    fer(i, 1, n + 1) {
        if(prep[i - 1].first <= p[i]) {
            prep[i] = {p[i], i};
        } else {
            prep[i] = prep[i - 1];
        }
        if(preq[i - 1].first <= q[i]) {
            preq[i] = {q[i], i};
        } else {
            preq[i] = preq[i - 1];
        }
    }

    fer(i, 1, n + 1) {
        pii p1 = {prep[i].first, q[i - prep[i].second + 1]};
        pii p2 = {preq[i].first, p[i - preq[i].second + 1]};
        if(p1 < p2) p1 = p2;
        ll res = (arr[p1.first] + arr[p1.second]) % MOD;
        cout << res << ' ';
    }
    cout << '\n';
}
```

## C. [Gellyfish and Flaming Peony](https://codeforces.com/contest/2116/problem/C)

### 题意

给出数组\(a\)，一次操作为选两个不同索引\(i, j\)，进行\(a_i = gcd(a_i, a_j)\) ，求出使得数组元素都相等的最小操作数。

### 思路

可以想到最终数组元素都会变为所有元素的 \(gcd\) ，那么就可以分为两种情况

- 如果数组中本就有元素等于 \(gcd\) ，那么其余元素只需要分别进行一次操作；
- 如果数组中所有元素都不等于 \(gcd\) ，那么我们需要使用最小的操作数得到第一个 \(gcd\) ，这样其余元素也是只需要分别进行一次操作。那么如何用最少的操作数找出第一个 \(gcd\) 呢？我们可以**在值空间上进行 \(bfs\)**
  - 我们需要的就是选择一个起点，然后从这个起点开始经过最短的路径得出 \(gcd\) ，而每个点之间的关系就是通过两者的 \(gcd\) 相连的
  - 既然如此，我们只要维护一个到某个 \(gcd\) 需要的最小操作数这个数组就行了
- 本题也可以用动态规划 \(+\) 滚动数组维护上面提到的数组。事实上，似乎可以在值空间上进行\(bfs\) 的题目都可以用动态规划 \(+\) 滚动数组来做，只是 \(bfs\) 并不会将值域所有的值都访问一遍，而动态规划 \(+\) 滚动数组会将值域所有的值都访问一遍，如果值域大但可达集稀疏，那么使用 \(bfs\) 更省时省空间。

### 算法思想

值域 \(bfs\) ，动态规划 \(+\) 滚动数组

### 示例代码

```cpp
void solve() {
    int n;
    cin >> n;
    vector<int> arr(n);

    int g = 0;
    fer(i, 0, n) {
        cin >> arr[i];
        g = gcd(g, arr[i]);
    }

    if(g == *min_element(all(arr))) {
        cout << n - count(all(arr), g) << "\n";
        return;
    }

    vector<int> dist(*max_element(all(arr)) + 1, INT_MAX);
    queue<int> q;
    for(int x : arr) q.push(x), dist[x] = 0;
    while(!q.empty()) {
        int u = q.front(); q.pop();
        if(u == g) break;
        for(int x : arr) {
            int w = gcd(u, x);
            if(dist[w] > dist[u] + 1) {
                dist[w] = dist[u] + 1;
                q.push(w);
            }
        }
    }
    cout << dist[g] + (n - 1) << '\n';
}
```
