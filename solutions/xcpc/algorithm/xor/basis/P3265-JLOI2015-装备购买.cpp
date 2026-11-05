#include<bits/stdc++.h>

using namespace std;

#define IOS ios::sync_with_stdio(false); cin.tie(nullptr)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define lowbit(x)  ((x) & -(x))

#ifdef LOCAL
	#define dbg(x) cerr << #x << char(61) << x << " ###\n"
	#define dbg_arr(a, i) cerr << #a << '[' << i << "]=" << a[i] << " ###\n"
#else
	#define dbg(x) (void)0
	#define dbg_arr(a, i) (void)0
#endif

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
const int inf = 2e9;

struct basis {
	static const int LOG = 63;
	vector<ll> b;

	basis() {
		b.resize(LOG + 1);
	}

	void insert(ll x) {
		ferd(i, LOG, 0) {
			if(x >> i & 1) {
				if(!b[i]) {
					b[i] = x;
					break;
				}
				x ^= b[i];
			}
		}
	}

	ll query_max(ll x = 0) {
		ferd(i, LOG, 0) {
			if((x ^ b[i]) > x) x ^= b[i];
		}
		return x;
	}

	ll query_min() {
		fer(i, 0, LOG + 1) {
			if(b[i]) return b[i];
		}
		return 0;
	}

	bool check(ll x) {
		ferd(i, LOG, 0) {
			if(x >> i & 1) {
				if(!b[i]) return false;
				x ^= b[i];
			}
		}
		return true;
	}
};

signed main() {
    IOS;

    int n, m;
    cin >> n >> m;
    vector<array<int, 510>> arr(n);

    fer(i, 0, n) {
    	fer(j, 1, m + 1) {
    		cin >> arr[i][j];
    	}
    }
    fer(i, 0, n) {
    	cin >> arr[i][0];
    }
    sort(all(arr));

    vector<basis> B(m + 1);

    int cnt = 0, s = 0;
    fer(i, 0, n) {
    	bool ok = true;
    	fer(j, 1, m + 1) {
    		ok = B[j].check(arr[i][j]);
    		if(!ok) {
    			fer(k, 1, m + 1) {
    				B[k].insert(arr[i][k]);
    			}
    			cnt++, s += arr[i][0];
    		}
    		if(!ok) break;
    	}
    }
    cout << cnt << ' ' << s << '\n';

    return 0;
}