#include<bits/stdc++.h>

using namespace std;

#define ll long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << '=' << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;

void solve() {
    int n,k;cin >> n >> k;
    string s; cin >> s;
    int cnt0 = 0,cnt1 = 0;
    fer(i,0,n) {
        if (s[i] == '0') {
            cnt0++;
        } else {
            cnt1++;
        }
    }
    while (cnt0 >= 0 && cnt1 >= 0 && k) {
        if (cnt1 > cnt0) {
            cnt1 -= 2;
            k--;
        }else {
            cnt0 -= 2;
            k--;
        }
    }
    if (k) {
        cout << "NO" << endl;
        return;
    }
    if (cnt0 == cnt1) {
        cout << "YES" << endl;
    }else {
        cout << "NO" << endl;
    }


}
int main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    int t = 1;
    cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}