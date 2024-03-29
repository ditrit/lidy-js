import { LidyError } from './errors.js'
import { LineCounter } from 'yaml'

export class Ctx {
    constructor() {
        this.lineCounter = new LineCounter()
        this.src = ""
        this.file = ""
        this.txt = ""
        this.errors   = []
        this.warnings = []
        this.yaml_ok  = false
        this.contents = null
        this.listener = null
        this.prog = {}
    }

    errors(newErrors) {
        this.errors = this.errors.concat(newErrors)
    }

    warnings(newWarnings) {
        this.warnings = this.warnings.concat(newWarnings)
    }

    fileError(message) {
        let e = new LidyError('FILE_ERROR', 0, `FileError : ${message}`)
        e.pretty(this);
        this.errors.push(e)
        return e
    }

    syntaxError(current, message) {
        let e = new LidyError('SYNTAX_ERROR', (current.range) ? current.range[0] : 0, `SyntaxError : ${message}`)
        e.pretty(this);
        this.errors.push(e)
        return e
    }

    syntaxWarning(current, message) {
        let e = new LidyError('SYNTAX_WARNING', (current.range) ? current.range[0] : 0, `SyntaxWarning : ${message}`)
        e.pretty(this);
        this.warnings.push(e)
        return e
    }

    typeError(current, message) {
        let e = new LidyError('TYPE_ERROR', (current.range) ? current.range[0] : 0, `TypeError : ${message}`)
        e.pretty(this);
        this.errors.push(e)
        return e
    }

    grammarError(message) {
        let e = new LidyError('GRAMMAR_ERROR', 0, `GrammarError : ${message}`)
        e.pretty(this);
        this.errors.push(e)
    }

    grammarWarning(message) {
        let e = new LidyError('GRAMMAR_WARNING', 0, `GrammarWarning : ${message}`)
        e.pretty(this);
        this.warnings.push(e)
        return e
    }

    fails() {
        return this.errors.length > 0
    }

    success() {
        return this.errors.length === 0 && this.warnings.length === 0
    }

    result() {
        return this.contents
    }
}
