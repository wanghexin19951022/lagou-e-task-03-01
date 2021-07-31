import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
import { classModule } from 'snabbdom/build/package/modules/class'
import { propsModule } from 'snabbdom/build/package/modules/props'
import { originalData } from './data'

var patch = init([classModule, propsModule, styleModule, eventListenersModule])

// 第一个参数：标签+选择器
// 第二个参数：如果是字符串就是标签中的文本内容
let vnode = h('div#app',{
  hook: {
    init (vnode) {
      console.log(vnode.elm)
    },
    create (emptyNode, vnode) {
      console.log(vnode.elm)
    }
  }
}, 'Hello World')
let app = document.querySelector('#app')
// 第一个参数：旧的 VNode，可以是 DOM 元素
// 第二个参数：新的 VNode
// 返回新的 VNode
let oldVnode = patch(app, vnode)

// vnode = h('div#container.xxx', 'Hello Snabbdo1m')
// patch(oldVnode, vnode)
let nextKey = 11 // 添加的时候从第11条开始
let margin = 18 // 每条数据的间距
let totalHeight = 0
let sortBy = 'rank'
const origin = originalData
let data = origin


function render () {
  data = data.reduce((acc, m) => {
    var last = acc[acc.length - 1]
    m.offset = last ? last.offset + last.elmHeight + margin : margin
    return acc.concat(m)
  }, [])
  totalHeight = data.length === 0
    ? 0
    : data[data.length - 1].offset + data[data.length - 1].elmHeight
  vnode = patch(vnode, view(data))
}
function add () {
  var n = origin[Math.floor(Math.random() * 10)]
  data = [{ rank: nextKey++, title: n.title, desc: n.desc, elmHeight: 0 }].concat(data)
  render()
  render()
}

function movieView (movie) {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translate(-200px)',
      delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
      remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
    },
    hook: { insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight } },
  }, [
    h('div', { style: { fontWeight: 'bold' } }, movie.rank),
    h('div', movie.title),
    h('div', movie.desc),
    h('div.btn.rm-btn', {
      on: {
        click: () => {
          remove(movie)
        }
      }
    }, '删除'),
  ])
}
function view (data) {
  return h('div', [
    h('h1', '这是一个列表'),
    h('div', [
      h('a.btn.add', { on: { click: add } }, '增加'),
      '排序: ',
      h('span.btn-group', [
        h('a.btn.rank', {
          class: { active: sortBy === 'rank' },
          on: {
            click: () => {
              changeSort('rank')
            }
          }
        }, 'Rank'),
        h('a.btn.desc', {
          class: { active: sortBy === 'desc' },
          on: {
            click: () => {
              changeSort('desc')
            }
          }
        }, 'Description'),
      ]),
    ]),
    h('div.list', { style: { height: totalHeight + 'px' } }, data.map(movieView)),
  ])
}
// 删除元素
function remove (movie) {
  data = data.filter((m) => {
    return m !== movie
  })
  render()
}
// 排序
function changeSort (prop) {
  sortBy = prop
  data.sort((a, b) => {
    if (a[prop] > b[prop]) {
      return 1
    }
    if (a[prop] < b[prop]) {
      return -1
    }
    return 0
  })
  render()
}
window.addEventListener('DOMContentLoaded', () => {
  var container = document.getElementById('app')
  vnode = patch(container, view(data))
  render()
})
