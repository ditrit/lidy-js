import { YAMLError } from 'yaml'

class LidyError extends YAMLError {
    constructor(name, pos, message) {
        super(name, pos, 'IMPOSSIBLE', message);
        this.name = name
    }

    pretty(ctx) {
        this.linePos = ctx.lineCounter.linePos(this.pos)
        const { line, col } = this.linePos
        this.message += ` at line ${line}, column ${col} ${(ctx.file) ? ' @'+ctx.file : ''}`;
    }
}

export { LidyError }

