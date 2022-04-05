const Standard = "standard"
const MutedStandard = "mutedStandard"
const Hybrid = "hybrid"
const Satellite = "satellite"

const isOneOf = (value) => {
    switch(value) {
        case Standard:
        case MutedStandard:
        case Hybrid:
        case Satellite:
            return true
        default:
            return false
    }
}

export default {
    Standard,
    MutedStandard,
    Hybrid,
    Satellite,
    isOneOf
}
