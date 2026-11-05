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
const int N = 1e6 + 5;
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

    int n;
    cin >> n;
    DSU uf(N);

    // val -> root(id)
    map<int, int> mp;

    vector<int> arr(n + 1);
    fer(i, 1, n + 1) {
    	cin >> arr[i];
    	int rt = mp[arr[i]];
    	if(!rt) {
    		mp[arr[i]] = i;
    	} else {
    		uf.merge(rt, i);
    	}
    }

    int q;
    cin >> q;
    while(q--) {
    	int op;
    	cin >> op;
    	if(op == 1) {
    		int x, y;
    		cin >> x >> y;
    		if(mp[x]) {
    			uf.sz[mp[x]] = 0;
    			if(mp[y]) {
    				uf.merge(mp[y], mp[x]);
    			} else {
    				mp[y] = mp[x];
    			}
				mp[x] = 0;
    		}
       	} else if(op == 2) {
       		int x, y;
       		cin >> x >> y;
       		uf.sz[uf.find(x)]--;
       		
       		arr[x] = y;

       		uf.fa[x] = x;
       		if(mp[y]) {
       			uf.merge(x, mp[y]);
       		} else {
       			uf.fa[x] = x;
       		}
       	} else if(op == 3) {
       		int x;
       		cin >> x;
       		cout << uf.size(mp[x]);
       	}
    }

    return 0;
}