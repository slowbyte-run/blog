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
    vector<int> a(n + 1);
    map<int, int> mp;

    fer(i, 1, n + 1) cin >> a[i];

    ll ans = 0;
    fer(i, 1, n + 1) {
    	int s = i - a[i];
    	auto it = mp.find(s);
    	if(it != mp.end()) {
    		ans += it->second;
    	}
    	mp[i + a[i]]++;
    }
    cout << ans << '\n';

    return 0;
}