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

    int l, m;
    cin >> l >> m;
    vector<int> arr(l + 2, 1);

    vector<int> diff(l + 3, 0);
    while(m--) {
    	int u, v;
    	cin >> u >> v;
    	u++, v++;
    	diff[u] -= 1, diff[v + 1] += 1;
    }
    int cnt = 0;
    fer(i, 1, l + 2) {
    	diff[i] += diff[i - 1];
    	arr[i] += diff[i];
    	if(arr[i] == 1) cnt++;
    }
    cout << cnt << '\n';

    return 0;
}