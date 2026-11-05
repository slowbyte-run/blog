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
    int n;
    cin >> n;
    vector<int> a(n + 1), b(n + 1);

    map<int, int> mp1, mp2;
    fer(i, 1, n + 1) cin >> a[i];
    fer(i, 1, n + 1) cin >> b[i];

    int ans = 0;
    fer(i, 1, n + 1) {
        if(mp1[a[i]]) ans = max(ans, mp1[a[i]]);
        if(mp2[b[i]]) ans = max(ans, mp2[b[i]]);
        if(a[i] == b[i]) ans = max(ans, i);

        if(mp1[b[i]] && i - mp1[b[i]] != 1) ans = max(ans, mp1[b[i]]);
        if(mp2[a[i]] && i - mp2[a[i]] != 1) ans = max(ans, mp2[a[i]]);

        mp1[a[i]] = i;
        mp2[b[i]] = i;
        cerr << "i = " << i << " ans = " << ans << '\n';
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