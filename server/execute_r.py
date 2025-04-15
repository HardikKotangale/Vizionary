import os
import subprocess
import shutil
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent / "static" / "visualizations"
TEMP_DIR = Path(__file__).resolve().parent / "temp"
DOCKER_DIR = Path(__file__).resolve().parent / "Docker"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def execute_r_script_docker(code, file_id):
    # Clean and recreate temp folder
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    output_png = f"{file_id}.png"
    output_html = f"{file_id}.html"

    # Determine which engine to use
    if "plotly" in code.lower() and "fig" in code:
        save_code = (
            f"\nlibrary(plotly)\n"
            f"htmlwidgets::saveWidget(fig, '/app/static/visualizations/{output_html}', selfcontained = TRUE)"
        )
        output_file = output_html
        engine = "plotly"
        result_type = "html"
    else:
        save_code = f"\nggsave('/app/static/visualizations/{output_png}')"
        output_file = output_png
        engine = "ggplot2"
        result_type = "image"

    complete_code = code + "\n" + save_code
    temp_code_path = TEMP_DIR / f"{file_id}.R"
    temp_code_path.write_text(complete_code)

    try:
        image_name = "r-visualization"
        dockerfile_path = DOCKER_DIR / "Dockerfile.r"

        # Build the Docker image
        subprocess.run([
            "docker", "build",
            "-f", str(dockerfile_path),
            "-t", image_name,
            "."
        ], cwd=DOCKER_DIR, check=True)

        # Run the Docker container
        subprocess.run([
            "docker", "run", "--rm",
            "-v", f"{temp_code_path}:/app/{file_id}.R",
            "-v", f"{OUTPUT_DIR}:/app/static/visualizations",
            image_name,
            f"/app/{file_id}.R"
        ], check=True)

        shutil.rmtree(TEMP_DIR)

        output_path = OUTPUT_DIR / output_file
        if output_path.exists():
            return {
                "type": result_type,
                "url": f"/static/visualizations/{output_file}",
                "engine": engine
            }
        else:
            return {"error": "No output file generated"}

    except subprocess.CalledProcessError as e:
        shutil.rmtree(TEMP_DIR, ignore_errors=True)
        return {"error": f"Docker error: {e}"}
