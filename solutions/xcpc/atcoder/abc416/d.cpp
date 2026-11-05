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
#define lowbit(x) ((x) & (-x))

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

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;

void solve() {
    int n, m;
    cin >> n >> m;
    vector<int> a(n), b(n);

    fer(i, 0, n) {
    	cin >> a[i];
    }
    fer(i, 0, n) {
    	cin >> b[i];
    }

    ll ans = accumulate(all(a), 0LL) + accumulate(all(b), 0LL);
    sort(all(a));
    sort(all(b), greater());

    multiset<int> st(all(a));

    int cnt = 0;
    for(auto x : b) {
    	auto it = st.lower_bound(m - x);
    	if(it != st.end()) {
    		cnt++;
    		st.erase(it);
    	} else {
    		st.erase(st.begin());
    	}
    }
    cout << ans - 1LL * cnt * m << '\n';
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}