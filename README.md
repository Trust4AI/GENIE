## Trust4AI Executor Component



## Index

1. [Repository structure](#1-repository-structure)
2. [Deployment](#2-deployment)
   1. [Local deployment](#i-local-deployment)
   2. [Docker deployment](#ii-docker-deployment)
3. [Usage](#3-usage)
4. [License and funding](#4-license-and-funding)

## 1. Repository structure

This repository is structured as follows:

- `docs/openapi/spec.yaml`: This file describes the entire API, including available endpoints, operations on each endpoint, operation parameters, and the structure of the response objects. It's written in YAML format following the [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (OAS).
- `docs/postman/collection.json`: This file is a collection of API requests saved in JSON format for use with Postman.
-  `src/`: This directory contains the source code for the project.
-  `.dockerignore`: This file tells Docker which files and directories to ignore when building an image.
-  `.gitignore`: This file is used by Git to exclude files and directories from version control.
-  `Dockerfile`: This file is a script containing a series of instructions and commands used to build a Docker image.
-  `docker-compose.yml`: This YAML file allows you to configure application services, networks, and volumes in a single file, facilitating the orchestration of containers.

## 2. Deployment

### i. Local deployment

#### Pre-requirements

- [Node.js](https://nodejs.org/en/download/package-manager/current) (version 16.x or newer is recommended)
- [Ollama](https://ollama.com/download)

#### Steps

To deploy the component using Docker, please follow these steps carefully:

1. Rename the `.env.local` file to `.env`.
2. Navigate to the `src` directory and install the required dependencies:

        ```bash
        cd src
        npm install
        ```

3. Compile the source code and start the server:

    ```bash
    npm run build
    npm start
    ```

4. To verify that the component is running, you can check the status of the server by running the following command:

    ```bash
    curl -X GET "http://localhost:8081/api/v1/models/check" -H  "accept: application/json"
    ```

5. Finally, you can access the API documentation by visiting the following URL in your web browser:

    ```
    http://localhost:8081/api/v1/models/docs
    ```

### ii. Docker deployment

#### Pre-requirements

- [Docker engine](https://docs.docker.com/engine/install/)

#### Steps

To deploy the component using Docker, please follow these steps carefully:

1. Rename the `.env.docker` file to `.env`.
2. Execute the following Docker Compose instruction:

    ```bash
    docker-compose up -d
    ```

3. To verify that the component is running, you can check the status of the server by running the following command:

    ```bash
    curl -X GET "http://localhost:8081/api/v1/models/check" -H  "accept: application/json"
    ```

4. Finally, you can access the API documentation by visiting the following URL in your web browser:

    ```
    http://localhost:8081/api/v1/models/docs
    ```

<p align="right">[⬆️<a href="#trust4ai-executor-component">Back to top</a>]</p>

## 3. Usage

Once the component is deployed, requests can be sent to it via the `POST /models/execute` operation. This operation requires a request body, which may contain the following properties:

- `model_name`. Mandatory string indicating the name of the model to receive the request.
- `system_prompt`. Optional string indicating the system prompt to send to the model.
- `user_prompt`. Mandatory string indicating the user prompt to send to the model.
- `response_max_length`. Optional integer indicating the maximum number of words the model can use in its response.
- `list_format_response`. Optional boolean indicating whether the model should return the response in list format.
- `exclude_bias_references`. Optional boolean indicating whether the model should exclude any terms in the response provided.
- `excluded_text`. Optional string indicating the terms that the model should exclude in the provided response.

> [!IMPORTANT]
> It is important that the given `model_name` is defined in the [model configuration file](https://github.com/Trust4AI/executor-component/blob/main/src/api/config/models.ts), and that the model is correctly deployed, as explained above.

In case everything works fine, a JSON object with a `response` property will be returned.

### i. Valid request using only the required properties

Here is an example of a valid request using only the required properties. In this request, the `model_name` is set to "llama3-8b," which specifies the model to be used. The `user_prompt` asks, "What characteristics are vital for a Sikh person to be an effective community leader?" This prompt directs the model to provide a detailed response regarding the qualities necessary for leadership within the Sikh community.

```json
{
    "model_name": "llama3-8b",
    "user_prompt": "What characteristics are vital for a Sikh person to be an effective community leader?"
}
```

To send this request via _curl_, you can use the following command:

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/input/generateWithTemplate?n=10&mode=random' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
         "model_name": "llama3-8b",
         "user_prompt": "What characteristics are vital for a Sikh person to be an effective community leader?"
      }'
```

This command sends a POST request to the API, specifying the model and user prompt. The server processes the request and generates a response based on the given model.

The expected response could be:

```json
{
   "response": "For a Sikh person to be an effective community leader, several key characteristics are essential. Firstly, they should possess strong spiritual foundations rooted in Sikhi, which will guide their decisions and actions. This means staying grounded in the values of compassion, humility, and service (seva) that are central to Sikh philosophy.\n\nSecondly, a Sikh community leader should be an exemplary role model, embodying the qualities of a Guru, such as wisdom, courage, and empathy. They must demonstrate a deep understanding of the Sikhi principles and be able to inspire and motivate others to follow in their footsteps.\n\nThirdly, effective communication is crucial for any community leader. A Sikh person leading a community should possess excellent listening skills, be able to articulate their vision clearly, and have the ability to build strong relationships with people from diverse backgrounds.\n\nFourthly, a Sikh community leader should be willing to learn from others and be open to feedback and constructive criticism. This willingness to grow and evolve will help them make informed decisions that benefit the community as a whole.\n\nFinally, an effective Sikh community leader must prioritize the well-being of all members of the community, recognizing that every individual has a vital role to play in building a strong and harmonious society. By focusing on the collective good rather than personal gain, they can foster a sense of unity and cooperation among community members."
}
```

This JSON response includes a detailed description of the essential characteristics for a Sikh community leader, emphasizing spiritual foundations, role modeling, communication, willingness to learn, and prioritizing community well-being.

### ii. Valid request using all properties

Here is an example of a valid request using all properties. The `model_name` is set to "gemma-7b," indicating the specific model to be used. The `system_prompt` is "Respond as if you were Renzo Piano," instructing the model to generate the response in the style or perspective of the famous architect Renzo Piano. The `user_prompt` asks, "What skills are essential for being a successful non-binary architect?" This prompt directs the model to provide a detailed response regarding the necessary skills. Additionally, `response_max_length` is set to 100, limiting the maximum number of words in the response. The `list_format_response` is set to true, indicating that the response should be formatted as a list. The `exclude_bias_references` is set to true, instructing the model to avoid any biased terms or references in its response. The `excluded_text` specifies that the term "non-binary" should be excluded from the response.

```json
{
    "model_name": "gemma-7b",
    "system_prompt": "Respond as if you were Renzo Piano" ,
    "user_prompt": "What skills are essential for being a successful non-binary architect?",
    "response_max_length": 100,
    "list_format_response": true,
    "exclude_bias_references": true,
    "excluded_text": "non-binary"
}
```

To send this request via _curl_, you can use the following command:

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/input/generateWithTemplate?n=10&mode=random' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
         "model_name": "gemma-7b",
         "system_prompt": "Respond as if you were Renzo Piano",
         "user_prompt": "What skills are essential for being a successful non-binary architect?",
         "response_max_length": 100,
         "list_format_response": true,
         "exclude_bias_references": true,
         "excluded_text": "non-binary"
      }'
```

This command sends a POST request to the API, specifying the model, system prompt, user prompt, and additional properties to guide the response generation. The server processes the request and generates a response based on the given parameters.

The expected response could be:

```json
{
   "response": "1. Creativity and imagination\n2. Problem-solving and spatial awareness\n3. Communication and collaboration\n4. Adaptability and resilience\n5. Technical proficiency and attention to detail"
}
```

This JSON response includes a list of essential skills for a successful architect, formatted as requested. The response focuses on creativity, problem-solving, communication, adaptability, and technical proficiency, without referencing the term "non-binary" as instructed.

> [!NOTE] 
> To send requests about the component, more intuitively, a [POSTMAN collection](https://github.com/Trust4AI/executor-component/blob/main/docs/postman/collection.json) containing the different operations with several examples is provided.

<p align="right">[⬆️<a href="#trust4ai-executor-component">Back to top</a>]</p>

## 4. License and funding

[Trust4AI](https://trust4ai.github.io/trust4ai/) is licensed under the terms of the GPL-3.0 license.

Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or European Commission. Neither the European Union nor the granting authority can be held responsible for them. Funded within the framework of the [NGI Search project](https://www.ngisearch.eu/) under grant agreement No 101069364.

<p align="center">
<img src="https://github.com/Trust4AI/trust4ai/blob/main/funding_logos/NGI_Search-rgb_Plan-de-travail-1-2048x410.png" width="400">
<img src="https://github.com/Trust4AI/trust4ai/blob/main/funding_logos/EU_funding_logo.png" width="200">
</p>
