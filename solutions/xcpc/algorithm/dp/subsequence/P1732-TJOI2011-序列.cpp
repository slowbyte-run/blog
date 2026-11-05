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
const int inf = 2e9;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n);
    fer(i, 0, n) cin >> a[i];
    ll ans = 0;

    set<int> st;
    ans += a.front();
    st.insert(a.front());

    fer(i, 1, n) {
    	auto it = st.lower_bound(a[i]);
    	int t = -1;
    	if(it != st.end()) {
    		t = *it - a[i];
    		if(it != st.begin()) {
    			t = min(t, a[i] - *(--it));
    		}
    	} else {
    		t = a[i] - *st.rbegin();
    	}
    	st.insert(a[i]);
    	ans += t;
    }
    cout << ans << '\n';
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}