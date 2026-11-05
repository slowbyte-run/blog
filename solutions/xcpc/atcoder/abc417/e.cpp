#include<bits/stdc++.h>

using namespace std;

#ifdef LOCAL
    #include<macro.hpp>
#else
    #define dbg(...)
    #define print(...)
    #define dbg_label(...)
#endif
#define IOS ios::sync_with_stdio(false); cin.tie(nullptr)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define lowbit(x) ((x) & (-x))

#define popcount(x)  __builtin_popcount(x)
#define popcountll(x)  __builtin_popcountll(x)
#define clz(x)  __builtin_clz(x)
#define ctz(x)  __builtin_ctz(x)

using u32 = unsigned;
using i64 = ll;
using u64 = ull;
using i128 = __int128;
using u128 = unsigned __int128;
mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
mt19937_64 rng64(chrono::steady_clock::now().time_since_epoch().count());

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 2e9;

void solve() {
    int n, m, x, y;
    cin >> n >> m >> x >> y;
    vector<vector<int>> g(n);

    fer(i, 0, m) {
    	int u, v;
    	cin >> u >> v;
    	u--, v--;
    	g[u].push_back(v), g[v].push_back(u);
    }
    x--, y--;
    fer(i, 0, n) sort(all(g[i]));

    // fer(i, 0, n) print(i, g[i]);

    // vis[y] = true;
    // queue<int> q;
    // q.push(y);
    vector<bool> st(n);
    // st[y] = true;
    // while(!q.empty()) {
    // 	int u = q.front(); q.pop();

    // 	for(auto v : g[u]) {
    // 		if(st[u]) continue;
    // 		q.push(v);
    // 		st[v] = true;
    // 		vis[v] = true;
    // 	}
    // }
    // while(!q.empty()) q.pop();

    vector<int> res;

    // st.assign(n, false);
    st[x] = true;
    int cur = x;
    res.push_back(x);
    while(cur != y) {
    	queue<int> q;
		vector<bool> vis(n);
		vis[y] = true;
		q.push(y);
		while(!q.empty()) {
			auto u = q.front(); q.pop();
			for(auto v : g[u]) {
				if(!st[v] && !vis[v]) {
					vis[v] = true;
					q.push(v);
				}
			}
		}
		int x = -1;
		for(auto v : g[cur]) {
			if(!st[v] && vis[v]) {
				x = v;
				break;
			}
		}
		st[x] = true;
		res.push_back(x);
		cur = x;
    }
    for(auto x : res) {
    	cout << x + 1 << ' ';
    }
    cout << '\n';
}

signed main() {
    IOS;

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}