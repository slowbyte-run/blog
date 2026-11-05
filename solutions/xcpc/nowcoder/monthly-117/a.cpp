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

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int n;
    string s;
    cin >> n >> s;

    set<char> st;
    for(char c : s) st.insert(c);

    for(char c : s) {
        if(c >= 'a' && !st.count(c - 'a' + 'A')) {
            cout << "NO" << '\n';
            return 0;
        } else if(c >= 'A' && c <= 'Z' && !st.count(c - 'A' + 'a')) {
            cout << "NO" << '\n';
            return 0;
        }
    }
    cout << "YES" << '\n';
    return 0;
}