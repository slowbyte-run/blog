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
    int n, x;
    cin >> n >> x;
    vector<int> arr(n);

    fer(i, 0, n) cin >> arr[i];
    int a = -1, b = -1;

    fer(i, 0, n) {
        if(arr[i] == 1) {
            a = i;
            break;
        }
    }
    ferd(i, n - 1, 0) {
        if(arr[i] == 1) {
            b = i;
            break;
        }
    }
    if(a == -1 || b == -1) {
        cout << "YES" << '\n';
    }
    cout << (b - a + 1 <= x ? "YES" : "NO") << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}