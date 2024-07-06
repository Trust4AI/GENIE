## Trust4AI Executor Component



## Index

1. [Repository structure](#1-repository-structure)
2. [Deployment](#2-deployment)
   1. [Local deployment](#i-local-deployment)
   2. [Docker deployment](#ii-docker-deployment)
3. [Usage](#3-usage)
4. [License and funding](#4-license-and-funding)

## 2. Repository structure

This repository is structured as follows:

- `docs/openapi/spec.yaml`: This file describes the entire API, including available endpoints, operations on each endpoint, operation parameters, and the structure of the response objects. It's written in YAML format following the [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (OAS).
- `docs/postman/collection.json`: This file is a collection of API requests saved in JSON format for use with Postman.
-  `src/`: This directory contains the source code for the project.
-  `.dockerignore`: This file tells Docker which files and directories to ignore when building an image.
-  `.gitignore`: This file is used by Git to exclude files and directories from version control.
-  `Dockerfile`: This file is a script containing a series of instructions and commands used to build a Docker image.
-  `docker-compose.yml`: This YAML file allows you to configure application services, networks, and volumes in a single file, facilitating the orchestration of containers.

<p align="right">[⬆️<a href="#trust4ai-executor-component">Back to top</a>]</p>

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

It is important that the given `model_name` is defined in the [model configuration file](https://github.com/Trust4AI/executor-component/blob/main/src/api/config/models.ts), and that the model is correctly deployed, as explained above.

In case everything works fine, a JSON object with a `response` property will be returned.

#### i.




To send requests about the component, more intuitively, a [POSTMAN collection](https://github.com/Trust4AI/executor-component/blob/main/docs/postman/collection.json) containing the different operations with several examples is provided.

<p align="right">[⬆️<a href="#trust4ai-executor-component">Back to top</a>]</p>

## 4. License and funding

[Trust4AI](https://trust4ai.github.io/trust4ai/) is licensed under the terms of the GPL-3.0 license.

Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or European Commission. Neither the European Union nor the granting authority can be held responsible for them. Funded within the framework of the [NGI Search project](https://www.ngisearch.eu/) under grant agreement No 101069364.

<p align="center">
<img src="https://github.com/Trust4AI/trust4ai/blob/main/funding_logos/NGI_Search-rgb_Plan-de-travail-1-2048x410.png" width="400">
<img src="https://github.com/Trust4AI/trust4ai/blob/main/funding_logos/EU_funding_logo.png" width="200">
</p>
