/*
 * @Author: PL
 * @Date: 2021-09-18 23:20:55
 * @LastEditTime: 2021-09-21 10:56:38
 * @Description: 
 */

import { ATTR, TEXT, REPLACE, REMOVE } from './patchTypes'

let patches = {}  // 两组 vDOM 对比后形成最终完整的补丁包
let vnIndex = 0

/**
 * @description: vDom 对比
 * @param {Element} oldVDom
 * @param {Element} newVDom
 * @return {*}
 */
function vDomDiff(oldVDom, newVDom) {
  vNodeWalk(oldVDom, newVDom, vnIndex)
  return patches
}

/**
 * @description: 比较新旧虚拟节点，找出差异
 * @param {*} oldNode
 * @param {*} newNode
 * @param {*} index
 * @return {*}
 */
function vNodeWalk(oldNode, newNode, index) {
  let vnPatch = []  //  某一个节点的变化，实际这里是个对象也行

  // 如果新的节点不存在，证明被删除了，子节点不需要进行比较
  if (!newNode) {
    vnPatch.push({
      type: REMOVE,
      index
    })
  }
  // 如果新旧节点都是字符串，证明是文本节点的更改
  else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) {
      vnPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  }
  // 如果新旧节点 tagName 相同，就比较它们的属性
  else if (oldNode.tagName === newNode.tagName) {
    // 比较属性
    const attrPatch = attrsWalk(oldNode.props, newNode.props)

    // 如果有差异就把差异存起来
    if (Object.keys(attrPatch).length) {
      vnPatch.push({
        type: ATTR,
        attrs: attrPatch,
      })
    }

    // 对子节点进行遍历
    childrenWalk(oldNode.children, newNode.children)
  }
  // 其他情况就是替换，包含之前是文本节点，后面改成元素节点等
  else {
    vnPatch.push({
      type: REPLACE,
      newNode
    })
  }

  // 如果单一节点最终存在差异，则将差异放到完整补丁包上
  if (vnPatch.length > 0) {
    patches[index] = vnPatch
  }
}

/**
 * @description: 遍历虚拟节点的属性，寻找差异
 * @param {Object} oldAttrs
 * @param {Object} newAttrs
 * @return {*}
 */
function attrsWalk(oldAttrs, newAttrs) {
  let attrPatch = {}  // 属性差异补丁包

  // 遍历旧的属性，从新的属性上找对应的值，如果旧属性有，新属性没有，就是 undefined
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      attrPatch[key] = newAttrs[key]
    }
  }

  // 遍历新的属性，如果旧的属性上没有，证明是本次新加的属性
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      attrPatch[key] = newAttrs[key]
    }
  }

  // 最终 attrPatch 是包含新旧全部属性的一个对象
  // 新增的属性直接加在 attrPatch 上
  // 被删掉的属性就是 attrPatch[key] = undefined
  return attrPatch
}

/**
 * @description: 当新旧节点 tagName 相同时，对子节点进行比较
 * @param {*} oldChildren
 * @param {*} newChildren
 * @return {*}
 */
function childrenWalk(oldChildren, newChildren) {
  // map 内回调函数为同步时，每一个回调完成之后才会执行下一个回调
  // 在这里是实现了【深度优先】，即先找子级
  oldChildren.map((c, idx) => {
    vNodeWalk(c, newChildren[idx], ++vnIndex)
  })
}

export default vDomDiff;