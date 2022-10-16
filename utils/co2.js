/**
 * @param {number} bytes
 * @returns {number} - the number of grams of CO2 emitted
 */
export const estimateEmissions = (bytes, co2js) => {
    const emissions = co2js.perByte(bytes)
    return Number(emissions.toFixed(5))
}
