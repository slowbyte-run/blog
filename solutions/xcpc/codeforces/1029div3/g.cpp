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
const int inf = 2e9;

class DSU {
private:
	int n;
	vector<int> parent, rank;
	vector<pii> W;

public:
	// 节点编号从 0 开始
	DSU(int n) : n(n), parent(n), rank(n, 0) {
		iota(all(parent), 0);
		W.resize(n, {inf, -inf});
	}

	int find(int x) {
		if(x != parent[x]) {
			parent[x] = find(parent[x]);
		}
		return parent[x];
	}

	// merge还需要维护每个集合的边权最小值和最大值
	void merge(int x, int y, int w) {
		int rootx = find(x), rooty = find(y);
		if(rootx == rooty) {
			W[rootx].first = min(W[rootx].first, w);
			W[rootx].second = max(W[rootx].second, w);
			return;
		}

		if(rank[rootx] < rank[rooty]) {
			parent[rootx] = rooty;
			W[rooty].first = min({W[rooty].first, w, W[rootx].first});
			W[rooty].second = max({W[rooty].second, w, W[rootx].second});
		} else if(rank[rootx] > rank[rooty]) {
			parent[rooty] = rootx;
			W[rootx].first = min({W[rootx].first, w, W[rooty].first});
			W[rootx].second = max({W[rootx].second, w, W[rooty].second});
		} else {
			parent[rooty] = rootx;
			rank[rootx]++;
			W[rootx].first = min({W[rootx].first, w, W[rooty].first});
			W[rootx].second = max({W[rootx].second, w, W[rooty].second});
		}
	}

	bool same(int x, int y) {
		return find(x) == find(y);
	}

	int getAns() {
		return W[find(0)].first + W[find(0)].second;
	}
};

void solve() {
    int n, m;
    cin >> n >> m;
   	vector<array<int, 3>> adges(m);
   	fer(i, 0, m) {
   		int u, v, w;
   		cin >> u >> v >> w;
		u--, v--;
   		adges[i] = {w, u, v};
   	}
   	sort(all(adges));

   	DSU dsu(n);
   	int ans = inf;
   	for(auto& [w, u, v] : adges) {
   		dsu.merge(u, v, w);
		if(dsu.same(0, n - 1)) {
   			ans = min(ans, dsu.getAns());
		}
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