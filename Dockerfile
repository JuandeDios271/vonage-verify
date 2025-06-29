# Imagen con Node JS
FROM node:22.14.0-alpine

# Recibe la variable PORT desde docker-compose
ARG PORT
ENV PORT=${PORT}

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias (solo producción)
RUN npm install --omit=dev

# Copia el resto de los archivos
COPY . .

# Expón el puerto configurado dinámicamente
EXPOSE ${PORT}

# Comando de inicio
CMD ["node", "index.js"]