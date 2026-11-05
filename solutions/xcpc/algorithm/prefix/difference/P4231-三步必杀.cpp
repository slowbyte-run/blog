#include<bits/stdc++.h>

using namespace std;

#define IOS ios::sync_with_stdio(false); cin.tie(nullptr)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cerr << #x << char(61) << x << " ###\n"
#define dbg_arr(a, i) cerr << #a << '[' << i << "]=" << a[i] << " ###\n"
#define lowbit(x)  ((x) & -(x))

using u32 = unsigned;
using i64 = ll;
using u64 = ull;
using i128 = __int128;
using u128 = unsigned __int128;

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;

signed main() {
    IOS;

    int n, m;
    cin >> n >> m;
    vector<ll> a(n + 2), d1(n + 2), d2(n + 2);

    while(m--) {
    	ll l, r, s, e;
    	cin >> l >> r >> s >> e;
    	d1[l] += s, d1[r + 1] -= e;
    	ll d = (e - s) / (r - l);
    	d2[l + 1] += d, d2[r + 1] -= d;
    }

    ll xr = 0;
    fer(i, 1, n + 2) {
    	d2[i] += d2[i - 1];
    	d1[i] += d2[i];
    	d1[i] += d1[i - 1];
    	a[i] += d1[i];
        if(i <= n) xr ^= a[i];
    }

    // fer(i, 1, n + 1) cerr << a[i] << " \n"[i == n];

    cout << xr << ' ' << *max_element(all(a)) << '\n';

    return 0;
}