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
	vector<int> sz;
	// 节点编号从 0 开始
	DSU(int n) : n(n) {
		parent.resize(n);
		iota(all(parent), 0);
		rank.resize(n);
		sz.resize(n, 1);
	}

	int find(int x) {
		if(x != parent[x]) {
			parent[x] = find(parent[x]);
		}
		return parent[x];
	}

	void merge(int x, int y) {
		int rx = find(x), ry = find(y);
		if(rx != ry) {
			parent[ry] = rx;
			sz[rx] += sz[ry];
		}
	}

	bool same(int x, int y) {
		return find(x) == find(y);
	}
};

signed main() {
    IOS;

    int n;
    cin >> n;
    DSU uf(n);

    fer(i, 0, n) {
    	int a;
    	while(cin >> a, a) {
    		a--;
    		uf.merge(i, a);
    	}
    }
    set<int> st;
    fer(i, 0, n) st.insert(uf.find(i));

    cout << st.size() << '\n';

    return 0;
}