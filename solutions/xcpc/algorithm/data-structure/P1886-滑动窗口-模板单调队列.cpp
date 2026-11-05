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

#define popcount(x)  __builtin_popcount(x)
#define popcountll(x)  __builtin_popcountll(x)
#define clz(x)  __builtin_clz(x)
#define ctz(x)  __builtin_ctz(x)

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

    int n, k;
    cin >> n >> k;
    vector<int> arr(n);

    fer(i, 0, n) cin >> arr[i];
    deque<pii> dq1, dq2;
    vector<int> mx, mn;

    fer(i, 0, k) {
    	if(i == 0) {
    		dq1.push_back({arr[i], i});
			dq2.push_back({arr[i], i});
    	}

    	while(!dq1.empty() && dq1.back().first <= arr[i]) {
    		dq1.pop_back();
    	}
    	dq1.push_back({arr[i], i});
    	while(!dq2.empty() && dq2.back().first >= arr[i]) {
    		dq2.pop_back();
    	}
    	dq2.push_back({arr[i], i});
    }

    mx.push_back(dq1.front().first), mn.push_back(dq2.front().first);

    fer(i, k, n) {
		if(dq1.front().second <= i - k) dq1.pop_front();
    	while(!dq1.empty() && dq1.back().first <= arr[i]) {
    		dq1.pop_back();
    	}
    	dq1.push_back({arr[i], i});
    	mx.push_back(dq1.front().first);

    	if(dq2.front().second <= i - k) dq2.pop_front();
    	while(!dq2.empty() && dq2.back().first >= arr[i]) {
    		dq2.pop_back();
    	}
    	dq2.push_back({arr[i], i});
    	mn.push_back(dq2.front().first);
    }

    for(auto x : mn) cout << x << ' ';
    cout << '\n';
	for(auto x : mx) cout << x << ' ';

    return 0;
}