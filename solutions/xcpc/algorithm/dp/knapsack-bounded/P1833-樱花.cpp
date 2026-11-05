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
#define dbg_arr(a, i) cerr << #a << '[' << #i << "]=" << a[i] << " ###\n";

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

signed main() {
    //IOS;
	int hh, mm;
	int T;
	scanf("%d:%d", &hh, &mm);
	T = hh * 60 + mm;
	scanf("%d:%d", &hh, &mm);
	T = hh * 60 + mm - T;
	int n;
	scanf("%d", &n);
	vector<int> w(N), v(N);

	int cnt = 0;
	fer(i, 0, n) {
		int a, b, c;
		scanf("%d%d%d", &a, &b, &c);

		if(!c) c = T / a + 1;

		int k = 1;
		while(k <= c) {
			w[++cnt] = k * a;
			v[cnt] = k * b;
			c -= k;
			k <<= 1;
		}
		if(c) {
			w[++cnt] = c * a;
			v[cnt] = c * b;
		}
	}
	vector<int> dp(1010);
    fer(i, 1, cnt + 1) {
    	ferd(j, T, w[i]) {
    		dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    	}
    }
    cout << dp[T] << '\n';
    return 0;
}