---
title: '8008: 纸牌游戏（ "Accordian" Patience）'
date: '2025-01-18 23:09'
link: 'cnblogs-18679016'
description: '用栈数组模拟纸牌游戏（Accordian Patience）的题解。'
tags:
  - 'algorithm'
categories:
  - 'Algorithm'
---

## [8008: 纸牌游戏（ "Accordian" Patience）](https://buctcoder.com/problem.php?id=8008)

## 题面

![](/img/posts/8008-%20%E7%BA%B8%E7%89%8C%E6%B8%B8%E6%88%8F%EF%BC%88%20Accordian%20Patience%EF%BC%89/1-3460892-20250118230613991-632853720.png)

## 思路

用栈数组模拟，注意寻找`pos`的左边第一个和左边第三个下标的写法。

## 示例代码

```cpp
#include<bits/stdc++.h>

using namespace std;

#define ll long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)

const int MOD = 1e9 + 7;
const int N = 55;
const int inf = 1e9;

stack<string> stk[N];

bool InRange(int x){
    return x >= 1 && x <= 52;
}

int GetLeftPos1(int x){
    if(InRange(x - 1) && !stk[x - 1].empty()) return x - 1;
    if(InRange(x - 1)) return GetLeftPos1(x - 1);
    return -1;
}

int GetLeftPos3(int x){
    return GetLeftPos1(GetLeftPos1(GetLeftPos1(x)));
}

void Init(){
    fer(i, 1, 53){
        while(!stk[i].empty()) stk[i].pop();
    }
}

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s;
    int pos = 1;

    while(cin >> s, s!= "#"){
        Init();
        pos = 1;
        stk[1].push(s);
        fer(i, 2, 53){
            cin >> s;
            stk[i].push(s);
        }
        while(pos <= 52){
            if(stk[pos].empty()){
                pos++;
                continue;
            }
            string top = stk[pos].top();
            if(GetLeftPos3(pos) != -1){
                string top1 = stk[GetLeftPos3(pos)].top();
                if(top1[0] == top[0] || top1[1] == top[1]){
                    stk[GetLeftPos3(pos)].push(top);
                    int ind = GetLeftPos3(pos);
                    stk[pos].pop();
                    pos = ind;
                    continue;
                }
            }
            if(GetLeftPos1(pos) != -1){
                string top1 = stk[GetLeftPos1(pos)].top();
                if(top1[0] == top[0] || top1[1] == top[1]){
                    stk[GetLeftPos1(pos)].push(top);
                    int ind = GetLeftPos1(pos);
                    stk[pos].pop();
                    pos = ind;
                    continue;
                }
            }
            pos++;
        }
        int cnt = 0;
        fer(i, 1, 53) cnt += !stk[i].empty();
        if(cnt > 1) cout << cnt << " piles remaining: ";
        else cout << cnt << " pile remaining: ";
        fer(i, 1, 53){
            if(!stk[i].empty()) cout << stk[i].size() << ' ';
        }
        cout << '\n';
    }

    return 0;
}
```
