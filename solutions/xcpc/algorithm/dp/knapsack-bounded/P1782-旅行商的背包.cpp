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
const int N = 2e5 + 10;
const int inf = 1e9;

signed main() {
    IOS;

    int n, m, C;
    cin >> n >> m >> C;

    vector<int> V(N), W(N);
    vector<ll> dp(C + 1);
    int cnt = 0;

    fer(i, 0, n) {
    	int v, w, d;
    	cin >> v >> w >> d;

    	int k = 1;
    	while(k <= d) {
    		V[++cnt] = k * v;
    		W[cnt] = k * w;
    		d -= k;
    		k <<= 1;

    		ferd(j, C, V[cnt]) {
    			dp[j] = max(dp[j], dp[j - V[cnt]] + W[cnt]);
    		}
    	}
    	if(d) {
    		V[++cnt] = d * v;
    		W[cnt] = d * w;
    		ferd(j, C, V[cnt]) {
    			dp[j] = max(dp[j], dp[j - V[cnt]] + W[cnt]);
    		}
    	}
    }
    fer(i, 0, m) {
    	int a, b, c;
    	cin >> a >> b >> c;
    	
    	// fer(v, 1, C + 1) {
        //     ll w = 1LL * a * v * v + b * v + c;
        //     ferd(j, C, v) {
        //         dp[j] = max(dp[j], dp[j - v] + w);
        //     }
        // }
        ferd(j, C, 0) {
            fer(v, 0, j + 1) {
                ll w = 1LL * a * v * v + b * v + c;
                dp[j] = max(dp[j], dp[j - v] + w);
            }
        }
    }
    cout << dp[C] << '\n';
    return 0;
}