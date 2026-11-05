#include<bits/stdc++.h>

using namespace std;

#define ll long long
#define ull unsigned long long
//#define int ll
#define pii pair<int, int>
#define all(x) x.begin(),x.end()
#define fer(i, m, n) for(int i = m; i < n; ++i)
#define ferd(i, m, n) for(int i = m; i >= n; --i)
#define dbg(x) cout << #x << ' ' << '=' << ' ' << x << '\n'

const int MOD = 1e9 + 7;
const int N = 2e5 + 2;
const int inf = 1e9;

signed main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> arr(n);

    set<pii> st;
    map<int, int> mp;
    fer(i, 0, n) {
        cin >> arr[i];
        mp[arr[i]]++;
    }
    for(auto& [x, cnt] : mp) {
        st.insert({cnt, x});
    }

    set<int> res;

    fer(i, 0, n) {
        auto sub = [&](int x) -> void {
            int cnt = mp[x];
            st.erase({cnt, x});
            st.insert({cnt - 1, x});
            mp[x]--;
        };
        auto add = [&](int x) -> void {
            int cnt = mp[x];
            st.erase({cnt, x});
            st.insert({cnt + 1, x});
            mp[x]++;
        };

        sub(arr[i]), add(arr[i] - 1);
        fer(j, 0, n) {
            if(i == j) continue;
            
            sub(arr[j]), add(arr[j] + 1);
            res.insert(st.rbegin()->second);
            add(arr[j]), sub(arr[j] + 1);
        }
        add(arr[i]), sub(arr[i] - 1);
    }

    for(auto x : res) cout << x << ' ';
    return 0;
}