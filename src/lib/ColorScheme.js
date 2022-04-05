const Light = "light"
const Dark = "dark"

const isOneOf = (value) => {
    switch(value) {
        case Light:
        case Dark:
            return true
        default:
            return false
    }
}

export default {
    Light,
    Dark,
    isOneOf
}
