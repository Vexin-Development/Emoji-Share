from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="discord-emoji-hub",
    version="1.0.0",
    author="Vexing Development",
    description="Official Python SDK for Discord Emoji Hub",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/TheUselessCreator/Discord-Emoji-Hub",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.8",
    install_requires=[
        "httpx>=0.25.0",
        "typing-extensions>=4.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.21.0",
            "black>=22.0.0",
            "mypy>=1.0.0",
        ]
    }
)