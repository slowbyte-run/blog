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

const int MOD = 1 << 31;
const int N = 2e5 + 2;
const int inf = 2e9;

signed main() {
    IOS;

    int n;
    cin >> n;

    vector<ll> dp(n + 1);
    dp[1] = dp[2] = 1;

    if(n <= 2) {
    	cout << "2=2" << '\n';
    	return 0;
    } else {
    	fer(i, 3, n + 1) {
    		dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
    	}
    }

    vector<int> vec;
    auto get = [&](int x) -> void {
    	for(int i = 2; i <= x / i; i++) {
    		while(x % i == 0) {
    			vec.push_back(i);
    			x /= i;
    		}
    	}
    	if(x != 1) vec.push_back(x);
    };

    int x = dp[n];
    get(x);
    if(vec.size() == 1) {
    	cout << x << "=" << x << '\n';
    } else {
    	cout << x << "=" << vec.front();
    	fer(i, 1, vec.size()) {
    		cout << '*' << vec[i];
    	}
    }

    return 0;
}