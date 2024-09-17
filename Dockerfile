FROM node:lts-alpine

WORKDIR /app
COPY . .

RUN npm install --force
RUN npm run build

EXPOSE 3000

# Run the next standalone server
CMD ["node", ".next/standalone/server.js"]