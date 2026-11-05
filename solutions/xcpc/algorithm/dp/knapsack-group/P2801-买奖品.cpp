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

    int p;
    cin >> p;

    vector<vector<int>> group(3);
    int mn = 0;
    fer(i, 0, 3) {
    	int n;
    	cin >> n;
    	group[i].resize(n);
    	fer(j, 0, n) cin >> group[i][j];
    	sort(all(group[i]));
    }

    vector<int> dp(p + 1, -inf);
    dp[0] = 0;
    int d[3] = {1, 2, 3};

    fer(i, 0, 3) mn += group[i][0] * d[i];
    if(mn > p) {
    	cout << -1 << '\n';
    	return 0;
    }
    //dbg(mn);

    // 枚举组数-枚举组内物品-逆序枚举容量-枚举件数
    fer(i, 0, 3) {
    	// cur[j][k]: 在当前组容量为j选了k件的最大价值
    	vector<vector<int>> cur(p + 1, vector<int>(d[i] + 1, -inf));

    	fer(j, 0, p + 1) cur[j][0] = dp[j];

    	for(auto &w : group[i]) {
    		fer(j, w, p + 1) {
    			fer(k, 1, d[i] + 1) {
    				if(cur[j - w][k - 1] > -inf) {
    					cur[j][k] = max(cur[j][k], cur[j - w][k - 1] + w);
    				}
    			}
    		}
    	}

    	// 合并
    	fer(j, 0, p + 1) {
    		dp[j] = cur[j][d[i]];
    	}
    }
    cout << *max_element(all(dp)) << '\n';
    return 0;
}
