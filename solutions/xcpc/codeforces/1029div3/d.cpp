#include<bits/stdc++.h>

using namespace std;

#define ll long long
#define ull unsigned long long
#define int ll
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
    vector<int> arr(n + 1);
    vector<pii> p(n + 1);

    fer(i, 1, n + 1) {
    	cin >> arr[i];
    	p[i].first = i, p[i].second = n - i + 1;
    }

    int yy = -1, xx = -1;
    fer(i, 2, n + 1) {
    	int a = p[i - 1].first, b = p[i - 1].second;
    	int c = p[i].first, d = p[i].second;

    	if(b * c == a * d) continue;

    	if((c * arr[i - 1] - a * arr[i]) % (b * c - a * d) != 0) {
    		cout << "NO" << '\n';
    		return;
    	}
    	if((c * arr[i - 1] - a * arr[i]) / (b * c - a * d) < 0) {
    		cout << "NO" << '\n';
    		return;
    	}
    	int y = (c * arr[i - 1] - a * arr[i]) / (b * c - a * d);
    	if(arr[i - 1] - b * y < 0 || (arr[i - 1] - b * y) % a) {
    		cout << "NO" << '\n';
    		return;
    	}
    	int x = (arr[i - 1] - b * y) / a;
    	if(yy == -1) {
    		yy = y, xx = x;
    		continue;
    	} else if(y != yy || x != xx) {
    		cout << "NO" <<'\n';
    		return;
    	}
    }
    cout << "YES" << '\n';
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int T = 1;
    cin >> T;
    while(T--) solve();

    return 0;
}