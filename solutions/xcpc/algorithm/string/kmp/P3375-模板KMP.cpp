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

struct KMP {
	int m;
	string t;
	// vector<int> ne;
	// vector<int> neval;
	int* ne;
	int* neval;

	KMP(string &t) {
		this->t = t;
		init();
	}

	void init() {
		m = t.size();
		// ne.resize(m + 1);
		// neval.resize(m + 1);
		ne = new int[m + 1];
		neval = new int[m + 1];
		get_next();
		get_nextval();
	}

	void get_next() {
	    ne[0] = -1;
	    if(m == 1) return;
	    ne[1] = 0;
		// i: 当前要求的 next 值的位置
		// ind: 当前要和 t[i - 1] 匹配的下标
		int i = 2, ind = 0;
		while(i <= m) {
			if(t[i - 1] == t[ind]) {
				ne[i++] = ++ind;
			} else if(ind > 0) {
				ind = ne[ind];
			} else {
				ne[i++] = 0;
			}
		}
	}

	void get_nextval() {
	    neval[0] = -1;
	    if(m == 1) return;

	    int i = 1;
	    while(i < m) {
	        if(t[i] == t[ne[i]]) {
	            neval[i] = neval[ne[i]]; // 跳过相同的匹配不上的字符
	        } else {
	            neval[i] = ne[i]; // 否则，与 next 一样
	        }
	        i++;
	    }
	}

	int pos0(string &s) {
		int n = s.size();

		int x = 0, y = 0;
		while(x < n && y < m) {
			if(s[x] == t[y]) {
				x++, y++;
			} else if(y != 0) {
				y = ne[y];
			} else {
				x++;
			}
		}
		return y == m ? x - m : -1;
	}

	void pos(string &s) {
		int n = s.size();
		vector<int> res;

		int x = 0, y = 0;
		while(x < n && y < m) {
			if(y == -1 || s[x] == t[y]) {
				x++, y++;
			} else {
				y = neval[y];
			}
			if(y == m) {
				cout << x - y + 1 << '\n';
				// x = x - y + 1;
				// y = 0;
				y = ne[y];
			}
		}
	}
};

signed main() {
    IOS;

    string s1, s2;
    cin >> s1 >> s2;

    KMP k(s2);

    k.pos(s1);

    fer(i, 0, s2.size()) cout << k.ne[i + 1] << ' ';


    return 0;
}