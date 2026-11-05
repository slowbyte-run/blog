#include <iostream>
#include <vector>
using namespace std;

typedef long long ll;

ll find_good_number(ll n) {
    vector<int> ternary;
    ll temp = n;

    // 将 n 转换为三进制表示
    while (temp > 0) {
        ternary.push_back(temp % 3);
        temp /= 3;
    }

    // 添加一个额外的位以处理可能的进位
    ternary.push_back(0);

    // 查找第一个为 2 的位
    int idx = -1;
    for (int i = 0; i < ternary.size(); ++i) {
        if (ternary[i] == 2) {
            idx = i;
            break;
        }
    }

    // 如果存在 2，则进行进位处理
    if (idx != -1) {
        for (int i = 0; i <= idx; ++i) {
            ternary[i] = 0;
        }
        ternary[idx + 1] += 1;

        // 处理进位可能引起的连锁反应
        for (int i = idx + 1; i < ternary.size(); ++i) {
            if (ternary[i] >= 3) {
                ternary[i] = 0;
                if (i + 1 == ternary.size()) {
                    ternary.push_back(1);
                } else {
                    ternary[i + 1] += 1;
                }
            } else {
                break;
            }
        }
    }

    // 将三进制表示转换回十进制
    ll result = 0, base = 1;
    for (int i = 0; i < ternary.size(); ++i) {
        result += ternary[i] * base;
        base *= 3;
    }

    return result;
}

int main() {
    int q;
    cin >> q;
    while (q--) {
        ll n;
        cin >> n;
        cout << find_good_number(n) << endl;
    }
    return 0;
}
