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
#define dbg_arr(a, i) cerr << #a << '[' << #i << "]=" << a[i] << " ###\n";

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
    ll W;
    cin >> n >> W;

    vector<ll> v(n), p(n);
    ll b = inf;
    fer(i, 0, n) {
        cin >> v[i] >> p[i];
        b = min(b, v[i]);
    }

    // 四组：d = v[i] - b ∈ {0,1,2,3}
    vector<ll> groups[4];
    fer(i, 0, n) {
        int d = int(v[i] - b);
        groups[d].push_back(p[i]);
    }

    // 对每组排序并做前缀和
    vector<vector<ll>> S(4);
    fer(d, 0, 4) {
        auto &G = groups[d];
        sort(G.rbegin(), G.rend());  // 降序
        S[d].assign(G.size() + 1, 0);
        fer(k, 1, G.size() + 1) {
            S[d][k] = S[d][k - 1] + G[k - 1];
        }
    }

    // 四重枚举
    ll ans = 0;
    ll c[4] = { b, b+1, b+2, b+3 };
    fer(k0, 0, groups[0].size() + 1) {
        fer(k1, 0, groups[1].size() + 1) {
            fer(k2, 0, groups[2].size() + 1) {
                fer(k3, 0, groups[3].size() + 1) {
                    ll cost = k0*c[0] + k1*c[1] + k2*c[2] + k3*c[3];
                    if(cost > W) continue;
                    ll val = S[0][k0] + S[1][k1] + S[2][k2] + S[3][k3];
                    ans = max(ans, val);
                }
            }
        }
    }

    cout << ans << "\n";   

    return 0;
}