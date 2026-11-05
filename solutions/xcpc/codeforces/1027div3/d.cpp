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
    vector<int> X(n), Y(n);
    multiset<int> msx, msy;
    fer(i, 0, n) {
        cin >> X[i] >> Y[i];
        msx.insert(X[i]);
        msy.insert(Y[i]);
    }

    if(n == 1) {
        cout << 1 << '\n';
        return;
    }

    int x_max = *msx.rbegin(), x_min = *msx.begin();
    int y_max = *msy.rbegin(), y_min = *msy.begin();

    ll ans = 1LL * (x_max - x_min + 1) * (y_max - y_min + 1);

    fer(i, 0, n) {
        msx.erase(msx.find(X[i])), msy.erase(msy.find(Y[i]));
        x_max = *msx.rbegin(), x_min = *msx.begin();
        y_max = *msy.rbegin(), y_min = *msy.begin();
        ll cur = 1LL * (x_max - x_min + 1) * (y_max - y_min + 1);
        ans = min(ans, cur + (cur == n - 1 ? min(x_max - x_min + 1, y_max - y_min + 1) : 0));
        msx.insert(X[i]), msy.insert(Y[i]);
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