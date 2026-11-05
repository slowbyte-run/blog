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
    int n, m;
    cin >> n >> m;
    vector<int> arr(m);

    fer(i, 0, m) cin >> arr[i];
    sort(all(arr));

    int res = 0;
    fer(i, 0, n / 2) {
        fer(j, 0, 6) {
            if(j & 1) {
                cout << arr[i] << ' ';
                res += arr[m - 1 - i] / 100 - arr[i] / 100;
            } else {
                cout << arr[m - 1 - i] << ' ';
                res += arr[m - 1 - i] / 100 - arr[i] / 100;
            }
            if(j == 0) res -= arr[m - 1 - i] / 100 - arr[i] / 100;
        }
        cout << '\n';
    }

    fer(i, 0, n / 2) {
        fer(j, 0, 6) {
            if(j & 1) {
                cout << arr[m - 1 - i] << ' ';
                res += arr[m - 1 - i] / 100 - arr[i] / 100;
            } else {
                cout << arr[i] << ' ';
                res += arr[m - 1 - i] / 100 - arr[i] / 100;
            }
            if(j == 0) res -= arr[m - 1 - i] / 100 - arr[i] / 100;
        }
        cout << '\n';
    }
    if(n & 1) {
        fer(i, 0, 6) {
            if(i & 1) cout << arr[n / 2] << ' ';
            else cout << arr[m - 1 - n / 2] << ' ';
        }
        cout << '\n';
    }
    //dbg(res);
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}