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
    vector<vector<int>> adjlist(n + 1);
    vector<ll> w(n + 1);

    fer(i, 1, n + 1) cin >> w[i];
    fer(i, 0, n - 1) {
        int u, v;
        cin >> u >> v;
        adjlist[u].push_back(v);
        adjlist[v].push_back(u);
    }
    vector<bool> vis(n + 1, false);
    vector<ll> dpmin(n + 1, 0), dpmax(n + 1, 0);
    fer(i, 1, n + 1) {
        dpmin[i] = dpmax[i] = w[i];
    }

    vis[1] = true;
    auto dfs = [&](auto self, int u) -> void {
        for(int v : adjlist[u]) {
            if(!vis[v]) {
                vis[v] = true;
                dpmax[v] = max(dpmax[v], w[v] - dpmin[u]);
                dpmin[v] = min(dpmin[v], w[v] - dpmax[u]);
                self(self, v);
            }
        }
    };
    
    dfs(dfs, 1);
    fer(i, 1, n + 1) cout << dpmax[i] << ' ';
    
    cout << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}