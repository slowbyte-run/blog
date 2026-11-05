#include<bits/stdc++.h>

using namespace std;

#ifdef LOCAL
    #include<macro.hpp>
#else
    #define dbg(...)
    #define print(...)
    #define dbg_label(...)
#endif
#define IOS ios::sync_with_stdio(false); cin.tie(nullptr)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
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
mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
mt19937_64 rng64(chrono::steady_clock::now().time_since_epoch().count());

const int MOD = 1e9 + 7;
const int N = 1e5 + 2;
const int inf = 2e9;

struct Hash {
	ull base = 1000000033, mod = 212370440130137957ll;
	vector<ull> p, hash;

	Hash() {}
	Hash(string &s) {
		init(s);
	}

	void init(string &s) {
		s = " " + s;
		int len = s.size();
		p.resize(len + 1, 1), hash.resize(len + 1);
		fer(i, 1, len) {
			p[i] = p[i - 1] * base % mod;
			hash[i] = (hash[i - 1] * base % mod + s[i]) % mod;
		}
	}

	ull get(int l, int r) {
		return (hash[r] - hash[l - 1] * p[r - l + 1] % mod + mod) % mod;
	}

	ull link(int l1, int r1, int l2, int r2) {
		return (get(l1, r1) * p[r2 - l2 + 1] % mod + get(l2, r2)) % mod;
	}

	bool same(int l1, int r1, int l2, int r2) {
		return get(l1, r1) == get(l2, r2);
	}
};

signed main() {
    IOS;

    int n;
    cin >> n;
    set<int> st;
    while(n--) {
    	string s;
    	cin >> s;
    	Hash h(s);
    	st.insert(h.get(1, s.size() - 1));
    }
    cout << st.size() << '\n';

    return 0;
}