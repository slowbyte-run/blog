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
#define lowbit(x)  ((x) & -(x))

#ifdef LOCAL
	#define dbg(x) cerr << #x << char(61) << x << " ###\n"
	#define dbg_arr(a, i) cerr << #a << '[' << i << "]=" << a[i] << " ###\n"
#else
	#define dbg(x) (void)0
	#define dbg_arr(a, i) (void)0
#endif

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
const int N = 1e4;
const int inf = 2e9;

vector<int> primes;
vector<bool> is_prime(N, true);

void seive() {
	is_prime[0] = is_prime[1] = false;

	fer(i, 2, N) {
		if(is_prime[i]) primes.push_back(i);
		for(int j = 0; j < primes.size() && primes[j] * i < N; j++) {
			is_prime[primes[j] * i] = false;
			if(i % primes[j] == 0) break;
		}
	}
}

signed main() {
    IOS;

    int m, n;
    cin >> m >> n;
    seive();

    fer(i, m, n + 1) {
    	ferd(j, i, 2) {
    		if(i % j == 0 && is_prime[j]) {
    			if(i == m) cout << j;
    			else cout << ',' << j;
    			break;
    		}
    	}
    }

    return 0;
}