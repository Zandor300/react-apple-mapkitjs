class TokenManager {
    static getInstance() {
        if(!TokenManager.instance) {
            TokenManager.instance = new TokenManager()
        }
        return TokenManager.instance
    }

    constructor() {
        this.token = null
        this.lastMapId = 0;
    }

    getToken() {
        return this.token
    }

    setToken(token) {
        this.token = token
    }

    getNewMapId() {
        this.lastMapId++;
        return this.lastMapId;
    }
}

export default TokenManager
