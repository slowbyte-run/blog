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
    vector<ll> arr(n);
    set<ll> st;

    bool has_zero = false;
    fer(i, 0, n) {
        cin >> arr[i];
        st.insert(arr[i]);
        if(arr[i] == 0) has_zero = true;
    }
    int x = st.size();

    if(x == 1) {
        cout << 0 << '\n';
        return 0;
    }

    ll t = *upper_bound(all(st), 0LL);
    ll cnt = (t + x - 1) / x;
    ll res = 0, sum = cnt * x;

    int ignore = 0;
    bool f = false;
    for(auto it =  st.begin(); it != st.end(); ++it) {
        if(*it <= sum) ignore++;
        else {
            if(!f) {
                x -= ignore - 1;
                f = true;
            } else {
                x -= ignore;
            }
            
            res += cnt;
            cnt = (*it - sum + x - 1) / x;
            sum += cnt * x;
            
            ignore = 1;
        }
    }
    cout << res + cnt << '\n';

    return 0;
}