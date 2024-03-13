import fs from 'fs'

const writeResponseToFile = (
    role: string,
    model_name: string,
    prompt: string,
    response: string
) => {
    const date = new Date().toISOString().replace(/:/g, '-')

    const data = {
        role,
        model_name,
        prompt,
        response,
    }

    fs.writeFileSync(
        './output/' + date + '.json',
        JSON.stringify(data, null, 4)
    )
}

export { writeResponseToFile }
