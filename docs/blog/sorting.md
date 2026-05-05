# 排序算法

## 冒泡排序

冒泡排序每一轮把当前未排序区间中的最大值交换到末尾。

```c++
void bubbleSort(vector<int>& nums) {
    for (int i = 0; i < nums.size(); ++i) {
        bool swapped = false;
        for (int j = 0; j + 1 < nums.size() - i; ++j) {
            if (nums[j] > nums[j + 1]) {
                swap(nums[j], nums[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}
```

## 选择排序

选择排序每一轮从未排序区间中选出最小值，放到当前区间开头。

```c++
void selectSort(vector<int>& nums) {
    for (int i = 0; i + 1 < nums.size(); ++i) {
        int minIndex = i;
        for (int j = i + 1; j < nums.size(); ++j) {
            if (nums[j] < nums[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex != i) {
            swap(nums[minIndex], nums[i]);
        }
    }
}
```

## 插入排序

插入排序把当前元素插入到前面已经有序的区间中，适合数据量小或基本有序的场景。

```c++
void insertSort(vector<int>& nums) {
    for (int i = 1; i < nums.size(); ++i) {
        int value = nums[i];
        int j = i - 1;
        while (j >= 0 && nums[j] > value) {
            nums[j + 1] = nums[j];
            --j;
        }
        nums[j + 1] = value;
    }
}
```

## 快速排序

快速排序通过一趟划分把数组分成两部分：左边不大于基准值，右边不小于基准值，然后递归处理左右区间。

```c++
int partition(vector<int>& nums, int left, int right) {
    int pivot = nums[right];
    int i = left - 1;
    for (int j = left; j < right; ++j) {
        if (nums[j] <= pivot) {
            ++i;
            swap(nums[i], nums[j]);
        }
    }
    swap(nums[i + 1], nums[right]);
    return i + 1;
}

void quickSort(vector<int>& nums, int left, int right) {
    if (left >= right) {
        return;
    }
    int mid = partition(nums, left, right);
    quickSort(nums, left, mid - 1);
    quickSort(nums, mid + 1, right);
}
```

另一种双指针写法：

```c++
void quickSort(vector<int>& nums, int left, int right) {
    if (left >= right) {
        return;
    }

    int pivot = nums[left];
    int i = left;
    int j = right;

    while (i < j) {
        while (i < j && nums[j] >= pivot) {
            --j;
        }
        while (i < j && nums[i] <= pivot) {
            ++i;
        }
        if (i < j) {
            swap(nums[i], nums[j]);
        }
    }

    swap(nums[left], nums[i]);
    quickSort(nums, left, i - 1);
    quickSort(nums, i + 1, right);
}
```

## 堆排序

堆排序先建立大根堆，然后不断把堆顶最大值交换到数组末尾，再调整剩余元素。

```c++
void heapify(vector<int>& nums, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && nums[left] > nums[largest]) {
        largest = left;
    }
    if (right < n && nums[right] > nums[largest]) {
        largest = right;
    }
    if (largest != i) {
        swap(nums[i], nums[largest]);
        heapify(nums, n, largest);
    }
}

void heapSort(vector<int>& nums) {
    int n = nums.size();
    for (int i = n / 2 - 1; i >= 0; --i) {
        heapify(nums, n, i);
    }
    for (int i = n - 1; i > 0; --i) {
        swap(nums[0], nums[i]);
        heapify(nums, i, 0);
    }
}
```

## 归并排序

归并排序采用分治思想：先递归拆分数组，再把两个有序区间合并。

![Merge Sort](https://cdn.jsdelivr.net/gh/YZJss/tuchuang@main/images/sorting/merge-sort.jpeg)

```c++
vector<int> merge(const vector<int>& left, const vector<int>& right) {
    vector<int> res;
    int i = 0;
    int j = 0;

    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            res.push_back(left[i++]);
        } else {
            res.push_back(right[j++]);
        }
    }

    res.insert(res.end(), left.begin() + i, left.end());
    res.insert(res.end(), right.begin() + j, right.end());
    return res;
}

vector<int> mergeSort(vector<int>& nums) {
    if (nums.size() < 2) {
        return nums;
    }

    int mid = nums.size() / 2;
    vector<int> left(nums.begin(), nums.begin() + mid);
    vector<int> right(nums.begin() + mid, nums.end());

    return merge(mergeSort(left), mergeSort(right));
}
```

## 复杂度对比

| 排序算法 | 平均时间复杂度 | 最坏时间复杂度 | 最好时间复杂度 | 空间复杂度 | 稳定性 |
| --- | --- | --- | --- | --- | --- |
| 冒泡排序 | O(n²) | O(n²) | O(n) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(n) | O(1) | 稳定 |
| 快速排序 | O(nlogn) | O(n²) | O(nlogn) | O(logn) | 不稳定 |
| 堆排序 | O(nlogn) | O(nlogn) | O(nlogn) | O(1) | 不稳定 |
| 希尔排序 | 取决于增量序列 | 取决于增量序列 | O(n) | O(1) | 不稳定 |
| 归并排序 | O(nlogn) | O(nlogn) | O(nlogn) | O(n) | 稳定 |
| 计数排序 | O(n+k) | O(n+k) | O(n+k) | O(n+k) | 稳定 |
| 基数排序 | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n+k) | 稳定 |

时间复杂度描述的是算法运行时间随输入规模增长的变化趋势。空间复杂度描述的是算法运行过程中额外占用空间随输入规模增长的变化趋势。
