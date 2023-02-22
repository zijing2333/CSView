### [20.有效的括号](https://leetcode.cn/problems/valid-parentheses)

> 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
>
> 有效字符串需满足：
>
> 左括号必须用相同类型的右括号闭合。
> 左括号必须以正确的顺序闭合。
> 每个右括号都有一个对应的相同类型的左括号。

```go
func isValid(s string) bool {
    stack := make([]byte,0)
    for i:=0;i<len(s);i++{
        if s[i]=='('||s[i]=='{'||s[i]=='['{
            stack = append(stack,s[i])
        }
        if s[i]==')'{
            if len(stack)<1||stack[len(stack)-1]!='('{
                return false
            }else{
                stack = stack[:len(stack)-1]
            }
        }  
        if s[i]==']'{
            if len(stack)<1||stack[len(stack)-1]!='['{
                return false
            }else{
                stack = stack[:len(stack)-1]
            }
        }  
        if s[i]=='}'{
            if len(stack)<1||stack[len(stack)-1]!='{'{
                return false
            }else{
                stack = stack[:len(stack)-1]
            }
        }  
    }
    return len(stack)==0
}
```

------



### [232.用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

> 请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（push、pop、peek、empty）：
>
> 实现MyQueue类：
>
> - void push(int x) 将元素 x 推到队列的末尾
>
> - int pop() 从队列的开头移除并返回元素
> - int peek() 返回队列开头的元素
> - boolean empty() 如果队列为空，返回 true ；否则，返回 false
>
> 说明：
>
> 你只能使用标准的栈操作 —— 也就是只有push to top, peek/pop from top, size, 和 is empty操作是合法的。
> 你所使用的语言也许不支持栈。你可以使用list或者deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。

```go
typeMyQueue struct {
	stackPush, stackPop []int
}

func Constructor() MyQueue {
	return MyQueue{make([]int, 0), make([]int, 0)}
}

func (this *MyQueue) pushToPop() {
	if len(this.stackPop)==0 {
		for !(len(this.stackPush)==0) {
			value := this.stackPush[len(this.stackPush)-1]
			this.stackPush = this.stackPush[:len(this.stackPush)-1]
			this.stackPop = append(this.stackPop, value)
		}
	}
}

func (this *MyQueue) Push(x int) {
	this.stackPush = append(this.stackPush, x)
	this.pushToPop()
}

func (this *MyQueue) Pop() int {
	this.pushToPop()
	value := this.stackPop[len(this.stackPop)-1]
	this.stackPop = this.stackPop[:len(this.stackPop)-1]
	return value
}

func (this *MyQueue) Peek() int {
	this.pushToPop()
	return this.stackPop[len(this.stackPop)-1]
}

func (this *MyQueue) Empty() bool {
	this.pushToPop()
	if len(this.stackPop) == 0 {
		return true
	}
	return false
}
```

------



### [155.最小栈](https://leetcode.cn/problems/min-stack)

> 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
>
> 实现 MinStack 类:
>
> - MinStack() 初始化堆栈对象。
> - void push(int val) 将元素val推入堆栈。
> - void pop() 删除堆栈顶部的元素。
> - int top() 获取堆栈顶部的元素。
> - int getMin() 获取堆栈中的最小元素。

```go
type MinStack struct {
	stackData, stackMin []int
}

func Constructor() MinStack {
	return MinStack{make([]int, 0), make([]int, 0)}
}

func (this *MinStack) Push(val int) {
	this.stackData = append(this.stackData, val)
	if len(this.stackMin)==0 {
		this.stackMin = append(this.stackMin, val)
	} else {
		min := this.GetMin()
		if val <= min {
			this.stackMin = append(this.stackMin, val)
		} else {
			this.stackMin = append(this.stackMin, min)
		}
	}
}

func (this *MinStack) Pop() {
	this.stackData = this.stackData[:len(this.stackData)-1]
	this.stackMin = this.stackMin[:len(this.stackMin)-1]
}

func (this *MinStack) Top() int {
	return this.stackData[len(this.stackData)-1]
}

func (this *MinStack) GetMin() int {
	return this.stackMin[len(this.stackMin)-1]
}
```

------



### [224.基本计算器](https://leetcode.cn/problems/basic-calculator/)

> 给你一个字符串表达式 `s` ，请你实现一个基本计算器来计算并返回它的值。
>
> 注意:不允许使用任何将字符串作为数学表达式计算的内置函数，比如 `eval()` 。

```go
func calculate(s string) int {
	stack, res, num, sign := []int{}, 0, 0, 1
	for i := 0; i < len(s); i++ {
		if s[i] >= '0' && s[i] <= '9' {
			num = num*10 + int(s[i]-'0')
		} else if s[i] == '+' {
			res += sign * num
			num = 0
			sign = 1
		} else if s[i] == '-' {
			res += sign * num
			num = 0
			sign = -1
		} else if s[i] == '(' {
			stack = append(stack, res) //将前一个结果和符号压入栈中
			stack = append(stack, sign)
			res = 0 //将结果设置为0，只需在括号内计算新结果。
			sign = 1
		} else if s[i] == ')' {
			res += sign * num
			num = 0
			res *= stack[len(stack)-1]
			res += stack[len(stack)-2]
			stack = stack[:len(stack)-2]
		}
	}
	if num != 0 {
		res += sign * num
	}
	return res
}
```

------



### [227.基本计算器 II](https://leetcode.cn/problems/basic-calculator-ii/)

> 给你一个字符串表达式 s ，请你实现一个基本计算器来计算并返回它的值。
>
> 整数除法仅保留整数部分。
>
> 你可以假设给定的表达式总是有效的。所有中间结果将在 [-231, 231 - 1] 的范围内。
>
> 注意：不允许使用任何将字符串作为数学表达式计算的内置函数，比如 eval() 。

```go
func calculate(s string) int {
	stack, sign, num, res := []int{}, byte('+'), 0, 0
	for i := 0; i < len(s); i++ {
		isDigit := s[i] <= '9' && s[i] >= '0'
		if isDigit {
			num = num*10 + int(s[i]-'0')
		}
		if !isDigit && s[i] != ' ' || i == len(s)-1 {
			if sign == '+' {
				stack = append(stack, num)
			} else if sign == '-' {
				stack = append(stack, -num)
			} else if sign == '*' {
				stack[len(stack)-1] *= num
			} else if sign == '/' {
				stack[len(stack)-1] /= num
			}
			sign = s[i]
			num = 0
		}
	}
	for _, i := range stack {
		res += i
	}
	return res
}
```

------

### [739.每日温度](https://leetcode.cn/problems/daily-temperatures/)

> 给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。
>

```go
func dailyTemperatures(T []int) []int {
    result := make([]int,len(T))
    stack := []int{}

    for i := len(T)-1;i >= 0 ;i-- {
        for len(stack) != 0 && T[i] >= T[stack[len(stack)-1]] {
            stack = stack[:len(stack)-1]
        }
        if len(stack) != 0 {
            result[i] = stack[len(stack)-1] - i 
        }
        stack = append(stack,i)
    }
    return result
}
```

### [402.移掉 K 位数字](https://leetcode.cn/problems/remove-k-digits/)

> 给你一个以字符串表示的非负整数 `num` 和一个整数 `k` ，移除这个数中的 `k` 位数字，使得剩下的数字最小。请你以字符串形式返回这个最小的数字。

```go
func removeKdigits(num string, k int) string {
	if len(num) == k {
		return "0"
	}
	stack := make([]rune, 0)
	for _, c := range num {
		for k > 0 && len(stack) > 0 && stack[len(stack)-1] > c {
			stack = stack[0:len(stack)-1]
			k--
		}
		if c != '0' || len(stack) != 0 {
			stack = append(stack, c)
		}
	}
	for k > 0 && len(stack) != 0 {
		stack = stack[0:len(stack)-1]
		k--
	}
	if len(stack) == 0 {
		return "0"
	}
	return string(stack)
}

```

