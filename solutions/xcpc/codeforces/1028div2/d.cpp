#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll INF = 1e9;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n, q;
        cin >> n >> q;
        vector<ll> b(n + 1), c(n + 1), a(n + 1);
        for (int i = 1; i <= n; ++i) {
            cin >> b[i];
            c[i] = a[i] = b[i];
        }

        vector<int> x(q + 1), y(q + 1), z(q + 1);
        vector<int> lastZ(n + 1, 0);
        for (int i = 1; i <= q; ++i) {
            cin >> x[i] >> y[i] >> z[i];
            lastZ[z[i]] = i;   
        }

        auto raise = [&](int idx, ll target, int step)->bool {
            if (c[idx] < target && lastZ[idx] > step) {
                c[idx] = target;
                a[idx] = target;                    
            }
            return true;
        };

        bool ok = true;
        for (int i = 1; i <= q && ok; ++i) {
            ll target = b[ z[i] ];
            ll mn = min(c[ x[i] ], c[ y[i] ]);

            if (mn > target) { ok = false; break; }
            if (mn < target) {
                raise(x[i], target, i);
                raise(y[i], target, i);
                ll mn2 = min(c[ x[i] ], c[ y[i] ]);
                if (mn2 != target) { ok = false; break; }
            }
            c[ z[i] ] = target;         
        }

        if (!ok) {
            cout << -1 << '\n';
        } else {
            for (int i = 1; i <= n; ++i) {
                cout << a[i] << (i == n ? '\n' : ' ');
            }
        }
    }
    return 0;
}
