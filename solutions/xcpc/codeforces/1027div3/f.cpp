#include<bits/stdc++.h>

using namespace std;

#define ll long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << char(61) << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 1e6 + 2;
const int inf = 1e9;

vector<vector<int>> fac(N);

void init() {
    fer(i, 1, N) {
        for(int j = i; j < N; j += i) {
            fac[j].push_back(i);
        }
    }
}

void solve() {
    int x, y, k;
    cin >> x >> y >> k;

    if(k == 1) {
        cout << (x == y ? 0 : -1) << '\n';
        return;
    }

    int d = gcd(x, y);
    x /= d, y /= d;

    auto work = [&](int n) {
        int m = fac[n].size();
        vector<int> dp(m, inf);
        // dp[i] : 考虑到将 n 的第 i 个因子转化为 1 时的最小操作次数
        dp[0] = 0;
        fer(i, 0, m) {
            fer(j, i + 1, m) {
                if(fac[n][j] % fac[n][i] == 0 && fac[n][j] / fac[n][i] <= k) {
                    dp[j] = min(dp[j], dp[i] + 1);
                } else if(fac[n][j] / fac[n][i] > k) {
                    break;
                }
            }
        }
        return dp[m - 1] == inf ? -1 : dp[m - 1];
    };
    cout << (work(x) == -1 || work(y) == -1 ? -1 : work(x) + work(y)) << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    init();
    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}