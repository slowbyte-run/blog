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

signed main() {
    IOS;

    vector<int> w(N);

    int cnt = 0;
    int maxN = 0;
    fer(i, 1, 7) {
        int v;
        if(i <= 3) v = i;
        else if(i == 4) v = 5;
        else if(i == 5) v = 10;
        else if(i == 6) v = 20;

        int c;
        cin >> c;

        maxN += v * c;
        int k = 1;
        while(k <= c) {
            w[++cnt] = k * v;
            c -= k;
            k <<= 1;
        }
        if(c) {
            w[++cnt] = k * v;
            c -= k;
        }
    }

    // dp[j]: 重量j的可能性
    vector<bool> dp(maxN + 1);
    dp[0] = 1;

    fer(i, 1, cnt + 1) {
        ferd(j, maxN, w[i]) {
            dp[j] = dp[j] | dp[j - w[i]];
        }
    }
    int ans = 0;
    fer(i, 1, maxN + 1)  ans += dp[i];
    cout << "Total=" << ans << '\n';
    return 0;
}