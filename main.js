(() => {
  const expireDateModifier = 7 * 24 * 60 * 60 * 1000
  const qs = sel => document.querySelector(sel)
  const qsa = sel => Array.from(document.querySelectorAll(sel))
  const cln = (node, parent) => {
    const clonedNode = qs`.templates`.querySelector(node).cloneNode(true)
    qs(parent).appendChild(clonedNode)
    return clonedNode
  }
  const qsT = (parent, target, value) => {
    const targetNode = parent.querySelector(target)
    targetNode.innerText = value
    return targetNode
  }
  const readCookieKey = (cookie, key) => cookie.replace(
    new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`, 'g'), '$1'
  )

  const formatToQueryStr = className =>
    className.replace(/\s/g, '.').replace(/^/g, '.')

  function loadState() {
    const cookie = document.cookie
    const cookieValue = cookie && readCookieKey(cookie, 'state')
    if(!cookie || !cookieValue) return
    try {
      const parsedCookie = JSON.parse(cookieValue)
      parsedCookie.forEach(item => {
        qsT(qs`.container`, formatToQueryStr(item.owner), item.value)
      })
    } catch(e) {
      qsT(document, '.notification', e.message)
      console.error(e)
    }
  }

  function saveState() {
    const values = qsa`.container .capture`.map(item => ({
      owner: item.className,
      value: item.innerText
    }))
    document.cookie = `state=${JSON.stringify(values)}` +
      `;expires=${new Date(Date.now() + expireDateModifier).toUTCString()}`
  }

  const createNumber = (parent, key) => {
    const number = cln('.editable-number', parent)
    const numberNode = qsT(number, '.number', '0')
    numberNode.classList.add(`i${key}`)
    number.querySelector('.up').addEventListener('click', () => {
      const currVal = Number(numberNode.innerText)
      if((currVal + 1) > 9) {
        numberNode.innerText = '0'
        return
      }
      numberNode.innerText = String(currVal + 1)
      saveState()
    })
    number.querySelector('.down').addEventListener('click', () => {
      const currVal = Number(numberNode.innerText)
      if((currVal - 1) < 0) {
        numberNode.innerText = '9'
        return
      }
      numberNode.innerText = String(currVal - 1)
      saveState()
    })
  }

  function formatTime(time) {
    let ampm = 'AM'
    let hour = time.getHours()
    if(hour > 12) {
      hour = hour - 12
      ampm = 'PM'
    }
    let minute = time.getMinutes()
    if(minute < 10) {
      minute = `0${minute}`
    }
    return `${hour}:${minute} ${ampm}`
  }

  const createTimestampable = (parent) => {
    const timestamp = cln('.timestamp', parent)
    timestamp.querySelector('.capture-now').addEventListener('click', () => {
      const dateCapture = formatTime(new Date())
      qsT(timestamp, '.time-display', dateCapture)
      saveState()
    })
  }

  const toggleSidebar = () => {
    const toggleNodes = [qs`.sidebar`, qs`.overlay`]
    const method = Array.from(toggleNodes[0].classList)
      .includes('active') ? 'remove' : 'add'
    toggleNodes.forEach(node => {
      node.classList[method]('active')
    })
    qs`.container`.classList[method]('blur')
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('beforeunload', saveState)
    qs`.save`.addEventListener('click', () => {
      // parent list append values
      saveState()
    })

    qsa`.toggle-menu`.forEach(btn => {
      btn.addEventListener('click', toggleSidebar)
    })

    let it = 0
    while(it++ < 6) {
      createNumber('.container .odometer', it)
    }
    createTimestampable('.container .timestamp')
    loadState()
  })
})();
