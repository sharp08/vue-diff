import { createElement, render, renderDom } from './virtualDom'
import vDomDiff from './vDomDiff'
import doPatch from './doPatch'

// 以下 DOM 结构在 imgs 目录中有截图
// 虚拟DOM1
const vDom1 = createElement("ul", {
  class: "list",
  style: "width: 300px; height: 300px; background-color: orange"
}, [
  createElement("li", {
    class: "item",
    "data-index": 0
  }, [
    createElement("p", {
      class: "text",
    }, [
      "第一个列表项"
    ])
  ]),
  createElement("li", {
    class: "item",
    "data-index": 1
  }, [
    createElement("p", {
      class: "text",
    }, [
      createElement("span", {
        class: "title",
      }, [
        "第二个列表项"
      ])
    ])
  ]),
  createElement("li", {
    class: "item",
    "data-index": 2
  }, [
    "第三个列表项"
  ])
])


// 虚拟DOM2
const vDom2 = createElement("ul", {
  class: "list-wrap",
}, [
  createElement("li", {
    class: "item",
    "data-index": 0
  }, [
    createElement("p", {
      class: "title",
    }, [
      "特殊列表项"
    ])
  ]),
  createElement("li", {
    class: "item",
    "data-index": 1
  }, [
    createElement("p", {
      class: "text",
    }, [])
  ]),
  createElement("div", {
    class: "item",
    "data-index": 2
  }, [
    "第三个列表项"
  ])
])

// 通过 render 方法将虚拟 DOM 转换成真实 DOM
const rDom = render(vDom1)

// 将真实 DOM 挂载到页面上
renderDom(rDom, document.getElementById("app"))

// 找出两个虚拟DOM 的差异存储为补丁包
const patches = vDomDiff(vDom1, vDom2)  // 补丁包格式见 patches.json
console.log(patches)

// 将差异更新到真实DOM 上
doPatch(rDom, patches)