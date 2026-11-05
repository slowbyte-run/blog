#include<bits/stdc++.h>

using namespace std;

#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << char(61) << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;

void solve() {
    int n;
    cin >> n;
    vector<int> arr(n);

    int g = 0;
    fer(i, 0, n) {
        cin >> arr[i];
        g = gcd(g, arr[i]);
    }

    if(g == *min_element(all(arr))) {
        cout << n - count(all(arr), g) << "\n";
        return;
    }

    vector<int> dist(*max_element(all(arr)) + 1, INT_MAX);
    queue<int> q;
    for(int x : arr) q.push(x), dist[x] = 0;
    while(!q.empty()) {
        int u = q.front(); q.pop();
        if(u == g) break;
        for(int x : arr) {
            int w = gcd(u, x);
            if(dist[w] > dist[u] + 1) {
                dist[w] = dist[u] + 1;
                q.push(w);
            }
        }
    }
    cout << dist[g] + (n - 1) << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}