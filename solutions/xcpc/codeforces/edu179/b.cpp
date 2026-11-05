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

int f[11];

void init() {
    f[1] = 1, f[2] = 2;
    fer(i, 3, 11) f[i] = f[i - 1] + f[i - 2];
}

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

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    init();
    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}