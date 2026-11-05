#include<bits/stdc++.h>

using namespace std;

#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << '=' << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 10;
const int inf = 1e9;

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int n, k;
    cin >> n >> k;

    vector<int> dist(N, inf);
    dist[n] = 0;

    queue<pii> q;
    q.push({n, 0});

    while(!q.empty()) {
        auto [x, cnt] = q.front(); q.pop();

        if(x == k) {
            cout << cnt << '\n';
            return 0;
        }
        if(cnt > dist[x]) continue;

        if(x - 1 >= 0 && dist[x - 1] > cnt + 1) {
            dist[x - 1] = cnt + 1;
            q.push({x - 1, dist[x - 1]});
        }
        if(x + 1 < N && dist[x + 1] > cnt + 1) {
            dist[x + 1] = cnt + 1;
            q.push({x + 1, dist[x + 1]});
        }
        if(2 * x < N && dist[2 * x] > cnt + 1) {
            dist[2 * x] = cnt + 1;
            q.push({2 * x, dist[2 * x]});
        }
    }
    return 0;
}