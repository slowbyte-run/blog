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
const int N = 1e5 + 10;
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

vector<int> primes;
vector<bool> is_prime(N, true);

void seive() {
	is_prime[0] = is_prime[1] = false;

	fer(i, 2, N) {
		if(is_prime[i]) primes.push_back(i);
		for(int j = 0; j < primes.size() && primes[j] * i < N; j++) {
			is_prime[primes[j] * i] = false;
			if(i % primes[j] == 0) break;
		}
	}
}

signed main() {
    IOS;

    seive();

    int a, b, p;
    cin >> a >> b >> p;
    DSU uf(b + 1);

    map<int, vector<int>> mp;

    // auto is_prime = [&](int n) -> bool {
    // 	if(n < 2) return false;
    // 	for(int i = 2; i <= n / i; i++) {
    // 		if(n % i == 0) return false;
    // 	}
    // 	return true;
    // };

    auto get = [&](int n) -> void {
    	for(int i = 1; i <= n / i; i++) {
    		if(n % i == 0) {
    			if(is_prime[i] && i >= p) mp[i].push_back(n);
    			if(i != n / i) {
    				if(is_prime[n / i] && n / i >= p) mp[n / i].push_back(n);
    			}
    		}
    	}
    };
    fer(i, a, b + 1) get(i);

    for(auto [a, v] : mp) {
    	int x = v.front();
    	fer(i, 1, v.size()) uf.merge(x, v[i]);
    }
    set<int> st;
    fer(i, a, b + 1) {
    	st.insert(uf.find(i));
    }
    cout << st.size() << '\n';

    return 0;
}