---
title: '字符串匹配：从 BF 到 KMP'
date: '2025-07-27 13:02'
link: 'algo-string-kmp'
description: '从暴力匹配到 KMP 的推导，next 数组的含义与求法，含洛谷模板题。'
tags:
  - 'algorithm'
  - 'string'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'String'
---

> 本篇对应源码见仓库 `solutions/xcpc/algorithm/string/kmp/`。

## BF算法

**说明**

- BF算法，即暴力(Brute Force)算法，是普通的[模式匹配](https://baike.baidu.com/item/模式匹配/1258334?fromModule=lemma_inlink)算法，BF算法的思想就是将目标串S的第一个字符与模式串T的第一个[字符](https://baike.baidu.com/item/字符/4768913?fromModule=lemma_inlink)进行匹配，若相等，则继续比较S的第二个字符和 T的第二个字符；若不相等，则比较S的第二个字符和T的第一个字符，依次比较下去，直到得出最后的匹配结果。

- 时间复杂度：O(mn)

**示例**

```cpp
int findPos(string s, string t)
{
    int m = s.size(), n = t.size();
    int i = 0, j = 0;
    while (i < m && j < n)
    {
        if (s[i] == t[j])
            i++, j++;
        else
            i = i - j + 1, j = 0;
    }
    if (j == n)
        return i - j;
    return -1;
}
```

## `KMP`算法及其优化

### 原理和说明

- 在匹配过程中，主串的指针不需要回溯，只回溯模式串的指针（回溯到匹配失败位置前的模式串的内容的最长公共前后缀的长度），然后继续比较
- 优化后的`KMP`算法的优化点在于`aaaaabaaaaac`与`aaaaac`的匹配，`b`与`c`失配后与`a`匹配（失配），然后根据`next`数组，后面又是与`a`匹配，这里是在做无用功
- 注意，kmp优化后的匹配过程也适用于优化前的匹配过程

前缀：包含头不包含尾的所有子串

后缀：包含尾不包含头的所有子串

最长相等前后缀：两者的交集的中的最大长度

注意：若字符串长度为1，则没有前后缀

`next` 数组：

- 给模式串的每个位置 `i` 赋一个值，表示 `i` 之前的字符串前后缀最大匹配长度
- 特殊的，`next[0] = -1, next[1] = 0`
  - 如模式串 `t = "aabaabsaabaaa` 的 `next[] = {-1, 0, 1, 0, 1, 2, 3, 0, 1, 2, 3, 4, 5, 2}`

### 求`next`数组(前缀表)

步骤：

- 初始化, `next[0] = -1, next[1] = 0`
- `next[i] 与本身字符 s2[i]` 没有关系
- 那么 `next[i]` 可以根据 `next[i - 1]`，和 `s2[i - 1] =?= s2[next[i - 1]]` 得出，实际上就是看上一个字符 `s2[i - 1]` 与上一个字符最大前缀的下一个字符 `s2[next[i - 1]]` 是否相等，否则递归处理

```cpp
void get_next(string s, vector<int> &ne)
{
    ne[0] = -1;
    int m = s.size();
    if(m == 1) return;
    ne[1] = 0;
	// i: 当前要求的 next 值的位置
	// ind: 当前要和 s[i - 1] 匹配的下标
	int i = 2, ind = 0;
	while(i < m) {
		if(s[i - 1] == s[ind]) {
			ne[i++] = ++ind;
		} else if(ind > 0) {
			ind = ne[ind];
		} else {
			ne[i++] = 0;
		}
	}
}
```

### 匹配过程

步骤：

- 如果当前 `s1[x] == s2[y]` 说明，这一位匹配上了，那么 `x++, y++`
- 否则，如果当前 `y == 0` ，也就是说，`s2` 不能通过前缀数组进行跳跃了，也就是 `s2` 没有一个前缀可以和 `s1` 当前后缀进行匹配，那么只能 `x++`
- 否则，是可以进行跳跃，用 `s2` 的前缀和 `s1` 当前的某个后缀进行匹配，那么就是 `y` 进行跳跃操作, `y = next[y]`

- 那么循环退出条件就是 `x < n && y < m`
- 那么最终退出循环后，判断是否匹配成功的条件就是 `y == m ? x - m : -1`，匹配成功返回的是首字母匹配的下标

```cpp
int kmp(string s1, string s2) {
	int n = s1.size(), m = s2.size();

	int x = 0, y = 0;
	while(x < n && y < m) {
		if(s1[x] == s2[y]) {
			x++, y++;
		} else if(y != 0) {
			y = next[y];
		} else {
			x++;
		}
	}
	return y == m ? x - m : -1;
}
```

### 求`nextval`数组

```cpp
void get_nextval(string s, int m, int *ne, int *neval)
{
    neval[0] = -1;
    if (m == 1)
        return;
    int i = 0;
    while (i < m)
    {
        if (s[i] == s[ne[i]])
            neval[i] = neval[ne[i]]; // 跳过相同的匹配不上的字符
        else
            neval[i] = ne[i]; // 否则，与 next 一样
        i++;
    }
    return;
}
```

### 优化后的匹配过程

```cpp
    int i = 0, j = 0;
    while (i < m && j < n)
    {
        // 如果 j == -1,说明 i 这个位置不可能匹配，所以 i++, j = 0(即j++)
        // 如果 s1[i] == s2[j], 说明 i 这个位置匹配上了，所以 i++, j++
        if (j == -1 || s1[i] == s2[j])
            i++, j++;
        else // 其他情况: j != -1 且匹配不上，则 j = neval[j]
            j = neval[j];
    }
    cout << (j == s2.size() ? "YES" : "NO") << endl;
```

### 究极完整代码

```cpp
#include <bits/stdc++.h>

using namespace std;

#define ll long long
#define int ll
#define pii pair<int, int>
#define all(x) x.begin(), x.end()

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;

void get_next(string s, int m, int *ne)
{
    ne[0] = -1;
    if (m == 1)
        return;
    ne[1] = 0;

    int i = 2, cn = 0;
    while (i < m)
    {
        while (cn > 0 && s[i - 1] != s[cn])
            cn = ne[cn];
        if (s[i - 1] == s[cn])
            ne[i++] = ++cn;
        else
            ne[i++] = 0;
    }
    return;
}

void get_nextval(string s, int m, int *ne, int *neval)
{
    neval[0] = -1;
    if (m == 1)
        return;
    int i = 0;
    while (i < m)
    {
        if (s[i] == s[ne[i]])
            neval[i] = neval[ne[i]]; // 跳过相同的匹配不上的字符
        else
            neval[i] = ne[i]; // 否则，与 next 一样
        i++;
    }
    return;
}

void kmp(string s1, string s2)
{
    int m = s1.size(), n = s2.size();
    int *ne = new int[n];

    cout << "kmp匹配:\n";

    get_next(s2, n, ne);
    cout << "打印next数组:" << endl;
    for (int i = 0; i < n; i++)
        cout << ne[i] << ' ';
    cout << endl;

    int i = 0, j = 0;
    while (i < m && j < n)
    {
        while (j > 0 && s1[i] != s2[j])
            j = ne[j]; // 得到新的下标(>=0)
        if (s1[i] == s2[j])
            i++, j++;
        else
            i++;
    }
    if (j == n)
        cout << i - j << endl;
    else
        cout << -1 << endl;
}

void kmp_plus(string s1, string s2)
{
    int m = s1.size(), n = s2.size();
    int *ne = new int[n];

    get_next(s2, n, ne);
    int *neval = new int[n];
    get_nextval(s2, s2.size(), ne, neval);

    cout << "kmp_plus匹配\n";
    cout << "打印nextval数组:" << endl;
    for (int i = 0; i < n; i++)
        cout << neval[i] << ' ';
    cout << endl;

    int i = 0, j = 0;
    while (i < m && j < n)
    {
        // 如果 j == -1,说明 i 这个位置不可能匹配，所以 i++, j = 0(即j++)
        // 如果 s1[i] == s2[j], 说明 i 这个位置匹配上了，所以 i++, j++
        if (j == -1 || s1[i] == s2[j])
            i++, j++;
        else // 其他情况: j != -1 且匹配不上，则 j = neval[j]
            j = neval[j];
    }
    if (j == n)
        cout << i - j << endl;
    else
        cout << -1 << endl;
}
signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    string s1, s2;
    cin >> s1 >> s2;
    kmp(s1, s2);
    kmp_plus(s1, s2);
    return 0;
}
```

```cpp
// 输入
ababaaaaababaaab
ababaaab
```

```cpp
// 输出
kmp匹配:
打印next数组:
-1 0 0 1 2 3 1 1
YES

kmp_plus匹配
打印nextval数组:
-1 0 -1 0 -1 3 1 0
YES

```

## 题目

### [模板KMP](https://www.luogu.com.cn/problem/P3375)

**题意**

找出模式串在主串的每次出现的位置，并且求出模式串的`next`数组

**思路**

模板题，模拟KMP即可

```cpp
#include <bits/stdc++.h>

using namespace std;

#define ll long long
#define int ll
#define pii pair<int, int>
#define all(x) x.begin(), x.end()
#define endl '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;

void get_ne(string s, int ne[])
{
    int m = s.size();
    ne[0] = -1;
    if (m == 1)
        return;
    ne[1] = 0;

    int i = 2, cn = 0;
    while (i <= m)
    {
        while (cn > 0 && s[i - 1] != s[cn])
            cn = ne[cn];
        if (s[i - 1] == s[cn])
            ne[i++] = ++cn;
        else
            ne[i++] = 0;
    }
    return;
}
void get_neval(string s, int ne[], int neval[])
{
    int m = s.size();
    neval[0] = -1;
    if (m == 1)
        return;

    int i = 1;
    while (i < m)
    {
        if (s[i] == s[ne[i]])
            neval[i] = neval[ne[i]];
        else
            neval[i] = ne[i];
        i++;
    }
    return;
}
signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    string s1, s2;
    cin >> s1 >> s2;
    int m = s1.size(), n = s2.size();
    int *ne = new int[n + 2];
    int *neval = new int[n + 2];
    get_ne(s2, ne);
    get_neval(s2, ne, neval);

    int i = 0, j = 0;
    while (i < m)
    {
        if (j == -1 || s1[i] == s2[j])
            i++, j++;
        else
            j = neval[j];
        if (j == n)
        {
            cout << i - j + 1 << endl;	// 注意纯 endl 会超时
            i = i - j + 1;
            j = 0;
        }
    }
    for (int i = 1; i <= n; i++)
        cout << ne[i] << ' ';

    return 0;
}
```

### [B. Password](https://codeforces.com/problemset/problem/126/B)

**题意**

你需要找到既是 `S` 的前缀又是 `S` 的后缀同时又在 `S`中间出现过的最长子串

**思路**

求出`S`的`next`数组，并且用`map`记下每个`next[i]`的个数，分不需要跳跃和需要跳跃两种情况模拟

```cpp
#include <bits/stdc++.h>

using namespace std;

#define ll long long
#define int ll
#define pii pair<int, int>
#define all(x) x.begin(), x.end()
#define endl '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;

map<int, int> mp;

void get_ne(string s, int ne[])
{
    int m = s.size();
    ne[0] = -1;
    mp[-1]++;
    if (m == 1)
        return;
    ne[1] = 0;
    mp[0]++;
    int i = 2, cn = 0;
    while (i <= m)
    {
        while (cn > 0 && s[i - 1] != s[cn])
            cn = ne[cn];
        if (s[i - 1] == s[cn])
            ne[i] = ++cn;
        else
            ne[i] = 0;
        mp[ne[i++]]++;
    }
    return;
}
void solve()
{
    string s;
    cin >> s;
    int *ne = new int[s.size() + 2];
    get_ne(s, ne);
    string ss;
    int len = ne[s.size()];

    // for (int i = 0; i <= s.size(); i++)
    //     cout << ne[i] << ' ';
    // cout << endl;
    bool f = true;
    while (len > 0)
    {
        if (f && mp[len] > 1)
        {
            ss = s.substr(0, len);
            break;
        }
        else if (!f && mp[len] >= 1)
        {
            ss = s.substr(0, len);
            break;
        }
        f = false;
        len = ne[len];
    }
    cout << (len > 0 ? ss : "Just a legend");
}

signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
    {
        solve();
    }
    return 0;
}
```

### [Power Strings](https://www.luogu.com.cn/problem/UVA10298)

**题意**

求一个字符串最多由多少个重复的子串连接而成

**思路**

结合题面分析`next`数组，可以得到结论：循环节的长度 `k = s.size() - ne[s.size()]`

```cpp
#include <bits/stdc++.h>

using namespace std;

#define ll long long
#define int ll
#define pii pair<int, int>
#define all(x) x.begin(), x.end()
#define endl '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;

void get_next(string s, int m, int *ne)
{
    ne[0] = -1;
    if (m == 1)
        return;
    ne[1] = 0;

    int i = 2, cn = 0;
    while (i <= m)
    {
        while (cn > 0 && s[i - 1] != s[cn])
            cn = ne[cn];
        if (s[i - 1] == s[cn])
            ne[i++] = ++cn;
        else
            ne[i++] = 0;
    }
    return;
}

signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    string s;
    while (cin >> s, s != ".")
    {
        int m = s.size();
        int *ne = new int[m + 2];

        get_next(s, m, ne);
        int cnt = m - ne[m];
        if (m % cnt)
            cout << 1 << endl;
        else
            cout << m / cnt << endl;
    }

    return 0;
}
```

### [P4391](https://www.luogu.com.cn/problem/P4391)

**题意**

给你一个字符串，它是由某个字符串不断自我连接形成的。但是这个字符串是不确定的，现在只想知道它的最短长度是多少。

**思路**

结合题面分析`next`数组，可以得到结论：循环节的长度 `k = s.size() - ne[s.size()]`

```cpp
#include <bits/stdc++.h>

using namespace std;

#define ll long long
#define int ll
#define pii pair<int, int>
#define all(x) x.begin(), x.end()
#define endl '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;

void get_next(string s, int m, int *ne)
{
    ne[0] = -1;
    if (m == 1)
        return;
    ne[1] = 0;

    int i = 2, cn = 0;
    while (i <= m)
    {
        while (cn > 0 && s[i - 1] != s[cn])
            cn = ne[cn];
        if (s[i - 1] == s[cn])
            ne[i++] = ++cn;
        else
            ne[i++] = 0;
    }
    return;
}

signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    string s;
    cin >> n >> s;
    int *ne = new int[n + 2];
    get_next(s, s.size(), ne);

    // for (int i = 0; i <= n; i++)
    //     cout << ne[i] << ' ';
    // cout << endl;

    int k = n - ne[n]; // 循环节的长度
    cout << k << endl;

    return 0;
}
```
