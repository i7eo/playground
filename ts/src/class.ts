// 接口继承接口，类继承类均使用 extends

// 1. 类类型接口
interface IFood {
  type: string
}
// 类继承接口（成为类实现接口）则必须使用 implements
class Food implements IFood {
  constructor(public type: string) {}
}

// 2. 接口继承类
// 使用 extends 关键字
class Person {
  // constructor(private name: string) {}
  private name = '123'
  protected name1 = '456'
  getName() {
    return this.name + this.name1
  }
}
// 接口继承类后只继承成员（类型），不包括实现
interface IPerson extends Person {}
// 接口继承 private 与 protected 修饰的成员，但这个接口只可被这个类或它的子类实现
class CPerson extends Person implements IPerson {
  // private name = '123'
  // protected name1 = '456'
  getName() {
    return this.name1 + 'new Class CPerson'
  }
}
