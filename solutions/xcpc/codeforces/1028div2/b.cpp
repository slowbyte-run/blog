#include<bits/stdc++.h>

using namespace std;

#define ll long long
#define ull unsigned long long
#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << char(61) << ' ' << x << '\n'

const int MOD = 998244353;
const int N = 1e5 + 2;
const int inf = 1e9;

ll arr[N];

void init() {
    arr[0] = 1, arr[1] = 2;
    fer(i, 2, N) {
        arr[i] = arr[i - 1] * 2 % MOD;
    }
}

void solve() {
    int n;
    cin >> n;
    vector<int> p(n + 1), q(n + 1);
    vector<pii> prep(n + 1), preq(n + 1);

    fer(i, 1, n + 1) cin >> p[i];
    fer(i, 1, n + 1) cin >> q[i];

    fer(i, 1, n + 1) {
        if(prep[i - 1].first <= p[i]) {
            prep[i] = {p[i], i};
        } else {
            prep[i] = prep[i - 1];
        }
        if(preq[i - 1].first <= q[i]) {
            preq[i] = {q[i], i};
        } else {
            preq[i] = preq[i - 1];
        }
    }

    fer(i, 1, n + 1) {
        pii p1 = {prep[i].first, q[i - prep[i].second + 1]};
        pii p2 = {preq[i].first, p[i - preq[i].second + 1]};
        if(p1 < p2) p1 = p2;
        ll res = (arr[p1.first] + arr[p1.second]) % MOD;
        cout << res << ' ';
    }
    cout << '\n';
}
signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    init();
    while(T--) solve();
    return 0;
}