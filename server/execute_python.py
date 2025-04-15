import os
import subprocess
import shutil
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent / "static" / "visualizations"
TEMP_DIR = Path(__file__).resolve().parent / "temp"
DOCKER_DIR = Path(__file__).resolve().parent / "Docker"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def execute_python_script(code, file_id):
    # Ensure a clean temp dir for every request
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    output_png = f"{file_id}.png"
    output_html = f"{file_id}.html"

    # Append save instructions
    if "plotly" in code.lower() and "fig" in code:
        save_code = (
            f"\nimport plotly.io as pio\n"
            f"pio.write_html(fig, '/app/static/visualizations/{output_html}')"
        )
        output_file = output_html
    else:
        save_code = f"\nimport matplotlib.pyplot as plt\nplt.savefig('/app/static/visualizations/{output_png}')"
        output_file = output_png

    complete_code = code + "\n" + save_code
    temp_script_path = TEMP_DIR / f"{file_id}.py"
    temp_script_path.write_text(complete_code)

    try:
        image_name = "python-visualization"

        # Build Docker image
        subprocess.run([
            "docker", "build",
            "-f", str(DOCKER_DIR / "Dockerfile.python"),
            "-t", image_name,
            "."
        ], cwd=DOCKER_DIR, check=True)

        # Run Docker container and mount volumes
        subprocess.run([
            "docker", "run", "--rm",
            "-v", f"{temp_script_path}:/app/{file_id}.py",
            "-v", f"{OUTPUT_DIR}:/app/static/visualizations",
            image_name,
            f"/app/{file_id}.py"
        ], check=True)

        # Clean up temp folder completely
        shutil.rmtree(TEMP_DIR)

        # Return result
        if output_file.endswith(".png"):
            return {"type": "image", "url": f"/static/visualizations/{output_png}", "engine": "matplotlib"}
        elif output_file.endswith(".html"):
            return {"type": "html", "url": f"/static/visualizations/{output_html}", "engine": "plotly"}
        else:
            return {"error": "No output file generated"}

    except subprocess.CalledProcessError as e:
        shutil.rmtree(TEMP_DIR, ignore_errors=True)
        return {"error": f"Docker error: {e}"}
