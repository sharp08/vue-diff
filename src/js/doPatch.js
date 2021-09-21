/*
 * @Author: PL
 * @Date: 2021-09-20 19:03:27
 * @LastEditTime: 2021-09-21 10:39:41
 * @Description: 
 */
import { ATTR, TEXT, REPLACE, REMOVE } from './patchTypes'
import { setAttrs, render } from './virtualDom'
import Element from './Element'

let finalPatches = {}
let rnIndex = 0

/**
 * @description: 打补丁方法
 * @param {*} rDom 已经挂载的真实DOM
 * @param {*} patches 补丁包
 * @return {*}
 */
function doPatch(rDom, patches) {
  finalPatches = patches
  rNodeWalk(rDom)
}

function rNodeWalk(rNode) {
  // rnIndex 是递增的，但不一定所有节点都被更改，因此未更改的节点 rnPatch 为 undefined
  const rnPatch = finalPatches[rnIndex++]

  // 如果某个节点存在补丁包，就执行打补丁操作
  if (rnPatch) {
    patchAction(rNode, rnPatch)
  }

  // 对子节点进行遍历打补丁，同样是深度优先
  const childNodes = rNode.childNodes;
  [...childNodes].map(c => {
    rNodeWalk(c)
  })
}

/**
 * @description: 对真实节点进行打补丁，能进到这个逻辑证明需要打补丁
 * @param {HTMLElement} rNode 真实节点
 * @param {Array} rnPatch 对应的补丁包
 * @return {*}
 */
function patchAction(rNode, rnPatch) {
  // 一个节点可能有多个补丁包
  rnPatch.map(p => {
    switch (p.type) {
      case ATTR:
        /**
         * 这里的 p.attrs 包含新旧节点所有的属性
         * 旧节点有，新节点没有的属性值为 undefined
         */
        for (let key in p.attrs) {
          const value = p.attrs[key]
          // 有值赋值或者新增属性
          if (value) {
            setAttrs(rNode, key, value)
          } 
          // 如果没值证明被删掉了
          else {
            rNode.removeAttribute(key)
          }
        }
        break;
      case TEXT:
        rNode.textContent = p.text
        break;
      case REPLACE:
        /**
         * 因为补丁包是虚拟节点比较的产物
         * 因此内部即便有新的节点，也是虚拟DOM，需要 render 转换成真实DOM
         */
        const newNode = p.newNode instanceof Element  // 判断是否为虚拟DOM
          ? render(p.newNode) :   // 虚拟DOM 转换成 真实 DOM
          document.createTextNode(p.newNode)  // 文本节点直接创建
        rNode.parentNode.replaceChild(newNode, rNode)
        break;
      case REMOVE:
        rNode.parentNode.removeChild(rNode)
        break;
      default:
        break;
    }
  })
}

export default doPatch