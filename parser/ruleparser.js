import { parse_rule } from "./parse.js"

export class RuleParser {
  static scalartypes  = ['string', 'int', 'float', 'null', 'boolean', 'binary', 'timestamp']
  static keywords     = [ '_map', '_mapOf', '_mapFacultative','_list', '_listOf', '_listFacultative', '_oneOf', '_regex', '_nb', '_min', '_max', '_in'] // merge?
  static throwOnError = false;

  /**
   *
   * @param {Ctx} ctx
   * @param {string} rule_name
   * @param rule
   * @param current
   * @returns {StringNode|BinaryNode|TimestampNode|IntNode|FloatNode|BooleanNode|NullNode|MapNode|ListNode|null}
   */
  static parse(ctx, rule_name, rule, current) {

    if (current == null) {
      ctx.fileError("No source to parse")
      return null
    }

    if (RuleParser.scalartypes.includes(rule_name) || RuleParser.keywords.includes(rule_name)) {
      ctx.syntaxError(current, `'${rule_name}' is not allowed as rule_name in Lidy Grammar (reserved keyword)`)
      return null
    }

    // Call enter listener if it exists
    let fenter = "enter_" + rule_name
    let isRegex = rule._regex !== undefined
    let matchRegex = new RegExp(rule._regex).test(current.value)
    current.ctx = ctx

    if (ctx.listener && ctx.listener[fenter] && (!isRegex || matchRegex)) {
      ctx.listener[fenter](current);
    }

    // Parse rule
    let parsedRule = parse_rule(ctx, null, rule, current)

    if(this.throwOnError && parsedRule===null)
    {
      if(ctx.errors.length !== 0)
      {
        throw ctx.errors[ctx.errors.length-1];
      }
      else
        throw new Error("Unknown error encountered while parsing.");
    }

    // Call exit listener if it exists
    let fexit = "exit_" + rule_name

    if (ctx.listener && ctx.listener[fexit] && (!isRegex || matchRegex)) {
      ctx.listener[fexit](parsedRule)
    }
    return parsedRule
  }
}
