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
    vector<vector<int>> adjlist(n + 1);
    int max_k = 11;
    vector<int> depth(n + 1);
    vector<vector<int>> fa(max_k + 1, vector<int>(n + 1));

    fer(i, 1, n + 1) {
    	int t;
    	cin >> t;
    	while(t--) {
    		int v;
    		cin >> v;
    		adjlist[i].push_back(v);
    		adjlist[v].push_back(i);
    	}
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
    	fer(k, 1, max_k) {
    		fer(i, 1, n + 1) {
    			int mid = fa[k - 1][i];
    			fa[k][i] = mid ? fa[k - 1][mid] : 0;
    		}
    	}
    };
    auto lca = [&](int u, int v) -> int {
    	if(depth[u] < depth[v]) swap(u, v);
    	int diff = depth[u] - depth[v];

    	fer(k, 0, max_k) {
    		if(diff & (1 << k)) {
    			u = fa[k][u];
    		}
    	}
    	if(u == v) return u;

    	ferd(k, max_k, 0) {
    		if(fa[k][u] && fa[k][u] != fa[k][v]) {
    			u = fa[k][u];
    			v = fa[k][v];
    		}
    	}
    	return fa[0][u];
    };

    init_lca();
    int q;
    cin >> q;
    while(q--) {
    	int u, v;
    	cin >> u >> v;
    	cout << lca(u, v) << '\n';
    }
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1, cnt = 1;
    cin >> T;
    while(T--) {
    	cout << "Case " << cnt++ << ":\n";
    	solve();
    }

    return 0;
}