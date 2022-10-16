import { co2 } from '@tgwf/co2'

const model = new co2({
    model: 'swd',
})

/**
 * @param {number} bytes
 * @returns {number} - the number of grams of CO2 emitted
 */
export const estimateEmissions = (bytes) => {
    const emissions = model.perByte(bytes)
    return Number(emissions.toFixed(5))
}
