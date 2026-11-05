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
    vector<array<int, 3>> arr(n);

    fer(i, 0, n) cin >> arr[i][0] >> arr[i][1] >> arr[i][2];

    sort(all(arr));

    int ind = 0;
    multimap<int, int> mp;
   	queue<int> q;
   	q.push(k);
    int res = k;

    while(!q.empty()) {
    	int u = q.front(); q.pop();

    	while(ind < arr.size() && arr[ind][0] <= u) {
    		mp.emplace(arr[ind][1], arr[ind][2]);
    		ind++;
    	}

    	auto it = mp.lower_bound(u);
    	while(it != mp.end()) {
    		res = max(res, it->second);
    		q.push(it->second);
    		mp.erase(it);
    		it = mp.lower_bound(u);
    	}
    }
    cout << res << '\n';
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}