FROM node:18-alpine3.19

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

# Use build secrets to create the .env file
RUN --mount=type=secret,id=PORT \
    --mount=type=secret,id=JWT_SECRET \
    --mount=type=secret,id=AWS_REGION \
    --mount=type=secret,id=AWS_ACCESS_KEY_ID \
    --mount=type=secret,id=AWS_ACCESS_KEY_SECRET \
    --mount=type=secret,id=AWS_S3_BUCKET_NAME \
    --mount=type=secret,id=MYSQL_HOST \
    --mount=type=secret,id=MYSQL_PORT \
    --mount=type=secret,id=MYSQL_USERNAME \
    --mount=type=secret,id=MYSQL_PASSWORD \
    --mount=type=secret,id=MYSQL_DBNAME \
    --mount=type=secret,id=CYPHER_KEY \
    --mount=type=secret,id=CYPHER_IV \
    --mount=type=secret,id=ALLOW_LIST \
    sh -c 'echo "PORT=$(cat /run/secrets/PORT)" >> .env && \
            echo "JWT_SECRET=$(cat /run/secrets/JWT_SECRET)" >> .env && \
            echo "AWS_REGION=$(cat /run/secrets/AWS_REGION)" >> .env && \
            echo "AWS_ACCESS_KEY_ID=$(cat /run/secrets/AWS_ACCESS_KEY_ID)" >> .env && \
            echo "AWS_ACCESS_KEY_SECRET=$(cat /run/secrets/AWS_ACCESS_KEY_SECRET)" >> .env && \
            echo "AWS_S3_BUCKET_NAME=$(cat /run/secrets/AWS_S3_BUCKET_NAME)" >> .env && \
            echo "MYSQL_HOST=$(cat /run/secrets/MYSQL_HOST)" >> .env && \
            echo "MYSQL_PORT=$(cat /run/secrets/MYSQL_PORT)" >> .env && \
            echo "MYSQL_USERNAME=$(cat /run/secrets/MYSQL_USERNAME)" >> .env && \
            echo "MYSQL_PASSWORD=$(cat /run/secrets/MYSQL_PASSWORD)" >> .env && \
            echo "MYSQL_DBNAME=$(cat /run/secrets/MYSQL_DBNAME)" >> .env && \
            echo "CYPHER_KEY=$(cat /run/secrets/CYPHER_KEY)" >> .env && \
            echo "CYPHER_IV=$(cat /run/secrets/CYPHER_IV)" >> .env && \
            echo "ALLOW_LIST=$(cat /run/secrets/ALLOW_LIST)" >> .env'

EXPOSE 8080

USER node

CMD [ "node", "index.js" ]
