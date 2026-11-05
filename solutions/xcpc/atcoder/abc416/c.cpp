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
#define lowbit(x)  ((x) & -(x))

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

signed main() {
    IOS;

    int n, k, x;
    cin >> n >> k >> x;
    vector<string> arr(n);

    fer(i, 0, n) cin >> arr[i];

    vector<string> res;

    // auto dfs = [&](this auto &&self, int cnt, string s) -> void {
    // 	if(cnt == k) {
    // 		res.push_back(s);
    // 		s.clear();
    // 		return;
    // 	}
    // 	fer(i, 0, n) {
    // 		self(cnt + 1, s + arr[i]);
    // 	}
    // };
    // dfs(0, "");

    // function<void(int, string)> dfs = [&](int cnt, string s) -> void {
    // 	if(cnt == k) {
    // 		res.push_back(s);
    // 		return;
    // 	}
    // 	fer(i, 0, n) {
    // 		dfs(cnt + 1, s + arr[i]);
    // 	}
    // };

    auto dfs = [&](auto &&self, int cnt, string s) -> void {
        if(cnt == k) {
            res.push_back(s);
            return;
        }
        fer(i, 0, n) {
            self(self, cnt + 1, s + arr[i]);
        }
    };
    dfs(dfs, 0, "");
    sort(all(res));
    cout << res[x - 1] << '\n';

    return 0;
}