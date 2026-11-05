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
    int n, q;
    cin >> n >> q;

    vector<int> a(n + 1);
    fer(i, 1, n + 1) cin >> a[i];

    vector<vector<pii>> g(n + 1);
    vector<array<int, 3>> E;
    E.reserve(n - 1);

    fer(i, 0, n - 1) {
    	int u, v, c;
    	cin >> u >> v >> c;
    	g[u].push_back({v, c});
    	g[v].push_back({u, c});
    	E.push_back({u, v, c});
    }

    vector<bool> st(n + 1);
    int B = 550;
    fer(i, 1, n + 1) {
    	if(g[i].size() > B) st[i] = true;
    }

    vector<ll> totW(n + 1);
    vector<map<int, ll>> sum(n + 1);
    vector<vector<pii>> adj(n + 1);
    ll ans = 0;

    for(auto &e : E) {
    	int u = e[0], v = e[1], w = e[2];
    	if(a[u] != a[v]) ans += w;
    	if(st[u]) {
    		sum[u][a[v]] += w;
    		totW[u] += w;
    	}
    	if(st[v]) {
    		sum[v][a[u]] += w;
    		totW[v] += w;
    	}
    	if(st[u] && st[v]) {
    		adj[u].push_back({v, w});
    		adj[v].push_back({u, w});
    	}
    }

    while(q--) {
    	int v, x;
    	cin >> v >> x;
    	if(a[v] == x) {
    		cout << ans << '\n';
    		continue;
    	}
    	int t = a[v];

    	if(!st[v]) {
    		for(auto [u, w] : g[v]) {
    			ll w1 = (a[u] != t ? w : 0);
    			ll w2 = (a[u] != x ? w : 0);
    			ans += w2 - w1;

    			if(st[u]) {
    				auto &mp = sum[u];
    				mp[w1] -= w;
    				if(mp[t] == 0) mp.erase(t);
    				mp[x] += w;
    			}
    		}
    	} else {
    		ll tt = 0, t2 = 0;
            auto it = sum[v].find(t);
            if (it != sum[v].end()) tt = it->second;
            it = sum[v].find(x);
            if (it != sum[v].end()) t2 = it->second;

            ll d1 = totW[v] - tt;
            ll d2 = totW[v] - t2;
            ans += d2 - d1;

            for (auto [u,w] : adj[v]){
                auto &mp = sum[u];
                mp[t] -= w;
                if (mp[t] == 0) mp.erase(t);
                mp[x] += w;
            }
        }
        a[v] = x;
        cout << ans << '\n';
	}
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}