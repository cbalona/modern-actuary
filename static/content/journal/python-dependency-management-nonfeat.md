---
title: "Python Preferred Practice 2: Dependency Management"
description: "Understanding and implementing effective dependency management strategies"
date: "2024-06-15"
---

<!-- This is part 2 of my series on Python Preferred Practices. If you missed it, you can check out [part 1 on Project Structure here](/python-project-structure). -->

BLAHBLAH

Dependency management is one of those topics that feels like a chore when you're first
learning Python. If your script runs, who cares what version of `pandas` you're using,
right? But as you start building more complex applications, collaborating with others,
or deploying your work, you'll quickly realize that disciplined dependency management is
the bedrock of reliable and professional software.

## What is Dependency Management?

At its core, dependency management is the process of managing the external libraries and
tools your project needs to run. When you write `import pandas as pd`, you are declaring
a dependency on the `pandas` library.

But it goes deeper than that. Your project depends on:

- A specific version of Python (e.g., 3.10).
- Specific versions of Python packages (e.g., `pandas==2.2.0`).
- The dependencies of your dependencies (e.g., `pandas` itself depends on `numpy`,
  `pytz`, and others).

Properly managing this entire "dependency tree" ensures that your code works today,
tomorrow, and on any machine.

## Why It Matters

Ignoring dependency management leads to the classic "it works on my machine" problem.
Here’s why a disciplined approach is critical:

- **Reproducibility:** A colleague (or your future self) can set up your project and get
  the _exact same environment_, eliminating version conflicts and unexpected errors.
- **Stability:** Pinning versions prevents a package update from suddenly breaking your
  application. An API in `scikit-learn` might change between versions, and you don't
  want that surprise in production.
- **Isolation:** Different projects on your machine can have different, conflicting
  dependencies. Project A might need `pandas 1.5`, while Project B needs `pandas 2.2`.
  Virtual environments keep them separate and happy.
- **Security:** By explicitly listing your dependencies, you can use tools to scan for
  known vulnerabilities and update packages in a controlled way.

## The Essential Toolkit

### 1. Virtual Environments (`venv`)

A virtual environment is an isolated Python directory that contains its own Python
interpreter and installed packages. It’s the first and most important tool you should
use.

**Always start a new project by creating a virtual environment.**

```bash
# 1. Navigate to your project folder
cd my-actuarial-model

# 2. Create a virtual environment (commonly named .venv or venv)
python -m venv .venv

# 3. Activate the environment

# On Windows (Git Bash or CMD/PowerShell)
source .venv/Scripts/activate

# On macOS/Linux
source .venv/bin/activate

# Your command prompt will now show (.venv) to indicate it's active!

# 4. Install packages into the isolated environment
pip install pandas numpy

# 5. When you're done, deactivate
deactivate
```
