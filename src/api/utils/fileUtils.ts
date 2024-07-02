import fs from 'fs'

const writeResponseToFile = (
    modelName: string,
    userPrompt: string,
    response: string
) => {
    const date = new Date().toISOString().replace(/:/g, '-')

    const data = {
        modelName,
        userPrompt,
        response,
    }

    fs.writeFileSync(
        './output/' + date + '.json',
        JSON.stringify(data, null, 4)
    )
}

export { writeResponseToFile }
