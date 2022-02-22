import { isSeq  } from 'yaml'
import { ListNode } from "../nodes/collections/listnode.js"
import { ScalarParser } from "./scalarparser.js"
import { parse_rule } from './parse.js'
import { CollectionParser } from "./collectionparser.js"
  
export class ListParser {

  static parse(ctx, rule, current) {
    // current value is a list
    if (!ListNode.checkCurrent(current)) {
      ctx.syntaxError(current, `Error : a list is expected `)
      return null
    }
  
    // quantity checkers are verified
    if (!CollectionParser.sizeCheckers(ctx, rule, current)) {
      return null
    }
    
    // get values for llist keywords 
    let listNode = rule._list
    let listOfNode = rule._listOf
    let listFacultativeNode = rule._listFacultative
    
    // values for keywords are lists if not null
    if ((listNode != null && !(listNode instanceof Array)) || 
        (listFacultativeNode != null && !(listFacultativeNode instanceof Array))) {
      ctx.grammarError(`Error : error in list value definition`)
      return null
    }
  
    let idx = 0
    let nbItems = current.items.length
    let parsedList = []

    // parse mandatory items 
    if (listNode) {
      listNode.forEach(lidyItem => { 
        if (idx < nbItems) {
          let newEle = parse_rule(ctx, null, lidyItem, current.items[idx])
          if (newEle == null) {
            ctx.syntaxError(current, `Error : can node parse an element of the list`)
            return null
          } else {
            parsedList.push(newEle)
          }
        } else {
          ctx.syntaxError(current, `Error : mandatory elements missing in the list`)
          return null
        }
        idx += 1
      })
    }

    // parse optional elements 
    let tmpErrors = [].concat(ctx.errors)
    let tmpWarnings = [].concat(ctx.warnings)
    if (listFacultativeNode) {
      listFacultativeNode.forEach(lidyItem => {
        if (idx < nbItems) {
          let newEle = parse_rule(ctx, null, lidyItem, current.items[idx])
          if (newEle != null) {
            parsedList.push(newEle)
            idx += 1
          }
        }
      })
    }
    
    // parse listOf elements
    if (listOfNode != null) {
      for (; idx < nbItems; idx++) {
        let newEle = parse_rule(ctx, null, listOfNode, current.items[idx])
        if (newEle == null) {
          ctx.syntaxError(current, `Error : wrong type for an element in a list`)
          return null
        } else {
          parsedList.push(newEle)
        }
      }
    }

    // every element of the current list should have been parsed
    if (idx < nbItems) {
      ctx.syntaxError(current, `Error : too much elements in the list`)
      return null
    }

    // if everything is ok, errors have to be cleaned of errors throwed during optional elements parsing
    ctx.errors = tmpErrors
    ctx.warnings = tmpWarnings

    return new ListNode(ctx, current, parsedList)
  }

  static parse_any(ctx, current) {
    // current value is a list whose keys are strings
    if (!ListNode.checkCurrent(current)) {
      ctx.syntaxError(current, `Error : a list whose keys are strings is expected `)
      return null
    }

    let parsedList = []
    current.items.forEach(item => {
      let parsedValue = ScalarParser.parse_any(ctx, item)
      if (parsedValue == null) {
        ctx.SyntaxError(value, `Error : bad value '${value}' found for '${key}' (listparser.parse_any)`)
        return null
      }
      parsedList.push(parsedValue)
    })
    return new ListNode(ctx, current, parsedList)
  }
}

