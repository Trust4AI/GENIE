import fs from 'fs'

const writeResponseToFile = (
    role: string,
    modelName: string,
    prompt: string,
    response: string
) => {
    const date = new Date().toISOString().replace(/:/g, '-')

    const data = {
        role,
        modelName,
        prompt,
        response,
    }

    fs.writeFileSync(
        './output/' + date + '.json',
        JSON.stringify(data, null, 4)
    )
}

export { writeResponseToFile }
