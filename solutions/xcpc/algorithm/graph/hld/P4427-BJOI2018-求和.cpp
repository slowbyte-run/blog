#include<bits/stdc++.h>

using namespace std;

#define IOS ios::sync_with_stdio(false); cin.tie(nullptr)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cerr << #x << char(61) << x << " ###\n"
#define dbg_arr(a, i) cerr << #a << '[' << i << "]=" << a[i] << " ###\n"
#define lowbit(x)  ((x) & -(x))

using u32 = unsigned;
using i64 = ll;
using u64 = ull;
using i128 = __int128;
using u128 = unsigned __int128;

const int MOD = 998244353;
const int N = 2e5 + 2;
const int inf = 1e9;

struct HLD {
	int n, cnt;
	vector<vector<int>> adj;
	vector<int> fa, dep, sz, top, in, out, seq;

	HLD(int _n) {
		init(_n);
	}

	void init(int _n) {
		n = _n;
		cnt = 0;
		adj.resize(n);
		fa.resize(n);
		dep.resize(n);
		sz.resize(n);
		top.resize(n);
		in.resize(n); out.resize(n);
		seq.resize(n);
	}

	void add(int u, int v) {
		adj[u].push_back(v);
		adj[v].push_back(u);
	}

	void work(int root = 0) {
		top[root] = 0;
		dep[root] = 0;
		fa[root] = -1;
		dfs1(root);
		dfs2(root);
	}

	// fa, dep, sz, son
	void dfs1(int u) {
		if(fa[u] != -1) adj[u].erase(find(all(adj[u]), fa[u]));

		sz[u] = 1;
		for(auto &v : adj[u]) {
			fa[v] = u;
			dep[v] = dep[u] + 1;
			dfs1(v);
			sz[u] += sz[v];
			if(sz[v] > sz[adj[u][0]]) {
				swap(v, adj[u][0]);
			}
		}
	}

	// in, seg, top
	void dfs2(int u) {
		in[u] = cnt++;
		seq[in[u]] = u;
		for(auto v : adj[u]) {
			top[v] = top[v] == adj[u][0] ? top[u] : v;
			dfs2(v);
		}
		out[u] = cnt;
	}

	int lca(int u, int v) {
		while(top[u] != top[v]) {
			if(dep[top[u]] > dep[top[v]]) {
				u = fa[top[u]];
			} else {
				v = fa[top[v]];
			}
		}
		return dep[u] < dep[v] ? u : v;
	}

	int dis(int u, int v) {
		return dep[u] + dep[v] - 2 * dep[lca(u, v)];
	}

	int jump(int u, int k) {
		if(dep[u] < k) {
			return -1;
		}
		int d = dep[u] - k;
		while(dep[top[u]] > d) {
			u =fa[top[u]];
		}
		return seq[in[u] - (dep[u] - d)];
	}

	bool isAncester(int u, int v ){
		return in[u] <= in[v] && in[v] < out[u];
	}
};

signed main() {
    IOS;

    int n;
    cin >> n;

    HLD t(n);
    fer(i, 0, n) {
    	int u, v;
    	cin >> u >> v;
    	t.add(u - 1, v - 1);
    }
    t.work();
    vector<vector<ll>> s(n + 1, vector<ll>(51));

    auto fpow = [](ll a, ll b) -> ll {
    	ll res = 1;
    	while(b) {
    		if(b & 1) res = res * a % MOD;
    		a = a * a % MOD;
    		b >>= 1;
    	}
    	return res;
    };

    fer(i, 0, n) {
    	fer(j, 1, 51) {
    		s[t.seq[i]][j] = (s[t.seq[i] - 1][j] + fpow(t.dep[i], j)) % MOD;
    	}
    }

    int m;
    cin >> m;
    while(m--) {
    	int i, j, k;
    	cin >> i >> j >> k;
    	i--, j--;
    	ll ans = 0;
    	while(t.top[i] != t.top[j]) {
    		if(t.dep[t.top[i]] < t.dep[t.top[j]]) swap(i, j);
			ans = (ans + s[t.seq[i]][k] - s[t.seq[t.top[i]] - 1][k]) % MOD;
    	}
    	if(t.dep[i] < t.dep[j]) swap(i, j);
    	ans = (ans + s[t.seq[i]][k] - s[t.seq[j] - 1][k]);
    	cout << ans << '\n';
    }

    return 0;
}