---
title: '从结构化 Chunking 到 GraphRAG 的食谱知识检索系统设计'
date: '2026-11-05 20:15'
link: 'cook-rag'
description: '以 Cook-RAG 项目为例，讲清楚食谱数据要怎么分块：结构感知的三级 Chunking、Metadata 设计，以及升级到 GraphRAG 后 Chunk 与知识图谱的分工，最后用 Agentic RAG 按问题动态选择检索策略。'
tags:
  - 'cook-rag'
  - 'rag'
  - 'graph-rag'
  - 'agentic-rag'
  - 'chunking'
categories:
  - 'Agent'
  - 'RAG'
---

## 一、项目背景

最近在做一个 Cook-RAG 项目，目标是构建一个基于 RAG 和 Agentic RAG 的智能食谱检索与推荐系统。

项目中的食谱数据主要以 Markdown 文件的形式存储，每个 Markdown 文件对应一道食谱，文件名就是食谱名称。每份食谱包含难度、烹饪时间、原材料、操作步骤等信息。

例如：

```markdown
# 番茄炒蛋

## 基本信息

- 难度：简单
- 烹饪时间：15分钟
- 份量：2人

## 原材料

- 番茄：2个
- 鸡蛋：3个
- 食用油：适量
- 盐：适量
- 白糖：少许

## 操作步骤

### 步骤1：准备食材

将番茄洗净切块，鸡蛋打入碗中搅拌均匀。

### 步骤2：炒鸡蛋

锅中倒入适量食用油，加热后倒入鸡蛋液，炒至凝固后盛出。

### 步骤3：炒番茄

锅中加入少量油，倒入番茄翻炒，加入少许盐和白糖。

### 步骤4：混合

将炒好的鸡蛋倒入锅中，与番茄翻炒均匀即可。
```

项目希望支持以下场景：

1. 根据食材检索食谱，例如：有哪些菜使用番茄和鸡蛋？
2. 根据难度、时间等条件筛选食谱，例如：推荐几道20分钟以内的简单菜肴。
3. 根据自然语言描述推荐食谱，例如：推荐一道适合新手、口味偏酸甜的家常菜。
4. 查询具体烹饪步骤，例如：番茄炒蛋应该怎么炒鸡蛋？
5. 比较不同食谱，例如：番茄炒蛋和蛋炒饭在制作方法上有什么区别？
6. 根据现有食材推荐可以制作的菜肴。

在这样的需求下，单纯使用传统 RAG 的固定长度分块和向量相似度检索，可能无法充分利用食谱本身的结构化信息。

因此，我将项目的数据处理和检索设计分成两个阶段：

- 第一阶段：设计合理的 Chunking 策略，让食谱可以被准确切分和检索。
- 第二阶段：进一步引入 GraphRAG，将食谱、食材、烹饪步骤、烹饪方法等实体及其关系组织成知识图谱。

本文将围绕这两个阶段展开。

---

## 二、第一阶段：如何为食谱设计 Chunking 策略？

### 2.1 为什么不推荐简单的固定长度分块？

传统 RAG 通常会使用 Fixed-size Chunking，将文本按照固定字符数或 Token 数切分。

例如：

- 每个 Chunk 包含 500 个 Token。
- Chunk 之间设置 50 个 Token 的重叠。
- 将切分后的文本生成 Embedding。
- 存入向量数据库。

这种方法适用于一般性的长文本，但不一定适合食谱。

原因是食谱本身具有比较明确的结构：

| 内容     | 数据特点                     |
| -------- | ---------------------------- |
| 食谱名称 | 唯一标识一道菜               |
| 基本信息 | 难度、时间、份量等结构化属性 |
| 原材料   | 一组具有整体性的食材及其用量 |
| 操作步骤 | 具有明确顺序的操作描述       |
| 烹饪方法 | 与具体食材、步骤存在关联     |

如果直接按照固定长度切分，可能产生以下问题：

1. 原材料列表被拆散，导致食材信息不完整。
2. 一个操作步骤被切成多个 Chunk，丢失操作上下文。
3. Chunk 缺少食谱名称，导致检索结果无法明确对应哪道菜。
4. 同一道菜的多个步骤可能被分散到不同的 Chunk 中。
5. Chunk 过长时，Embedding 难以准确表达某个具体步骤的语义。

因此，对于食谱数据，更适合采用：

**Structure-aware Chunking（结构感知分块）+ Parent-Child Chunking（父子分块）+ Metadata Enrichment（元数据增强）。**

### 2.2 三级分块架构

我建议将食谱组织成三个层次：

- Recipe Chunk：食谱级别。
- Section Chunk：章节级别。
- Step Chunk：步骤级别。

#### 第一层：Recipe Chunk

一个食谱对应一个完整的 Parent Chunk。

例如：

```json
{
  "recipe_id": "tomato_egg",
  "recipe_name": "番茄炒蛋",
  "content": "完整的番茄炒蛋食谱内容",
  "difficulty": "简单",
  "cooking_time": 15,
  "servings": 2
}
```

Recipe Chunk 的作用：

1. 保存完整的食谱上下文。
2. 为子 Chunk 提供关联信息。
3. 当子 Chunk 被检索命中时，可以通过 recipe_id 找到完整食谱。
4. 为 Agent 提供完整的食谱信息，辅助推理和回答。

需要注意的是，不建议只使用完整 Recipe Chunk 进行向量检索。

因为当食谱内容较长时，整个食谱生成的 Embedding 可能无法准确表达某个具体步骤的语义。

#### 第二层：Section Chunk

按照 Markdown 的章节结构进行切分。

例如，一个食谱可以拆分成以下几个 Section Chunk：

**Chunk 1：基本信息**

```text
食谱名称：番茄炒蛋

章节：基本信息

难度：简单
烹饪时间：15分钟
份量：2人
```

**Chunk 2：原材料**

```text
食谱名称：番茄炒蛋

章节：原材料

番茄：2个
鸡蛋：3个
食用油：适量
盐：适量
白糖：少许
```

**Chunk 3：操作步骤**

```text
食谱名称：番茄炒蛋

章节：操作步骤

步骤1：准备食材
将番茄洗净切块，鸡蛋打入碗中搅拌均匀。

步骤2：炒鸡蛋
锅中倒入适量食用油，加热后倒入鸡蛋液，炒至凝固后盛出。

步骤3：炒番茄
锅中加入少量油，倒入番茄翻炒，加入少许盐和白糖。

步骤4：混合
将炒好的鸡蛋倒入锅中，与番茄翻炒均匀即可。
```

Section Chunk 的优点：

- 原材料列表不会被随意拆散。
- 基本信息可以整体检索。
- 完整操作步骤可以作为一个上下文单元。
- Chunk 数量相对可控。

#### 第三层：Step Chunk

将操作步骤进一步拆分，每个步骤形成一个独立 Chunk。

例如：

```text
食谱名称：番茄炒蛋

章节：操作步骤

步骤编号：2

当前步骤：炒鸡蛋

操作：
锅中倒入适量食用油，加热后倒入鸡蛋液，
炒至凝固后盛出。
```

Step Chunk 非常重要，因为很多用户并不需要获取完整食谱，而只是想了解某个具体操作。

例如：

- 番茄炒蛋应该怎么炒鸡蛋？
- 番茄应该什么时候放入锅中？
- 鸡蛋应该炒到什么程度？
- 炒番茄时需要加糖吗？

如果只有完整食谱 Chunk，检索结果可能包含大量无关信息。

而 Step Chunk 可以更精准地命中用户需要的内容。

同时，每个 Step Chunk 必须保留以下信息：

- 食谱名称。
- 食谱 ID。
- 步骤编号。
- 步骤名称。
- 所属章节。
- 当前步骤的完整操作描述。

不能只保存操作文本，否则会丢失语义上下文。

### 2.3 最终 Chunk 设计

综合来看，我建议采用以下方案：

| Chunk 类型   | 切分规则                    | 向量化策略 |
| ------------ | --------------------------- | ---------- |
| Recipe       | 一个食谱对应一个完整 Parent | 可选       |
| Basic Info   | 基本信息整体                | 可选       |
| Ingredients  | 原材料整体                  | 推荐       |
| Instructions | 完整操作步骤                | 推荐       |
| Step         | 一个操作步骤对应一个 Chunk  | 推荐       |

其中，Basic Info 不一定需要向量化，因为难度、时间、份量等信息更适合通过结构化字段查询。

例如：

```sql
SELECT *
FROM recipes
WHERE difficulty = '简单'
AND cooking_time <= 20;
```

对于食材检索，也可以使用结构化的食材关系表，而不是完全依赖向量相似度。

因此，**Embedding 不应该成为所有数据检索的唯一方式。**

---

## 三、Chunk Metadata 设计

除了 Chunk 本身的文本内容，还需要设计合理的 Metadata。

因为后续无论采用普通 RAG 还是 GraphRAG，都需要通过 Metadata 建立 Chunk、Recipe 和其他实体之间的关联。

建议每个 Chunk 至少包含：

```json
{
  "chunk_id": "tomato_egg_step_2",
  "recipe_id": "tomato_egg",
  "recipe_name": "番茄炒蛋",

  "chunk_type": "step",
  "section": "操作步骤",

  "step_number": 2,
  "step_name": "炒鸡蛋",

  "difficulty": "简单",
  "cooking_time": 15,

  "parent_id": "tomato_egg",

  "ingredients": ["番茄", "鸡蛋", "食用油", "盐", "白糖"],

  "source_file": "番茄炒蛋.md"
}
```

这里建议区分两种元数据：

**1. 业务元数据**

- difficulty
- cooking_time
- servings
- ingredients
- cuisine
- flavor

主要用于数据库查询、过滤和推荐。

**2. 检索元数据**

- chunk_id
- recipe_id
- chunk_type
- section
- step_number
- parent_id
- source_file

主要用于向量检索、父子 Chunk 关联和结果追溯。

这样可以同时支持业务查询与语义检索。

---

## 四、Markdown Parser 的设计

在实际工程中，不建议直接将 Markdown 文件交给通用的 RecursiveCharacterTextSplitter 处理。

更好的做法是实现一个专门的 Markdown Parser。

需要识别：

1. Markdown 标题：`#`、`##`、`###`。
2. 有序列表：操作步骤。
3. 无序列表：原材料。
4. 普通段落：补充说明。
5. 表格：食材、用量等结构化信息。

解析之后，先构建统一的 Recipe 数据结构，再根据结构生成 Chunk。

例如：

```python
recipe = {
    "recipe_id": "tomato_egg",
    "name": "番茄炒蛋",

    "metadata": {
        "difficulty": "简单",
        "cooking_time": 15,
        "servings": 2
    },

    "ingredients": [
        {
            "name": "番茄",
            "quantity": "2个"
        },
        {
            "name": "鸡蛋",
            "quantity": "3个"
        }
    ],

    "steps": [
        {
            "step_number": 1,
            "title": "准备食材",
            "content": "将番茄洗净切块，鸡蛋打入碗中搅拌均匀。"
        },
        {
            "step_number": 2,
            "title": "炒鸡蛋",
            "content": "锅中倒入适量食用油，加热后倒入鸡蛋液，炒至凝固后盛出。"
        }
    ]
}
```

随后再通过 Chunk Generator 生成不同粒度的 Chunk。

这种设计的优点是：

- Markdown 解析与 Chunking 解耦。
- 可以独立调整 Chunk 生成策略。
- 可以复用结构化数据构建知识图谱。
- 方便后续增加新的食谱字段。
- 便于进行数据校验和增量更新。

另外，Chunk 不应该无限细分。

例如：

```text
步骤2：炒鸡蛋
```

这个 Chunk 太短，缺少实际语义。

更合理的是将步骤标题和操作描述合并：

```text
番茄炒蛋，步骤2：炒鸡蛋。

锅中倒入适量食用油，加热后倒入鸡蛋液，
炒至凝固后盛出。
```

对于食谱数据，通常一个完整步骤就足以成为一个独立 Chunk，不需要再按照句子切分。

---

## 五、第二阶段：如果项目升级成 GraphRAG，还需要 Chunking 吗？

答案是：**需要。GraphRAG 并不能替代 Chunking，两者解决的是不同的问题。**

Chunking 主要解决文本的组织和检索问题。

Graph Construction 主要解决实体、关系以及知识结构的组织问题。

Graph Retrieval 则负责利用实体关系进行关联查询和多跳检索。

普通 RAG 的基本流程：

```text
Markdown
    ↓
Chunking
    ↓
Embedding
    ↓
Vector Database
    ↓
Similarity Search
    ↓
LLM
```

GraphRAG 的基本流程：

```text
Markdown
    ↓
Structure Parsing / Chunking
    ↓
Entity Extraction
    ↓
Relationship Extraction
    ↓
Knowledge Graph Construction
    ↓
Graph Database
    ↓
Graph Retrieval + Vector Retrieval
    ↓
LLM
```

当然，GraphRAG 也可以直接从结构化数据构建知识图谱，而不一定依赖 Chunking。

但对于 Cook-RAG，我仍然建议保留 Chunking。

原因在于：

**知识图谱能够表达实体之间的关系，但不能完全替代原始自然语言文本。**

例如：

```text
(番茄炒蛋)-[:HAS_INGREDIENT]->(鸡蛋)

(番茄炒蛋)-[:HAS_STEP]->(炒鸡蛋)
```

图谱可以表达：

- 番茄炒蛋需要鸡蛋。
- 番茄炒蛋包含炒鸡蛋这一步。

但是，图谱本身并不一定保存了完整的操作描述：

```text
锅中倒入适量食用油，加热后倒入鸡蛋液，
炒至凝固后盛出。
```

这段原始文本仍然需要通过 Chunk 保存。

因此，在 GraphRAG 中，Chunk 不再只是向量检索单元，也可以成为知识图谱的 Evidence Source（证据来源）。

---

## 六、GraphRAG 中如何设计 Chunking？

在 GraphRAG 中，我建议保留之前的分层分块架构，但进一步明确 Chunk 和 Graph Node 的职责。

可以理解为：

- Recipe：食谱实体。
- Ingredient：食材实体。
- Step：烹饪步骤实体。
- Chunk：原始文本证据。
- Relationship：实体之间的关联关系。

例如：

```text
Recipe Node：番茄炒蛋

    ├── Ingredient Section Chunk
    │       └── 番茄、鸡蛋、食用油
    │
    └── Instruction Section Chunk
            ├── Step 1 Chunk
            ├── Step 2 Chunk
            ├── Step 3 Chunk
            └── Step 4 Chunk
```

需要注意，Chunk 和 Graph Node 不一定是一一对应的。

例如，一个 Ingredients Chunk 可能包含多个 Ingredient 实体。

而一个 Ingredient 实体也可能出现在多个食谱的 Chunk 中。

因此，需要通过统一 ID 将两者关联起来。

### 6.1 Chunk 与 Graph Node 的关联设计

**Chunk 数据：**

```json
{
  "chunk_id": "tomato_egg_step_2",
  "recipe_id": "tomato_egg",
  "chunk_type": "step",
  "content": "锅中倒入适量食用油，加热后倒入鸡蛋液，炒至凝固后盛出。",
  "step_number": 2
}
```

**Graph Node 数据：**

```json
{
  "node_id": "step_tomato_egg_2",
  "node_type": "Step",
  "name": "炒鸡蛋",
  "recipe_id": "tomato_egg",
  "step_number": 2,
  "source_chunk_id": "tomato_egg_step_2"
}
```

**Graph Relationship：**

```text
(番茄炒蛋)-[:HAS_STEP]->(炒鸡蛋)

(炒鸡蛋)-[:USES_INGREDIENT]->(鸡蛋)

(炒鸡蛋)-[:USES_METHOD]->(炒)

(炒鸡蛋)-[:NEXT_STEP]->(炒番茄)
```

这样设计之后：

1. 图数据库负责实体和关系查询。
2. 向量数据库负责语义相似度检索。
3. Chunk 负责提供原始文本证据。
4. PostgreSQL 负责保存完整食谱和业务数据。

四者的职责比较清晰。

---

## 七、Cook-RAG 知识图谱应该如何设计？

这是 GraphRAG 阶段最值得深入设计的部分。

我的建议是先确定实体类型，再设计关系类型。

### 7.1 Entity：节点设计

可以考虑以下实体：

| 实体类型      | 示例     | 主要属性               |
| ------------- | -------- | ---------------------- |
| Recipe        | 番茄炒蛋 | 名称、难度、时间、份量 |
| Ingredient    | 番茄     | 分类、别名             |
| Step          | 炒鸡蛋   | 步骤编号、操作描述     |
| CookingMethod | 炒       | 方法名称               |
| Cuisine       | 家常菜   | 菜系名称               |
| Equipment     | 炒锅     | 设备名称               |
| Flavor        | 酸甜     | 风味名称               |

其中，Recipe、Ingredient、Step 是最核心的三个实体。

可以先围绕这三个实体构建第一版图谱，之后再逐步增加 CookingMethod、Cuisine、Equipment 和 Flavor。

### 7.2 Relationship：关系设计

建议设计以下关系：

| 起点   | 关系            | 终点          |
| ------ | --------------- | ------------- |
| Recipe | HAS_INGREDIENT  | Ingredient    |
| Recipe | HAS_STEP        | Step          |
| Step   | USES_INGREDIENT | Ingredient    |
| Step   | USES_METHOD     | CookingMethod |
| Step   | USES_EQUIPMENT  | Equipment     |
| Step   | NEXT_STEP       | Step          |
| Recipe | BELONGS_TO      | Cuisine       |
| Recipe | HAS_FLAVOR      | Flavor        |
| Recipe | SIMILAR_TO      | Recipe        |

其中有一个值得特别注意的设计：

**不仅要建立 Recipe 和 Ingredient 的关系，还应该建立 Step 和 Ingredient 的关系。**

因为这两种关系回答的问题不一样：

Recipe → Ingredient：

这道菜需要哪些食材？

Step → Ingredient：

具体在哪一步使用了某种食材？

例如：

```text
(番茄炒蛋)-[:HAS_INGREDIENT]->(鸡蛋)

(炒鸡蛋)-[:USES_INGREDIENT]->(鸡蛋)
```

这样 Agent 不仅能回答某道菜需要什么食材，还能回答具体在哪一步使用食材。

### 7.3 不要过度 Graph 化

不是所有数据都需要成为独立节点。

例如：

- 难度：简单。
- 烹饪时间：15分钟。
- 份量：2人。

这些信息更适合作为 Recipe 的属性：

```json
{
  "name": "番茄炒蛋",
  "difficulty": "简单",
  "cooking_time": 15,
  "servings": 2
}
```

而不是分别创建 Difficulty、CookingTime、Servings 节点。

我的原则是：

- 实体之间存在实际语义关联时，建立节点和关系。
- 单纯描述某个实体的属性时，优先保存为节点属性。

这样能够避免知识图谱中出现大量无意义的节点和关系。

---

## 八、GraphRAG 的检索流程如何设计？

对于 Cook-RAG，我不建议只采用 Graph Search，而是建议采用 Hybrid Retrieval，即图检索、向量检索和结构化数据库查询相结合。

因为不同用户 Query 的检索需求不同。

例如：

### 场景1：根据食材查找食谱

用户：

> 有哪些菜需要番茄和鸡蛋？

可以采用 Graph Retrieval：

```text
Ingredient：番茄
       ↓
HAS_INGREDIENT
       ↓
Recipe

Ingredient：鸡蛋
       ↓
HAS_INGREDIENT
       ↓
Recipe

       ↓
交集计算
       ↓
符合条件的食谱
```

### 场景2：根据烹饪步骤检索

用户：

> 番茄炒蛋应该怎么炒鸡蛋？

可以采用 Vector Retrieval：

```text
User Query
    ↓
Query Embedding
    ↓
Vector Search
    ↓
命中 Step Chunk
    ↓
通过 Recipe ID 获取完整食谱
    ↓
LLM Answer
```

### 场景3：根据难度和时间推荐

用户：

> 推荐一些简单且20分钟以内的家常菜。

这种场景不需要完全依赖图检索和向量检索。

可以直接通过 PostgreSQL 进行结构化过滤：

```sql
SELECT *
FROM recipes
WHERE difficulty = '简单'
AND cooking_time <= 20;
```

之后再使用语义检索或推荐算法排序。

### 场景4：比较两道菜的制作方法

用户：

> 番茄炒蛋和蛋炒饭的制作步骤有什么区别？

可以采用：

1. Graph Retrieval 获取两道菜对应的 Step 节点。
2. 根据步骤关系获取完整操作流程。
3. Vector Retrieval 补充相关操作描述。
4. 获取两个 Recipe 的完整上下文。
5. 交给 LLM 进行比较和总结。

因此，不同 Query 应该选择不同检索策略。

---

## 九、Agentic RAG：让 Agent 动态决定检索方式

这是 GraphRAG 和 Agentic RAG 结合后比较有价值的地方。

我建议不要让所有用户 Query 都执行相同的 Graph Search + Vector Search。

可以先设计一个 Query Understanding Agent，负责识别用户意图和检索需求。

例如：

| 用户 Query                 | 推荐检索策略                     |
| -------------------------- | -------------------------------- |
| 哪些菜含有番茄？           | Graph Search                     |
| 番茄和鸡蛋可以做什么？     | Graph Search + SQL               |
| 番茄炒蛋怎么做？           | Recipe Retrieval + Vector Search |
| 鸡蛋应该炒到什么程度？     | Step-level Vector Search         |
| 有哪些和番茄炒蛋相似的菜？ | Graph Search + Vector Search     |
| 哪些菜适合新手？           | SQL Metadata Filtering           |
| 比较两道菜的制作方法       | Multi-recipe Graph Retrieval     |

整体流程：

```text
User Query
    ↓
Query Understanding Agent
    ↓
Intent Classification
    ↓
Retrieval Strategy Selection
    |
    ├── Graph Search
    |
    ├── Vector Search
    |
    ├── SQL Query
    |
    └── Hybrid Search
            ↓
      Result Fusion
            ↓
        Reranking
            ↓
      Parent Retrieval
            ↓
      Context Assembly
            ↓
       LLM Answer
```

其中：

**1. Query Understanding**

提取用户 Query 中的关键信息：

- 食材。
- 菜系。
- 烹饪方法。
- 难度。
- 时间。
- 用户意图。

**2. Retrieval Strategy Selection**

根据用户 Query 选择检索工具。

**3. Result Fusion**

合并 Graph、Vector 和 SQL 的检索结果，去重并统一排序。

**4. Reranking**

通过 Reranker 对候选结果进行二次排序。

**5. Parent Retrieval**

根据 Recipe ID 获取完整食谱上下文。

**6. Context Assembly**

整理检索证据，交给 LLM 生成最终回答。

这也是 Agentic RAG 的优势：它可以根据问题的不同，动态决定调用什么工具，而不是每次都执行固定的向量检索。

---

## 十、最终技术架构设计

综合上面的分析，我建议 Cook-RAG 最终采用以下架构。

### 10.1 数据处理 Pipeline

```text
Markdown Recipe Files
        ↓
Markdown Parser
        ↓
Recipe Structure Builder
        ↓
Chunk Generator
        |
        ├── Recipe Parent Chunk
        |
        ├── Ingredient Chunk
        |
        ├── Instruction Chunk
        |
        └── Step Chunk
                ↓
        Entity Extraction
                ↓
      Relationship Extraction
                ↓
       Knowledge Graph Builder
                |
                ├── Graph Database
                |
                ├── Vector Database
                |
                └── PostgreSQL
```

### 10.2 数据存储设计

| 数据           | 存储位置              | 作用                         |
| -------------- | --------------------- | ---------------------------- |
| 完整食谱       | PostgreSQL            | 保存原始 Markdown 和完整内容 |
| 结构化食谱信息 | PostgreSQL            | 难度、时间、份量等           |
| 食材关系       | PostgreSQL / Graph DB | 支持食材查询                 |
| Parent Chunk   | PostgreSQL            | 保存完整上下文               |
| Section Chunk  | Vector DB             | 章节级语义检索               |
| Step Chunk     | Vector DB             | 步骤级语义检索               |
| Graph Nodes    | Neo4j                 | 保存实体                     |
| Graph Edges    | Neo4j                 | 保存实体关系                 |
| Embeddings     | pgvector / Vector DB  | 向量检索                     |

这里需要注意，存储位置并不是绝对的。

如果使用 PostgreSQL + pgvector，可以将业务数据、Chunk 和 Embedding 统一放在 PostgreSQL 中，减少基础设施复杂度。

如果希望单独使用 Neo4j 管理知识图谱，也可以采用 PostgreSQL + pgvector + Neo4j 的组合。

### 10.3 推荐技术栈

| 模块          | 技术选型                        |
| ------------- | ------------------------------- |
| 前端          | React / Next.js                 |
| 后端          | Python + FastAPI                |
| Agent 编排    | LangGraph                       |
| Markdown 解析 | Python-Markdown / 自定义 Parser |
| 关系数据库    | PostgreSQL                      |
| 图数据库      | Neo4j                           |
| 向量检索      | pgvector                        |
| Embedding     | BGE-M3 等多语言 Embedding       |
| Reranker      | BGE Reranker                    |

对于初期开发，可以先使用 PostgreSQL + pgvector 实现基础功能，后续再引入 Neo4j。

---

## 十一、项目落地建议：分阶段实现

虽然完整架构涉及 Chunking、GraphRAG、Agentic RAG 等多个部分，但不建议一开始就把所有功能全部实现。

我更推荐分阶段开发。

### Phase 1：食谱数据解析和结构化

目标：将 Markdown 文件解析成统一的 Recipe 数据结构。

实现：

- Markdown Parser。
- Recipe Schema。
- Ingredient Parser。
- Step Parser。
- 数据校验。
- 原始文件与 Recipe ID 的关联。

### Phase 2：实现结构化 Chunking

目标：构建可用于 RAG 的 Chunk。

实现：

- Recipe Parent Chunk。
- Ingredient Chunk。
- Instruction Chunk。
- Step Chunk。
- Metadata Enrichment。
- Parent-Child Mapping。

### Phase 3：实现基础 RAG

目标：支持语义检索和基础食谱问答。

实现：

- Embedding Pipeline。
- Vector Database。
- Similarity Search。
- Metadata Filtering。
- Parent Retrieval。
- Reranking。

### Phase 4：构建 Knowledge Graph

目标：让系统理解食谱、食材和烹饪步骤之间的关系。

实现：

- Entity Extraction。
- Entity Normalization。
- Relationship Extraction。
- Graph Construction。
- Graph Database。
- Chunk 与 Graph Node 的关联。

### Phase 5：实现 GraphRAG Hybrid Retrieval

目标：同时支持图检索、向量检索和结构化查询。

实现：

- Graph Retrieval。
- Vector Retrieval。
- SQL Retrieval。
- Hybrid Search。
- Result Fusion。
- Context Assembly。

### Phase 6：实现 Agentic RAG

目标：让 Agent 根据用户问题动态选择检索策略。

实现：

- Query Understanding。
- Intent Classification。
- Tool Selection。
- Retrieval Orchestration。
- Reranking。
- Answer Generation。
- 多轮对话上下文管理。

---

## 十二、总结

回到最初的问题：如果 Cook-RAG 项目最终采用 GraphRAG，还需要像传统 RAG 一样进行分块吗？

我的答案是：**需要，而且应该保留结构化的分块设计。**

GraphRAG 并不是要取代传统 RAG，而是让系统能够同时利用文本语义和知识实体之间的关系。

对于 Cook-RAG，我最终推荐的设计是：

| 层次       | 推荐方案                                   |
| ---------- | ------------------------------------------ |
| 原始数据   | Markdown                                   |
| 数据解析   | Structure-aware Parsing                    |
| 文本分块   | Recipe + Section + Step                    |
| 元数据     | Metadata Enrichment                        |
| 知识抽取   | Entity + Relationship Extraction           |
| 知识图谱   | Recipe + Ingredient + Step + CookingMethod |
| 图数据库   | Neo4j                                      |
| 向量检索   | pgvector                                   |
| 业务数据   | PostgreSQL                                 |
| 检索策略   | Graph + Vector + SQL Hybrid Retrieval      |
| Agent 编排 | LangGraph                                  |

其中，我认为最值得重点设计的是 Step Chunk。

因为它同时具备三个价值：

1. **文本检索价值**：可以作为独立的向量检索单元，精准回答具体烹饪操作问题。
2. **知识图谱价值**：可以对应一个 Step Node，与食材、烹饪方法和前后步骤建立关系。
3. **上下文关联价值**：可以通过 Recipe ID 找到完整食谱，避免检索结果缺乏上下文。

最终，希望 Cook-RAG 不只是一个能够通过自然语言搜索食谱的 RAG 系统，而是一个真正理解食材、食谱、烹饪步骤及其关系的烹饪知识系统。

这也是我认为 GraphRAG 和 Agentic RAG 在这个项目中最有价值的地方。
