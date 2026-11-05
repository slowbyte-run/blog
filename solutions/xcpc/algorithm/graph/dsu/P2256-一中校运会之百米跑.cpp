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
	vector<int> fa, rank;
	vector<int> sz;

	// 节点编号从 1 开始
	DSU(int n) : n(n) {
		fa.resize(n + 1);
		iota(all(fa), 0);
		rank.resize(n + 1);
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

signed main() {
    IOS;

    int n, m;
    cin >> n >> m;

    DSU uf(n);
    int cnt = 0;
    map<string, int> mp;

    fer(i, 0, n) {
    	string name;
    	cin >> name;
    	if(!mp[name]) {
    		mp[name] = ++cnt;
    	}
    }

    while(m--) {
    	string a, b;
    	cin >> a >> b;
    	int id1 = mp[a], id2 = mp[b];
    	uf.merge(id1, id2);
    }

    int k;
    cin >> k;
    while(k--) {
    	string a, b;
    	cin >> a >> b;
    	int id1 = mp[a], id2 = mp[b];
    	cout << (uf.same(id1, id2) ? "Yes." : "No.") << '\n';
    }

    return 0;
}