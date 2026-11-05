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
const int K = 19;

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int n, m, s;
    cin >> n >> m >> s;
    vector<int> adjlist[n + 1];
    vector<int> depth(n + 1);
    vector<vector<int>> fa(K, vector<int>(n + 1));

    fer(i, 0, n - 1) {
        int u, v;
        cin >> u >> v;
        adjlist[u].push_back(v);
        adjlist[v].push_back(u);
    }

    // 处理父亲、深度
    // auto dfs = [&](auto&& self, int u, int par) {
    //     fa[0][u] = par;
    //     depth[u] = (par ? depth[par] + 1 : 0);

    //     for(auto v : adjlist[u]) {
    //         if(v != par) {
    //             self(self, v, u);
    //         }
    //     }
    // };
    function<void(int, int)> dfs = [&](int u, int par) {
        fa[0][u] = par;
        depth[u] = (par ? depth[par] + 1 : 0);

        for(auto v : adjlist[u]) {
            if(v != par) {
                dfs(v, u);
            }
        }
    };

    // 处理 i 的 2^k 级父亲
    auto init_lca = [&]() {
        dfs(s, 0);

        fer(k, 1, K) {
            fer(i, 1, n + 1) {
                int mid = fa[k - 1][i];
                fa[k][i] = (mid ? fa[k - 1][mid] : 0);
            }
        }
    };

    auto lca = [&](int u, int v) -> int {
        if(depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];

        // 深度对齐
        fer(k, 0, K) {
            if(diff & (1 << k)) {
                u = fa[k][u];
            }
        }
        if(u == v) return u;

        // 二分提升
        ferd(k, K - 1, 0) {
            if(fa[k][u] && fa[k][u] != fa[k][v]) {
                u = fa[k][u];
                v = fa[k][v];
            }
        }
        return fa[0][u];
    };

    init_lca();
    while(m--) {
        int a, b;
        cin >> a >> b;
        cout << lca(a, b) << '\n';
    }

    return 0;
}