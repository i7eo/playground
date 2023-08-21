// any
// any：有时，我们在编写代码的时候，并不能清楚地知道一个值到底是什么类型，这时就需要用到 any 类型，即任意类型；

// void
// void: void 和 any 相反，any 是表示任意类型，而 void 是表示没有任意类型，就是什么类型都不是；
// 注意：void 类型的变量只能赋值为 undefined 和 null，其他类型不能赋值给 void 类型的变量

// never
// never: never 类型指那些永不存在的值的类型，它是那些总会抛出异常或根本不会有返回值的函数表达式的返回值类型。
// 主要用途为如下：
// 1. 限制类型
// 2. 控制流程
// 3. 类型运算

interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar

function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      // 这里 val 被收窄为 Foo
      break
    case 'bar':
      // val 在这里是 Bar
      break
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val
      break
  }
}

// 假如后来有一天改了 All 的类型
// type All = Foo | Bar | Baz
// 这样在 default 中 val 会被收窄为 Baz 类型导致编译报错，never 能更好的避免错误

// unknown
// unknown: unknown类型是TypeScript在3.0版本新增的类型，它表示未知的类型。
// 任何类型的值都可以赋值给 unknown 类型；
// 如果没有类型断言或基于控制流的类型细化时 unknown 不可以赋值给其它类型，此时它只能赋值给 unknown 和 any 类型：
// 与 any 最大区别就是，any 类型的变量可以调用任何属性以及方法，而 never 则会直接报错

let value2: unknown;
// let value3: string = value2; // error 不能将类型“unknown”分配给类型“string”
// value1 = value2;

let value4: unknown;
// value4 += 1; // error 对象的类型为 "unknown"
