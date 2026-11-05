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

// dp[pos][sum] : pos 之前数字之和为 sum 的所有情况的数位之和
vector<vector<int>> dp(20, vector<int>(200, -1));
vector<int> num(20);

int dfs(int pos, int s, bool limit, bool lead) {
	if(pos == 0) return s;

	if(!limit && !lead && dp[pos][s] != -1) return dp[pos][s];
	int up = limit ? num[pos] : 9;
	int ans = 0;

	fer(i, 0, up + 1) {
		ans = (ans + dfs(pos - 1, s + i, limit && i == up, lead && !i)) % MOD;
	}

	if(!limit && !lead) dp[pos][s] = ans;
	return ans;
}

void solve() {
    ll l, r;
    cin >> l >> r;

    auto get = [&](ll n) -> int {
    	int len = 0;
    	dp.assign(20, vector<int> (200, -1));
    	while(n) {
    		num[++len] = n % 10;
    		n /= 10;
    	}
    	return dfs(len, 0, true, true);
    };
    cout << (get(r) - get(l - 1) + MOD) % MOD << '\n';
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}