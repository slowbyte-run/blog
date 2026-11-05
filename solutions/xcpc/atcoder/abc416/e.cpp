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
const ll inf = 4e18;

signed main() {
    IOS;

    int n, m;
    cin >> n >> m;
    vector<vector<ll>> adj(n, vector<ll> (n, inf));

    fer(i, 0, m) {
        int u, v, w;
        cin >> u >> v >> w;
        u--, v--;
        adj[u][v] = adj[v][u] = min(adj[u][v], w + 0LL);
    }

    int k, t;
    cin >> k >> t;

    vector<bool> air(n);
    vector<int> vec;
    fer(i, 0, k) {
        int u;
        cin >> u;
        u--;
        air[u] = true;
        vec.push_back(u);
    }

    fer(k, 0, n) {
        fer(i, 0, n) {
            adj[i][i] = 0;
            if(adj[i][k] < inf) {
                fer(j, 0, n) {
                    if(adj[k][j] < inf && adj[i][k] + adj[k][j] < adj[i][j]) {
                        adj[i][j] = adj[j][i] = adj[i][k] + adj[k][j];
                    }
                }
            }
        }
    }

    vector<ll> dist(n, inf);
    fer(i, 0, n) {
        for(auto x : vec) {
            dist[i] = min(dist[i], adj[i][x]);
        }
    }

    int q;
    cin >> q;
    while(q--) {
        int op;
        cin >> op;
        if(op == 1) {
            int x, y; ll w;
            cin >> x >> y >> w;
            x--, y--;
            if(adj[x][y] <= w) continue;
            adj[x][y] = adj[y][x] = w;

            fer(i, 0, n) {
                fer(j, 0, n) {
                    if(adj[i][x] + w + adj[y][j] < adj[i][j]) {
                        adj[i][j] = adj[j][i] = adj[i][x] + w + adj[y][j];
                    }
                    if(adj[i][y] + w + adj[x][j] < adj[i][j]) {
                        adj[i][j] = adj[j][i] = adj[i][y] + w + adj[x][j];
                    }
                }
            }
            fer(i, 0, n) {
                for(auto x : vec) {
                    dist[i] = min(dist[i], adj[i][x]);
                }
            }
        } else if(op == 2) {
            int x;
            cin >> x;
            x--;
            if(air[x]) continue;
            air[x] = true;
            vec.push_back(x);

            fer(i, 0, n) {
                for(auto x : vec) {
                    dist[i] = min(dist[i], adj[i][x]);
                }
            }
        } else {
            ll ans = 0;
            fer(i, 0, n) {
                fer(j, 0, n) {
                    ll s = adj[i][j];
                    if(dist[i] < inf && dist[j] < inf){
                        s = min(adj[i][j], dist[i] + t + dist[j]);
                    }
                    if(s < inf) ans += s;
                }
            }
            cout << ans << '\n';
        }
    }

    return 0;
}