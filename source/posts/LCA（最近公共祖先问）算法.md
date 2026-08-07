---
title: 'LCA（最近公共祖先问）算法'
date: '2025-06-11 21:27'
link: 'cnblogs-18924572'
description: 'LCA 最近公共祖先的倍增（二分提升）实现流程与 C++ 模板。'
tags:
  - 'algorithm'
categories:
  - 'Algorithm'
---

本篇提供 LCA 算法的介绍、倍增（二分提升）实现流程，以及个人的类模板。

---

## 什么是 LCA？

- **定义**：在一棵以某个节点（通常是 1）为根的树中，给定两个节点 u, v，它们的 **最近公共祖先（Lowest Common Ancestor, LCA）** 是同时是 u 和 v 的祖先中，距离它们最近的那个节点。

---

## 为什么要用二分提升？

- **暴力做法**：每次查询 u, v 时，挨个往上跑，一个节点一个节点地向上找，会导致最坏 O(N) 时间，N≈树高。多次查询时太慢。

- **二分提升思想**：先预处理，让每个节点都记录“2^k 级祖先”（k=0,1,2…），这样查询时可以一次性“跳”大步向上，时间 O(log N)。

---

## 算法流程

1.  **建树并跑一遍 DFS（或 BFS）**

    - 记录每个节点的深度 `depth[x]`

    - 记录每个节点的直接父节点 `fa[0][x]`

2.  **预处理 \(fa\[k\]\[i\]\)**

    - 对所有 k 从 1 到 \(⌊log₂N⌋\)，对所有节点 i：

```
fa[k][i] = fa[k-1][ fa[k-1][i] ]
```

    -   含义：\(fa\[k\]\[i\]\) 是 i 的 2^k 级祖先。

3. **查询 LCA(u,v)**

    -   **第一步**：让 u, v 深度对齐。若 \(depth\[u\]\) > \(depth\[v\]\)，就把 u 往上跳 `depth[u]-depth[v]` 层；反之同理。

    -   **第二步**：如果 u == v，直接返回；否则从大 k 开始往下尝试，让 u 和 v 同时朝它们的 2^k 级祖先跳，如果跳完后两者依然不相同，就继续往下 k-1 跳……

    -   最后跳不到更高才结束，此时 `fa[0][u]` 就是答案。

---

## 复杂度

- **预处理**：DFS O(N)，构造 fa 表 O(N log N)。

- **单次查询**：对齐深度 O(log N) + 搜索祖先 O(log N)，合计 O(log N)。

---

## 算法模板（C++）

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

- **实现说明**

  - `dfs` ： 处理直接父亲，处理节点的深度
  - `init_lca(root)` ： 初始化操作，进行上面的 `dfs`，并且初始化 `fa` 表（处理节点 \(i\) 的 \(2^k\) 级祖先）
  - `query(u, v)` ： 查询两个节点的 LCA

- **使用说明**

  - n 是节点数
  - 节点编号默认从 1 开始
  - 根节点深度默认为 0

---

## LCA算法的应用领域

LCA（最近公共祖先）看似只是树上的一个“公共节点”查询，实际上是很多树论、路径查询和树形 DP 的核心子模块。下面按几大类问题给你列举它的常见应用场景：

---

### 1\. 路径长度／距离计算

- **两点距离**

  \(dist(u,v)=depth\[u\]+depth\[v\]−2 depth\[LCA(u,v)\]. \\text{dist}(u,v) = \\text{depth}\[u\] + \\text{depth}\[v\] - 2\\,\\text{depth}\[\\mathrm{LCA}(u,v)\]\)

  这是最直接的应用：给定两节点，O(1) 算出它们在树上的最短路径长度。

- **路径上的节点／边数**

  # nodes(u→v)=dist(u,v)+1,#edges(u→v)=dist(u,v). #\\text{nodes}(u\\to v)=\\text{dist}(u,v)+1,\\quad #\\text{edges}(u\\to v)=\\text{dist}(u,v).

---

### 2\. k-th 节点与祖先查询

- **第 k 个祖先**  
  在二分表 `up[k][v]` 上直接查：`up[⌊\log₂k⌋][…]` 递推，O(log N) 得到第 k 级父亲。

- **路径上第 kth 个节点**  
  先判断 k 是否在 u→LCA 段，或在 LCA→v 段，再用「跳 2^j 步」快速定位。

---

### 3\. 路径区间查询（树链剖分／虚树）

- **区间和／区间最值**  
  结合 **树链剖分**（HLD）或 **树上差分**，把 u→v 的路径拆成 O(log N) 段，每段在线段树／BIT 上查询。LCA 用来断点分割路径。

- **虚树（Virtual Tree）**  
  给定一组 m 个特殊节点，构造只含这些节点及其 LCA 的最小子树，规模 O(m log m)，很多「多源最短路」「费用流」题里都要先虚树化。

---

### 4\. 树形 DP 与重心／直径

- **树的直径**  
  先任选一点 A，DFS 找最远点 B；再自 B 出发找最远点 C，距离就是直径。求路径时需 LCA(B,C) 来记录路径上节点。

- **树的中心（重心）**  
  直径路径上任取中点（或二节点），用 LCA 快速判断。

---

### 5\. 离线 LCA（Tarjan 算法）

- 当查询非常多且实时性不重要，可用 **Tarjan 并查集** 在线性时间（近 O(N+Q)）批量算完所有 LCA。

---

### 6\. 其他衍生应用

- **动态树／Link-Cut Tree**：虽然结构变化更复杂，但内部仍需经常做祖先查询。

- **字符串／Trie 最长公共前缀**：把 Trie 当成树，LCA 就是两个字符串的最长公共前缀节点。

- **进阶算法**：如树上最近 k/距离约束查询、树上染色问题、网络流上的树形分层等等。

---

#### 小结

只要你的题目中出现了“树上两点路径”、“祖先关系判断”、“路径汇总”或“子树合并”，LCA 几乎都一定排得上用场。掌握它，就等于为所有树形结构的高级题目打下了坚实基础。希望这些场景能帮你在赛场上更灵活地应用 LCA！

## 拓展

了解「\(Euler Tour + RMQ」\)方法，可实现 O(1) 查询，但预处理更复杂。
