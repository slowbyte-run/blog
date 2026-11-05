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

const int MOD = 1e9 + 7;
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
		top[root] = root;
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
			top[v] = v == adj[u][0] ? top[u] : v;
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

template<class T>
struct segmentTree {
	struct Node {
		int l, r;
		T sum;
		T lazy;
	};

	int n;
	vector<Node> tr;
	int mod;

	segmentTree(int _n, int p = 1e9 + 7) {
		mod = p;
		init(vector<T> (_n));
	}
	segmentTree(vector<T> a, int p = 1e9 + 7) {
		mod = p;
		init(a);
	}

	void init(vector<T> a) {
		n = a.size();
		tr.resize(n << 2);

		function<void(int, int, int)> build = [&](int i, int l, int r) -> void {
			tr[i].l = l, tr[i].r = r;
			if(l == r) {
				tr[i].sum = a[l] % mod;
				return;
			}
			int mid = l + (r - l >> 1);
			build(i << 1, l, mid);
			build(i << 1 | 1, mid + 1, r);
			push_up(i);
		};
		build(1, 0, n - 1);
	}

	void push_up(int i) {
		tr[i].sum = tr[i << 1].sum + tr[i << 1 | 1].sum;
		tr[i].sum %= mod;
	}
	void push_down(int i) {
		if(tr[i].lazy != 0) {
			int l = tr[i].l, r = tr[i].r;
			int mid = l + (r - l >> 1);

			tr[i << 1].sum += tr[i].lazy * (mid - tr[i << 1].l + 1) % mod;
			tr[i << 1].lazy += tr[i].lazy % mod;

			tr[i << 1 | 1].sum += tr[i].lazy * (tr[i << 1 | 1].r - mid) % mod;
			tr[i << 1 | 1].lazy += tr[i].lazy % mod;

			tr[i].lazy = 0;
		}
	}

	void update1(int i, int ind, T val) {
		int l = tr[i].l, r = tr[i].r;
		if(l == r) {
			tr[i].sum += val;
			return;
		}
		int mid = l + (r - l >> 1);
		if(ind <= mid) update1(i << 1, ind, val);
		else update1(i << 1 | 1, ind, val);
		push_up(i);
	}
	void update2(int i, int ul, int ur, T val) {
		int l = tr[i].l, r = tr[i].r;

		if(r < ul || l > ur) return;
		if(ul <= l && r <= ur) {
			// 打懒标记，无需再往后更新
			tr[i].sum += val * (r - l + 1) % mod;
			tr[i].lazy += val % mod;
			return;
		}

		push_down(i);
		int mid = l + (r - l >> 1);
		update2(i << 1, ul, ur, val);
		update2(i << 1 | 1, ul, ur, val);
		push_up(i);
	}

	T query(int i, int ql, int qr) {
		int l = tr[i].l, r = tr[i].r;

		if(r < ql || l > qr) return 0;
		if(ql <= l && r <= qr) return tr[i].sum;

		push_down(i);
		return (query(i << 1, ql, qr) + query(i << 1 | 1, ql, qr)) % mod;
	}

	void update1(int ind, T val) {
		update1(1, ind, val);
	}
	void update2(int ul, int ur, T val) {
		update2(1, ul, ur, val);
	}
	T query(int ql, int qr) {
		return query(1, ql, qr);
	}
};

signed main() {
    IOS;

    int n, m, r, p;
    cin >> n >> m >> r >> p;
    vector<int> w(n);
    fer(i, 0, n) cin >> w[i];

    HLD t(n);
    fer(i, 0, n - 1) {
    	int u, v;
    	cin >> u >> v;
    	u--, v--;
    	t.add(u, v);
    }
    t.work(r - 1);

    vector<int> init(n);
    fer(i, 0, n) {
    	init[i] = w[t.seq[i]];
    }

    segmentTree<int> seg(init, p);

    while(m--) {
    	int op;
    	cin >> op;
    	int x, y, z;
    	if(op == 1) {
    		cin >> x >> y >> z;
    		x--, y--;
    		while(t.top[x] != t.top[y]) {
    			if(t.dep[t.top[x]] > t.dep[t.top[y]]) {
    				seg.update2(t.in[t.top[x]], t.in[x], z);
    				x = t.fa[t.top[x]];
    			} else {
    				seg.update2(t.in[t.top[y]], t.in[y], z);
    				y = t.fa[t.top[y]];
    			}
    		}
    		if(t.dep[x] > t.dep[y]) {
    			seg.update2(t.in[y], t.in[x], z);
    		} else {
    			seg.update2(t.in[x], t.in[y], z);
    		}
    	} else if(op == 2) {
    		ll ans = 0;
    		cin >> x >> y;
    		x--, y--;
    		while(t.top[x] != t.top[y]) {
    			if(t.dep[t.top[x]] > t.dep[t.top[y]]) {
    				ans = (ans + seg.query(t.in[t.top[x]], t.in[x])) % p;
    				x = t.fa[t.top[x]];
    			} else {
    				ans = (ans + seg.query(t.in[t.top[y]], t.in[y])) % p;
    				y = t.fa[t.top[y]];
    			}
    		}
    		if(t.dep[x] > t.dep[y]) {
    			ans = (ans + seg.query(t.in[y], t.in[x])) % p;
    		} else {
    			ans = (ans + seg.query(t.in[x], t.in[y])) % p;
    		}
    		cout << ans << '\n';
    	} else if(op == 3) {
    		int x, z;
    		cin >> x >> z;
    		x--;
    		seg.update2(t.in[x], t.in[x] + t.sz[x] - 1, z);
    	} else if(op == 4) {
    		int x;
    		cin >> x;
    		x--;
    		ll ans = seg.query(t.in[x], t.in[x] + t.sz[x] - 1);
    		cout << ans << '\n';
    	}
    }
    return 0;
}