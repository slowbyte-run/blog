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

// dp[pos][cnt0][cnt1]
int dp[40][40][40];
vector<int> num(40);

int dfs(int pos, int cnt0, int cnt1, bool limit, bool lead) {
	if(pos == 0) return lead || cnt0 >= cnt1;

	if(!limit && !lead && ~dp[pos][cnt0][cnt1]) return dp[pos][cnt0][cnt1];

	int up = limit ? num[pos] : 1;
	int ans = 0;

	fer(i, 0, up + 1) {
		int new_lead = lead && !i;
		ans += dfs(pos - 1, cnt0 + (!new_lead && !i), cnt1 + i, limit && i == up, new_lead);
	}

	if(!limit && !lead) dp[pos][cnt0][cnt1] = ans;
	return ans;
}

signed main() {
    IOS;

    int l, r;
    cin >> l >> r;

    auto get = [&](int n) -> int {
    	int len = 0;
    	memset(dp, -1, sizeof dp);
    	while(n) {
    		num[++len] = n & 1;
    		n >>= 1;
    	}
    	return dfs(len, 0, 0, true, true);
    };

    cout << get(r) - get(l - 1) << '\n';

    return 0;
}