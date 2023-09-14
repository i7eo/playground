# Grid Layout

## 基本概念

1. 采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）。Grid 布局只对项目生效。

2. 容器里面的水平区域称为"行"（row），垂直区域称为"列"（column）。

3. 行和列的交叉区域，称为"单元格"（cell）。正常情况下，n行和m列会产生n x m个单元格。比如，3行3列会产生9个单元格。

4. 划分网格的线，称为"网格线"（grid line）。水平网格线划分出行，垂直网格线划分出列。正常情况下，n行有n + 1根水平网格线，m列有m + 1根垂直网格线，比如三行就有四根水平网格线。

> Grid 布局的属性分成两类。一类定义在容器上面，称为容器属性；另一类定义在项目上面，称为项目属性。

## 容器属性

1. display
    - 见 [grid-1](./grid-1.html)
    - 设为网格布局以后，容器子元素（项目）的float、display: inline-block、display: table-cell、vertical-align和column-*等设置都将失效。

2. grid-template-rows/grid-template-columns
    - 见 [grid-2](./grid-2.html)
    - 容器指定了网格布局以后，接着就要划分行和列。grid-template-columns属性定义每一列的列宽，grid-template-rows属性定义每一行的行高。
    - 绝对单位、百分比、repeat函数、auto-fill/auto-fit（auto-fill会用空格子填满剩余宽度，auto-fit则会尽量扩大单元格的宽度）、fr（如果两列的宽度分别为1fr和2fr，就表示后者是前者的两倍）、minmax（minmax(100px, 1fr)表示列宽不小于100px，不大于1fr）、auto（auto关键字表示由浏览器自己决定长度）、网格布局（grid-template-columns: repeat(12, 1fr)）

3. row-gap/column-gap/gap
    - 见 [grid-2](./grid-2.html)
    - row-gap属性设置行与行的间隔（行间距），column-gap属性设置列与列的间隔（列间距）
    - gap属性是column-gap和row-gap的合并简写形式（`gap: <row-gap> <column-gap>;`）

4. grid-auto-flow
    - 见 [grid-3](./grid-3.html)
    - 容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行。
    - grid-auto-flow属性除了设置成row和column，还可以设成row dense和column dense。这两个值主要用于，某些项目指定位置以后，剩下的项目怎么自动放置。dense 指紧密紧贴

5. justify-items/align-items/place-items
    - 见 [grid-4](./grid-4.html)
    - justify-items属性设置单元格内容的水平位置（左中右），align-items属性设置单元格内容的垂直位置（上中下）。
    - place-items属性是align-items属性和justify-items属性的合并简写形式（`place-items: <align-items> <justify-items>;`）

6. justify-content/align-content/place-content
    - 见 [grid-5](./grid-5.html)
    - justify-content属性是整个内容区域在容器里面的水平位置（左中右），align-content属性是整个内容区域的垂直位置（上中下）。
    - place-content属性是align-content属性和justify-content属性的合并简写形式。(`place-content: <align-content> <justify-content>`)
    - 水平垂直居中可用
  
7. grid-auto-columns/grid-auto-rows
    - 见 [grid-6](./grid-6.html)
    - grid-auto-columns属性和grid-auto-rows属性用来设置，浏览器自动创建的多余网格的列宽和行高。它们的写法与grid-template-columns和grid-template-rows完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

8. grid-template/grid
    - grid-template属性是grid-template-columns、grid-template-rows和grid-template-areas这三个属性的合并简写形式。
    - grid属性是grid-template-rows、grid-template-columns、grid-template-areas、 grid-auto-rows、grid-auto-columns、grid-auto-flow这六个属性的合并简写形式。

## 项目属性

1. grid-column-start/grid-column-end/grid-row-start/grid-row-end
    - 见 [grid-7](./grid-7.html)
    - 项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线。grid-column-start属性：左边框所在的垂直网格线，grid-column-end属性：右边框所在的垂直网格线，grid-row-start属性：上边框所在的水平网格线，grid-row-end属性：下边框所在的水平网格线
    - 这四个属性的值，除了指定为第几个网格线，还可以指定为网格线的名字。
    - 这四个属性的值还可以使用span关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

2. grid-column/grid-row
    - grid-column属性是grid-column-start和grid-column-end的合并简写形式，grid-row属性是grid-row-start属性和grid-row-end的合并简写形式。
    - `grid-column: <start-line> / <end-line>;` `grid-row: <start-line> / <end-line>;`

3. justify-self/align-self/place-self
    - justify-self属性设置单元格内容的水平位置（左中右），跟justify-items属性的用法完全一致，但只作用于单个项目。align-self属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目。
    - place-self属性是align-self属性和justify-self属性的合并简写形式。
