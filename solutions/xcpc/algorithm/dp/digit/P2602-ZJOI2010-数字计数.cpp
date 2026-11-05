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

// dp[pos][cnt]: 枚举到pos时出现了cnt次时总共出现的次数
ll dp[15][15];
vector<int> num(15);

ll dfs(int pos, int d, int cnt, bool limit, bool lead) {
	if(pos == 0) return cnt;

	if(!limit && !lead && ~dp[pos][cnt]) return dp[pos][cnt];

	int up = limit ? num[pos] : 9;
	ll ans = 0;

	fer(i, 0, up + 1) {
		// if(!lead) {
		// 	if(i == d) cnt++;
		// } else {
		// 	if(d && i == d) cnt++;
		// 	else if(pos == 1 && i == d) cnt++;
		// }
		int cnt1 = cnt + (lead && !i ? 0 : i == d);
		int cnt2 = cnt + (!lead && i == d || lead && d && i == d);
		int cnt3 = cnt + (!lead && i == d || d && i == d || pos == 1 && i == d);
		ans += dfs(pos - 1, d, cnt3, limit && i == up, lead && !i);
	}
	if(!limit && !lead) dp[pos][cnt] = ans;
	return ans;
}

signed main() {
    IOS;

    ll l, r;
    cin >> l >> r;

    auto get = [&](ll n, int d) {
    	memset(dp, -1, sizeof dp);
    	num[0] = 0;
    	while(n) {
    		num[++num[0]] = n % 10;
    		n /= 10;
    	}
    	return dfs(num[0], d, 0, true, true);
    };

    fer(i, 0, 10) {
    	cout << get(r, i) - get(l - 1, i) << ' ';
    }

    return 0;
}