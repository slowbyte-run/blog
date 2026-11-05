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

// dp[pos][pre]
int dp[12][10];
vector<int> num(12);

int dfs(int pos, int pre, bool limit, bool lead) {
	if(pos == 0) return lead ? 0 : 1;

	if(!limit && !lead && dp[pos][pre] != -1) return dp[pos][pre];

	int up = limit ? num[pos] : 9;
	int ans = 0;
	fer(i, 0, up + 1) {
		// 角度一：pre是否为0
		// if(pre == 0) {
		// 	if(!lead && i < 2) continue;
		// 	ans += dfs(pos - 1, i, limit && i == up, lead && !i);
		// } else {
		// 	if(abs(i - pre) < 2) continue;
		// 	ans += dfs(pos - 1, i, limit && i == up, lead && !i);
		// }
		// 角度二：是否处于前导零阶段
		if(lead || abs(i - pre) >= 2) {
			ans += dfs(pos - 1, i, limit && i == up, lead && !i);
		}
	}

	if(!limit && !lead) dp[pos][pre] = ans;
	return ans;
}

signed main() {
    IOS;

    int l, r;
    cin >> l >> r;

    auto get = [&](int n) -> int {
    	memset(dp, -1, sizeof dp);
    	num[0] = 0;
    	while(n) {
    		num[++num[0]] = n % 10;
    		n /= 10;
    	}
    	return dfs(num[0], 0, true, true);
    };
    cout << get(r) - get(l - 1) << '\n';

    return 0;
}