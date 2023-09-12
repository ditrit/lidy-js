import { YAMLError } from 'yaml'

class LidyError extends YAMLError {
    constructor(name, pos, message) {
        super(name, pos, 'IMPOSSIBLE', message);
        this.name = name
    }

    /**
     * Add extra info to the exception message, given a context.
     * @param {Ctx} ctx - A context.
     */
    pretty(ctx) {
        this.linePos = ctx.lineCounter.linePos(this.pos)
        const { line, col } = this.linePos
        this.message += ` at line ${line}, column ${col} ${(ctx.file) ? ' @'+ctx.file : ''}`;
    }
}

export { LidyError }

