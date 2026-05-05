# STL

## 什么是 STL、STL 有哪些容器？

### STL 组成

#### 简单概括

**C++ STL 从广义上看主要包括算法、容器和迭代器。**

-   算法包括排序，拷贝等常用算法，以及不同容器特定的算法
-   容器就是数据的存放形式，包括**序列容器**和**关联式容器**
    -   序列容器：list、vector等
    -   关联容器：set、map等
-   迭代器就是在不暴露容器内部结构的情况下对容器的遍历

#### 详细说明

-   **容器：**一些封装数据结构的模板类，例如 vector 向量容器、list 列表容器等。
-   **算法：**STL 提供了非常多（大约 100 个）的数据结构算法，它们都被设计成一个个的模板函数，这些算法在 std 命名空间中定义，其中大部分算法都包含在头文件`<algorithm>` 中，少部分位于头文件 `<numeric>` 中。
-   **迭代器：**在 C++ STL 中，对容器中数据的读和写，是通过迭代器完成的，扮演着容器和算法之间的胶合剂。
-   **函数对象：**如果一个类将 () 运算符重载为成员函数，这个类就称为函数对象类，这个类的对象就是函数对象（又称仿函数）。
-   **适配器：**可以使一个类的接口（模板的参数）适配成用户指定的形式，从而让原本不能在一起工作的两个类工作在一起。值得一提的是，容器、迭代器和函数都有适配器。
-   **内存分配器：**为容器类模板提供自定义的内存申请和释放功能，由于往往只有高级用户才有改变内存分配策略的需求，因此内存分配器对于一般用户来说，并不常用。

其中**迭代器、函数对象、适配器、内存分配器**这四部分是为**容器和算法**服务的：

-   算法通过**迭代器**获取容器中的内容
-   **函数对象**可以协助算法完成各种操作
-   **适配器**用来套接适配仿函数
-   **内存分配器**给容器分配存储空间

在惠普实验室最初发行的版本中，STL 被组织成 48 个头文件；但在 C++ 标准中，它们被重新组织为 13 个头文件：

`<iterator>`

`<functional>`

`<vector>`

`<deque>`

`<list>`

`<queue>`

`<stack>`

`<set>`

`<map>`

`<algorithm>`

`<numeric>`

`<memory>`

`<utility>`

### STL 容器分类

标准库的容器分为三类：顺序容器、关联容器、容器适配器

| 分类 | 容器 | 特点 |
| --- | --- | --- |
| 顺序容器 | `array<T, N>` | 固定大小数组，支持快速随机访问，不能插入或删除元素 |
| 顺序容器 | `vector<T>` | 动态数组，支持快速随机访问，尾部插入和删除快 |
| 顺序容器 | `deque<T>` | 双端队列，支持快速随机访问，首尾插入和删除快 |
| 顺序容器 | `list<T>` | 双向链表，只支持双向顺序访问，任意位置插入和删除快 |
| 顺序容器 | `forward_list<T>` | 单向链表，只支持单向顺序访问，任意位置插入和删除快 |
| 关联容器 | `map<K, T>` / `multimap<K, T>` | 按 key 有序存储 key-value |
| 关联容器 | `set<T>` / `multiset<T>` | 按 key 有序存储元素 |
| 无序关联容器 | `unordered_map<K, T>` / `unordered_multimap<K, T>` | 基于哈希表，无序存储 key-value |
| 无序关联容器 | `unordered_set<T>` / `unordered_multiset<T>` | 基于哈希表，无序存储元素 |
| 容器适配器 | `stack<T>` / `queue<T>` / `priority_queue<T>` | 对底层容器接口进行封装 |

## vector

### 底层原理

`vector` 底层是动态数组，内存连续。常见实现中会维护三个位置：`start` 指向已用空间的开始，`finish` 指向已用空间的末尾，`end_of_storage` 指向整块已分配空间的末尾。

当空间不足以容纳新元素时，例如执行 `v.push_back(val)`，`vector` 会申请一片更大的连续空间，通常按 1.5 倍或 2 倍扩容，再把原有元素移动或拷贝到新空间，最后释放旧空间。

调用 `v.clear()` 只会清空元素，不会释放已经申请的容量。

对 `vector` 的任何操作一旦引起重新分配，原来的迭代器、指针和引用都会失效。

![Vector Capacity](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/images/stl/vector-capacity.png)

### vector中的 size 和 capacity 的区别？

-   `size` 表示当前 `vector` 中实际元素个数，即 `finish - start`。
-   `capacity` 表示已经分配的空间最多能容纳多少元素，即 `end_of_storage - start`。

### vector 中的 reserve 和 resize 的区别？

-   `reserve(n)` 只调整容量，保证 `capacity` 至少达到 `n`，不会改变已有元素个数。它常用于提前分配空间，减少多次 `push_back` 导致的扩容和拷贝。
-   `resize(n)` 会改变元素个数，也就是改变 `size`。如果新大小更大，会补充默认值或指定值；如果新大小更小，会删除多余元素。
-   `resize(n, element)` 表示扩容时用 `element` 填充新增元素。

### vector的元素类型可以是引用吗？vector如何查找一个元素？

不能。`vector` 的底层实现要求元素是可以存放在连续内存中的对象，而引用不是对象，没有独立存储空间，因此 `vector` 的元素类型不能是引用。

```cpp
find(vec.begin(),vec.end(),1);  // 查找1
```

### vector 迭代器失效的情况？

-   向 `vector` 插入元素时，如果触发扩容，原来的迭代器全部失效。
    
-   删除元素后，被删除元素及其后面元素对应的迭代器会失效。
    
    -   `erase` 会返回下一个有效迭代器，所以删除时常写成 `it = vec.erase(it)`。

```cpp
it = vec.erase(it);
```

### vector如何正确释放内存？

-   `vec.clear()`：清空元素，但不释放容量。
-   `vector<T>().swap(vec)`：用临时空 `vector` 交换，清空内容并释放原容量。
-   `vec.shrink_to_fit()`：请求容器将 `capacity` 降低到接近 `size`。
-   `vec.clear(); vec.shrink_to_fit();`：先清空元素，再请求释放容量。

### vector扩容为什么要以 1.5 或 2 倍 扩容？

以2倍方式扩容，导致下一次申请的内存必然大于之前分配的内存总和，导致之前分配的内存不能再被使用，所以最好倍增长因子设置为1和2之间，即（1,2）

$$ k\\sum^n\_{i=0}2^i = k(2^{n+1}-1)

$$

**在Win + VS 下是 1.5倍，在 Linux + GCC 下是 2 倍**

### 频繁对vector调用push\_back()对性能的影响和原因？

在 `vector` 尾部之外的位置插入元素，需要移动插入点之后的元素。向 `vector` 添加元素还可能触发扩容，扩容需要重新分配内存，并把元素从旧空间移动或拷贝到新空间，因此会影响性能。

## list

### 底层原理

-   `list` 底层是双向链表，以节点为单位存放数据。节点地址在内存中不一定连续，每次插入或删除元素时，只需要调整节点指针。
    
-   `list` 不支持随机访问，适合频繁插入、删除，但不要求按下标访问的场景。
    

![List Structure](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/images/stl/list-structure.png)

### list常用函数

```cpp
list.push_back(elem);
list.pop_back();
list.push_front(elem);
list.size();
list.sort();
list.unique();   // 移除数值相同的连续元素
list.back();     // 取尾迭代器
list.erase(it);  // 删除一个元素，返回删除元素的下一个迭代器
```

## vector 和 list 的区别是什么？

| 对比项 | `vector` | `list` |
| --- | --- | --- |
| 底层结构 | 动态数组，连续内存 | 双向链表，节点不连续 |
| 随机访问 | 支持，$O(1)$ | 不支持，访问需要遍历，$O(n)$ |
| 尾部插入 | 容量足够时 $O(1)$，扩容时需要移动或拷贝元素 | $O(1)$ |
| 中间插入 | 需要移动后续元素，$O(n)$ | 已知位置时调整指针，$O(1)$ |
| 删除元素 | 删除中间元素需要移动后续元素，$O(n)$ | 已知位置时调整指针，$O(1)$ |
| 内存特点 | 连续空间，空间不足时扩容 | 每个节点单独分配空间 |
| 适用场景 | 随机访问多，尾部插入多 | 插入删除多，随机访问少 |
    

## map、set、multiset、multimap

#### map、set、multiset、multimap 的底层原理

`map`、`set`、`multiset`、`multimap` 的底层实现通常是红黑树。红黑树是一种自平衡二叉搜索树，能够在较稳定的时间复杂度下完成查找、插入和删除。

#### 红黑树的特性：

-   每个节点是红色或黑色的
-   根节点是黑色的
-   每个叶子节点是黑色的
-   如果一个节点是红的，则它的两个儿子均是黑色的
-   **每个结点到其子孙节点NULL指针的所有路径上包含相同数目的黑色节点**

[红黑树详解：](https://www.iamshuaidi.com/2061.html)

#### map、set、multiset、multimap 的特点

`set` 和 `multiset` 会根据特定排序准则自动排序。`set` 中元素不重复，`multiset` 中元素可以重复。

`map` 和 `multimap` 将 key 和 value 组成的 `pair` 作为元素，并根据 key 自动排序。`map` 中 key 不允许重复，`multimap` 中 key 可以重复。

#### 为何map和set的插入删除效率比其他序列容器高，而且每次insert之后，以前保存的迭代器不会失效？

因为存储的是节点，不需要内存的拷贝和移动

因为关联容器插入或删除节点时，主要是调整树节点之间的指针关系，已有节点的内存位置通常不会改变。迭代器可以理解为指向节点的对象，节点地址不变时，指向该节点的迭代器也不会因为其他节点的插入而失效。

#### 为何map和set不能像vector一样有一个reserve函数来预分配数据？

因为在map和set内部存储的已经不是元素本身了，而是包含元素的节点。也就是说map内部使用的Alloc并不是map声明的时候从参数传入的Alloc.

#### map、set、multiset、multimap 常用函数？

```cpp
mp.count(key) > 0;       // 统计的是key出现的次数，只能是0或1
mp.find(key) != mp.end() //表示key存在

// 均返回迭代器
it map.begin();
it map.end();
it mp.find(k);

bool map.empty();
int map.size();
map.insert({it,string});

for (it = mp.begin();it != mp.end())
{
    if (it->second == "target")
        mp.erase(it++);
    else ++it;
}
```

### map插入方式有哪几种？

1.  用insert函数插入pair数据

```cpp
mapStudent.insert(pair<int, string>(1,"student_one"));;
```

1.  用insert函数插入value\_type数据

```cpp
mapStudent.insert(map<int,string>::value_type(1,"student_one"));
```

1.  在insert函数中使用make\_pair()函数

```cpp
mapStudent.insert(make_pair(1,"student_one"));
```

1.  用数组方式插入

```cpp
mapStudent[1] = "student_one";
```

### map中[]和find的区别是什么？

-   map的下标运算[]的作用是：将key作为下标去执行查找，并返回相应的值；如果不存在这个key，就将一个具有该key和value的键值对插入map
-   find函数是用关键字执行查找，找到了返回该位置的迭代器，如果不存在返回尾迭代器

### map 和 set 的区别

-   map中的元素是 key - value 键值对；Set则只是关键字的简单集合，set中每个元素的值都唯一。
-   set的迭代器是const的，不允许修改元素的值，而map允许修改value，但不允许修改key。
    -   原因是因为map和set是根据关键字排序来保证其有序性的。如果允许修改key 的话，那么首先需要删除该键，然后调节平衡，再插入修改后的键值，调节平衡，如此一来，严重破坏了map 和set 的结构，导致iterator 失效，不知道应该指向改变前的位置，还是指向改变后的位置。所以STL 中将set 的迭代器设置成const，不允许修改迭代器的值；而map 的迭代器则不允许修改key 值，允许修改value 值。
-   map 支持下标操作，set 不支持下标操作。map 可以用key 做下标，map 的下标运算符[ ]将关键码作为下标去执行查找，如果关键码不存在，则插入一个具有该关键码和mapped\_type类型默认值的元素至map 中。
    -   因此下标运算符[ ]在map 应用中需要慎用，const\_map 不能用，只希望确定某一个关键值是否存在而不希望插入元素时也不应该使用，mapped\_type 类型没有默认值也不应该使用。如果find 能解决需要，尽可能用find。

### 红黑树是怎么能够同时实现这两种容器？ 为什么使用红黑树？

-   它们的底层通常以红黑树实现，因此插入、删除等操作可以在 $O(\log n)$ 时间内完成。
-   在这里定义了一个模版参数，如果它是key那么它就是set，如果它是map，那么它就是map；底层是红黑树，实现map的红黑树的节点数据类型是key+value，而实现set的节点数据类型是value
-   因为map和set要求是自动排序的，红黑树能够实现这一功能，而且时间复杂度比较低。

#### 适用场景：

-   map：有序键值对不重复映射
-   set：有序不重复集合

## unordered\_map、unordered\_set

#### unordered\_map、unordered\_set 底层原理

-   `unordered_map` / `unordered_set` 的底层通常是哈希表。哈希表的优点是查找和插入平均时间复杂度接近 $O(1)$；代价是需要额外空间，并且在哈希冲突严重时性能会下降。
-   哈希表使用数组存储桶（bucket），通过哈希函数把 key 映射到桶下标。
-   不同 key 可能映射到同一个桶，这种情况称为哈希冲突，常见解决方式是开链法。

#### unordered\_map 和 map 的区别？使用场景？

-   构造条件：`unordered_map` 依赖哈希函数和相等判断；`map` 依赖比较函数。
-   存储结构：`unordered_map` 通常基于哈希表；`map` 通常基于红黑树。
-   查找效率：`unordered_map` 平均查找接近 $O(1)$；`map` 查找为 $O(\log n)$。但 `unordered_map` 需要计算哈希，也会消耗更多空间。
-   使用场景：需要有序遍历时用 `map`；主要追求快速查找且不要求有序时，可以优先考虑 `unordered_map`。

#### unordered\_map、unordered\_set 常用函数有哪些？

```cpp
unordered_map.begin();   // 起始位置迭代器
unordered_map.end();       // 末尾迭代器
unordered_map.cbegin();  // 起始位置常迭代器 const_iterator
unordered_map.cend();    // 末尾常迭代器
unordered_map.size();    // 有效元素个数
unordered_map.insert(key); // 插入元素
unordered_map.find(key);   // 查找元素，返回迭代器
unordered_map.count(key);  // 返回匹配给定主键的元素的个数
```

## deque

#### deque 的底层原理

`deque` 是双端队列，在头尾插入和删除的时间复杂度通常为 $O(1)$。

`deque` 底层通常由若干段连续数组组成。单个数组内部连续，但不同数组之间不一定连续。

`deque` 的扩展或收缩通常通过新增或释放某些内存块实现，不需要像 `vector` 那样整体搬移所有元素。

`deque` 内部会维护访问元素所需的信息，对外提供统一的随机访问接口。它的底层设计决定了以下特点：

-   ① **支持高效的双端增减操作**（因为无需移动数据）
-   ② 在首尾频繁插入删除时，通常比 `vector` 更合适。
-   ③ **不支持“指针+offset”的访问方式**（物理空间不连续）
-   ④ 当需要在首尾之外的位置频繁插入或删除元素时，`deque` 通常不如 `list` / `forward_list`。
-   ⑤ 内存连续性不如 `vector`。

#### deque常用函数

```cpp
deque.push_back(elem);
deque.pop_back();
deque.push_front(elem);
deque.pop_front();
deque.size();
deque.at(idx)  // 传回索引idx所指的数据，如果idx越界，抛出out_of_range
```

## 什么情况下用 vector、list、deque？

-   `vector` 支持随机访问，适合元素数量变化不大、随机访问频繁、尾部插入较多的场景。除非需要频繁在首部插入删除，否则优先考虑 `vector`。
    
-   `list` 不支持随机访问，适用于对象数量变化频繁、插入和删除频繁、随机访问较少的场景。
    
-   需要在首尾两端频繁插入或删除时，可以使用 `deque`。
    

## 哈希表

### hash\_map、map使用情况？

`hash_map` 查找平均接近常数级；`map` 查找是 $O(\log n)$ 级别。

-   **删除和插入操作较多的情况下，map比hash\_map的性能更好，数据量越大越明显**
-   map的遍历性能高于hash\_map，
-   hash\_map 查找性能 比map要好，数据量越大，查找次数越多，hash\_map表现就越好。

但是常数级并不一定总比 $O(\log n)$ 快，因为哈希函数本身也有计算成本。当元素达到一定数量级时，可以优先考虑哈希表；若对内存使用非常敏感，则需要谨慎选择。如何取舍主要看查找速度、数据量和内存使用。

### STL中哈希表的底层实现

Hashtable在C++的STL里占据着重要的一席之地。其中的hash\_set、hash\_map、hash\_multiset、hash\_multimap四个关联容器都是以hashtable为底层实现方法（技巧）

-   Hashtable底层实现是通过**开链法**来实现的，hash table表格内的元素称为桶（bucket)，bucket是hashtable\_node数据结构组成的链表，定义如下，通过当前节点，可以方便地通过节点自身的next指针来获取下一链表节点的元素。
    
    ```cpp
    template<class Value>
    struct __hashtable_node
    {
        __hashtable_node *next;
        Value val;
    };
    ```
    
-   **存入桶元素的容器是vector**。选择vector为存放桶元素（bucket）的基础容器，是因为vector容器本身具有动态扩容能力，无需人工干预。
    
-   在开链方法中，用于装载桶元素（bucket）的 `vector` 容器大小通常会选择合适的质数容量。当元素数量超过当前负载能力时，需要重建哈希表：创建新的 buckets，重新计算元素位置，再释放旧哈希表空间。
    

hash\_table的一些细节：

-   其迭代器没有减操作，也没有逆向迭代器。
-   不能处理 string double float等类型。

### 哈希构造函数和哈希冲突算法有哪些？

#### 哈希构造函数（记住前四个）：

-   除留余数法
    
-   直接定址法
    
-   数字分析法
-   平方取中法
-   折叠法、基数转换法、随机数法、随机乘数法、字符串数值哈希法、旋转法

#### 哈希处理冲突方法：

-   开链法
-   开放定址法
-   再哈希法

## 迭代器

#### 迭代器的底层原理

迭代器是连接容器和算法的桥梁。通过迭代器，可以在不了解容器内部实现的情况下遍历容器。

它的底层实现包含两个重要的部分：

-   萃取技术
-   模板偏特化

萃取技术（traits）可以进行类型推导，让算法根据不同迭代器类型选择不同处理流程。比如 `vector` 的迭代器是随机访问迭代器，而 `list` 的迭代器是双向迭代器。

-   例如 STL 算法库中的 `distance` 函数接收两个迭代器参数，用来计算两者之间的距离。对于 `vector` 来说，内存连续，迭代器可以直接相减，复杂度为 $O(1)$；对于 `list` 来说，只能逐个节点移动，复杂度为 $O(n)$。
-   使用萃取技术（traits）进行类型推导的过程中会使用到模板偏特化。模板偏特化可以用来推导参数，如果我们自定义多个类型，除非我们把这些自定义类型的特化版本写出来，否则我们只能判断他们是内置类型，并不能判断他们具体属于哪个类型。

```cpp
template <typename T>
struct TraitsHelper
{
  static const bool isPointer = false;
};
template <typename T>
struct TraitsHelper<T*>
{
  static const bool isPointer = true;
}

if (TraitsHelper<T>::isPointer)
   .... // 可以得出当前类型int*为指针类型
else
   .... // 可以得出当前类型int非指针类型
```

#### 迭代器的种类

-   输入迭代器：只读迭代器，每个位置通常只能读取一次。例如部分查找算法可以使用输入迭代器。
-   输出迭代器：只写迭代器，每个位置通常只能写入一次。
-   前向迭代器：兼具输入和输出能力，可以多次读写同一位置，但只能向前移动。
-   双向迭代器：在前向迭代器基础上支持向前和向后移动。
-   随机访问迭代器：支持双向迭代器的所有能力，还支持 `it + n`、`it - n`、`it += n`、`it -= n`、`it1 - it2`、`it[n]` 等随机访问操作。

#### 迭代器的失效问题

以vector为例：

**插入元素：**

1、尾后插入：size < capacity时，首迭代器不失效尾迭代失效（未重新分配空间），size == capacity时，所有迭代器均失效（需要重新分配空间）。

2、中间插入：中间插入：size < capacity时，首迭代器不失效但插入元素之后所有迭代器失效，size == capacity时，所有迭代器均失效。

**删除元素：**

尾后删除：只有尾迭代失效。

中间删除：删除位置之后所有迭代失效。

`deque` 和 `vector` 的情况类似。

`list` 是双向链表，每个节点内存不连续，删除节点时通常只有当前迭代器失效，`erase` 返回下一个有效迭代器。

`map` / `set` 等关联容器底层是红黑树，删除节点通常不会影响其他节点的迭代器，可以使用递增方式保留下一个迭代器：`mmp.erase(iter++)`。

`unordered_*` 容器在发生 `rehash` 后，迭代器通常会失效。

### 迭代器 ++ it 与 it++

-   前置（++ it）返回一个引用，后置（ it ++）返回一个对象
-   前置（++ it）不会产生临时变量，后置（ it ++）必须产生临时对象，临时对象会导致效率降低

```cpp
// 前缀形式：
int& int::operator++() //这里返回的是一个引用形式，就是说函数返回值也可以作为一个左值使用
{//函数本身无参，意味着是在自身空间内增加1的
  *this += 1;  // 增加
  return *this;  // 取回值
}

//后缀形式:函数返回值是一个非左值型的，与前缀形式的差别所在。
const int int::operator++(int)  //函数带参，说明有另外的空间开辟
{
  int oldValue = *this;  // 取回值
  ++ (*this);  // 增加
  return oldValue;  // 返回被取回的值
}
```

### 迭代器与指针的区别

-   **迭代器不是普通指针，而是表现得像指针的对象。**它通过重载 `->`、`*`、`++`、`--` 等操作符，封装了不同容器的遍历方式。迭代器可以根据容器底层结构实现不同的移动逻辑。
-   迭代器返回的是对象引用而不是对象的值，所以cout 只能输出迭代器使用`*`取值后的值而不能直接输出其自身。

## 常用算法

### 函数式编程

统计某个元素的出现次数：

```cpp
vector<int> v = {1,3,1,7,5};    // vector容器

auto n1 = std::count(          // count算法计算元素的数量 
    begin(v), end(v), 1        // begin()、end()获取容器的范围
);
```

使用就地定义函数的lambda表达式，函数式编程，统计大于2的元素个数

```cpp
auto n = std::count_if(      // count_if算法计算元素的数量
    begin(v), end(v),       // begin()、end()获取容器的范围
    [](auto x) {            // 定义一个lambda表达式
        return x > 2;       // 判断条件
    }
);                          // 大函数里面套了三个小函数
```

### 迭代器使用

容器一般会提供begin()，end()函数，但更建议使用更加通用的全局函数begin()，end()，另外还有cbegin(), rbegin()

```cpp
vector<int> v = {1,2,3,4,5};    // vector容器

auto iter1 = v.begin();        // 成员函数获取迭代器，自动类型推导
auto iter2 = v.end();

auto iter3 = std::begin(v);   // 全局函数获取迭代器，自动类型推导
auto iter4 = std::end(v);

auto iter5 = v.rbegin();     // 反向迭代器，前开后闭区间
auto iter6 = v.rend();         //

auto iter7 = v.cbegin();     // 常量迭代器，只读
```

迭代器和指针类似，也可以前进和后退，但不能假设它一定支持“++”“--”操作符，最好也要用函数来操作，常用的有这么几个：

-   distance()，计算两个迭代器之间的距离；
-   advance()，前进或者后退 N 步；
-   next()/prev()，计算迭代器前后的某个位置。

```cpp
array<int, 5> arr = {0,1,2,3,4};  // array静态数组容器

auto b = begin(arr);          // 全局函数获取迭代器，首端
auto e = end(arr);            // 全局函数获取迭代器，末端

assert(distance(b, e) == 5);  // 迭代器的距离

auto p = next(b);              // 获取“下一个”位置
assert(distance(b, p) == 1);    // 迭代器的距离
assert(distance(p, b) == -1);  // 反向计算迭代器的距离

advance(p, 2);                // 迭代器前进两个位置，指向元素'3'
assert(*p == 3);
assert(p == prev(e, 2));     // 是末端迭代器的前两个位置
```

### 排序算法

一些常见问题对应的算法：

-   要求排序后仍然保持元素的相对顺序，应该用 stable\_sort，它是稳定的；
    
-   选出前几名（TopN），应该用 partial\_sort；
    
-   选出前几名，但不要求再排出名次（BestN），应该用 nth\_element；
-   中位数（Median）、百分位数（Percentile），还是用 nth\_element；
-   按照某种规则把元素划分成两组，用 partition；
-   第一名和最后一名，用 minmax\_element。

```cpp
// top3
std::partial_sort(
    begin(v), next(begin(v), 3), end(v));  // 取前3名

// best3
std::nth_element(
    begin(v), next(begin(v), 3), end(v));  // 最好的3个

// Median
auto mid_iter =                            // 中位数的位置
    next(begin(v), v.size()/2);
std::nth_element( begin(v), mid_iter, end(v));// 排序得到中位数
cout << "median is " << *mid_iter << endl;

// partition
auto pos = std::partition(                // 找出所有大于9的数
    begin(v), end(v),
    [](const auto& x)                    // 定义一个lambda表达式
    {
        return x > 9;
    }
); 
for_each(begin(v), pos, print);         // 输出分组后的数据  

// min/max
auto value = std::minmax_element(        //找出第一名和倒数第一
    cbegin(v), cend(v)
);
```

如果是 list 容器，应该调用成员函数 sort()，它对链表结构做了特别的优化。有序容器 set/map 本身就已经排好序了，直接对迭代器做运算就可以得到结果。

### 查找算法

算法 binary\_search，顾名思义，就是在已经排好序的区间里执行二分查找。但只返回一个 bool 值，告知元素是否存在，而更多的时候是想定位到那个元素，所以 binary\_search 几乎没什么用。

```cpp
vector<int> v = {3,5,1,7,10,99,42};  // vector容器
std::sort(begin(v), end(v));        // 快速排序

auto found = binary_search(         // 二分查找，只能确定元素在不在
    cbegin(v), cend(v), 7
);
```

在已序容器上执行二分查找，要用到：**lower\_bound**，它返回第一个**“大于或等于”**值的位置：

```cpp
decltype(cend(v)) pos;            // 声明一个迭代器，使用decltype

pos = std::lower_bound(          // 找到第一个>=7的位置
    cbegin(v), cend(v), 7
);  
found = (pos != cend(v)) && (*pos == 7); // 可能找不到，所以必须要判断
assert(found);                          // 7在容器里
```

lower\_bound 的返回值是一个迭代器，所以就要做一点判断工作，才能知道是否真的找到了。判断的条件有两个，一个是迭代器是否有效，另一个是迭代器的值是不是要找的值。

lower\_bound 的查找条件是“大于等于”，而不是“等于”，所以它的真正含义是“大于等于值的第一个位置”。相应的也就有**“大于等于值的最后一个位置”**，算法叫 **upper\_bound**，返回的是第一个“大于”值的元素。

```cpp
pos = std::upper_bound(             // 找到第一个>9的位置
    cbegin(v), cend(v), 9
);
```

两者的区分可以借助一个简单的不等式：

```
begin < x <= lower_bound < upper_bound < end
```

有序容器 set/map，就不需要调用这三个算法了，它们有等价的成员函数find/lower\_bound/upper\_bound，效果是一样的。

```cpp
multiset<int> s = {3,5,1,7,7,7,10,99,42};  // multiset，允许重复

auto pos = s.find(7);                      // 二分查找，返回迭代器
assert(pos != s.end());                   // 与end()比较才能知道是否找到

auto lower_pos = s.lower_bound(7);       // 获取区间的左端点
auto upper_pos = s.upper_bound(7);       // 获取区间的右端点

for_each(                                // for_each算法
    lower_pos, upper_pos, print          // 输出7,7,7
);
```

## 其他

### vector 越界访问下标，map 越界访问下标？vector 删除元素时会不会释放空间？

1.  `vector` 通过 `operator[]` 访问元素时通常不做边界检查；如果需要边界检查，应使用 `at()`，越界时会抛出异常。
    
2.  `map` 的下标运算 `[]` 会用 key 执行查找并返回对应 value；如果 key 不存在，会插入一个具有该 key 和默认 value 的元素。
    

`erase` 只能删除元素，通常不会改变 `vector` 的容量。它删除迭代器 `it` 指向的元素，并返回被删除元素之后的下一个有效迭代器。

`clear` 只能清空内容，通常也不会改变 `capacity`。

如果想释放 `vector` 已占用的容量，可以考虑 `shrink_to_fit()` 或使用空 `vector` 交换。

### 使用有序容器插入自定义对象要怎么做？

标准库里一共有四种有序容器：set/multiset 和 map/multimap。set 是集合，map 是关联数组（在其他语言里也叫“字典”）。

因为有序容器的数量很少，所以使用的关键就是要理解它的“有序”概念，也就是说，**容器是如何判断两个元素的“先后次序”，知道了这一点，才能正确地排序。**

这就导致了有序容器与顺序容器的另一个根本区别，在定义容器的时候必须要指定 key 的比较函数。只不过这个函数通常是默认的 less，表示小于关系，不用特意写出来：

```cpp
template<
    class T                          // 模板参数只有一个元素类型
> class vector;                      // vector

template<
    class Key,                      // 模板参数是key类型，即元素类型
    class Compare = std::less<Key>  // 比较函数
> class set;                        // 集合

template<
    class Key,                      // 第一个模板参数是key类型
    class T,                        // 第二个模板参数是元素类型
    class Compare = std::less<Key>  // 比较函数
> class map;                        // 关联数组
```

C++ 里的 int、string 等基本类型都支持比较排序，放进有序容器里毫无问题。但很多自定义类型没有默认的比较函数，要作为容器的 key 就有点麻烦。

**解决这个问题有两种办法：一个是重载“<”，另一个是自定义模板参数。**

比如说我们有一个 Point 类，它是没有大小概念的，但只要给它重载“<”操作符，就可以放进有序容器里了：

```cpp
bool operator<(const Point& a, const Point& b)
{
    return a.x < b.x;            // 自定义比较运算
}

set<Point> s;                    // 现在就可以正确地放入有序容器
s.emplace(7);
s.emplace(3);
```

另一种方式是编写专门的函数对象或者 lambda 表达式，然后在容器的模板参数里指定。这种方式更灵活，而且可以实现任意的排序准则：

```cpp
set<int> s = {7, 3, 9};           // 定义集合并初始化3个元素

for(auto& x : s) {                // 范围循环输出元素
    cout << x << ",";              // 从小到大排序，3,7,9
}   

auto comp = [](auto a, auto b)  // 定义一个lambda，用来比较大小
{   
    return a > b;                // 定义大于关系
};  

set<int, decltype(comp)> gs(comp)  // 使用decltype得到lambda的类型

std::copy(begin(s), end(s),          // 拷贝算法，拷贝数据
          inserter(gs, gs.end()));  // 使用插入迭代器

for(auto& x : gs) {                // 范围循环输出元素
    cout << x << ",";                // 从大到小排序，9,7,3
}
```

### 使用无序容器插入自定义对象要怎么做？

无序容器也有四种，名字里也有 set 和 map，只是加上了 unordered（无序）前缀，分别是unordered\_set/unordered\_multiset、unordered\_map/unordered\_multimap。

无序容器虽然不要求顺序，但是对 key 的要求反而比有序容器更“苛刻”一些，例如unordered\_map 的声明：

```cpp
template<
    class Key,                          // 第一个模板参数是key类型
    class T,                            // 第二个模板参数是元素类型
    class Hash = std::hash<Key>,        // 计算散列值的函数对象
    class KeyEqual = std::equal_to<Key> // 相等比较函数
> class unordered_map;
```

**它要求 key 具备两个条件，一是可以计算 hash 值，二是能够执行相等比较操作。**

第一个是因为散列表的要求，只有计算 hash 值才能放入散列表，第二个则是因为 hash 值可能会冲突，所以当 hash 值相同时，就要比较真正的 key 值。

**与有序容器一样，要把自定义类型作为 key 放入无序容器，必须要实现这两个函数：**

-   **“==”函数 ：**可以用与“<”函数类似的方式，通过重载操作符来实现

```cpp
bool operator==(const Point& a, const Point& b)
{
    return a.x == b.x;              // 自定义相等比较运算
}
```

-   **散列函数：**可以用函数对象或者 lambda 表达式实现，内部最好调用标准的 std::hash 函数对象，而不要自己直接计算，否则很容易造成 hash 冲突：

```cpp
auto hasher = [](const auto& p)    // 定义一个lambda表达式
{
    return std::hash<int>()(p.x);  // 调用标准hash函数对象计算
};
```

有了相等函数和散列函数，自定义类型也就可以放进无序容器了：

```cpp
unordered_set<Point, decltype(hasher)> s(10, hasher);

s.emplace(7);
s.emplace(3);
```

### 容器内删除一个元素

-   **对于顺序容器 `vector`、`deque` 来说**，使用 `erase(iterator)` 后，删除位置及其后面的迭代器通常都会失效（`list` 除外），后面的元素会往前移动一个位置。`erase` 会返回下一个有效迭代器。

```cpp
int main()
{
    vector<int> v{1, 2, 3};
    for (auto it = v.begin(); it != v.end(); ++it)
        cout << *it << " ";
    auto it = v.begin() + 1;
    auto res = v.erase(it); 
    cout << endl << *res << endl;
    return 0;
}
```

输出：

```
1 2 3
3
```

-   **对于关联容器 `map`、`set` 来说**，使用 `erase(iterator)` 后，当前元素的迭代器失效，但删除当前节点通常不会影响其他节点的迭代器。可以采用 `erase(it++)` 的方式删除当前元素，同时让 `it` 指向下一个元素。
    
-   **对于 `list` 来说**，它使用不连续内存，`erase` 方法会返回下一个有效迭代器，下述两种写法均可。
    

```cpp
int main()
{
    list<int> lst{1, 2, 3, 4, 5};
    for (auto it = lst.begin(); it != lst.end(); ++it)
        cout << *it << " ";
    auto res1 = lst.erase(lst.begin());  // 写法一
    cout << endl
         << *res1 << endl;

    auto res2 = lst.begin();
    lst.erase(res2++);                   // 写法二
    cout << *res2 << endl;    
    for (auto it = lst.begin(); it != lst.end(); ++it)
        cout << *it << " ";
    return 0;
}
```

输出：

```
1 2 3 4 5 
2
3
3 4 5
```

### 如果在共享内存上使用 STL 标准库？

假设进程 A 在共享内存中放入了多个容器，进程 B 如何找到这些容器？

一种方法是进程 A 把容器放在共享内存的确定偏移位置上（fixed offsets），进程 B 从已知偏移位置获取容器。

另一种方法是，进程 A 先在共享内存某块确定位置放一个 `map` 容器，然后创建其他容器，并把容器名字和地址一并保存到这个 `map` 中。

进程 B 只需要先找到保存地址映射的 `map`，再根据名字取得其他容器的地址。
