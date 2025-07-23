# Use a lightweight Nginx image as the base
FROM nginx:alpine

# Copy the project files into the Nginx web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
