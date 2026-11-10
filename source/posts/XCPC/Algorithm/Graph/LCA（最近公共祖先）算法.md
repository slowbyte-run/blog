---
title: 'LCA（最近公共祖先）算法'
date: '2025-06-11 21:27'
link: 'cnblogs-18924572'
description: 'LCA 最近公共祖先的倍增（二分提升）实现流程与 C++ 模板。'
tags:
  - 'algorithm'
  - 'graph'
categories:
  - 'XCPC'
  - 'Algorithm'
  - 'Graph'
---

## 定义

在一棵以某个节点（通常是 1）为根的树中，给定两个节点 $u$、$v$，它们的最近公共祖先（Lowest Common Ancestor）是同时为 $u$ 和 $v$ 的祖先、且距离它们最近的那个节点。

## 为什么要倍增

暴力做法是每次查询都从两个点逐个往上爬，最坏 $O(N)$，$N$ 是树高。多组查询直接撑不住。

倍增的思路是预处理出每个节点的 $2^k$ 级祖先，查询时按二进制位一次跳一大步，把单次查询压到 $O(\log N)$。

## 流程

跑一遍 DFS，记下每个节点的深度 `depth[x]` 和直接父亲 `fa[0][x]`。

再按 $2^k$ 递推整张表：

```text
fa[k][i] = fa[k-1][ fa[k-1][i] ]
```

含义是 $i$ 的 $2^k$ 级祖先等于“先跳 $2^{k-1}$ 级，再跳 $2^{k-1}$ 级”。

查询分两步：

- 深度对齐。把较深的点往上跳 `depth[u] - depth[v]` 层，跳法就是把差值按二进制拆开，哪一位是 1 就跳对应的 $2^k$。
- 同步上跳。此时两点深度相同，如果已经重合就直接返回；否则从最大的 $k$ 往下试，只要 `fa[k][u] != fa[k][v]` 就同时跳。最后两点的父亲就是 LCA。

第二步从大到小扫是对的：这样能保证跳到“LCA 下方最远的那个位置”，再往上一步就重合了。

## 复杂度

预处理 DFS 是 $O(N)$，构造 `fa` 表是 $O(N \log N)$；单次查询 $O(\log N)$。空间 $O(N \log N)$。

## 模板

```cpp
class LCA {
private:
	int n;
	int LOG;
	vector<vector<int>> adjlist;
	vector<int> depth;
	vector<vector<int>> fa;

	void dfs(int u, int p) {
		fa[0][u] = p;
		depth[u] = p ? depth[p] + 1 : 0;

		for(int v : adjlist[u]) {
			if(v != p) {
				dfs(v, u);
			}
		}
	}

	void init_lca(int root) {
		dfs(root, 0);
		fer(k, 1, LOG) {
			fer(i, 1, n + 1) {
				int mid = fa[k - 1][i];
				fa[k][i] = mid ? fa[k - 1][mid] : 0;
			}
		}
	}

public:
	// 节点从 1 开始编号
	LCA(const vector<vector<int>>& tree, int root)
		: n(tree.size() - 1),
		  LOG(__lg(n) + 1),
		  adjlist(tree),
		  depth(n + 1, 0),
		  fa(LOG + 1, vector<int>(n + 1))
	{
		init_lca(root);
	}

	int query(int u, int v) {
		if(depth[u] < depth[v]) swap(u, v);
		int diff = depth[u] - depth[v];

		// 深度对齐
		fer(k, 0, LOG) {
			if(diff & (1 << k)) {
				u = fa[k][u];
			}
		}
		if(u == v) return u;

		ferd(k, LOG, 0) {
			if(fa[k][u] && fa[k][u] != fa[k][v]) {
				u = fa[k][u];
				v = fa[k][v];
			}
		}
		return fa[0][u];
	}
};
```

几个约定：`n` 是节点数，编号从 1 开始，根节点的深度是 0，0 号节点当哨兵（`fa[k][0] = 0`）。

`dfs` 只负责父亲和深度，`init_lca` 负责整张表，`query` 负责查询。三块分开写，改起来不容易互相牵连。

## 常见用法

两点距离：

$$d(u, v) = depth[u] + depth[v] - 2 \cdot depth[\mathrm{LCA}(u,v)]$$

路径上的点数等于 $d(u,v) + 1$，边数等于 $d(u,v)$。

其余的用法基本都由这个式子派生：

- 第 $k$ 级祖先：把 $k$ 拆成二进制位，在 `fa` 表上跳。单次 $O(\log N)$。
- 路径上的第 $k$ 个点：先算出 $l = \mathrm{LCA}(u,v)$，判断 $k$ 落在 $u \to l$ 还是 $l \to v$ 这一段，再换算成“向上跳几步”。
- 路径求和 / 最值：和树链剖分或树上差分配合，把路径拆成 $O(\log N)$ 段，每段用线段树或 BIT 查。
- 虚树：给一组关键点，把它们和两两的 LCA 取出来建成一棵小树，规模 $O(m)$。多组询问、每组点数不多时能省掉大量空跑。
- 树的直径：两次 DFS 求端点，需要输出路径上的点时再用 LCA 补出具体节点。
- 离线批量查询：Tarjan 并查集可以做到近似 $O(N + Q)$，适合查询数量远大于建树开销的场合。

Trie 上求两个串的最长公共前缀，等价于在 Trie 这棵树上求两点的 LCA，算是同一个东西的另一种包装。

## 拓展

再进一步可以看欧拉序 + RMQ 的写法，能做到 $O(1)$ 查询，代价是预处理和常数都更大。
