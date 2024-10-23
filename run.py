import os
import subprocess

def build_docker_image():
    """Build the Docker image."""
    try:
        print("Building Docker image...")
        subprocess.run(["docker", "build", "-t", "my_cpp_project", "."], check=True)
        print("Docker image built successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error building Docker image: {e}")
        exit(1)

def run_docker_container():
    """Run the Docker container with the mounted volume."""
    try:
        # Get the absolute path of the current directory
        current_dir = os.getcwd()

        print("Running Docker container...")
        subprocess.run([
            "docker", "run", "--rm", 
            "-v", f"{current_dir}/src:/usr/src/app/src", 
            "my_cpp_project"
        ], check=True)
        print("Docker container ran successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running Docker container: {e}")
        exit(1)

if __name__ == "__main__":
    build_docker_image()
    run_docker_container()
