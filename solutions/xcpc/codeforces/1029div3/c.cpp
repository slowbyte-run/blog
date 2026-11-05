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
    fer(i, 0, n) cin >> arr[i];

    int ans = 1;
    set<int> st1, st2;
    st1.insert(arr.front());

    int cnt = 0;
    fer(i, 1, n) {
        if(st1.count(arr[i]) && !st2.count(arr[i])) {
            cnt++;
        }
        st2.insert(arr[i]);
        if(cnt == st1.size()) {
            ans++, cnt = 0;
            st1 = st2;
            st2.clear();
        }
    }
    cout << ans << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}