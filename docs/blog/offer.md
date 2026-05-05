# 剑指 Offer

## 链表

```c++
// Definition for singly-linked list
struct ListNode{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
```

### [06\. 从尾到头打印链表](https://leetcode.cn/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/?favorite=xb9nqhhg)

方法一：使用栈

```c++
class Solution {
public:
    vector<int> reversePrint(ListNode* head){
        ListNode *p=head;
        stack<int> a;
        vector<int> b;
        while(p!=nullptr){
            a.push(p->val);
            p = p->next;
        }
        while(!a.empty()){
            b.push_back(a.top());
            a.pop();
        }
        return b;
    }
};
```

方法二：递归

```c++
class Solution {
public:
    vector<int> a;
    vector<int> reversePrint(ListNode* head){
        if (head!=nullptr){
            if(head->next!=nullptr){
                reversePrint(head->next);
            }
            a.push_back(head->val);
        }
        return a;
    }
};
```

### [18\. 删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    ListNode* deleteNode(ListNode* head, int val) {
        ListNode *p = new ListNode;
        p->next=head;
        ListNode *cur = p;
        while(cur!=nullptr &&cur->next!=nullptr){
            if(cur->next->val == val){
                cur->next=cur->next->next;
            }
            cur=cur->next;
        }
        return p->next;
    }
};
```

### [22\. 链表中倒数第k个节点](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/?favorite=xb9nqhhg)

方法一：先统计链表长度

```c++
class Solution {
public:
    ListNode* getKthFromEnd(ListNode* head, int k) {
        int l = 0;
        ListNode *p=head;
        ListNode *q=head;
        while(p!=nullptr){
            l++;
            p=p->next;
        }
        for(int i =0;i<l-k;i++){
            q=q->next;
        }
        return q;
    }
};
```

方法二：快慢指针。`p` 先走 `k` 步，然后 `p`、`q` 同时向后移动，直到 `p` 走到链表尾部，返回 `q`。

```c++
class Solution {
public:
    ListNode* getKthFromEnd(ListNode* head, int k) {
        ListNode *p = head;
        ListNode *q = head;
        for(int i=0;i<k;i++){
            p=p->next;
        }
        while(p!=nullptr){
            p=p->next;
            q=q->next;
        }
        return q;
    }
};
```

### [24\. 反转链表](https://leetcode.cn/problems/fan-zhuan-lian-biao-lcof/?favorite=xb9nqhhg)

方法一：双指针

```c++
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *p=nullptr;
        ListNode *q=head;
        while(q!=nullptr){
            ListNode *t = q->next;
            q->next=p;
            p=q;
            q=t;
        }
        return p;
    }
};
```

方法二：递归

```c++
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        return recur(head, nullptr);           // 调用递归并返回
    }
private:
    ListNode* recur(ListNode* cur, ListNode* pre) {
        if (cur == nullptr) return pre;        // 终止条件
        ListNode* res = recur(cur->next, cur); // 递归后继节点
        cur->next = pre;                       // 修改节点引用指向
        return res;                            // 返回反转链表的头节点
    }
};
```

### [25\. 合并两个排序的链表](https://leetcode.cn/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode *d=new ListNode();
        ListNode *a=d;
        while(l1!=nullptr && l2!=nullptr){
            if(l1->val>l2->val){
                a->next=l2;
                l2=l2->next;
            }
            else{
                a->next=l1;
                l1=l1->next;
            }
            a=a->next;
        }
        if(l1==nullptr){
            a->next=l2;
            return d->next;
        }
        else{
            a->next=l1;
            return d->next;
        }
    }
};
```

### [35\. 复杂链表的复制](https://leetcode.cn/problems/fu-za-lian-biao-de-fu-zhi-lcof/?favorite=xb9nqhhg)

使用哈希表保存原节点到新节点的映射。

```c++
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(head==nullptr){
            return head;
        }
        unordered_map<Node*,Node*> ma;
        Node *p=head;
        while(p!=nullptr){
            ma[p]=new Node(p->val);
            p=p->next;
        }
        p=head;
        while(p!=nullptr){
            ma[p]->next=ma[p->next];
            ma[p]->random=ma[p->random];
            p=p->next;
        }
        return ma[head];
    }
};
```

### [52\. 两个链表的第一个公共节点](https://leetcode.cn/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/?favorite=xb9nqhhg)

使用哈希集合记录链表 A 的所有节点，再遍历链表 B，遇到第一个已经出现过的节点时返回。

```c++
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        unordered_set<ListNode*> se;
        ListNode *p = headA;
        while(p!=nullptr){
            se.insert(p);
            p=p->next;
        }
        ListNode *q = headB;
        while(q!=nullptr){
            if(se.find(q)!=se.end()){
                return q;
            }  
            q=q->next;
        }
        return nullptr;
    }
};
```

## 二叉树

```c++
// Definition for a binary tree node
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
```

### 二叉树的前中后序遍历

对应题号：144、94、145。

```c++
class Solution {
public:
    void preorder(TreeNode *root, vector<int> &res) {
        if (root == nullptr) {
            return;
        }
        res.push_back(root->val);        // 位置 前中后
        preorder(root->left, res);  //左节点
        preorder(root->right, res); //右节点
    }

    vector<int> preorderTraversal(TreeNode *root) {
        vector<int> res;
        preorder(root, res);
        return res;
    }
};
```

### [07\. 重建二叉树](https://leetcode.cn/problems/zhong-jian-er-cha-shu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        this->preorder=preorder;
        for(int i=0;i<inorder.size();i++){
            ma[inorder[i]]=i;
        }
        return build(0,0,inorder.size()-1);
    }
private:
    unordered_map<int,int> ma;
    vector<int> preorder;
    //root 根节点在先序遍历中的索引 left 子树在中序遍历的左边界 right 子树在中序遍历的右边界
    TreeNode* build(int root,int left,int right){
        if(left>right)  return nullptr;
        TreeNode *node=new TreeNode(preorder[root]);
        int i=ma[preorder[root]];   // 根节点在中序遍历的索引位置
        node->left=build(root+1,left,i-1);  // 左子树
        node->right=build(root+i-left+1,i+1,right);       // 右子树
        return node;
    }
};
```

### [26\. 树的子结构](https://leetcode.cn/problems/shu-de-zi-jie-gou-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    bool isSubStructure(TreeNode* A, TreeNode* B) {
        return (A!=nullptr && B!=nullptr) && (digui(A,B) || isSubStructure(A->left,B) || isSubStructure(A->right,B));
    }
    bool digui(TreeNode* A, TreeNode* B){
        if(B==nullptr)  return true;
        if(A==nullptr || A->val != B->val)  return false;
        return digui(A->left,B->left) && digui(A->right,B->right);
    }
};
```

### [27\. 二叉树的镜像](https://leetcode.cn/problems/er-cha-shu-de-jing-xiang-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    TreeNode* mirrorTree(TreeNode* root) {
        digui(root);
        return root;
    }
    void digui(TreeNode *root){
        if(root==nullptr){
            return;
        }
        TreeNode *tmp=root->left;
        root->left=root->right;
        root->right=tmp;
        digui(root->left);
        digui(root->right);
    }
};
```

### [28\. 对称的二叉树](https://leetcode.cn/problems/dui-cheng-de-er-cha-shu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        if(root == nullptr) return true;
        return digui(root->left,root->right);
    }
    bool digui(TreeNode *a,TreeNode *b){
        if((a==nullptr && b==nullptr))    
            return true;
        if(a==nullptr || b==nullptr || a->val!=b->val)   return false;
        return digui(a->left,b->right) && digui(b->left,a->right);
    }
};
```

### [32 - I. 从上到下打印二叉树](https://leetcode.cn/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/?favorite=xb9nqhhg)

层序遍历 BFS（广度优先搜索），queue+vector 解决。

```c++
class Solution {
public:
    vector<int> levelOrder(TreeNode* root) {
        vector<int> res;
        if(root==nullptr)
            return res;
        queue<TreeNode*> q;
        q.push(root);
        while(q.size()){
            TreeNode* node=q.front();
            res.push_back(node->val);
            q.pop();
            if(node->left!=nullptr)
                q.push(node->left);
            if(node->right!=nullptr)
                q.push(node->right);
        }
        return res;
    }
};
```

### [32 - II. 从上到下打印二叉树](https://leetcode.cn/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> a;
        queue<TreeNode*> q;
        if(root==nullptr)   return a;
        q.push(root);
        while(q.size()){
            int s=q.size();
            vector<int> b;
            for(int i=0;i<s;i++){
                TreeNode* t=q.front();
                b.push_back(t->val);
                q.pop();
                if(t->left!=nullptr) q.push(t->left);
                if(t->right!=nullptr) q.push(t->right);
            }
            a.push_back(b);      
        }
        return a;
    }
};
```

### [32 - III. 从上到下打印二叉树](https://leetcode.cn/problems/cong-shang-dao-xia-da-yin-er-cha-shu-iii-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        int cnt=1;
        vector<vector<int>> a;
        queue<TreeNode*> q;
        if(root==nullptr)   return a;
        q.push(root);
        while(q.size()){
            int s=q.size();
            vector<int> b;
            for(int i=0;i<s;i++){     
                TreeNode* t=q.front();
                b.push_back(t->val);
                q.pop();
                if(t->left!=nullptr) q.push(t->left);
                if(t->right!=nullptr) q.push(t->right);         
            }
            if(cnt%2==0)    reverse(b.begin(),b.end());
            cnt++;
            a.push_back(b);      
        }
        return a;
    }
};
```

### [33\. 二叉搜索树的后序遍历序列](https://leetcode.cn/problems/er-cha-sou-suo-shu-de-hou-xu-bian-li-xu-lie-lcof/?favorite=xb9nqhhg)

后序遍历的最后一个元素是根节点。先找到第一个大于根节点的位置，用它划分左右子树，再递归判断左右子树是否都满足二叉搜索树性质。

```c++
class Solution {
public:
    bool verifyPostorder(vector<int>& postorder) {
        return digui(postorder,0,postorder.size()-1);
    }
    bool digui(vector<int>& postorder,int i,int j){
        if(i>=j)    return true;
        int p=i;
        while(postorder[p]<postorder[j])    p++;
        int m=p;
        while(postorder[p]>postorder[j])    p++;
        return p==j && digui(postorder,i,m-1) &&digui(postorder,m,j-1);
    }
};
```

### [34\. 二叉树中和为某一值的路径](https://leetcode.cn/problems/er-cha-shu-zhong-he-wei-mou-yi-zhi-de-lu-jing-lcof/?favorite=xb9nqhhg)

回溯法：

1.  某一种可能情况向前探索，并生成一个子节点。
2.  过程中，一旦发现原来的选择不符合要求，就**回溯**至父亲结点，然后重新选择另一方向，再次生成子结点，继续向前探索。
3.  如此反复进行，直至求得最优解。

```c++
class Solution {
public:
    vector<vector<int>> pathSum(TreeNode* root, int target) {
        recur(root, target);
        return res;
    }
private:
    vector<vector<int>> res;
    vector<int> path;
    void recur(TreeNode *root, int tar) {
        if (root == nullptr) return;
        path.push_back(root->val);
        tar -= root->val;
        if (tar == 0 && root->left == nullptr && root->right == nullptr) {
            res.push_back(path);
        }
        recur(root->left, tar);
        recur(root->right, tar);
        path.pop_back();
    }
};
```

### [36\. 二叉搜索树与双向链表](https://leetcode.cn/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/?favorite=xb9nqhhg)

二叉搜索树的中序遍历为 **递增序列**

```c++
// right 指向下一个节点，left 指向上一个节点
class Solution {
public:
    Node* treeToDoublyList(Node* root) {
        if(root==nullptr)   return nullptr;
        digui(root);
        head->left=pre;
        pre->right=head;
        return head;      
    }
private:
    Node *pre,*head;
    void digui(Node* cur){
        if(cur==nullptr)   return;
        digui(cur->left);
        if(pre==nullptr)
            head=cur;
        else{
            pre->right=cur;
        }
        cur->left=pre;
        pre=cur;
        digui(cur->right);
    }
};
```

### [37\. 序列化二叉树](https://leetcode.cn/problems/xu-lie-hua-er-cha-shu-lcof/?favorite=xb9nqhhg)

思路：可以使用层序遍历，把空节点也用特殊标记保存下来；反序列化时再按顺序恢复左右孩子。

### [54\. 二叉搜索树的第k大节点](https://leetcode.cn/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    vector<int> a;
    int kthLargest(TreeNode* root, int k) {
        digui(root);
        return a[k-1];
    }
    void digui(TreeNode* root){
        if(root==nullptr)   return;
        digui(root->right);
        a.push_back(root->val);
        digui(root->left);
    }
};
```

### [55 - I. 二叉树的深度](https://leetcode.cn/problems/er-cha-shu-de-shen-du-lcof/?favorite=xb9nqhhg)

![Offer 55 1](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/images/offer/offer-55-1.png)

```c++
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if(root==nullptr)  return 0; 
        return max(maxDepth(root->left),maxDepth(root->right))+1;
    }
};
```

### [55 - II. 平衡二叉树](https://leetcode.cn/problems/ping-heng-er-cha-shu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    bool isBalanced(TreeNode* root) {
        if(root==nullptr)   return true;
        return abs(digui(root->left) - digui(root->right)) < 2 && isBalanced(root->left) && isBalanced(root->right);

    }
    int digui(TreeNode *root){
        if(root==nullptr)   return 0;
        return max(digui(root->left),digui(root->right))+1;
    }
};
```

### [68 - I. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/er-cha-sou-suo-shu-de-zui-jin-gong-gong-zu-xian-lcof/?favorite=xb9nqhhg)

```c++
// 分三种情况：都在左子树、都在右子树、分别位于左右子树
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if(p->val > root->val &&q->val>root->val){
            return lowestCommonAncestor(root->right,p,q);
        }
        if(p->val < root->val &&q->val<root->val){
            return lowestCommonAncestor(root->left,p,q);
        }
        return root;    
    }
};
```

### [68 - II. 二叉树的最近公共祖先](https://leetcode.cn/problems/er-cha-shu-de-zui-jin-gong-gong-zu-xian-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if(root == nullptr || root == p || root == q) return root;
        TreeNode *left = lowestCommonAncestor(root->left, p, q);
        TreeNode *right = lowestCommonAncestor(root->right, p, q);
        if(left == nullptr && right == nullptr) return nullptr; // 1.
        if(left == nullptr) return right; // 3.
        if(right == nullptr) return left; // 4.
        return root; // left 和 right 都不为空，说明当前节点是最近公共祖先
    }
};
```

## 栈和队列

### [09\. 用两个栈实现队列](https://leetcode.cn/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/?favorite=xb9nqhhg)

```c++
class CQueue {
public:
    CQueue() {
    }
    void in2out(){
        while(!s1.empty()){
            s2.push(s1.top());
            s1.pop();
        }
    }
    void appendTail(int value) {
        s1.push(value);
    }
    int deleteHead() {
        if(s2.empty()){
            if(s1.empty()){
                return -1;
            }
            in2out();
        }
        int v = s2.top();
        s2.pop();
        return v;
    }
private:
    stack<int> s1;
    stack<int> s2;
};
```

### [30\. 包含min函数的栈](https://leetcode.cn/problems/bao-han-minhan-shu-de-zhan-lcof/?favorite=xb9nqhhg)

```c++
class MinStack {
public:
    MinStack() {
        smin.push(INT_MAX);
    }
    void push(int x) {
        s.push(x);
        if(x<=smin.top()){
            smin.push(x);
        }
    }
    void pop() {
        if(s.top()== smin.top()){
            smin.pop();         
        }
        s.pop();
    }
    int top() {
        return s.top();
    }
    int min() {
        return smin.top();
    }
private:
    stack<int> s;
    stack<int> smin;
};
```

### [31\. 栈的压入、弹出序列](https://leetcode.cn/problems/zhan-de-ya-ru-dan-chu-xu-lie-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {
        stack<int> s;
        int i =0;
        for(int a: pushed){
            s.push(a);
            while(!s.empty() && s.top() == popped[i]){
                s.pop();
                i++;
            }
        }
        return s.empty();
    }
};
```

### [58 - I. 翻转单词顺序](https://leetcode.cn/problems/fan-zhuan-dan-ci-shun-xu-lcof/?favorite=xb9nqhhg)

可以使用字符串流按单词读取，再逆序拼接。

```c++
class Solution {
public:
    string reverseWords(string s) {
        stringstream iss(s);
        string ret="";
        string str;
        while(getline(iss,str,' '))
        {
            if(str!="")
            {
                if(ret=="")
                    ret=str;
                else
                    ret=str+" "+ret;
            }
        }
        return ret;
    }
};
```

### [59 - I. 滑动窗口的最大值](https://leetcode.cn/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/?favorite=xb9nqhhg)

思路：维护一个单调递减队列，队首始终是当前窗口最大值。

### [59 - II. 队列的最大值](https://leetcode.cn/problems/dui-lie-de-zui-da-zhi-lcof/?favorite=xb9nqhhg)

```c++
class MaxQueue {
public:
    MaxQueue() { }
    int max_value() {
        return deq.empty() ? -1 : deq.front();
    }
    void push_back(int value) {
        que.push(value);
        while(!deq.empty() && deq.back() < value)
            deq.pop_back();
        deq.push_back(value);
    }
    int pop_front() {
        if(que.empty()) return -1;
        int val = que.front();
        if(val == deq.front())
            deq.pop_front();
        que.pop();
        return val;
    }
private:
    queue<int> que;
    deque<int> deq;
};
```

## 堆

### [40\. 最小的k个数](https://leetcode.cn/problems/zui-xiao-de-kge-shu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    void quicksort(vector<int> &a, int low,int high){
        if(low<high){
            int base=a[low];
            int m=low;
            int n=high+1;
            while(1){
                while(m<high && a[++m]<=base);
                while(n>low && a[--n]>=base);
                if(m<n){
                    swap(a[m],a[n]);
                }
                else break;
            }
            swap(a[n],a[low]);
            quicksort(a,low,n-1);
            quicksort(a,n+1,high);
        }
    }
    vector<int> getLeastNumbers(vector<int>& arr, int k) {
        quicksort(arr,0,arr.size()-1);
        vector<int> res;
        for(int i=0;i<k;i++){
            res.push_back(arr[i]);
        }
        return res;
    } 
};
```

### [41\. 数据流中的中位数](https://leetcode.cn/problems/shu-ju-liu-zhong-de-zhong-wei-shu-lcof/?favorite=xb9nqhhg)

思路：维护两个堆，一个大根堆保存较小的一半，一个小根堆保存较大的一半。

## 字符串

### [19\. 正则表达式匹配](https://leetcode.cn/problems/zheng-ze-biao-da-shi-pi-pei-lcof/?favorite=xb9nqhhg)

思路：动态规划。`*` 可以匹配零个或多个前面的字符，状态转移时需要分别讨论。

### [20\. 表示数值的字符串](https://leetcode.cn/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
private:
    // 整数的格式可以用[+|-]B表示, 其中B为无符号整数
    bool scanInteger(const string s, int& index){
        if(s[index] == '+' || s[index] == '-')
            ++index;
        return scanUnsignedInteger(s, index);
    }
    bool scanUnsignedInteger(const string s, int& index){
        int befor = index;
        while(index != s.size() && s[index] >= '0' && s[index] <= '9')
            index ++;
        return index > befor;
    }
public:
    // 数字的格式可以用A[.[B]][e|EC]或者.B[e|EC]表示，
    // 其中A和C都是整数（可以有正负号，也可以没有），而B是一个无符号整数
    bool isNumber(string s) {
        if(s.size() == 0)
            return false;
        int index = 0;
        //字符串开始有空格，可以返回true
        while(s[index] == ' ')  //书中代码没有该项测试
            ++index;
        bool numeric = scanInteger(s, index);
        // 如果出现'.'，接下来是数字的小数部分
        if(s[index] == '.'){
            ++index;
            // 下面一行代码用||的原因：
            // 1. 小数可以没有整数部分，例如.123等于0.123；
            // 2. 小数点后面可以没有数字，例如233.等于233.0；
            // 3. 当然小数点前面和后面可以有数字，例如233.666
            numeric = scanUnsignedInteger(s, index) || numeric;
        }
        // 如果出现'e'或者'E'，接下来跟着的是数字的指数部分
        if(s[index] == 'e' || s[index] == 'E'){
            ++index;
            // 下面一行代码用&&的原因：
            // 1. 当e或E前面没有数字时，整个字符串不能表示数字，例如.e1、e1；
            // 2. 当e或E后面没有整数时，整个字符串不能表示数字，例如12e、12e+5.4
            numeric = numeric && scanInteger(s ,index);
        }
        //字符串结尾有空格，可以返回true
        while(s[index] == ' ')
            ++index;
        cout << s.size() << " " << index;   //调试用
        return numeric && index == s.size();
    }
};
```

### [58 - II. 左旋转字符串](https://leetcode.cn/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/?favorite=xb9nqhhg)

与189. 轮转数组相同

```c++
// nums = "----->-->"; n =5 result = "-->----->";
// reverse "----->-->" we can get "<--<-----"
// reverse "<--" we can get "--><-----" (0,k-n)
// reverse "<-----" we can get "-->----->" (k-n,k)
class Solution {
public:
    string reverseLeftWords(string s, int n) {
        int k=s.size();
        reverse(s.begin(),s.end());
        reverse(s.begin(),s.begin()+k-n);
        reverse(s.begin()+k-n,s.end());
        return s;
    }
};
```

### [67\. 把字符串转换成整数](https://leetcode.cn/problems/ba-zi-fu-chuan-zhuan-huan-cheng-zheng-shu-lcof/?favorite=xb9nqhhg)

状态机

```c++
class Solution {
public:
    int strToInt(string str) {
        int border=INT_MAX/10;
        //1、去除空格
        int i=0;
        while(i<str.size()&&str[i]==' ')
            i++;
        //2、判断符号 并定位第一个数字的位置
        bool sign=0;
        if(str[i]=='-') sign=1;
        if(str[i]=='-'||str[i]=='+')  ++i;
        //3、开始数字拼接  注意遇到字母直接break
        int ans=0;
        for(int j=i;j<str.size();++j){
            if(!isdigit(str[j]))    //——字母
                break;
            else if(j==i)           //——第一个数字
                ans=str[j]-'0';
            else{                   //——后面连续数字
                //4、判断是否出界
                if(ans>border|| (ans==border && str[j]>'7'))
                    return sign?INT_MIN:INT_MAX;
                //！！！这里注意先作str[j]-'0'  不然直接加ASCI码出界报错
                ans=ans*10+(str[j]-'0');
            }
        }
        //5、根据符号判断返回值为正数还是负数
        return sign?ans*-1:ans;
    }
};
```

## 哈希表

### [50\. 第一个只出现一次的字符](https://leetcode.cn/problems/di-yi-ge-zhi-chu-xian-yi-ci-de-zi-fu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    char firstUniqChar(string s) {
        unordered_map<char,int> ma;
        for(char x:s){
            ma[x]++;
        }
        for(char x: s){
            if(ma[x]==1)    return x;
        }
        return ' ';
    }
};
```

### [56 - II. 数组中数字出现的次数II](https://leetcode.cn/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-ii-lcof/?favorite=xb9nqhhg)

异或？

```c++
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        map<int,int> ma;
        for(auto x:nums){
            ma[x]++;
        }
        for(auto x: ma){
            if(x.second==1){
                return x.first;
            }
        }
        return -1;
    }
};
```

### [57\. 和为s的两个数字](https://leetcode.cn/problems/he-wei-sde-liang-ge-shu-zi-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int i=0,j=nums.size()-1;
        while(i<j){
            if(nums[i]+nums[j]>target){
                j--;
            }
            else if(nums[i]+nums[j]<target){
                i++;
            }
            else if(nums[i]+nums[j]==target)
                return{nums[i],nums[j]};
        }
        return {};
    }
};
```

## 位运算

### [15\. 二进制中1的个数](https://leetcode.cn/problems/er-jin-zhi-zhong-1de-ge-shu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int hammingWeight(uint32_t n) {
        int res=0;
        while(n){
            res+=n&1;
            n=n>>1;
        }
        return res;
    }
};
```

### [56 - I. 数组中数字出现的次数I](https://leetcode.cn/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-lcof/?favorite=xb9nqhhg)

异或 异为1 同为0

0^0=0，0^1=1 0异或任何数＝任何数

1^0=1，1^1=0 1异或任何数=任何数取反

任何数异或自己＝把自己置0

```c++
class Solution {
public:
    vector<int> singleNumbers(vector<int>& nums) {
        int x = 0, y = 0, n = 0, m = 1;
        for(int num : nums)         // 1. 遍历异或
            n ^= num;
        //n =x^y
        while((n & m) == 0)         // 2. 循环左移，计算 m
            m <<= 1;
        for(int num : nums) {       // 3. 遍历 nums 分组
            if(num & m) x ^= num;   // 4. 当 num & m != 0
            else y ^= num;          // 4. 当 num & m == 0
        }
        return vector<int> {x, y};  // 5. 返回出现一次的数字
    }
};
```

### [64\. 求1+2+…+n](https://leetcode.cn/problems/qiu-12n-lcof/?favorite=xb9nqhhg)

利用逻辑运算符的短路效应和递归。

```c++
if(A && B)  // 若 A 为 false ，则 B 的判断不会执行（即短路），直接判定 A && B 为 false 
if(A || B) // 若 A 为 true ，则 B 的判断不会执行（即短路），直接判定 A || B 为 true
```

```c++
class Solution {
public:
    int res=0;
    int sumNums(int n) {
        bool x=n>1 && sumNums(n-1);
        res+=n;
        return res;
    }
};
```

### [65\. 不用加减乘除做加法](https://leetcode.cn/problems/bu-yong-jia-jian-cheng-chu-zuo-jia-fa-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int add(int a, int b) {
//因为不允许用+号，所以求出异或部分和进位部分依然不能用+ 号，所以只能循环到没有进位为止        
        while(b!=0)
        {
//保存进位值，下次循环用
            int c=(unsigned int)(a&b)<<1;//C++中负数不支持左移位，因为结果是不定的
//保存不进位值，下次循环用，
            a^=b;
//如果还有进位，再循环，如果没有，则直接输出没有进位部分即可。
            b=c;   
        }
        return a;
    }
};
```

## 图

### [12\. 矩阵中的路径](https://leetcode.cn/problems/ju-zhen-zhong-de-lu-jing-lcof/?favorite=xb9nqhhg)

回溯 + DFS。

```c++
class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        rows = board.size();
        cols = board[0].size();
        for(int i = 0; i < rows; i++) {
            for(int j = 0; j < cols; j++) {
                if(dfs(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }
private:
    int rows, cols;
    bool dfs(vector<vector<char>>& board, string word, int i, int j, int k) {
        if(i >= rows || i < 0 || j >= cols || j < 0 || board[i][j] != word[k]) return false;
        if(k == word.size() - 1) return true;
        board[i][j] = '\0'; // 防止回头路
        bool res = dfs(board, word, i + 1, j, k + 1) || dfs(board, word, i - 1, j, k + 1) || 
                      dfs(board, word, i, j + 1, k + 1) || dfs(board, word, i , j - 1, k + 1);
        board[i][j] = word[k];  // 回溯
        return res;
    }
};
```

### [13\. 机器人的运动范围](https://leetcode.cn/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/?favorite=xb9nqhhg)

## 动态规划

给定一个问题，把它拆成一个个子问题，直到子问题可以直接解决。然后把子问题答案保存起来，以减少重复计算。再根据子问题答案反推，得出原问题解的一种方法。

### [10- I. 斐波那契数列](https://leetcode.cn/problems/fei-bo-na-qi-shu-lie-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int fib(int n) {
        if(n == 0)  return 0;
        vector<long long> dp(n+1);
        dp[0]=0;
        dp[1]=1;
        for(int i =2;i<n+1;i++){
            dp[i]=(dp[i-1]+dp[i-2])%1000000007;
        }
        return dp[n];
    }
};
```

### [10- II. 青蛙跳台阶问题](https://leetcode.cn/problems/qing-wa-tiao-tai-jie-wen-ti-lcof/?favorite=xb9nqhhg)

```
n-1个台阶有f(n-1)种跳法，最后还剩一个台阶，最后青蛙只能最后一跳
n-2个台阶有f(n-2)种跳法，最后剩余二个台阶，有两种跳法：
       ①一次跳两个台阶
       ②一次跳一个台阶  但是这种跳法其实已经在n-1个台阶里包含了，所以
 f(n)=f(n-1)+f(n-2)
```

```c++
class Solution {
public:
    int numWays(int n) {
        if(n==0)    return 1;
        if(n==1)    return 1;
        vector<long long> dp(n+1);
        dp[0]=1;
        dp[1]=1;
        for(int i=2;i<n+1;i++){
            dp[i]=dp[i-1]+dp[i-2];
            dp[i]%=1000000007;
        }
        return dp[n];
    }
};
```

### [14- I. 剪绳子](https://leetcode.cn/problems/jian-sheng-zi-lcof/?favorite=xb9nqhhg)

```c++
// 当所有绳段长度相等时，乘积最大
// 最优的绳段长度为3
// j*(i-j) 两段 dp[j]*(i-j) >2段
class Solution {
public:
    int cuttingRope(int n) {
        vector<int> dp(n+1);
        dp[1]=1;
        for(int i=2;i<n+1;i++){ //当前状态
            for(int j=1;j<i;j++){   //前一个状态
                int t=max(dp[j]*(i-j),j*(i-j));
                dp[i]=max(dp[i],t);
            }
        }
        return dp[n];
    }
};
```

### [14- II. 剪绳子 II](https://leetcode.cn/problems/jian-sheng-zi-ii-lcof/?favorite=xb9nqhhg)

更适合使用数学方法处理。尽量把绳子拆成长度为 3 的段，乘积通常最大。

```c++
// 循环取余
class Solution {
public:
    int cuttingRope(int n) {
        if(n<4){
            return n-1;
        }
        int b=n%3,p=1000000007;
        long ret=1;
        int linenums=n/3;
        for(int i=1;i<linenums;i++){
            ret=3*ret%p;
        }
        if(b==0)
            return (int)(ret*3%p);
        if(b==1)
            return (int)(ret * 4 % p);
        return (int)(ret * 6 % p);

    }
};
```

### [39\. 数组中出现次数超过一半的数字](https://leetcode.cn/problems/shu-zu-zhong-chu-xian-ci-shu-chao-guo-yi-ban-de-shu-zi-lcof/?favorite=xb9nqhhg)

这题常用哈希表计数或摩尔投票法，不属于典型动态规划问题。

```c++
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        unordered_map<int,int> hash;
        int res = 0, len = nums.size();
        for(int i = 0; i < len; i++){
            hash[nums[i]]++;
            //不必等到哈希表完全建立再进行此判断
            if(hash[nums[i]] > len/2)
                res = nums[i];
        }
        return res;
    }
};
```

### [42\. 连续子数组的最大和](https://leetcode.cn/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int pre=0,maxans=nums[0];
        for(auto x: nums){
            pre=max(pre+x,x);
            maxans=max(maxans,pre);
        }
        return maxans;
    }
};
```

### [46\. 把数字翻译成字符串](https://leetcode.cn/problems/ba-shu-zi-fan-yi-cheng-zi-fu-chuan-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int translateNum(int num) {
        string src = to_string(num);
        int len =src.size();
        vector<int> dp(len+1);
        dp[0] =1;
        dp[1] =1;
        for(int i = 2; i<len+1;i++){
            string tmp = src.substr(i-2,2);
            dp[i] = (tmp<="25" && tmp>="10") ? dp[i-1]+dp[i-2]:dp[i-1];      
        }
        return dp[len];
    }
};
```

### [47\. 礼物的最大价值](https://leetcode.cn/problems/li-wu-de-zui-da-jie-zhi-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int maxValue(vector<vector<int>>& grid) {
        int m=grid.size();
        int n=grid[0].size();
        vector<vector<int>> dp(m+1,vector<int>(n+1,0));
        for(int i=1;i<m+1;i++){
            for(int j=1;j<n+1;j++){
                dp[i][j]=max(dp[i-1][j],dp[i][j-1])+grid[i-1][j-1];
            }
        }
        return dp[m][n];
    }
};
```

### [60\. n个骰子的点数](https://leetcode.cn/problems/nge-tou-zi-de-dian-shu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    vector<double> dicesProbability(int n) {
        vector<double> dp(6, 1.0 / 6.0);
        for (int i = 2; i <= n; i++) {
            vector<double> tmp(5 * i + 1, 0);
            for (int j = 0; j < dp.size(); j++) {
                for (int k = 0; k < 6; k++) {
                    tmp[j + k] += dp[j] / 6.0;
                }
            }
            dp = tmp;
        }
        return dp;
    }
};
```

### [63\. 股票的最大利润](https://leetcode.cn/problems/gu-piao-de-zui-da-li-run-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int maxProfit(vector<int>& nums) {
        if (!nums.size())   return 0;
        int res = 0;
        int minValue = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] < minValue) {
                minValue = nums[i];
                continue;
            }
            res = max(res, nums[i] - minValue);
        }
        return res;
    }
};
```

## 贪心

### [45\. 把数组排成最小的数](https://leetcode.cn/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof/?favorite=xb9nqhhg)

```c++
// x+y>y+x 则 x “大于” y ；
// x+y<y+x 则 x “小于” y ；
// x “小于” y 代表：排序完成后，数组中 x 应在 y 左边；“大于” 则反之。
class Solution {
public:
    string minNumber(vector<int>& nums) {
        vector<string> strs;
        for(int i=0;i<nums.size();i++){
            strs.push_back(to_string(nums[i]));
        }
        quicksort(strs,0,strs.size()-1);
        string res;
        for(auto s:strs){
            res.append(s);
        }
        return res;
    }
private:
    void quicksort(vector<string> &strs, int l,int r){
        if(l<r){
            int i=l,j=r;
            while(i<j){
                while(strs[j]+strs[l] >= strs[l]+strs[j] && i<j)    j--;
                while(strs[i] + strs[l] <= strs[l] + strs[i] && i < j) i++;
                swap(strs[i], strs[j]);
            }
            swap(strs[i], strs[l]);
            quicksort(strs, l, i - 1);
            quicksort(strs, i + 1, r);
        }
    }
};
```

## 查找

### [04\. 二维数组中的查找](https://leetcode.cn/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/?favorite=xb9nqhhg)

法一：二分查找

```c++
class Solution {
public:
    bool findNumberIn2DArray(vector<vector<int>>& matrix, int target) {
        for (int i = 0; i < matrix.size(); i++){
            int a = 0, b = matrix[i].size()-1;
            while (a<=b){
                int mid = a+(b-a)/2;
                if (matrix[i][mid]== target)    
                    return true;
                else if(matrix[i][mid] > target)    
                    b = mid-1;
                else
                    a = mid+1;
            }
        }
        return false;
    }
};
```

法二：

![Offer 04](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/images/offer/offer-04.png)

```c++
class Solution {
public:
    bool findNumberIn2DArray(vector<vector<int>>& matrix, int target) {
        int i = matrix.size() - 1, j = 0;
        while(i >= 0 && j < matrix[0].size())
        {
            if(matrix[i][j] > target) i--;
            else if(matrix[i][j] < target) j++;
            else return true;
        }
        return false;
    }
};
```

### [53 - I. 在排序数组中查找数字I](https://leetcode.cn/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int search(vector<int>& nums, int target) {
        unordered_map<int,int> ma;
        for(auto x: nums){
            ma[x]++;
        }
        auto m=ma.find(target);
        if(m!=ma.end()){
            return m->second;
        }
        return 0;
    }
};
```

### [53 - II. 0～n-1中缺失的数](https://leetcode.cn/problems/que-shi-de-shu-zi-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int missingNumber(vector<int>& nums) {
        if(nums[0]==1)  return 0;
        for(int i=0;i<nums.size();i++){
            if(nums[i]!=i)   return i;
        }
        return nums.size();
    }
};
```

## 双指针

### [21\. 调整数组顺序使奇数位于偶数前面](https://leetcode.cn/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/?favorite=xb9nqhhg)

```c++
// 参考快排
// 指针i从左向右寻找偶数；
// 指针j从右向左寻找奇数；
// 将偶数nums[i]和奇数 nums[j]交换。
class Solution {
public:
    vector<int> exchange(vector<int>& nums)
    {
        int i = 0, j = nums.size() - 1;
        while (i < j)
        {
            while(i < j && (nums[i] & 1) == 1) i++;
            while(i < j && (nums[j] & 1) == 0) j--;
            swap(nums[i], nums[j]);
        }
        return nums;
    }
};
```

### [48\. 最长不含重复字符的子字符串](https://leetcode.cn/problems/zui-chang-bu-han-zhong-fu-zi-fu-de-zi-zi-fu-chuan-lcof/?favorite=xb9nqhhg)

哈希表 + 动态规划

```c++
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int n = s.size();
        if(n==0) return 0;
        vector<int> dp(n,0);//dp[i] :包含第i个数的最长不重复数量
        dp[0]=1;
        unordered_map<char,int> map;//下标key为字符，值value为该字符的位置。 比如“ab” 的map为 map[a]=0 map[b]=1
        map[s[0]] = 0;
        for(int i = 1; i<n; i++)
        {
            /**** 没记录过上一个位置，说明第一次出现 肯定可以连接dp[i-1] *********/
            if(map.find(s[i]) == map.end() )
            {
                dp[i] = dp[i-1] +1;
            }
            else
            /*****记录过上一个位置。它有两种可能（1）在dp[i-1]的范围外。（2）在dp[i-1]里面 **********/
            {
                if(dp[i-1]<i-map[s[i]])//上一个位置不在dp[i-1]范围内 ，可以直接连起来
                {
                    dp[i] = dp[i-1] +1;
                }
            else
                dp[i]= i -map[s[i]];//上一个位置在dp[i-1]范围内 ，则长度 = 这个位置-上一个位置
            }
        map[s[i]] = i;//记录位置
        }
        return *max_element(dp.begin(),dp.end());
    }
};
```

哈希表 + 双指针

### [57 - II. 和为s的连续正数序列](https://leetcode.cn/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/?favorite=xb9nqhhg)

滑动窗口

```c++
class Solution {
public:
    vector<vector<int>> findContinuousSequence(int target) {
        int i = 1, j = 2, s = 3;
        vector<vector<int>> res;
        while(i < j) {
            if(s == target) {
                vector<int> ans;
                for(int k = i; k <= j; k++)
                    ans.push_back(k);
                res.push_back(ans);
            }
            if(s > target) {
                s -= i;
                i++;
            } else {
                j++;
                s += j;
            }
        }
        return res;
    }
};
```

## 回溯

### [38\. 字符串的排列](https://leetcode.cn/problems/zi-fu-chuan-de-pai-lie-lcof/?favorite=xb9nqhhg)

？？？？？？

## 数学

### [17\. 打印从1到最大的n位数](https://leetcode.cn/problems/da-yin-cong-1dao-zui-da-de-nwei-shu-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    vector<int> printNumbers(int n) {
        vector<int> res;
        int i = 1;
        int maxi = pow(10,n);
        while(i < maxi){
            res.push_back(i);
            i++;
        }
        return res;
    }
};
```

### [43\. 1～n 整数中 1 出现的次数](https://leetcode.cn/problems/1nzheng-shu-zhong-1chu-xian-de-ci-shu-lcof/?favorite=xb9nqhhg)

思路：按位数分段统计，先确定目标数字所在的位数区间，再定位具体数字和具体位。

### [44\. 数字序列中某一位的数字](https://leetcode.cn/problems/shu-zi-xu-lie-zhong-mou-yi-wei-de-shu-zi-lcof/?favorite=xb9nqhhg)

找规律题

### [49\. 丑数](https://leetcode.cn/problems/chou-shu-lcof/?favorite=xb9nqhhg)

### [61\. 扑克牌中的顺子](https://leetcode.cn/problems/bu-ke-pai-zhong-de-shun-zi-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    bool isStraight(vector<int>& nums) {
        set<int> repeat;
        int max = 0, min = 14;
        for(int num:nums) {
            if(num == 0) continue; // 跳过大小王
            max = max > num?max:num; // 最大牌 max(max, num)
            min = min < num?min:num; // 最小牌 min(min, num)
            if(repeat.find(num)!=repeat.end()) return false; // 若有重复，提前返回 false
            repeat.insert(num); // 添加此牌至 Set
        }
        return max - min < 5; // 最大牌 - 最小牌 < 5 则可构成顺子
    }
};
```

### [62\. 圆圈中最后剩下的数字](https://leetcode.cn/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof/?favorite=xb9nqhhg)

约瑟夫环 背

```c++
class Solution {
public:
    int lastRemaining(int n, int m) {
        int x = 0;
        for (int i = 2; i <= n; i++) {
            x = (x + m) % i;
        }
        return x;
    }
};
```

## 其他

### [03\. 数组中重复的数字](https://leetcode.cn/problems/shu-zu-zhong-zhong-fu-de-shu-zi-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int findRepeatNumber(vector<int>& nums) {
        unordered_map<int,bool> ma;
        for(auto x: nums){
            if(ma[x])   return x;
            ma[x]=true;
        }
        return -1;
    }
};
```

```c++
class Solution {
public:
    int findRepeatNumber(vector<int>& nums) {
        int i=0;
        while(i<nums.size()){
            if(nums[i]==i){
            i++;
            continue;
            }
            if(nums[i]==nums[nums[i]])  return nums[i];
            swap(nums[i],nums[nums[i]]);
        }
        return -1;
    }
};
```

### [05\. 替换空格](https://leetcode.cn/problems/ti-huan-kong-ge-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    string replaceSpace(string s) {
        int count=0,len=s.size();
        for(auto x: s){
            if(x==' ')  count++;
        }
        s.resize(len + 2*count);
        for(int i=len-1,j=s.size()-1;i<j;j--,i--){
            if(s[i]!=' '){
                s[j]=s[i];
            }
            else{
                s[j-2]='%';
                s[j-1]='2';
                s[j]='0';
                j=j-2;
            }
        }
        return s;
    }
};
```

### [11\. 旋转数组的最小数字](https://leetcode.cn/problems/xuan-zhuan-shu-zu-de-zui-xiao-shu-zi-lcof/?favorite=xb9nqhhg)

```c++
class Solution {
public:
    int minArray(vector<int>& nums) {
        int i=0,j=nums.size()-1;
        while(i<j){
            int m=i+j>>1;
            if(nums[j]>nums[m]){
                j=m;
            }
            else if(nums[j]<nums[m]){
                i=m+1;
            }
            else{
                j--;//需要证明
            }
        }
        return nums[i];
    }
};
```

### [16\. 数值的整数次方](https://leetcode.cn/problems/shu-zhi-de-zheng-shu-ci-fang-lcof/?favorite=xb9nqhhg)

快速幂？

```c++
class Solution {
public:
    double myPow(double x, int n) {
        bool flag = false;
        long long N = n;
        if (N == 0) return 1;
        if (N < 0) flag = true, N = -N;
        double ret = 1;
        for (int i = 0; i < 32; ++i) {
            if ((1 << i) & N) ret *= x;
            x = x * x;
        }
        if (flag) return 1.0 / ret;
        else return ret;
    }
};
```

### [29\. 顺时针打印矩阵](https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/?favorite=xb9nqhhg)

```c++
class Solution 
{
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) 
    {
        if (matrix.empty()) return {};
        vector<int> res;
        int l = 0;                      //左边界
        int r = matrix[0].size() - 1;   //右边界
        int t = 0;                      //上边界
        int b = matrix.size() - 1;      //下边界
        while (true)
        {
            //left -> right
            for (int i = l; i <= r; i++) res.push_back(matrix[t][i]);
            if (++t > b) break;
            //top -> bottom
            for (int i = t; i <= b; i++) res.push_back(matrix[i][r]);
            if (--r < l) break;
            //right -> left
            for (int i = r; i >= l; i--) res.push_back(matrix[b][i]);
            if (--b < t) break;
            //bottom -> top
            for (int i = b; i >= t; i--) res.push_back(matrix[i][l]);
            if (++l > r) break;
        }
        return res;
    }
};
```

### [51\. 数组中的逆序对](https://leetcode.cn/problems/shu-zu-zhong-de-ni-xu-dui-lcof/?favorite=xb9nqhhg)

归并排序

### [66\. 构建乘积数组](https://leetcode.cn/problems/gou-jian-cheng-ji-shu-zu-lcof/?favorite=xb9nqhhg)

？

```c++
class Solution {
public:
    vector<int> constructArr(vector<int>& a) {
        int len = a.size();
        if(len == 0) return {};
        vector<int> b(len, 1);
        b[0] = 1;
        int tmp = 1;
        for(int i = 1; i < len; i++) {  // 下三角
            b[i] = b[i - 1] * a[i - 1];
        }
        for(int i = len - 2; i >= 0; i--) { // 上三角
            tmp *= a[i + 1];
            b[i] *= tmp;
        }
        return b;
    }
};
```

### 树

**二叉排序/搜索/查找树**

（1）若左子树不空，则左子树上所有结点的值均小于它的根节点的值；

（2）若右子树不空，则右子树所有结点的值均大于或等于它的根结点的值；

（3）左、右子树也分别为二叉排序树

**平衡二叉树**

它是一棵空树或它的左右两个子树的高度差（称为平衡因子）不大于1的二叉排序树，并且左右两个子树都是一棵平衡二叉树。

**AVL 平衡二叉查找树**

**红黑树**（Red-Black Tree）是一种自平衡的二叉搜索树（Binary Search Tree）。它在每个节点上增加了一个额外的存储位来表示节点的颜色，可以是红色或黑色。通过一些特定的规则和操作，红黑树保持了以下性质：

1.  每个节点要么是红色，要么是黑色。
2.  根节点是黑色的。
3.  每个叶子节点（空节点）是黑色的。
4.  如果一个节点是红色的，那么它的两个子节点都是黑色的。
5.  对于每个节点，从该节点到其所有后代叶子节点的简单路径上，均包含相同数量的黑色节点。
    
    Java 中的 TreeMap，JDK 1.8 中的 HashMap、C++ STL 中的 map 均是基于红黑树结构实现。
    
