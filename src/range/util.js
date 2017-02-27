/**
 * Created by peak on 2017/2/15.
 */
/**
 * add every elements of extArr to sourceArr.
 * @param sourceArr
 * @param extArr
 */
export const mergeArray = (sourceArr, extArr) => {
    // note: Array.prototype.push.apply(arr1,arr2) is unreliable
    extArr.forEach((el) => {
        sourceArr.push(el)
    })
}

/**
 * find all the descendant text nodes of a element
 * @param ancestor
 */
export const getDescendantTextNodes = (ancestor) => {
    if (ancestor.nodeType === Node.TEXT_NODE) {
        return [ancestor]
    }
    const textNodes = []
    if (!ancestor.hasChildNodes()) {
        return textNodes
    }
    const childNodes = ancestor.childNodes
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i]
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            mergeArray(textNodes, getDescendantTextNodes(node))
        }
    }
    return textNodes
}
/**
 * find all the descendant text nodes of an ancestor element that before the specify end element,
 * the ancestor element must contains the end element.
 * @param ancestor
 * @param endEl
 */
export const getBeforeEndDescendantTextNodes = (ancestor, endEl) => {
    const textNodes = []
    let endIndex = 0
    for (let i = 0; i < ancestor.childNodes.length; i++) {
        if (ancestor.childNodes[i].contains(endEl)) {
            endIndex = i
            break
        }
    }

    for (let i = 0; i <= endIndex; i++) {
        const node = ancestor.childNodes[i]
        if (node === endEl) {
            mergeArray(textNodes, getDescendantTextNodes(node))
        } else if (i === endIndex) {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node)
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                mergeArray(textNodes, getBeforeEndDescendantTextNodes(node, endEl))
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            mergeArray(textNodes, getDescendantTextNodes(node))
        }
    }
    return textNodes
}
/**
 * find all the descendant text nodes of an ancestor element that after the specify start element,
 * the ancestor element must contains the start element.
 * @param ancestor
 * @param startEl
 */
export const getAfterStartDescendantTextNodes = (ancestor, startEl) => {
    const textNodes = []
    let startIndex = 0
    for (let i = 0; i < ancestor.childNodes.length; i++) {
        if (ancestor.childNodes[i].contains(startEl)) {
            startIndex = i
            break
        }
    }

    for (let i = startIndex; i < ancestor.childNodes.length; i++) {
        const node = ancestor.childNodes[i]
        if (node === startEl) {
            mergeArray(textNodes, getDescendantTextNodes(node))
        } else if (i === startIndex) {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node)
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                mergeArray(textNodes,
                    getAfterStartDescendantTextNodes(node, startEl))
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            mergeArray(textNodes,
                getDescendantTextNodes(node))
        }
    }
    return textNodes
}


/**
 * get the closest parent block node of a text node.
 * @param node
 * @return {Node}
 */
export const getParentBlockNode = (node) => {
    const blockNodeNames = ['DIV', 'P', 'SECTION', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
        'OL', 'UL', 'LI', 'TR', 'TD', 'TH', 'TBODY', 'THEAD', 'TABLE', 'ARTICLE', 'HEADER', 'FOOTER']
    let container = node
    while (container) {
        if (blockNodeNames.includes(container.nodeName)) {
            break
        }
        container = container.parentNode
    }
    return container
}

export const isInlineElement = (node) => {
    const inlineNodeNames = ['A', 'ABBR', 'ACRONYM', 'B', 'CITE', 'CODE', 'EM', 'I',
        'FONT', 'IMG', 'S', 'SMALL', 'SPAN', 'STRIKE', 'STRONG', 'U', 'SUB', 'SUP']
    return inlineNodeNames.includes(node.nodeName)
}