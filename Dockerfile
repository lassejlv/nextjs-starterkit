FROM node:lts-alpine

WORKDIR /app
COPY . .

RUN npm install --force
RUN npm run build

# Make stacic files available to the standalone server
RUN mkdir -p standalone/.next/static
RUN cp -r .next/static/* standalone/.next/static
RUN cp -r public standalone/public


EXPOSE 3000

# Run the next standalone server
CMD ["node", ".next/standalone/server.js"]