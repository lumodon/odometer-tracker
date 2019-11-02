(() => {
  const qs = sel => document.querySelector(sel)
  const qsa = sel => Array.from(document.querySelectorAll(sel))
  const cln = (node, parent) => {
    const clonedNode = qs(node).cloneNode(true)
    qs(parent).appendChild(clonedNode)
    return clonedNode
  }
  const qsT = (parent, target, value) => {
    const targetNode = parent.querySelector(target)
    targetNode.innerText = value
    return targetNode
  }

  const createNumber = (parent) => {
    const number = cln('.editable-number', parent)
    const numberNode = qsT(number, '.number', '0')
    number.querySelector('.up').addEventListener('click', () => {
      const currVal = Number(numberNode.innerText)
      if((currVal + 1) > 9) {
        numberNode.innerText = '0'
        return
      }
      numberNode.innerText = String(currVal + 1)
    })
    number.querySelector('.down').addEventListener('click', () => {
      const currVal = Number(numberNode.innerText)
      if((currVal - 1) < 0) {
        numberNode.innerText = '9'
        return
      }
      numberNode.innerText = String(currVal - 1)
    })
  }

  document.addEventListener('DOMContentLoaded', () => {
    let it = 0
    while(it++ < 6) {
      createNumber('.odometer')
    }
  })
})();
