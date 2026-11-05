#include<bits/stdc++.h>

using namespace std;

#define IOS cin.tie(nullptr) -> ios::sync_with_stdio(false)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cerr << #x << char(61) << x << " ###\n"
#define dbg_arr(a, i) cerr << #a << '[' << i << "]=" << a[i] << " ###\n";

#define lowbit(x)  ((x) & -(x))
#define popcount(x)  __builtin_popcount(x)
#define popcountll(x)  __builtin_popcountll(x)
#define clz(x)  __builtin_clz(x)
#define ctz(x)  __builtin_ctz(x)

using u32 = unsigned;
using i64 = ll;
using u64 = ull;
using i128 = __int128;
using u128 = unsigned __int128;

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;

class DSU {
private:
	int n;
	vector<int> parent, rank;
public:	
	vector<int> E, sz; // 每个集合的边数和点数

public:
	// 节点编号从 0 开始
	DSU(int n) : n(n), parent(n), rank(n, 0) {
		iota(all(parent), 0);
		E.resize(n);
		sz.resize(n, 1);
	}

	int find(int x) {
		if(x != parent[x]) {
			parent[x] = find(parent[x]);
		}
		return parent[x];
	}

	void merge(int x, int y) {
		int rootx = find(x), rooty = find(y);
		if(rootx == rooty) {
			E[rootx]++;
			return;
		}

		if(rank[rootx] < rank[rooty]) {
			parent[rootx] = rooty;
			E[rooty] += E[rootx] + 1;
			sz[rooty] += sz[rootx];
		} else if(rank[rootx] > rank[rooty]) {
			parent[rooty] = rootx;
			E[rootx] += E[rooty] + 1;
			sz[rootx] += sz[rooty];
		} else {
			parent[rooty] = rootx;
			rank[rootx]++;
			E[rootx] += E[rooty] + 1;
			sz[rootx] += sz[rooty];
		}
	}

	bool same(int x, int y) {
		return find(x) == find(y);
	}
};

void solve() {
    int n, m;
    cin >> n >> m;

    DSU dsu(n);
    vector<vector<int>> g(n);
    vector<int> d(n);

    fer(i, 0, m) {
    	int u, v;
    	cin >> u >> v;
    	u--, v--;
    	dsu.merge(u, v);
    	g[u].push_back(v);
    	g[v].push_back(u);
    	d[u]++, d[v]++;
    }

    vector<int> st(n);
    int cnt = 0; // 章鱼图个数
    vector<int> V; // 每个章鱼图的根
    fer(i, 0, n) {
    	int x = dsu.find(i);
    	if(!st[x]) {
    		st[x] = true;
    		int c = dsu.E[x] + 1 - dsu.sz[x];
    		if(c == 1) {
				cnt++;
				V.push_back(x);
    		}
    	}
    }

    if(cnt != 1) {
    	cout << "No " << cnt << '\n';
    } else {
    	queue<int> q;
    	fer(i, 0, n) {
    		if(dsu.find(i) == V[0] && d[i] == 1) {
    			q.push(i);
    		}
    	}
    	int ans = 0;
    	while(!q.empty()) {
    		int u = q.front(); q.pop();
    		ans++;
    		for(auto v : g[u]) {
    			d[v]--;
    			if(d[v] == 1) q.push(v);
    		}
    	}
    	cout << "Yes " << dsu.sz[V[0]] - ans << '\n';
    }
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}