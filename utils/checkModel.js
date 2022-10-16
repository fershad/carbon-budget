const models = ['swd', '1byte']

export const checkModel = (model) => {
    if (!models.includes(model)) {
        throw new Error(`Invalid model: "${model}". Valid models are: ${models.toString()}`)
    }
}
