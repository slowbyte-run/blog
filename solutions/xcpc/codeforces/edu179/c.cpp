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
    ll res = LLONG_MAX;
    vector<int> arr(n + 1);

    fer(i, 1, n + 1) cin >> arr[i];

    int l = 1, r = 1;
    fer(i, 2, n + 1) {
        if(arr[i] != arr[i - 1]) {
            ll s = 1LL * (l - 1) * arr[l] + 1LL * (n - r) * arr[r];
            res = min(res, s);
            l = i, r = i;
        } else {
            r++;
        }
    }
    res = min(res, 1LL * (l - 1) * arr[l] + 1LL * (n - r) * arr[r]);
    cout << res << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}