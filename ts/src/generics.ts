// 泛型：在定义函数、接口、类的时候不预先指定类型，而在使用时再指定类型的特性。

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}

const result = swap<string, number>(['123', 456])
console.log(result)
