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

void solve() {
    int n, k;
    cin >> n >> k;
    vector<int> arr(n);
    fer(i, 0, n) cin >> arr[i];

    int ori = arr[k - 1];

    sort(all(arr));
    if(ori == arr.back()) {
    	cout << "YES\n";
    	return;
    }

    //fer(i, 0, n) dbg_arr(arr, i);

    int id = upper_bound(all(arr), ori) - arr.begin();
    int t = 1;

    fer(i, id, n) {
    	int d = arr[i] - ori;
    	if(t + d <= ori + 1 && ori + d >= arr[i]) {
    		ori = arr[i];
    		t += d;
    	} else {
    		cout << "NO\n";
    		return;
    	}
    }
    cout << "YES\n";
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}