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

    int l, n;
    cin >> l >> n;
    vector<int> arr(l + 2, 1);

    vector<int> diff(l + 3);
    vector<int> d(l + 3);

    while(n--) {
    	int op, a, b;
 	   	cin >> op >> a >> b;
 	   	a++, b++;
 	   	if(op == 0) diff[a] -= 1, diff[b + 1] += 1;
 	   	else d[a] += 1, d[b + 1] -= 1;
    }

    int cnt1 = 0, cnt2 = 0;
    fer(i, 1, l + 1) {
    	diff[i] += diff[i - 1];
    	d[i] += d[i - 1];
    	arr[i] += diff[i] + d[i];
    	if(arr[i] == 1) cnt1++;
    }
    fer(i, 1, l + 1) {
    	if(d[i] && arr[i] < 1) cnt2++;
    }
    cout << cnt1 << '\n' << cnt2 << '\n';

    return 0;
}