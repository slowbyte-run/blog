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

const int MOD = 10000;
const int N = 2e5 + 2;
const int inf = 1e9;

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    string s;
    cin >> s;

    stack<int> stk;

    int x = 0;
    fer(i, 0, s.size()) {
        if(s[i] >= '0' && s[i] <= '9') {
            x = x * 10 + (s[i] - '0');
        } else if(s[i] == '+') {
            x %= MOD;
            stk.push(x);
            x = 0;
        } else if(s[i] == '*') {
            int a = x % MOD;
            int b = 0, j;
            for(j = i + 1; j < s.size(); j++) {
                if(s[j] >= '0' && s[j] <= '9') {
                    b = b * 10 + (s[j] - '0');
                    b %= MOD;
                } else {
                    break;
                }
            }
            i = j - 1;
            x = (a * b) % MOD;
        }
    }
    stk.push(x);
    ll res = 0;
    while(!stk.empty()) {
        res = (res + stk.top()) % MOD;
        stk.pop();
    }
    cout << res << '\n';
    return 0;
}