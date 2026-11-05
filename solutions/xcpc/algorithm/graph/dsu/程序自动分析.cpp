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

struct DSU {
	int n;
	vector<int> fa, sz;

	// 节点编号从 1 开始
	DSU(int n) : n(n) {
		fa.resize(n + 1);
		iota(all(fa), 0);
		sz.resize(n + 1, 1);
	}

	int find(int x) {
		return x == fa[x] ? x : fa[x] = find(fa[x]);
	}

	void merge(int x, int y) {
		int rx = find(x), ry = find(y);
		if(rx != ry) {
			if(sz[rx] < sz[ry]) swap(rx, ry);
			fa[ry] = rx;
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

void solve() {
    int n;
    cin >> n;

    map<int, int> mp;
 	int cnt = 0;
 	vector<pii> v1, v2;

 	while(n--) {
 		int op, a, b;
 		cin >> a >> b >> op;
 		if(mp.find(a) == mp.end()) mp[a] = ++cnt;
 		if(mp.find(b) == mp.end()) mp[b] = ++cnt;
 		a = mp[a], b = mp[b];
		
		if(op == 1) v1.push_back({a, b}) 		;
		else v2.push_back({a, b});
 	}

 	DSU uf(cnt);
 	for(auto [a, b] : v1) {
 		uf.merge(a, b);
 	}
 	for(auto [a, b] : v2) {
 		if(uf.same(a, b)) {
 			cout << "NO\n";
 			return;
 		}
 	}
 	cout << "YES\n";
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}