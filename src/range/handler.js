import Command from './command'
import {
    mergeArray,
    getDescendantTextNodes,
    getAfterStartDescendantTextNodes,
    getBeforeEndDescendantTextNodes,
    getParentBlockNode,
    isInlineElement
} from './util'

// for IE 11
if (!Text.prototype.contains) {
    Text.prototype.contains = function contains(otherNode) {
        return this === otherNode
    }
}


/**
 * Created by peak on 2017/2/14.
 */
export default class RangeHandler {
    /**
     * build range handler
     * @param {Range} range
     */
    constructor(range) {
        if (!range || !(range instanceof Range)) {
            throw new TypeError('cant\'t resolve range')
        }
        this.range = range
    }


    /**
     * find all the text nodes in range
     */
    getAllTextNodesInRange() {
        const startContainer = this.range.startContainer
        const endContainer = this.range.endContainer
        const rootEl = this.range.commonAncestorContainer
        const textNodes = []

        if (startContainer === endContainer) {
            if (startContainer.nodeType === Node.TEXT_NODE) {
                return [startContainer]
            }
            const childNodes = startContainer.childNodes
            for (let i = this.range.startOffset; i < this.range.endOffset; i++) {
                mergeArray(textNodes, getDescendantTextNodes(childNodes[i]))
            }
            return textNodes
        }

        let startIndex = 0
        let endIndex = 0
        for (let i = 0; i < rootEl.childNodes.length; i++) {
            const node = rootEl.childNodes[i]
            if (node.contains(startContainer)) {
                startIndex = i
            }
            if (node.contains(endContainer)) {
                endIndex = i
            }
        }

        for (let i = startIndex; i <= endIndex; i++) {
            const node = rootEl.childNodes[i]
            if (i === startIndex) {
                if (node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node)
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    mergeArray(textNodes, getAfterStartDescendantTextNodes(node, startContainer))
                }
            } else if (i === endIndex) {
                if (node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node)
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    mergeArray(textNodes, getBeforeEndDescendantTextNodes(node, endContainer))
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
     * execute edit command
     * @param {String} command
     * @param arg
     */
    execCommand(command, arg) {
        switch (command) {

            case Command.JUSTIFY_LEFT: {
                document.execCommand(Command.JUSTIFY_LEFT, false, arg)
                break
            }

            case Command.JUSTIFY_RIGHT: {
                document.execCommand(Command.JUSTIFY_RIGHT, false, arg)
                break
            }

            case Command.JUSTIFY_CENTER: {
                document.execCommand(Command.JUSTIFY_CENTER, false, arg)
                break
            }

            case Command.FORE_COLOR: {
                document.execCommand(Command.FORE_COLOR, false, arg)
                break
            }
            case Command.BACK_COLOR: {
                document.execCommand(Command.BACK_COLOR, false, arg)
                break
            }
            case Command.REMOVE_FORMAT: {
                document.execCommand(Command.REMOVE_FORMAT, false, arg)
                break
            }
            case Command.FONT_NAME: {
                document.execCommand(Command.FONT_NAME, false, arg)
                break
            }
            case Command.FONT_SIZE: {
                // 重新实现，改为直接修改样式
                const textNodes = this.getAllTextNodesInRange()
                if (!textNodes.length) {
                    break
                }
                if (textNodes.length === 1 && textNodes[0] === this.range.startContainer
                    && textNodes[0] === this.range.endContainer) {
                    const textNode = textNodes[0]
                    if (this.range.startOffset === 0
                        && this.range.endOffset === textNode.textContent.length) {
                        if (textNode.parentNode.childNodes.length === 1
                            && isInlineElement(textNode.parentNode)) {
                            textNode.parentNode.style.fontSize = arg
                            break
                        }
                        const span = document.createElement('span')
                        span.style.fontSize = arg
                        textNode.parentNode.insertBefore(span, textNode)
                        span.appendChild(textNode)
                        break
                    }
                    const span = document.createElement('span')
                    span.innerText = textNode.textContent.substring(
                        this.range.startOffset, this.range.endOffset)
                    span.style.fontSize = arg
                    const frontPart = document.createTextNode(
                        textNode.textContent.substring(0, this.range.startOffset))
                    textNode.parentNode.insertBefore(frontPart, textNode)
                    textNode.parentNode.insertBefore(span, textNode)
                    textNode.textContent = textNode.textContent.substring(this.range.endOffset)
                    this.range.setStart(span, 0)
                    this.range.setEnd(span, 1)
                    break
                }

                textNodes.forEach((textNode) => {
                    if (textNode === this.range.startContainer) {
                        if (this.range.startOffset === 0) {
                            if (textNode.parentNode.childNodes.length === 1
                                && isInlineElement(textNode.parentNode)) {
                                textNode.parentNode.style.fontSize = arg
                            } else {
                                const span = document.createElement('span')
                                span.style.fontSize = arg
                                textNode.parentNode.insertBefore(span, textNode)
                                span.appendChild(textNode)
                            }
                            return
                        }
                        const span = document.createElement('span')
                        textNode.textContent = textNode.textContent.substring(
                            0, this.range.startOffset)
                        span.style.fontSize = arg
                        textNode.parentNode.insertBefore(span, textNode)
                        this.range.setStart(textNode, 0)
                        return
                    }
                    if (textNode === this.range.endContainer) {
                        if (this.range.endOffset === textNode.textContent.length) {
                            if (textNode.parentNode.childNodes.length === 1
                                && isInlineElement(textNode.parentNode)) {
                                textNode.parentNode.style.fontSize = arg
                            } else {
                                const span = document.createElement('span')
                                span.style.fontSize = arg
                                textNode.parentNode.insertBefore(span, textNode)
                                span.appendChild(textNode)
                            }
                            return
                        }
                        const span = document.createElement('span')
                        textNode.textContent = textNode.textContent.substring(this.range.endOffset)
                        span.style.fontSize = arg
                        textNode.parentNode.insertBefore(span, textNode)
                        span.appendChild(textNode)
                        this.range.setStart(textNode, textNode.textContent.length)
                        return
                    }
                    if (textNode.parentNode.childNodes.length === 1
                        && isInlineElement(textNode.parentNode)) {
                        textNode.parentNode.style.fontSize = arg
                        return
                    }

                    const span = document.createElement('span')
                    span.style.fontSize = arg
                    textNode.parentNode.insertBefore(span, textNode)
                    span.appendChild(textNode)
                })
                break
            }
            case Command.FORMAT_BLOCK: {
                if (document.execCommand(Command.FORMAT_BLOCK, false, arg)) {
                    break
                }
                // hack
                const element = document.createElement(arg)
                this.range.surroundContents(element)
                break
            }
            case Command.LINE_HEIGHT: {
                const textNodes = this.getAllTextNodesInRange()
                textNodes.forEach((textNode) => {
                    const parentBlock = getParentBlockNode(textNode)
                    if (parentBlock) {
                        parentBlock.style.lineHeight = arg
                    }
                })
                break
            }
            case Command.INSERT_HORIZONTAL_RULE: {
                document.execCommand(Command.INSERT_HORIZONTAL_RULE, false)
                break
            }
            case Command.INSERT_IMAGE: {
                document.execCommand(Command.INSERT_IMAGE, false, arg)
                break
            }
            case Command.CREATE_LINK: {
                document.execCommand(Command.CREATE_LINK, false, arg)
                break
            }
            case Command.INSERT_ORDERED_LIST: {
                document.execCommand(Command.INSERT_ORDERED_LIST, false, arg)
                break
            }
            case Command.INSERT_UNORDERED_LIST: {
                document.execCommand(Command.INSERT_UNORDERED_LIST, false, arg)
                break
            }
            case Command.INSERT_HTML: {
                if (document.execCommand(Command.INSERT_HTML, false, arg)) {
                    break
                }
                // hack
                const fragment = document.createDocumentFragment()
                const div = document.createElement('div')
                div.innerHTML = arg
                if (div.hasChildNodes()) {
                    for (let i = 0; i < div.childNodes.length; i++) {
                        fragment.appendChild(div.childNodes[i].cloneNode(true))
                    }
                }
                this.range.deleteContents()
                this.range.insertNode(fragment)
                break
            }
            case Command.BOLD: {
                document.execCommand(Command.BOLD, false, arg)
                break
            }
            case Command.ITALIC: {
                document.execCommand(Command.ITALIC, false)
                break
            }
            case Command.UNDERLINE: {
                document.execCommand(Command.UNDERLINE, false)
                break
            }
            case Command.STRIKE_THROUGH: {
                document.execCommand(Command.STRIKE_THROUGH, false)
                break
            }
            case Command.SUBSCRIPT: {
                document.execCommand(Command.SUBSCRIPT, false)
                break
            }
            case Command.SUPERSCRIPT: {
                document.execCommand(Command.SUPERSCRIPT, false)
                break
            }
            case Command.UNDO: {
                document.execCommand(Command.UNDO, false)
                break
            }
            case Command.UNLINK: {
                document.execCommand(Command.UNLINK, false)
                break
            }
            default: {
                document.execCommand(command, false, arg)
                break
            }
        }
    }
}