#pragma GCC optimize(2, 3, "inline")
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

inline void read(int &a) {
	a = 0;
	char c;
	while ((c = getchar()) < 48);
	do a = a * 10 + (c ^ 48);
	while ((c = getchar()) > 47);
}

void write(int x) {
	if (x < 0) {
		x = -x;
		putchar('-');
	}
	if (x > 9) write(x / 10);
	putchar(x % 10 + '0');
}

void solve() {
    int n;
    cin >> n;
    vector<array<int, 3>> arr(n + 1);

    int W = -inf;
    fer(i, 1, n + 1) {
    	cin >> arr[i][0] >> arr[i][1] >> arr[i][2];
    	W = max(W, arr[i][1]);
    }

    sort(all(arr), [](array<int, 3> a, array<int, 3> b) {
    	return a[1] < b[1];
    });
    // 时间在j前已经选择了要做事情的总价值，左闭右开的区间
    // 选/不选
    // 选：最晚在截止时间arr[i][1]之前arr[i][0]开始做
    vector<int> dp(W + 10);
    fer(i, 1, n + 1) {
    	ferd(j, arr[i][1], arr[i][0]) {
    		dp[j] = max(dp[j], dp[j - arr[i][0]] + arr[i][2]);
    	}
    }
    cout << *max_element(all(dp)) << '\n';
    //cout << dp[W] << '\n';
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}