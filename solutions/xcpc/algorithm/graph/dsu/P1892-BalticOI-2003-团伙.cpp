// #include<bits/stdc++.h>

// using namespace std;

// #define IOS cin.tie(nullptr) -> ios::sync_with_stdio(false)
// #define ll long long
// #define ull unsigned long long
// //#define int ll
// #define pii pair<int, int>
// #define all(x) x.begin(),x.end()
// #define fer(i, m, n) for(int i = m; i < n; ++i)
// #define ferd(i, m, n) for(int i = m; i >= n; --i)
// #define dbg(x) cerr << #x << char(61) << x << " ###\n"
// #define dbg_arr(a, i) cerr << #a << '[' << i << "]=" << a[i] << " ###\n";

// #define lowbit(x)  ((x) & -(x))
// #define popcount(x)  __builtin_popcount(x)
// #define popcountll(x)  __builtin_popcountll(x)
// #define clz(x)  __builtin_clz(x)
// #define ctz(x)  __builtin_ctz(x)

// using u32 = unsigned;
// using i64 = ll;
// using u64 = ull;
// using i128 = __int128;
// using u128 = unsigned __int128;

// const int MOD = 1e9 + 7;
// const int N = 2e5 + 2;
// const int inf = 1e9;

// class DSU {
// private:
// 	int n;
// 	vector<int> parent, rank;

// public:
// 	vector<int> sz;
// 	// 节点编号从 0 开始
// 	DSU(int n) : n(n) {
// 		parent.resize(n);
// 		iota(all(parent), 0);
// 		rank.resize(n);
// 		sz.resize(n, 1);
// 	}

// 	int find(int x) {
// 		if(x != parent[x]) {
// 			parent[x] = find(parent[x]);
// 		}
// 		return parent[x];
// 	}

// 	void merge(int x, int y) {
// 		int rx = find(x), ry = find(y);
// 		if(rx != ry) {
// 			parent[ry] = rx;
// 			sz[rx] += sz[ry];
// 		}
// 	}

// 	bool same(int x, int y) {
// 		return find(x) == find(y);
// 	}
// };

// signed main() {
//     IOS;

//     int n, m;
//     cin >> n >> m;
//     set<int> st[n];
//     DSU uf(n);

//     while(m--) {
//     	char op;
//     	int a, b;
//     	cin >> op >> a >> b;
//     	a--, b--;
//     	if(op == 'F') uf.merge(a, b);
//     	else {
//     		st[a].insert(b);
//     		st[b].insert(a);
//     	}
//     }
//     fer(i, 0, n) {
//     	int x = *st[i].begin();
//     	for(auto a : st[i]) uf.merge(x, a);
//     }
// 	set<int> res;
// 	fer(i, 0, n) {
// 		res.insert(uf.find(i));
// 	}
// 	cout << res.size() << '\n';

//     return 0;
// }

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
			//if(sz[rx] < sz[ry]) swap(rx, ry);
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

signed main() {
    IOS;

    int n;
    cin >> n;
    DSU uf(2 * n);

    int m;
    cin >> m;
    while(m--) {
    	char op;
    	int a, b;
    	cin >> op >> a >> b;
    	if(op == 'F') {
    		uf.merge(a, b);
    		//uf.merge(a + n, b + n);
    	} else {
    		uf.merge(b, a + n);
    		uf.merge(a, b + n);
    	}
    }

    int ans = 0;
    fer(i, 1, n + 1) {
    	if(uf.find(i) == i) ans++;
    }
    cout << ans << '\n';

    return 0;
}