---
title: 'Codeforces Round 1013 (Div. 3)'
date: '2025-03-28 14:49'
link: 'cnblogs-18798045'
description: 'Codeforces Round 1013 (Div.3) 的题解与思路。'
tags:
  - 'algorithm'
  - 'codeforces'
categories:
  - 'Algorithm'
---

## [题目链接](https://codeforces.com/contest/2091)

## A. Olympiad Date

### 题面

![](</img/posts/Codeforces%20Round%201013%20(Div.%203)/1-3460892-20250328142656390-1685025361.png>)

### 思路

题目的意思是在给到哪一个数字时可以组成这个日期，输出这个数的位置。用`map`模拟即可

### 示例代码

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
const int N = 2e5 + 2;
const int inf = 1e9;


void solve() {
    int n;
    cin >> n;
    vector<int> arr(n);
    map<int, int> mp;

    fer(i, 0, n) cin >> arr[i];


    auto ok = [&]() -> bool {
        return mp[0] >= 3 && mp[1] >= 1 && mp[2] >= 2 &&
            mp[3] >= 1 && mp[5] >= 1;
    };

    fer(i, 0, n) {
        mp[arr[i]]++;
        if(ok()) {
            cout << i + 1 << '\n';
            return;
        }
    }
    cout << 0 << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T = 1;
    cin >> T;
    while(T--) solve();
    return 0;
}
```

## B. Team Training

### 题面

![](</img/posts/Codeforces%20Round%201013%20(Div.%203)/2-3460892-20250328142858948-18529984.png>)

### 思路

题意是将一支球队分成多个球队，球分了之后强队的最大数量。可以贪心，将能力倒排，如果一个人能成为强队就一个人成队，否则依次将能力小于他的人加入团队，满足强队就成队。类似于滑动窗口。

### 示例代码

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
const int N = 2e5 + 2;
const int inf = 1e9;


void solve() {
    ll n, x;
    cin >> n >> x;
    vector<ll> arr(n);
    fer(i, 0, n) cin >> arr[i];

    ll ans = 0;
    sort(all(arr), greater());
    int cnt = 0;

    ll t = x;
    fer(i, 0, n) {
        if(arr[i] >= x) {
            ans++;
            continue;
        }
        t = min(t, arr[i]), cnt++;
        if(t * cnt >= x) {
            ans++;
            t = x, cnt = 0;
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

## C. Combination Lock

### 题面

![](</img/posts/Codeforces%20Round%201013%20(Div.%203)/3-3460892-20250328143530368-163010645.png>)

### 思路

题意是要我们构造一个排列，使得将排列每一次进行循环移位后都恰好有一个不动点。  
分析样例可以发现，\(n\)为偶数一定不存在，为奇数时从小到大输出奇数在输出偶数就行。

### 示例代码

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
const int N = 2e5 + 2;
const int inf = 1e9;


void solve() {
    int n;
    cin >> n;
    if(n & 1) {
        for(int i = 1; i <= n; i += 2) cout << i << ' ';
        for(int i = 2; i <= n; i += 2) cout << i << ' ';
        cout << '\n';
    }
    else cout << -1 << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T = 1;
    cin >> T;
    while(T--) solve();
    return 0;
}
```

## D. Place of the Olympiad

### 题面

![](</img/posts/Codeforces%20Round%201013%20(Div.%203)/4-3460892-20250328144126049-82100609.png>)

### 思路

数学题，贪心。

### 示例代码

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
const int N = 2e5 + 2;
const int inf = 1e9;


void solve() {
    int n, m, k;
    cin >> n >> m >> k;
    int c = (k + n - 1) / n;
    m = m - c + 1;
    cout << (c + m - 1) / m << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T = 1;
    cin >> T;
    while(T--) solve();
    return 0;
}
```

## E. Interesting Ratio

### 题面

![](</img/posts/Codeforces%20Round%201013%20(Div.%203)/5-3460892-20250328144308738-1743705503.png>)

### 思路

要使得\(p = lcm(a, b) / gcd(a, b)\)，也就是\(p = a \times b / gcd^2(a, b)\)，可以枚举\(gcd\)，然后枚举\(p\)，满足\(p \times gcd(a, b) <= n\)时答案加一。

### 示例代码

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
const int N = 1e7 + 10;
const int inf = 1e9;

vector<int> primes;
vector<bool> is_prime(N, true);

void sieve() {
    is_prime[0] = is_prime[1] = false;
    fer(i, 2, N) {
        if(is_prime[i]) primes.push_back(i);
        for(auto p : primes) {
            if(i * p >= N) break;
            is_prime[i * p] = false;
            if(i % p == 0) break;
        }
    }
}

void solve() {
    int n;
    cin >> n;
    ll cnt = 0;

    fer(g, 1, n + 1) {
        for(auto p : primes) {
            if(g * p > n) break;
            cnt++;
        }
    }
    cout << cnt << '\n';
    //dbg(primes.size());
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T = 1;
    cin >> T;
    sieve();
    while(T--) solve();
    return 0;
}
```
