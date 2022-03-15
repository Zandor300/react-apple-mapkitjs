class TokenManager {
    static getInstance() {
        if(!TokenManager.instance) {
            TokenManager.instance = new TokenManager()
        }
        return TokenManager.instance
    }

    constructor() {
        this.token = null
    }

    getToken() {
        return this.token
    }

    setToken(token) {
        this.token = token
    }
}

export default TokenManager
