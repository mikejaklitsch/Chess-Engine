# Use Ubuntu as the base image
FROM ubuntu:20.04

# Set non-interactive mode to avoid user interaction during package installation
ARG DEBIAN_FRONTEND=noninteractive

# Update and install build-essential (includes g++) and cmake
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

# Create a directory for the project source
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Set src directory as a mountable volume
VOLUME ["/usr/src/app/src"]

# Compile C++ files (including subdirectories)
RUN find ./src -name "*.cpp" > sources.txt && \
    g++ @sources.txt -o app

# Command to run the compiled app
CMD ["./app"]
