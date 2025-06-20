export class RateLimitError extends Error {
    constructor(message: string = "Rate limit exceeded") {
        super(message);
    }
}
