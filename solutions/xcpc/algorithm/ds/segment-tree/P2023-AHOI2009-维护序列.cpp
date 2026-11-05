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

template<class T>
struct segmentTree {
	struct Node {
		int l, r;
		T sum;
		T mul = 1, add = 0;
	};

	int n;
	vector<Node> tr;
	int mod;

	segmentTree(int _n) {
		init(vector<T> (_n));
	}
	segmentTree(vector<T> a, int p = 1e9 + 7) {
		mod = p;
		init(a);
	}

	void init(vector<T> a) {
		n = a.size();
		tr.resize(n << 2);

		function<void(int, int, int)> build = [&](int i, int l, int r) -> void {
			tr[i].l = l, tr[i].r = r;
			if(l == r) {
				tr[i].sum = a[l] % mod;
				return;
			}
			int mid = l + (r - l >> 1);
			build(i << 1, l, mid);
			build(i << 1 | 1, mid + 1, r);
			push_up(i);
		};
		build(1, 0, n - 1);
	}

	void push_up(int i) {
		tr[i].sum = tr[i << 1].sum + tr[i << 1 | 1].sum;
		tr[i].sum %= mod;
	}
	void push_down(int i) {
		if(tr[i].add != 0 || tr[i].mul != 1) {
			int l = tr[i].l, r = tr[i].r;
			T mul = tr[i].mul, add = tr[i].add;
			int mid = l + (r - l >> 1);

			tr[i << 1].sum = (tr[i << 1].sum * mul % mod + add * (mid - l + 1) % mod) % mod;
			tr[i << 1].mul = tr[i << 1].mul * mul % mod;
			tr[i << 1].add = (tr[i << 1].add * mul + add) % mod;

			tr[i << 1 | 1].sum = (tr[i << 1 | 1].sum * mul % mod + add * (r - mid) % mod) % mod;
			tr[i << 1 | 1].mul = tr[i << 1 | 1].mul * mul % mod;
			tr[i << 1 | 1].add = (tr[i << 1 | 1].add * mul % mod + add) % mod;

			tr[i].mul = 1, tr[i].add = 0;
		}
	}

	void update1(int i, int ind, T val) {
		int l = tr[i].l, r = tr[i].r;
		if(l == r) {
			tr[i].sum += val;
			return;
		}
		int mid = l + (r - l >> 1);
		if(ind <= mid) update1(i << 1, ind, val);
		else update1(i << 1 | 1, ind, val);
		push_up(i);
	}
	void update2(int i, int ul, int ur, T val, int op) {
		int l = tr[i].l, r = tr[i].r;

		if(r < ul || l > ur) return;
		if(ul <= l && r <= ur) {
			// 打懒标记，无需再往后更新
			if(op == 1) {
				tr[i].sum = (tr[i].sum * val % mod);
				tr[i].mul = tr[i].mul * val % mod;
				tr[i].add = tr[i].add * val % mod;
			} else if(op == 2) {
				tr[i].sum = (tr[i].sum + val * (r - l + 1) % mod) % mod;
				tr[i].add = (tr[i].add + val) % mod;
			}
			return;
		}

		push_down(i);
		int mid = l + (r - l >> 1);
		update2(i << 1, ul, ur, val, op);
		update2(i << 1 | 1, ul, ur, val, op);
		push_up(i);
	}

	T query(int i, int ql, int qr) {
		int l = tr[i].l, r = tr[i].r;

		if(r < ql || l > qr) return 0;
		if(ql <= l && r <= qr) return tr[i].sum % mod;

		push_down(i);
		return (query(i << 1, ql, qr) + query(i << 1 | 1, ql, qr)) % mod;
	}

	void update1(int ind, T val) {
		update1(1, ind, val);
	}
	void update2(int ul, int ur, T val, int op) {
		update2(1, ul, ur, val, op);
	}
	T query(int ql, int qr) {
		return query(1, ql, qr);
	}
};

signed main() {
    IOS;

    int n, p;
    cin >> n >> p;
    vector<ll> arr(n);
    fer(i, 0, n) cin >> arr[i];

    int m;
    cin >> m;
    segmentTree seg(arr, p);
    while(m--) {
    	int op;
    	cin >> op;
    	int t, g;
    	ll c;
    	if(op == 3){
    		cin >> t >> g;
    		cout << seg.query(t - 1, g - 1) << '\n';
    	} else {
    		cin >> t >> g >> c;
    		seg.update2(t - 1, g - 1, c % p, op);
    	}
    }

    return 0;
}