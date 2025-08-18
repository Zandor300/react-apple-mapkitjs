const Light = "light"
const Dark = "dark"
const Adaptive = "adaptive"

const isOneOf = (value) => {
    switch(value) {
        case Light:
        case Dark:
        case Adaptive:
            return true
        default:
            return false
    }
}

export default {
    Light,
    Dark,
    Adaptive,
    isOneOf
}
