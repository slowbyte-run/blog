#include<bits/stdc++.h>

using namespace std;

#define ll long long
#define ull unsigned long long
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

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}