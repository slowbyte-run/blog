---
title: 'C++字符串分割方法'
date: '2025-03-25 11:55'
link: 'cnblogs-18790711'
description: '使用 getline 与 stringstream 对 C++ 字符串进行分割的方法。'
tags:
  - 'algorithm'
  - 'cpp'
categories:
  - 'Algorithm'
---

本文只讲解使用`getline`与`stringstream`对字符串进行分割，其他方法请参考其他博客

## getline与stringsteam结合

### 用法讲解

`istream& getline ( istream& is , string& str , char delim );`  
参数解释：  
`is`:输入流  
`str`:用于接受结果的字符串  
`delim`:分隔符

### 使用示例

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

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    string s;
    getline(cin, s);

    stringstream ss(s);
    string word;
    cout << "Using ss >> word:\n";
    // 以空格为分隔符，读取字符串中的单词
    while(ss >> word) cout << word << '\n';
    ss.clear();
    ss.str(s);
    cout << "Using getline(ss, word, 'e'):\n";
    // 以'e'为分隔符，读取字符串中的单词
    while(getline(ss, word, 'e')) cout << word << '\n';
    return 0;
}
```

**输出结果**

```txt
Using ss >> word:
hello
world!
my
name
is
...
Using getline(ss, word, 'e'):
h
llo world! my nam
 is ...
```
