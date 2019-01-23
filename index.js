function getVisibleText (element) {
  if (!element) return ''

  switch (element.nodeType) {
    case 1:
    case 9:
    case 11:
      switch (element.tagName) {
        case 'CANVAS':
        case 'HEAD':
        case 'META':
        case 'SCRIPT':
        case 'STYLE':
        case 'TITLE':
        case 'NOSCRIPT':
          return ''
      }

      if (element.style.display === 'none') {
        return ''
      }

      if (element.style.visibility === 'hidden') {
        return ''
      }

      if (Number(element.style.opacity || '1') < (1 / 256)) {
        return ''
      }

      if ((element.offsetHeight === 0 || element.offsetWidth === 0) && element.style.overflow === 'hidden') {
        return ''
      }

      let result = ''

      for (let child = element.firstChild; child; child = child.nextSibling) {
        result += getVisibleText(child)
      }

      return result.replace(/\s+/g, ' ')
    case 3:
    case 4:
      return element.nodeValue.replace(/\s+/g, ' ')
    default:
      return ''
  }
}

module.exports = getVisibleText
