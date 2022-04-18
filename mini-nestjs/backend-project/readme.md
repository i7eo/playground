"concurrently": "^7.0.0", // 同时执行命令的插件
"nodemon": "^2.0.15", // 文件变化自动更新node服务代码，node热更新

详情：https://stackoverflow.com/questions/61477668/js-es6-class-syntax-and-prototype-confusion
通过class的创建的成员方法，不能通过for in遍历出来，见如下示例：

```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    //anything outside of constructor belong to this.prototype

    getName() {
        console.log(this.name);
    }
    getAge() {
        console.log(this.age);
    }
}

User.prototype.getGender = () => {console.log(this.name)}
console.log(Object.getOwnPropertyDescriptor(User.prototype, "getName")) // enumerable: false
console.log(Object.getOwnPropertyDescriptor(User.prototype, "getGender")) // enumerable: true
```