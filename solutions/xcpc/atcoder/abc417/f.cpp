#include<bits/stdc++.h>

using namespace std;

#ifdef LOCAL
    #include<macro.hpp>
#else
    #define dbg(...)
    #define print(...)
    #define dbg_label(...)
#endif
#define IOS ios::sync_with_stdio(false); cin.tie(nullptr)
#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
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
mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
mt19937_64 rng64(chrono::steady_clock::now().time_since_epoch().count());

const int MOD = 998244353;
const int N = 2e5 + 2;
const int inf = 2e9;

template<class T>
constexpr T power(T a, i64 b) {
    T res = 1;
    for (; b; b /= 2, a *= a) {
        if (b % 2) {
            res *= a;
        }
    }
    return res;
}

constexpr i64 mul(i64 a, i64 b, i64 p) {
    i64 res = a * b - i64(1.L * a * b / p) * p;
    res %= p;
    if (res < 0) {
        res += p;
    }
    return res;
}
template<i64 P>
struct MLong {
    i64 x;
    constexpr MLong() : x{} {}
    constexpr MLong(i64 x) : x{norm(x % getMod())} {}
    
    static i64 Mod;
    constexpr static i64 getMod() {
        if (P > 0) {
            return P;
        } else {
            return Mod;
        }
    }
    constexpr static void setMod(i64 Mod_) {
        Mod = Mod_;
    }
    constexpr i64 norm(i64 x) const {
        if (x < 0) {
            x += getMod();
        }
        if (x >= getMod()) {
            x -= getMod();
        }
        return x;
    }
    constexpr i64 val() const {
        return x;
    }
    explicit constexpr operator i64() const {
        return x;
    }
    constexpr MLong operator-() const {
        MLong res;
        res.x = norm(getMod() - x);
        return res;
    }
    constexpr MLong inv() const {
        assert(x != 0);
        return power(*this, getMod() - 2);
    }
    constexpr MLong &operator*=(MLong rhs) & {
        x = mul(x, rhs.x, getMod());
        return *this;
    }
    constexpr MLong &operator+=(MLong rhs) & {
        x = norm(x + rhs.x);
        return *this;
    }
    constexpr MLong &operator-=(MLong rhs) & {
        x = norm(x - rhs.x);
        return *this;
    }
    constexpr MLong &operator/=(MLong rhs) & {
        return *this *= rhs.inv();
    }
    friend constexpr MLong operator*(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res *= rhs;
        return res;
    }
    friend constexpr MLong operator+(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res += rhs;
        return res;
    }
    friend constexpr MLong operator-(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res -= rhs;
        return res;
    }
    friend constexpr MLong operator/(MLong lhs, MLong rhs) {
        MLong res = lhs;
        res /= rhs;
        return res;
    }
    friend constexpr std::istream &operator>>(std::istream &is, MLong &a) {
        i64 v;
        is >> v;
        a = MLong(v);
        return is;
    }
    friend constexpr std::ostream &operator<<(std::ostream &os, const MLong &a) {
        return os << a.val();
    }
    friend constexpr bool operator==(MLong lhs, MLong rhs) {
        return lhs.val() == rhs.val();
    }
    friend constexpr bool operator!=(MLong lhs, MLong rhs) {
        return lhs.val() != rhs.val();
    }
};

template<>
i64 MLong<0LL>::Mod = i64(1E18) + 9;

template<int P>
struct MInt {
    int x;
    constexpr MInt() : x{} {}
    constexpr MInt(i64 x) : x{norm(x % getMod())} {}
    
    static int Mod;
    constexpr static int getMod() {
        if (P > 0) {
            return P;
        } else {
            return Mod;
        }
    }
    constexpr static void setMod(int Mod_) {
        Mod = Mod_;
    }
    constexpr int norm(int x) const {
        if (x < 0) {
            x += getMod();
        }
        if (x >= getMod()) {
            x -= getMod();
        }
        return x;
    }
    constexpr int val() const {
        return x;
    }
    explicit constexpr operator int() const {
        return x;
    }
    constexpr MInt operator-() const {
        MInt res;
        res.x = norm(getMod() - x);
        return res;
    }
    constexpr MInt inv() const {
        assert(x != 0);
        return power(*this, getMod() - 2);
    }
    constexpr MInt &operator*=(MInt rhs) & {
        x = 1LL * x * rhs.x % getMod();
        return *this;
    }
    constexpr MInt &operator+=(MInt rhs) & {
        x = norm(x + rhs.x);
        return *this;
    }
    constexpr MInt &operator-=(MInt rhs) & {
        x = norm(x - rhs.x);
        return *this;
    }
    constexpr MInt &operator/=(MInt rhs) & {
        return *this *= rhs.inv();
    }
    friend constexpr MInt operator*(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res *= rhs;
        return res;
    }
    friend constexpr MInt operator+(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res += rhs;
        return res;
    }
    friend constexpr MInt operator-(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res -= rhs;
        return res;
    }
    friend constexpr MInt operator/(MInt lhs, MInt rhs) {
        MInt res = lhs;
        res /= rhs;
        return res;
    }
    friend constexpr std::istream &operator>>(std::istream &is, MInt &a) {
        i64 v;
        is >> v;
        a = MInt(v);
        return is;
    }
    friend constexpr std::ostream &operator<<(std::ostream &os, const MInt &a) {
        return os << a.val();
    }
    friend constexpr bool operator==(MInt lhs, MInt rhs) {
        return lhs.val() == rhs.val();
    }
    friend constexpr bool operator!=(MInt lhs, MInt rhs) {
        return lhs.val() != rhs.val();
    }
};

template<>
int MInt<0>::Mod = MOD;

template<int V, int P>
constexpr MInt<P> CInv = MInt<P>(V).inv();

constexpr int P = MOD;
using Z = MInt<P>;

template<class T>
struct segmentTree {
    struct Node {
        int l, r;
        T sum;
        T lazy;
    };

    int n;
    vector<Node> tr;

    segmentTree(int _n) {
        init(vector<T> (_n));
    }
    segmentTree(vector<T> a) {
        init(a);
    }

    void init(vector<T> a) {
        n = a.size();
        tr.resize(n << 2, {});

        function<void(int, int, int)> build = [&](int i, int l, int r) -> void {
            tr[i].l = l, tr[i].r = r;
            if(l == r) {
                tr[i].sum = a[l];
                return;
            }
            int mid = l + ((r - l) >> 1);
            build(i << 1, l, mid);
            build(i << 1 | 1, mid + 1, r);
            push_up(i);
        };
        build(1, 0, n - 1);
    }

    void push_up(int i) {
        tr[i].sum = tr[i << 1].sum + tr[i << 1 | 1].sum;
    }
    void push_down(int i) {
        if(tr[i].lazy != 0) {
            int l = tr[i].l, r = tr[i].r;
            int mid = l + ((r - l) >> 1);

            tr[i << 1].sum = tr[i].lazy * (mid - tr[i << 1].l + 1);
            tr[i << 1].lazy = tr[i].lazy;

            tr[i << 1 | 1].sum = tr[i].lazy * (tr[i << 1 | 1].r - mid);
            tr[i << 1 | 1].lazy = tr[i].lazy;

            tr[i].lazy = 0;
        }
    }

    void update1(int i, int ind, T val) {
        int l = tr[i].l, r = tr[i].r;
        if(l == r) {
            tr[i].sum += val;
            return;
        }
        int mid = l + ((r - l) >> 1);
        if(ind <= mid) update1(i << 1, ind, val);
        else update1(i << 1 | 1, ind, val);
        push_up(i);
    }
    void update2(int i, int ul, int ur, T val) {
        int l = tr[i].l, r = tr[i].r;

        if(r < ul || l > ur) return;
        if(ul <= l && r <= ur) {
            // 打懒标记，无需再往后更新
            tr[i].sum = val * ((r - l) + 1);
            tr[i].lazy = val;
            return;
        }

        push_down(i);
        update2(i << 1, ul, ur, val);
        update2(i << 1 | 1, ul, ur, val);
        push_up(i);
    }

    T query(int i, int ql, int qr) {
        int l = tr[i].l, r = tr[i].r;

        if(r < ql || l > qr) return 0;
        if(ql <= l && r <= qr) return tr[i].sum;

        push_down(i);
        return query(i << 1, ql, qr) + query(i << 1 | 1, ql, qr);
    }

    void update(int ind, T val) {
        update1(1, ind, val);
    }
    void update(int ul, int ur, T val) {
        update2(1, ul, ur, val);
    }
    T query(int ql, int qr) {
        return query(1, ql, qr);
    }
};

signed main() {
    IOS;

    int n, m;
    cin >> n >> m;
    vector<Z> a(n);
    fer(i, 0, n) cin >> a[i];

    segmentTree seg(a);
    while(m--) {
    	int l, r;
    	cin >> l >> r;
    	l--, r--;
    	Z sum = seg.query(l, r);
    	seg.update(l, r, sum / (Z(r - l) + 1));
    }

    fer(i, 0, n) {
    	cout << seg.query(i, i) << " \n"[i == n - 1];
    }

    return 0;
}