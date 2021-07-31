# lagou-e-task-03-01
# 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 methods: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
不是。
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 methods: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   vm.$set(this.dog,'name', 'Trump')
  }
 }
})
内部原理是：当new vue的时候，vue立即执行构造函数，在构造函数中，初始化data选项，Observer对data进行数据劫持，给data的属性设置getter/setter，当dog属性发生变化的时候，触发dog的set方法,发现传入的是个对象，然后把对象里的name也设置getter/setter，从而name也是响应式的；
# 2、请简述 Diff 算法的执行过程
patch()接收新旧两个Vnode两个参数，首先执行模块中的pre钩子函数；然后判断新旧Vnode是否相同，相同的化，通过调用patchVnode去找出两者的差异并更新到真实的dom上；否则通过oldVnode的dom元素找到它的父元素，接着通过createElm把newVnode转成真实的dom，并存储到insertedVnodeQueue队列里，如果oldVnode父元素存在的话，就把newVnode的dom元素更新到真实的dom树上，并找到它的下一个兄弟节点，然后移除原来的dom元素，返回新的Vnode作为下一次的老的Vnode。