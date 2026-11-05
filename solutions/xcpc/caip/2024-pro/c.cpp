#include<bits/stdc++.h>

using namespace std;

#define IOS cin.tie(nullptr) -> ios::sync_with_stdio(false)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cerr << #x << char(61) << x << " ###\n"
#define dbg_arr(a, i) cerr << #a << '[' << #i << "]=" << a[i] << " ###\n";

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

    int n, m;
    cin >> n >> m;
    string board[n];
    vector<pii> M;

	auto OnRange = [&](int x, int y) -> bool {
		return x >= 0 && x < n && y >= 0 && y < m;
	};
	auto check = [&](int i, int j) -> bool {
		fer(r, i - 1, i + 2) {
			fer(c, j - 1, j + 2) {
				if(OnRange(r, c) && board[r][c] == 'm') return true;
			}
		}
		return false;
	};

    vector<vector<bool>> vis(n, vector<bool>(m, true));

    fer(i, 0, n) {
    	cin >> board[i];
    	fer(j, 0, m) {
			if(board[i][j] == 'c') {
				fer(r, i - 1, i + 2) {
					fer(c, j - 1, j + 2) {
						if(OnRange(r, c)) vis[r][c] = false;
					}
				}
			}
		}
    }


    fer(i, 0, n) {
    	fer(j, 0, m) {
			if(board[i][j] == 'w') {
				if(check(i, j) == false) {
					fer(r, i - 1, i + 2) {
						fer(c, j - 1, j + 2) {
							if(OnRange(r, c) && vis[r][c] && board[r][c] == '.') M.emplace_back(r + 1, c + 1);
						}
					}
					if(M.empty()) {
						cout << "Too cold!";
					} else {
						for(auto [r, c] : M) cout << r << ' ' << c << '\n';
					}
					return 0;
				}
			}
    	}
    }
    cout << "Too cold!";
    return 0;
}