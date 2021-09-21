import Element from "./Element";

/**
 * @description: 用于将一个数据格式转换为 vDOM
 * @param {String} tagName
 * @param {Object} props
 * @param {Array} children
 * @return {Element}
 */
function createElement(tagName, props, children) {
  return new Element(tagName, props, children)
}

/**
 * @description: 为真实节点添加属性
 * @param {HTMLElement} rNode
 * @param {String} propName
 * @param {String,Number} propValue
 * @return {*}
 */
function setAttrs(rNode, propName, propValue) {
  switch (propName) {
    case "value":
      if (rNode.tagName === "INPUT" || rNode.tagName === "TEXTAREA") {
        rNode.value = propValue;
      } else {
        rNode.setAttribute(propName, propValue);
      }
      break;
    case "style":
      rNode.style.cssText = propValue;
      break;
    default:
      rNode.setAttribute(propName, propValue);
      break;
  }
}

/**
 * @description: 将虚拟DOM 转换为真实 DOM
 * @param {Element} vDom
 * @return {HTMLElement} 最终返回的是当前节点及其子节点组成的树形 rDom 结构
 */
function render(vDom) {
  const { tagName, props, children } = vDom
  // 创建标签
  const el = document.createElement(tagName)
  // 将属性放到标签上
  for (let key in props) {
    setAttrs(el, key, props[key])
  }

  /**
   * 子节点可能是 Element 实例，也可能是字符串
   * 如果是 Element 实例，即虚拟DOM，证明是元素节点，通过 render 转换成真实DOM
   * 如果是字符串，证明是文本节点，直接创建一个文本节点
   * 不论是任何类型的节点，最终都要添加到当前元素的子级中
   */
  children.map(c => {
    c = c instanceof Element
      ? render(c)
      : document.createTextNode(c)

    el.appendChild(c)
  })

  return el
}

/**
 * @description: 将真实节点放到页面的指定元素中
 * @param {HTMLElement} rDom
 * @param {HTMLElement} rootEl
 * @return {*}
 */
function renderDom(rDom, rootEl) {
  rootEl.appendChild(rDom)
}

export {
  createElement,
  render,
  setAttrs,
  renderDom
}