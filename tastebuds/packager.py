import os
import zipfile
import subprocess

# internal tool to create releases. calls npm run build then packages the build into release.zip

def create_release():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    react_dir = base_dir

    print("Running npm build...")
    subprocess.run(
        ["npm.cmd", "run", "build"],
        cwd=react_dir,
        check=True
    )

    zip_path = os.path.join(base_dir, "release.zip")

    if os.path.exists(zip_path):
        print("Replacing existing release.zip")
        os.remove(zip_path)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(
            os.path.join(base_dir, "run.py"),
            "run.py"
        )

        dist_dir = os.path.join(react_dir, "dist")

        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                file_path = os.path.join(root, file)
                archive_path = os.path.relpath(file_path, base_dir)
                zipf.write(file_path, archive_path)

    print(f"Created {zip_path}")

if __name__ == "__main__":  # run
    create_release()