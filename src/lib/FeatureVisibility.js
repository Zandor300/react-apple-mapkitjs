const Adaptive = "adaptive"
const Hidden = "hidden"
const Visible = "visible"

const isOneOf = (value) => {
    switch(value) {
        case Adaptive:
        case Hidden:
        case Visible:
            return true
        default:
            return false
    }
}

export default {
    Adaptive,
    Hidden,
    Visible,
    isOneOf
}
