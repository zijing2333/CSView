import{_ as n,X as s,Y as a,a2 as t}from"./framework-edbf9e3c.js";const p={},e=t(`<h3 id="手撕快排" tabindex="-1"><a class="header-anchor" href="#手撕快排" aria-hidden="true">#</a> 手撕快排</h3><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">sortArray</span><span class="token punctuation">(</span>nums <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
    <span class="token comment">// 快速排序，基于比较，不稳定算法，时间平均O(nlogn)，最坏O(n^2)，空间O(logn)</span>
	<span class="token comment">// 分治思想，选主元，依次将剩余元素的小于主元放其左侧，大的放右侧</span>
	<span class="token comment">// 然后取主元的前半部分和后半部分进行同样处理，直至各子序列剩余一个元素结束，排序完成</span>
	<span class="token comment">// 注意：</span>
	<span class="token comment">// 小规模数据(n&lt;100)，由于快排用到递归，性能不如插排</span>
	<span class="token comment">// 进行排序时，可定义阈值，小规模数据用插排，往后用快排</span>
	<span class="token comment">// golang的sort包用到了快排</span>
	<span class="token comment">// (小数，主元，大数)</span>
	<span class="token keyword">var</span> quick <span class="token keyword">func</span><span class="token punctuation">(</span>nums <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> left<span class="token punctuation">,</span> right <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span>
	quick <span class="token operator">=</span> <span class="token keyword">func</span><span class="token punctuation">(</span>nums <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> left<span class="token punctuation">,</span> right <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
		<span class="token comment">// 递归终止条件</span>
		<span class="token keyword">if</span> left <span class="token operator">&gt;</span> right <span class="token punctuation">{</span>
			<span class="token keyword">return</span> <span class="token boolean">nil</span>
		<span class="token punctuation">}</span>
		<span class="token comment">// 左右指针及主元</span>
		i<span class="token punctuation">,</span> j<span class="token punctuation">,</span> pivot <span class="token operator">:=</span> left<span class="token punctuation">,</span> right<span class="token punctuation">,</span> nums<span class="token punctuation">[</span>left<span class="token punctuation">]</span>
		<span class="token keyword">for</span> i <span class="token operator">&lt;</span> j <span class="token punctuation">{</span>
			<span class="token comment">// 寻找小于主元的右边元素</span>
			<span class="token keyword">for</span> i <span class="token operator">&lt;</span> j <span class="token operator">&amp;&amp;</span> nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">&gt;=</span> pivot <span class="token punctuation">{</span>
				j<span class="token operator">--</span>
			<span class="token punctuation">}</span>
			<span class="token comment">// 寻找大于主元的左边元素</span>
			<span class="token keyword">for</span> i <span class="token operator">&lt;</span> j <span class="token operator">&amp;&amp;</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&lt;=</span> pivot <span class="token punctuation">{</span>
				i<span class="token operator">++</span>
			<span class="token punctuation">}</span>
			<span class="token comment">// 交换i/j下标元素</span>
			nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
		<span class="token punctuation">}</span>
		<span class="token comment">// 交换元素</span>
		nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>left<span class="token punctuation">]</span> <span class="token operator">=</span> nums<span class="token punctuation">[</span>left<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
		<span class="token function">quick</span><span class="token punctuation">(</span>nums<span class="token punctuation">,</span> left<span class="token punctuation">,</span> i<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
		<span class="token function">quick</span><span class="token punctuation">(</span>nums<span class="token punctuation">,</span> i<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">,</span> right<span class="token punctuation">)</span>
		<span class="token keyword">return</span> nums
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token function">quick</span><span class="token punctuation">(</span>nums<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="手撕堆排" tabindex="-1"><a class="header-anchor" href="#手撕堆排" aria-hidden="true">#</a> 手撕堆排</h3><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">sortArray</span><span class="token punctuation">(</span>nums <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
    <span class="token comment">// 堆排序-大根堆，升序排序，基于比较交换的不稳定算法，时间O(nlogn)，空间O(1)-迭代建堆</span>
	<span class="token comment">// 遍历元素时间O(n)，堆化时间O(logn)，开始建堆次数多些，后面次数少 </span>
	<span class="token comment">// 主要思路：</span>
	<span class="token comment">// 1.建堆，从非叶子节点开始依次堆化，注意逆序，从下往上堆化</span>
	<span class="token comment">// 建堆流程：父节点与子节点比较，子节点大则交换父子节点，父节点索引更新为子节点，循环操作</span>
	<span class="token comment">// 2.尾部遍历操作，弹出元素，再次堆化</span>
	<span class="token comment">// 弹出元素排序流程：从最后节点开始，交换头尾元素，由于弹出，end--，再次对剩余数组元素建堆，循环操作</span>
	<span class="token comment">// 建堆函数，堆化</span>
	<span class="token keyword">var</span> heapify <span class="token keyword">func</span><span class="token punctuation">(</span>nums <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> root<span class="token punctuation">,</span> end <span class="token builtin">int</span><span class="token punctuation">)</span>
	heapify <span class="token operator">=</span> <span class="token keyword">func</span><span class="token punctuation">(</span>nums <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> root<span class="token punctuation">,</span> end <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token comment">// 大顶堆堆化，堆顶值小一直下沉</span>
		<span class="token keyword">for</span> <span class="token punctuation">{</span>
			<span class="token comment">// 左孩子节点索引</span>
			child <span class="token operator">:=</span> root<span class="token operator">*</span><span class="token number">2</span> <span class="token operator">+</span> <span class="token number">1</span>
			<span class="token comment">// 越界跳出</span>
			<span class="token keyword">if</span> child <span class="token operator">&gt;</span> end <span class="token punctuation">{</span>
				<span class="token keyword">return</span>
			<span class="token punctuation">}</span>
			<span class="token comment">// 比较左右孩子，取大值，否则child不用++</span>
			<span class="token keyword">if</span> child <span class="token operator">&lt;</span> end <span class="token operator">&amp;&amp;</span> nums<span class="token punctuation">[</span>child<span class="token punctuation">]</span> <span class="token operator">&lt;=</span> nums<span class="token punctuation">[</span>child<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
				child<span class="token operator">++</span>
			<span class="token punctuation">}</span>
			<span class="token comment">// 如果父节点已经大于左右孩子大值，已堆化</span>
			<span class="token keyword">if</span> nums<span class="token punctuation">[</span>root<span class="token punctuation">]</span> <span class="token operator">&gt;</span> nums<span class="token punctuation">[</span>child<span class="token punctuation">]</span> <span class="token punctuation">{</span>
				<span class="token keyword">return</span>
			<span class="token punctuation">}</span>
			<span class="token comment">// 孩子节点大值上冒</span>
			nums<span class="token punctuation">[</span>root<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>child<span class="token punctuation">]</span> <span class="token operator">=</span> nums<span class="token punctuation">[</span>child<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>root<span class="token punctuation">]</span>
			<span class="token comment">// 更新父节点到子节点，继续往下比较，不断下沉</span>
			root <span class="token operator">=</span> child
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	end <span class="token operator">:=</span> <span class="token function">len</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span>
	<span class="token comment">// 从最后一个非叶子节点开始堆化</span>
	<span class="token keyword">for</span> i<span class="token operator">:=</span>end<span class="token operator">/</span><span class="token number">2</span><span class="token punctuation">;</span>i<span class="token operator">&gt;=</span><span class="token number">0</span><span class="token punctuation">;</span>i<span class="token operator">--</span> <span class="token punctuation">{</span>
		<span class="token function">heapify</span><span class="token punctuation">(</span>nums<span class="token punctuation">,</span> i<span class="token punctuation">,</span> end<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token comment">// 依次弹出元素，然后再堆化，相当于依次把最大值放入尾部</span>
	<span class="token keyword">for</span> i<span class="token operator">:=</span>end<span class="token punctuation">;</span>i<span class="token operator">&gt;=</span><span class="token number">0</span><span class="token punctuation">;</span>i<span class="token operator">--</span> <span class="token punctuation">{</span>
		nums<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
		end<span class="token operator">--</span>
		<span class="token function">heapify</span><span class="token punctuation">(</span>nums<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> end<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> nums
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="手撕归并" tabindex="-1"><a class="header-anchor" href="#手撕归并" aria-hidden="true">#</a> 手撕归并</h3><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">//n为要排序数组的元素个数</span>
<span class="token keyword">func</span> <span class="token function">MergeSort</span><span class="token punctuation">(</span>array <span class="token operator">*</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> n <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token function">MergeSortDetail</span><span class="token punctuation">(</span>array<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> n<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
 
<span class="token comment">//l,r分别为需要排序的数组的最左、最右元素的下标</span>
<span class="token keyword">func</span> <span class="token function">MergeSortDetail</span><span class="token punctuation">(</span>array <span class="token operator">*</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> l<span class="token punctuation">,</span> r <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> l <span class="token operator">&gt;=</span> r <span class="token punctuation">{</span>
		<span class="token keyword">return</span>
	<span class="token punctuation">}</span>
	<span class="token comment">//分解过程</span>
	mid <span class="token operator">:=</span> <span class="token punctuation">(</span>r <span class="token operator">+</span> l<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span>
	<span class="token function">MergeSortDetail</span><span class="token punctuation">(</span>array<span class="token punctuation">,</span> l<span class="token punctuation">,</span> mid<span class="token punctuation">)</span>
	<span class="token function">MergeSortDetail</span><span class="token punctuation">(</span>array<span class="token punctuation">,</span> mid<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">,</span> r<span class="token punctuation">)</span>
	<span class="token comment">//合并过程</span>
	<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">*</span>array<span class="token punctuation">)</span><span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&gt;</span> <span class="token punctuation">(</span><span class="token operator">*</span>array<span class="token punctuation">)</span><span class="token punctuation">[</span>mid<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
		<span class="token function">Merge</span><span class="token punctuation">(</span>array<span class="token punctuation">,</span> l<span class="token punctuation">,</span> mid<span class="token punctuation">,</span> r<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
<span class="token keyword">func</span> <span class="token function">Merge</span><span class="token punctuation">(</span>array <span class="token operator">*</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> l<span class="token punctuation">,</span> mid<span class="token punctuation">,</span> r <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token comment">//temp为需要合并的两个数组无序合并而成的数组，方便下面遍历比较，再调整原数组的元素成有序状态</span>
	temp <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> r<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> l<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> r<span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		temp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token operator">*</span>array<span class="token punctuation">)</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span>
	<span class="token punctuation">}</span>
	<span class="token comment">//定义两个要合并的数组第一个元素的下标</span>
	i <span class="token operator">:=</span> l
	j <span class="token operator">:=</span> mid <span class="token operator">+</span> <span class="token number">1</span>
	<span class="token keyword">for</span> k <span class="token operator">:=</span> l<span class="token punctuation">;</span> k <span class="token operator">&lt;=</span> r<span class="token punctuation">;</span> k<span class="token operator">++</span> <span class="token punctuation">{</span>
		<span class="token comment">//需要合并的两个数组的下标不可以越界,设置判断条件i &gt; mid,j &gt; r</span>
		<span class="token keyword">if</span> i <span class="token operator">&gt;</span> mid <span class="token punctuation">{</span>
			<span class="token punctuation">(</span><span class="token operator">*</span>array<span class="token punctuation">)</span><span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">[</span>j<span class="token punctuation">]</span>
			j<span class="token operator">++</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> j <span class="token operator">&gt;</span> r <span class="token punctuation">{</span>
			<span class="token punctuation">(</span><span class="token operator">*</span>array<span class="token punctuation">)</span><span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
			i<span class="token operator">++</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> temp<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">&lt;</span> temp<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token punctuation">{</span>
			<span class="token punctuation">(</span><span class="token operator">*</span>array<span class="token punctuation">)</span><span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">[</span>j<span class="token punctuation">]</span>
			j<span class="token operator">++</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
			<span class="token punctuation">(</span><span class="token operator">*</span>array<span class="token punctuation">)</span><span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
			i<span class="token operator">++</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
 
<span class="token punctuation">}</span>
 
<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	array <span class="token operator">:=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token number">39</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">23</span><span class="token punctuation">,</span> <span class="token number">54</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">78</span><span class="token punctuation">,</span> <span class="token number">34</span><span class="token punctuation">,</span> <span class="token number">45</span><span class="token punctuation">,</span> <span class="token number">40</span><span class="token punctuation">}</span>
	<span class="token function">MergeSort</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>array<span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>array<span class="token punctuation">)</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> i<span class="token punctuation">,</span> v <span class="token operator">:=</span> <span class="token keyword">range</span> array <span class="token punctuation">{</span>
		fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;下标为%d的值为%d&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">,</span> v<span class="token punctuation">)</span>
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="手撕单例模式" tabindex="-1"><a class="header-anchor" href="#手撕单例模式" aria-hidden="true">#</a> 手撕单例模式</h3><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">// 懒汉式</span>
<span class="token keyword">package</span> singleton
<span class="token keyword">type</span> singleton <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">var</span> instance <span class="token operator">*</span>singleton
<span class="token keyword">func</span> <span class="token function">GetSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>singleton <span class="token punctuation">{</span>
    <span class="token keyword">if</span> instance <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        instance <span class="token operator">=</span> <span class="token operator">&amp;</span>singleton<span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> instance
<span class="token punctuation">}</span>

<span class="token comment">//	饿汉式</span>
<span class="token keyword">package</span> singleton
<span class="token keyword">type</span> singleton <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">var</span> instance <span class="token operator">*</span>singleton
<span class="token keyword">func</span> <span class="token function">GetSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>singleton <span class="token punctuation">{</span>
    <span class="token keyword">if</span> instance <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        instance <span class="token operator">=</span> <span class="token operator">&amp;</span>singleton<span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> instance
<span class="token punctuation">}</span>

<span class="token comment">// 并发单例模式</span>
<span class="token keyword">package</span> singleton
<span class="token keyword">import</span> <span class="token string">&quot;sync&quot;</span>
<span class="token keyword">type</span> singleton <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">var</span> instance <span class="token operator">*</span>singleton
<span class="token keyword">var</span> mu sync<span class="token punctuation">.</span>Mutex
<span class="token keyword">func</span> <span class="token function">GetSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>singleton <span class="token punctuation">{</span>
    mu<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">defer</span> mu<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> instance <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        instance <span class="token operator">=</span> <span class="token operator">&amp;</span>singleton<span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> instance
<span class="token punctuation">}</span>

<span class="token comment">// 双重锁定</span>
<span class="token keyword">package</span> singleton
<span class="token keyword">import</span> <span class="token string">&quot;sync&quot;</span>
<span class="token keyword">type</span> singleton <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">var</span> instance <span class="token operator">*</span>singleton
<span class="token keyword">var</span> mu sync<span class="token punctuation">.</span>Mutex
<span class="token keyword">func</span> <span class="token function">GetSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>singleton <span class="token punctuation">{</span>
    <span class="token keyword">if</span> instance <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        mu<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">defer</span> mu<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> instance <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
            instance <span class="token operator">=</span> <span class="token operator">&amp;</span>singleton<span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> instance
<span class="token punctuation">}</span>

<span class="token comment">// once写法</span>

<span class="token keyword">package</span> singleton
<span class="token keyword">import</span> <span class="token string">&quot;sync&quot;</span>
<span class="token keyword">type</span> singleton <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">var</span> instance <span class="token operator">*</span>singleton
<span class="token keyword">var</span> once sync<span class="token punctuation">.</span>Once
<span class="token keyword">func</span> <span class="token function">GetSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>singleton <span class="token punctuation">{</span>
    once<span class="token punctuation">.</span><span class="token function">Do</span><span class="token punctuation">(</span><span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        instance <span class="token operator">=</span> <span class="token operator">&amp;</span>singleton<span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> instance
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="手撕工厂模式" tabindex="-1"><a class="header-anchor" href="#手撕工厂模式" aria-hidden="true">#</a> 手撕工厂模式</h3><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> Log <span class="token keyword">interface</span> <span class="token punctuation">{</span>
	<span class="token function">set</span><span class="token punctuation">(</span>message <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>err <span class="token builtin">error</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
<span class="token keyword">type</span> dbLog <span class="token keyword">struct</span> <span class="token punctuation">{</span>

<span class="token punctuation">}</span>

<span class="token keyword">type</span> localLog <span class="token keyword">struct</span> <span class="token punctuation">{</span>

<span class="token punctuation">}</span>

<span class="token keyword">type</span> cloudLog <span class="token keyword">struct</span> <span class="token punctuation">{</span>

<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>m <span class="token operator">*</span>dbLog<span class="token punctuation">)</span> <span class="token function">writeLog</span><span class="token punctuation">(</span>log <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token punctuation">(</span>err <span class="token builtin">error</span><span class="token punctuation">)</span>  <span class="token punctuation">{</span>
	fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;把%s写入到了数据库日志&quot;</span><span class="token punctuation">,</span>log<span class="token punctuation">)</span>
	<span class="token keyword">return</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>l <span class="token operator">*</span>localLog<span class="token punctuation">)</span><span class="token function">writeLog</span><span class="token punctuation">(</span>log <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token punctuation">(</span>err <span class="token builtin">error</span><span class="token punctuation">)</span>  <span class="token punctuation">{</span>
	fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;把%s写入到了本地日志&quot;</span><span class="token punctuation">,</span>log<span class="token punctuation">)</span>
	<span class="token keyword">return</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c <span class="token operator">*</span>cloudLog<span class="token punctuation">)</span> <span class="token function">writeLog</span><span class="token punctuation">(</span>log <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>err <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;把%s写入到了云端日志&quot;</span><span class="token punctuation">,</span>log<span class="token punctuation">)</span>
	<span class="token keyword">return</span>
<span class="token punctuation">}</span>
<span class="token keyword">func</span> <span class="token function">newLog</span><span class="token punctuation">(</span>logType <span class="token builtin">string</span><span class="token punctuation">)</span> Log <span class="token punctuation">{</span>

	<span class="token keyword">switch</span> logType <span class="token punctuation">{</span>
	<span class="token keyword">case</span> <span class="token string">&quot;db&quot;</span><span class="token punctuation">:</span>
		<span class="token keyword">return</span> <span class="token operator">&amp;</span>dbLog<span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token keyword">case</span> <span class="token string">&quot;local&quot;</span><span class="token punctuation">:</span>
		<span class="token keyword">return</span> <span class="token operator">&amp;</span>localLog<span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token keyword">case</span> <span class="token string">&quot;cloud&quot;</span><span class="token punctuation">:</span>
		<span class="token keyword">return</span> <span class="token operator">&amp;</span>cloudLog<span class="token punctuation">{</span><span class="token punctuation">}</span>

	<span class="token punctuation">}</span>

	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="手撕生产者消费者" tabindex="-1"><a class="header-anchor" href="#手撕生产者消费者" aria-hidden="true">#</a> 手撕生产者消费者</h3><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">package</span> main

<span class="token comment">// 无缓冲的channel</span>

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;fmt&quot;</span>
	<span class="token string">&quot;time&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">produce</span><span class="token punctuation">(</span>ch <span class="token keyword">chan</span><span class="token operator">&lt;-</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		ch <span class="token operator">&lt;-</span> i
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Send:&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">consumer</span><span class="token punctuation">(</span>ch <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		v <span class="token operator">:=</span> <span class="token operator">&lt;-</span>ch
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Receive:&quot;</span><span class="token punctuation">,</span> v<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 因为channel没有缓冲区，所以当生产者给channel赋值后，</span>
<span class="token comment">// 生产者线程会阻塞，直到消费者线程将数据从channel中取出</span>
<span class="token comment">// 消费者第一次将数据取出后，进行下一次循环时，消费者的线程</span>
<span class="token comment">// 也会阻塞，因为生产者还没有将数据存入，这时程序会去执行</span>
<span class="token comment">// 生产者的线程。程序就这样在消费者和生产者两个线程间不断切换，直到循环结束。</span>
<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	ch <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">)</span>
	<span class="token keyword">go</span> <span class="token function">produce</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
	<span class="token keyword">go</span> <span class="token function">consumer</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
	time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">package</span> main

<span class="token comment">// 带缓冲区的channel</span>

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;fmt&quot;</span>
	<span class="token string">&quot;time&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">produce</span><span class="token punctuation">(</span>ch <span class="token keyword">chan</span><span class="token operator">&lt;-</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		ch <span class="token operator">&lt;-</span> i
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Send:&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">consumer</span><span class="token punctuation">(</span>ch <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		v <span class="token operator">:=</span> <span class="token operator">&lt;-</span>ch
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Receive:&quot;</span><span class="token punctuation">,</span> v<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	ch <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span>
	<span class="token keyword">go</span> <span class="token function">produce</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
	<span class="token keyword">go</span> <span class="token function">consumer</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
	time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),o=[e];function c(i,l){return s(),a("div",null,o)}const k=n(p,[["render",c],["__file","handtearing.html.vue"]]);export{k as default};
