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
const int N = 2e5 + 2;
const int inf = 2e9;

signed main() {
    IOS;

    int n;
    cin >> n;
    vector<array<int, 3>> arr(n);
    for(auto &[p, a, b] : arr) {
    	cin >> p >> a >> b;
    }

    vector<int> pref(n + 1);
    fer(i, 1, n + 1) {
    	pref[i] = pref[i - 1] + arr[i - 1][2];
    }
    vector<vector<int>> dp(n + 10, vector<int>(510));
  	fer(i, 0, 501) dp[n + 1][i] = i;

  	ferd(i, n, 1) {
  		auto [p, a, b] = arr[i - 1];
  		fer(j, 0, 501) {
  			int x;
  			if(j <= p) {
  				x = j + a;
  			} else if(j < b) {
  				x = 0;
  			} else {
  				x = j - b;
  			}
  			if(x <= 500) {
  				dp[i][j] = dp[i + 1][x];
  				continue;
  			}
  			ll t = x - 500;
  			int ind = lower_bound(pref.begin() + i, pref.end(), pref[i] + t) - pref.begin();
  			if(ind > n) {
  				dp[i][j] = max(0, x - pref[n] + pref[i]);
  			} else {
  				int res = x - pref[ind] + pref[i];
  				if(res < 0) res = 0;
  				dp[i][j] = dp[ind + 1][res];
  			}
  		}
  	}

    int q;
    cin >> q;
    while(q--) {
    	ll x;
    	cin >> x;
    	if(x <= 500) {
    		cout << dp[1][x] << '\n';
    	} else if(x - pref[n] > 500) {
    		cout << x - pref[n] << '\n';
    	} else {
    		int ind = lower_bound(all(pref), x - 500) - pref.begin();
    		if(x - pref[ind] < 0) {
    			cout << dp[ind + 1][0] << '\n';
    		} else {
    			cout << dp[ind + 1][x - pref[ind]] << '\n';
    		}
    	}
    }

    return 0;
}