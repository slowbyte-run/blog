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
const int N = 3e4;
const int inf = 1e9;

struct DSU {
	int n;
	vector<int> fa, sz;
	vector<int> d;

	// 节点编号从 1 开始
	DSU(int n) : n(n) {
		fa.resize(n + 1);
		iota(all(fa), 0);
		sz.resize(n + 1, 1);
		d.resize(n + 1, 0);
	}

	int find(int x) {
		if(x == fa[x]) return x;
		int t = fa[x];
		fa[x] = find(fa[x]);
		d[x] += d[t];
		return fa[x];
	}

	void merge(int x, int y) {
		int rx = find(x), ry = find(y);
		if(rx != ry) {
			//if(sz[rx] < sz[ry]) swap(rx, ry);
			fa[ry] = rx;
			d[ry] = sz[rx];
			sz[rx] += sz[ry];
		}
	}

	bool same(int x, int y) {
		return find(x) == find(y);
	}

	int size(int x) {
		return sz[find(x)];
	}
};

signed main() {
    IOS;

    int t;
    cin >> t;
    DSU uf(N);

    while(t--) {
    	char op;
    	int a, b;
    	cin >> op >> a >> b;
    	if(op == 'M') {
    		uf.merge(b, a);
    	} else if(op == 'C') {
    		int ans = -1;
    		if(uf.same(a, b)) {
    			ans = abs(uf.d[a] - uf.d[b]) - 1;
    		} 
    		cout << ans << '\n';
    	}
    }

    return 0;
}