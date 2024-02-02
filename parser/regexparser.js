import { FloatNode } from "../nodes/scalars/floatnode.js";
import { StringNode } from "../nodes/scalars/stringnode.js"

export class RegexParser {

  static parse(ctx, rule, current) {
    let currentValueIsFloat = FloatNode.checkCurrent(current)

    // determine current value type
    if (currentValueIsFloat) {
      current.value = current.value.toString()
    } else if (! StringNode.checkCurrent(current)) {
      ctx.syntaxError(current, `Error: regular expressions match only strings, '${(current) ? current.value : ""}' is not a string`)
      return null
    }

    // rule syntax is ok ('_regex' is the only one keyword)
    let ruleValue = rule._regex
    if (ruleValue == null) {
      ctx.grammarError(`Error : regexp rule must have a value for key '_regex'`)
      return null
    }

    // regex pattern is ok (can be parsed as javascript regexp)
    let regex = null
    try {
      regex = new RegExp(ruleValue)
    } catch (error) {}
    if (regex == null) {
      ctx.grammarError(`Error: value '${regex}' is not a valid regular expression`)
      return null
    }

    // string value matches the regex pattern
    if (! regex.test(current.value)) {
      ctx.syntaxError(current, `Error: value '${current.value}' does not match the regular expression '${regex}'`)
      return null
    }

    // everything is ok
    if (currentValueIsFloat) {
      current.value = parseFloat(current.value)
      return new FloatNode(ctx, current)
    } else {
      return new StringNode(ctx, current)
    }
  }
}
