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
const int N = 2e5 + 2;
const int inf = 1e9;

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int n;
    cin >> n;
    int cnt1 = 0, cnt2 = 0;
    fer(i, 0, n) {
        int x;
        cin >> x;
        if(x == -1) cnt1++;
        else if(x == 1) cnt2++;
    }
    if(cnt1 == 0 && cnt2 == 0) {
        cout << "YES" << '\n';
    } else if(cnt1 == 0 || cnt2 == 0) {
        cout << "NO" << '\n';
    } else {
        cout << "YES" << '\n';
    }
    return 0;
}