### [43.字符串相乘](https://leetcode.cn/problems/multiply-strings)

> 给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。
>
> 注意：不能使用任何内置的 BigInteger 库或直接将输入转换为整数。
>

```go
func multiply(num1 string, num2 string) string {
	if num1 == "0" || num2 == "0" {return "0"}
	arr := make([]int, len(num1)+len(num2))
	for i:=len(num2)-1;i>=0;i-- {
		n2 := int(num2[i]-'0')
		for j:=len(num1)-1;j>=0;j-- {
			n1 := int(num1[j]-'0')
			sum := n1 * n2 + arr[i+j+1]
			arr[i+j+1] = sum % 10
			arr[i+j] += sum / 10
		}
	}
	res := ""
	for i:=len(arr)-1;i>=0;i-- {
		if i == 0 && arr[i] == 0 {
			break
		} 
        res = strconv.Itoa(arr[i]) + res
		
	}
	return res
}
```



### [8.字符串转换整数 (atoi)](https://leetcode.cn/problems/string-to-integer-atoi)

> 请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C/C++ 中的 atoi 函数）。
>
> 函数 myAtoi(string s) 的算法如下：
>
> 读入字符串并丢弃无用的前导空格
> 检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有）。 确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
> 读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
> 将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32）。如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
> 如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被固定为 −231 ，大于 231 − 1 的整数应该被固定为 231 − 1 。
> 返回整数作为最终结果。

```go
func myAtoi(s string) int {
    if s == "" {
        return 0
    }
    i, n := 0, len(s)
    for i < n-1 {
        if s[i] == ' ' {
            i++
        } else {
            break
        }   
    }
    s0 := s[i:]
    if s[i] == '-' || s[i] == '+' {
        s = s[i+1:]
    } else if s[i] >= '0' && s[i] <= '9'{
        s = s[i:]    
    } else {
        return 0
    }
    num := 0
    for _, ch := range []byte(s) {
        ch -= '0'
        if ch > 9 || ch < 0 {
            break
        }
   
        num = num * 10 + int(ch)
        if num >= 1<<31 {
			num = 1<<31
            break
		}
    }
    if s0[0] == '-' {
        num = -num
    } else {
        if num >= 1 << 31 - 1 {
            num = 1 << 31 - 1
        }
    }
    
return num    
}
```



### [3.无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

> 给定一个字符串s，请你找出其中不含有重复字符的最长子串的长度。
>

**解题思路**：这道题的思路是**滑动窗口或双指针**，窗口内维持的是内部没有出现重复字符，我们可用一个hash表保存窗口内最长无重复子串中出现字符的下标，如果滑动到一个新的r碰到在窗口内出现的字符，那么l肯定就要往前滑动到之前出现的字符下标的下一位来保证l到r之间没有重复出现的字符。算法复杂度O(n)。

::: code-tabs

@tab cpp

```cpp
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> hash;
        int n = s.size();
        int l = 0;
        int ans = 0;
        for(int r = 0; r < n; r++) {
            if(hash.count(s[r])) {
                int last = hash[s[r]];
                for(int j = l; j <= last; j++) {
                    hash.erase(s[j]);
                }
                l = last + 1;
            }
            hash[s[r]] = r;
            ans = max(ans, r - l + 1);
        }
        return ans;
    }
```

@tab go

```go
func lengthOfLongestSubstring(s string) int {
    hashmap := make(map[byte]int)
    maxLen := 0
    left := 0 
    for i:=0;i<len(s);i++{
        if _,ok:=hashmap[s[i]];ok{
            left = max(left,hashmap[s[i]]+1)
        }
        hashmap[s[i]] = i
        maxLen = max(maxLen,i-left+1)
    } 
    return maxLen
}

func max(a,b int)int{
    if a>b{
        return a
    }
    return b
}
```

:::

### [5.最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

> 给你一个字符串 `s`，找到 `s` 中最长的回文子串。
>

**解题思路**：

- 可以考虑回文串的性质，首先是长度为奇数的回文串，我们可以确定中间数，然后从中间数往左右扩张，当扩不动了就说明找到了以该数为中心的最长回文串；对于长度为偶数的，我们看似没法处理，但其实我们只要给每个数之间插上特殊字符，这样偶数长度的回文串也可以扩充了。
- 所以思路就是先给字符串每个空插上特殊字符，然后遍历这个字符串的每一位，向两边扩得到当前位置为中心的最长回文串，然后取最大的。时间复杂度O(n^2)，空间复杂度O(n)。

::: code-tabs

@tab cpp

```cpp
    string longestPalindrome(string s) {
        string s1 = "*";
        for(int i = 0; i < s.size(); i++) {
            s1.push_back(s[i]);
            s1.push_back('*');
        }
        string ans = "";
        int al = 0, ar = 0;
        for(int i = 0; i < s1.size(); i++) {
            int l = i, r = i;
            while(l >= 0 && r < s1.size() && s1[l] == s1[r]) {
                l--;
                r++;
            }
            int t = r - l + 1;
            if(t > ar - al + 1) {
                al = l + 1;
                ar = r - 1;
            }
        }
        for(int i = al;i <= ar; i++) {
            if(s1[i] != '*') {
                ans.push_back(s1[i]);                
            }
        }
        return ans;
    }
```

@tab golang

```go
func longestPalindrome(s string) string {
    res := ""
    for i:=0;i<len(s);i++{
        s1 := isPalding(s,i,i)
        s2 := isPalding(s,i,i+1)
        if len(s1)>len(res){
            res = s1
        }
        if len(s2)>len(res){
            res = s2
        }
    }
    return res
}

func isPalding(s string,left,right int)string{
    for left>=0&&right<len(s)&&s[left]==s[right]{
        left--
        right++
    }
    return s[left+1:right]
}
```

:::

### [415.字符串相加](https://leetcode.cn/problems/add-strings/)

> 给定两个字符串形式的非负整数 `num1` 和`num2` ，计算它们的和并同样以字符串形式返回。
>

```go
func addStrings(num1 string, num2 string) string {
    res := ""
    i,j := len(num1)-1,len(num2)-1
    n1,n2,sum,carry := 0,0,0,0
    for i>=0||j>=0{
       n1, n2 = 0, 0
		if i >= 0 {
			n1 = int(num1[i]-'0')
		}
		if j >= 0 {
			n2 = int(num2[j]-'0')
		}
		sum = n1 + n2 + carry
		carry = sum / 10
		res = strconv.Itoa(sum%10) + res
		i--
		j--
    }
    if carry > 0 {
		return "1" + res
	}
	return res
}
```



### [76.最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

> 给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中涵盖 `t` 所有字符的最小子串。如果 `s` 中不存在涵盖 `t` 所有字符的子串，则返回空字符串 `""` 。
>

```go
func minWindow(s string, t string) string {
	left, right := 0, 0
	need := make(map[byte]int)
	window := make(map[byte]int)
	for _, c := range t {
		need[byte(c)]++
	}
	valid := 0
	// 记录最小覆盖子串的起始索引及长度
	start, lenr := 0, math.MaxInt64
	for right < len(s) {
		// c 是将移入窗口的字符
		c := byte(s[right])
		// 右移窗口
		right++
		// 进行窗口内数据的一系列更新
		if _, ok := need[c]; ok {
			window[c]++
			if window[c] == need[c] {
				valid++
			}
		}
		// 判断左侧窗口是否要收缩
		for valid == len(need) {
			if right-left < lenr {
				start = left
				lenr = right - left
			}
            		// d 是将移出窗口的字符
		d := byte(s[left])
		// 左移窗口
		left++
		// 进行窗口内数据的一系列更新
		if _, ok := need[d]; ok {
			if window[d] == need[d] {
				valid--
			}
			window[d]--
		}
		}
	}
	if lenr == math.MaxInt64 {
		return ""
	}
	// 返回最小覆盖子串
	return s[start : lenr+start]
}
```



### [165.比较版本号](https://leetcode.cn/problems/compare-version-numbers)

> 给你两个版本号 version1 和 version2 ，请你比较它们。
>
> 版本号由一个或多个修订号组成，各修订号由一个 '.' 连接。每个修订号由 多位数字 组成，可能包含 前导零 。每个版本号至少包含一个字符。修订号从左到右编号，下标从 0 开始，最左边的修订号下标为 0 ，下一个修订号下标为 1 ，以此类推。例如，2.5.33 和 0.1 都是有效的版本号。
>
> 比较版本号时，请按从左到右的顺序依次比较它们的修订号。比较修订号时，只需比较 忽略任何前导零后的整数值 。也就是说，修订号 1 和修订号 001 相等 。如果版本号没有指定某个下标处的修订号，则该修订号视为 0 。例如，版本 1.0 小于版本 1.1 ，因为它们下标为 0 的修订号相同，而下标为 1 的修订号分别为 0 和 1 ，0 < 1 。
>
> 返回规则如下：
>
> 如果 version1 > version2 返回 1，
> 如果 version1 < version2 返回 -1，
> 除此之外返回 0。

```go
import "strings"
import "strconv"
func compareVersion(version1 string, version2 string) int {
    demo1 := strings.Split(version1,".")
    demo2 := strings.Split(version2,".")
    len1 := len(demo1)
    len2 := len(demo2)
    for i:=0;i<len1||i<len2;i++{
        x,y := 0,0
        if i<len1{
            x,_= strconv.Atoi(demo1[i])
        }
        if i<len2{
            y,_= strconv.Atoi(demo2[i])
        }
        if x>y{
            return 1
        }
        if x<y{
           return -1 
        }
    }
    return 0 
}
```



### [151.反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/)

> 给你一个字符串 s ，请你反转字符串中 单词 的顺序。
>
> 单词 是由非空格字符组成的字符串。s 中使用至少一个空格将字符串中的 单词 分隔开。
>
> 返回 单词 顺序颠倒且 单词 之间用单个空格连接的结果字符串。
>
> 注意：输入字符串 s中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。
>

```go
func reverseWords(s string) string {
     list :=  strings.Split(s ," ")
     var res []string
     for i:=len(list)-1;i>=0;i--{
     	if len(list[i])>0{
     		res = append(res,list[i])
		}
	 }
	 s =strings.Join(res," ")
	 return s
}
```



### [14.最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/)

> 编写一个函数来查找字符串数组中的最长公共前缀。
>
> 如果不存在公共前缀，返回空字符串 `""`。

```go
type DictTreeNode struct {
	depth int
	next  []*DictTreeNode
}

func newDictTreeNode() *DictTreeNode {
	return &DictTreeNode{next: make([]*DictTreeNode, 26)}
}

type DictTree struct {
	root *DictTreeNode
}

func (t *DictTree) insert(str string) {
	cur := t.root
	for _, ch := range str {
		if cur.next[ch-'a'] == nil {
			cur.next[ch-'a'] = newDictTreeNode()
			cur.next[ch-'a'].depth = cur.depth + 1
		}
		cur = cur.next[ch-'a']
	}
}

func (t *DictTree) prefixMatch(str string) int {
	cur := t.root
	for i := 0; i < len(str) && cur.next[str[i]-'a'] != nil; i++ {
		cur = cur.next[str[i]-'a']
	}
	return cur.depth
}

func longestCommonPrefix(strs []string) string {
	tree := &DictTree{root: newDictTreeNode()}

	tree.insert(strs[0])
	length := len(strs[0])

	for _, str := range strs {
		length = min(length, tree.prefixMatch(str))
	}
	return strs[0][:length]
}

func min(a, b int) int {
	if a > b {
		return b
	}
	return a
}
```



### [394.字符串解码](https://leetcode.cn/problems/decode-string)

> 给定一个经过编码的字符串，返回它解码后的字符串。
>
> 编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
>
> 你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。
>
> 此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。
>

```go
func decodeString(s string) string {
	numStack := []int{}
	strStack := []string{}
	num := 0
	result := ""
	for _, char := range s {
		if char >= '0' && char <= '9' {
			n, _ := strconv.Atoi(string(char))
			num = num*10 + n
		} else if char == '[' {
			strStack = append(strStack, result)
			result = ""
			numStack = append(numStack, num)
			num = 0
		} else if char == ']' {
			count := numStack[len(numStack)-1]
			numStack = numStack[:len(numStack)-1]
			str := strStack[len(strStack)-1]
			strStack = strStack[:len(strStack)-1]
			result = string(str) + strings.Repeat(result, count)
		} else {
			result += string(char)
		}
	}
	return result
}
```



### [93.复原IP地址](https://leetcode.cn/problems/restore-ip-addresses)

> 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
>
> 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。
> 给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入 '.' 来形成。你 不能 重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。

```go
func restoreIpAddresses(s string) []string {
	res := []string{}
	var dfs func(subRes []string, start int)

	dfs = func(subRes []string, start int) {
		if len(subRes) == 4 && start == len(s) {
			res = append(res, strings.Join(subRes, "."))
			return
		}
		if len(subRes) == 4 && start < len(s) {
			return
		}
		for length := 1; length <= 3; length++ {
			if start+length-1 >= len(s) {
				return
			}
			if length != 1 && s[start] == '0' {
				return
			}
			str := s[start : start+length]
			if n, _ := strconv.Atoi(str); n > 255 {
				return
			}
			subRes = append(subRes, str)
			dfs(subRes, start+length)
			subRes = subRes[:len(subRes)-1]
		}
	}
	dfs([]string{}, 0)
	return res
}
```



### [468.验证IP地址](https://leetcode.cn/problems/validate-ip-address/)

> 给定一个字符串 queryIP。如果是有效的 IPv4 地址，返回 "IPv4" ；如果是有效的 IPv6 地址，返回 "IPv6" ；如果不是上述类型的 IP 地址，返回 "Neither" 。
>
> 有效的IPv4地址 是 “x1.x2.x3.x4” 形式的IP地址。 其中 0 <= xi <= 255 且 xi 不能包含 前导零。例如: “192.168.1.1” 、 “192.168.1.0” 为有效IPv4地址， “192.168.01.1” 为无效IPv4地址; “192.168.1.00” 、 “192.168@1.1” 为无效IPv4地址。
>
> 一个有效的IPv6地址 是一个格式为“x1:x2:x3:x4:x5:x6:x7:x8” 的IP地址，其中:1 <= xi.length <= 4
> xi 是一个 十六进制字符串 ，可以包含数字、小写英文字母( 'a' 到 'f' )和大写英文字母( 'A' 到 'F' )。
> 在 xi 中允许前导零。
> 例如 "2001:0db8:85a3:0000:0000:8a2e:0370:7334" 和 "2001:db8:85a3:0:0:8A2E:0370:7334" 是有效的 IPv6 地址，而 "2001:0db8:85a3::8A2E:037j:7334" 和 "02001:0db8:85a3:0000:0000:8a2e:0370:7334" 是无效的 IPv6 地址。

```go
func validIPAddress(queryIP string) string {
    isIPv4 := func(arr []string) bool {
        if len(arr) != 4 {
            return false
        }
        for _, ip := range arr {
            if len(ip) < 1 || len(ip) > 3 {
                return false
            }
            ipNum, _ := strconv.Atoi(ip)
            if ipNum > 255 || len(ip) != len(strconv.Itoa(ipNum)) {
                return false
            }
        }
        return true
    }
    isIPv6 := func(arr []string) bool {
        if len(arr) != 8 {
            return false
        }
        for _, ip := range arr {
            if len(ip) < 1 || len(ip) > 4 {
                return false
            }
            for _, ch := range ip {
                if !(ch >= '0' && ch <= '9') && !(ch >= 'a' && ch <= 'f' || ch >= 'A' && ch <= 'F') {
                    return false
                }
            }
        }
        return true
    }

    if strings.Contains(queryIP, ".") {
        arr := strings.SplitN(queryIP, ".", -1)
        if !isIPv4(arr) {
            return "Neither"
        }
        return "IPv4"
    }
    arr := strings.SplitN(queryIP, ":", -1)
    if !isIPv6(arr) {
        return "Neither"
    }
    return "IPv6"
}
```

