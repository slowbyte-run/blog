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

    int n;
    cin >> n;
    map<int, int> mp;
    mp[1] = 12, mp[2] = 9, mp[3] = 7, mp[4] = 5, mp[5] = 4;
    mp[6] = mp[7] = 3, mp[8] = mp[9] = mp[10] = 2;
    fer(i, 11, 16) mp[i] = 1;
    fer(i, 16, 21) mp[i] = 0;

    vector<int> arr(20);

    while(n--) {
    	fer(i, 0, 20) {
    		int p, k;
    		cin >> p >> k;
    		arr[i] += mp[p] + k;
    	}
    }

    fer(i, 0, 20) {
    	cout << i + 1 << ' ' << arr[i] << '\n';
    }

    return 0;
}