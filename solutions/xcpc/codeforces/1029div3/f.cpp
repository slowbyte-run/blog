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
    vector<int> adjlist[n + 1];
    int LOG = 18;
    vector<int> depth(n + 1);
    vector<vector<int>> fa(LOG + 1, vector<int>(n + 1));

    fer(i, 0, n - 1) {
        int u, v;
        cin >> u >> v;
        adjlist[u].push_back(v);
        adjlist[v].push_back(u);
    }

    function<void(int, int)> dfs = [&](int u, int p) {
        fa[0][u] = p;
        depth[u] = p ? depth[p] + 1 : 0;

        for(int v : adjlist[u]) {
            if(v != p) {
                dfs(v, u);
            }
        }
    };

    auto init_lca = [&]() -> void {
        dfs(1, 0);

        fer(k, 1, LOG) {
            fer(i, 1, n + 1) {
                int mid = fa[k - 1][i];
                fa[k][i] = mid ? fa[k - 1][mid] : 0;
            }
        }
    };

    auto lca = [&](int u, int v) -> int {
        if(depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];

        fer(k, 0, LOG) {
            if(diff & (1 << k)) {
                u = fa[k][u];
            }
        }
        if(u == v) return u;

        ferd(k, LOG, 0) {
            if(fa[k][u] && fa[k][u] != fa[k][v]) {
                u = fa[k][u];
                v = fa[k][v];
            }
        }
        return fa[0][u];
    };

    auto fpow = [&](ll a, int b) -> ll {
        ll res = 1 % MOD;
        while(b) {
            if(b & 1) res = res * a % MOD;
            a = a * a % MOD;
            b >>= 1;
        }
        return res;
    };

    vector<int> leaf;
    fer(i, 2, n + 1) {
        if(adjlist[i].size() == 1) leaf.push_back(i);
    }

    if(leaf.size() > 2) {
        cout << 0 << '\n';
        return;
    } else if(leaf.size() == 1) {
        cout << fpow(2, n) << '\n';
        return;
    }

    init_lca();
    int u = leaf[0], v = leaf[1];
    int ans = 0, d = depth[lca(u, v)];
    if(depth[u] == depth[v]) {
        ans = fpow(2, d + 2);
    } else {
        ans = 3 * fpow(2, abs(depth[u] - depth[v]) + d) % MOD;
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