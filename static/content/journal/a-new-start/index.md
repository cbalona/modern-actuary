---
title: "A New Start"
description: "Announcing the relaunch of the website. I've updated the Python Preferred Practices series, archived older content, and plan to contribute more regularly."
date: "2025-11-16"
pinned: true
---

It’s been a while.

The world of software development and data science has changed a lot since I last wrote here. AI and LLMs are more commonplace. `uv` has changed how I manage Python and Python projects and what was considered a "preferred practice" a year or two ago might feel a bit dated today. With all the changes, I felt it was time to give this website a refresh and relaunch.

The goal remains the same: to collect and share thoughts and ideas on modernising the actuarial toolkit. I’m excited to get back to it.

## Updating the "Python Preferred Practices"

The first step was to revisit the **Python Preferred Practices (PPP)** series. `uv` has had a massive impact on the Python ecosystem, and I use it extensively now. So, I’ve updated the PPP posts to reflect this new reality.

The most significant change is the move to [`uv`](https://docs.astral.sh/uv/) for both Python version management and dependency management. If you've read the original posts, you'll remember the workflow involved a combination of `pyenv`, `virtualenv`, and `pip-tools`. While that approach is still perfectly valid, `uv` has simplified things immensely by rolling all that functionality (and more) into a single tool.

- **[PPP 1: Python Version Management](./ppp-1-python)** has been updated to reflect how `uv` can install and manage different Python versions.
- **[PPP 2: Dependency Management](./ppp-2-dependency-management)** now demonstrates how to use `uv` with a `pyproject.toml` file to create virtual environments and manage project dependencies in a clean, modern way.

You might also notice that **PPP 3: Project Automation** has been deprecated. With `uv` handling so much of the environment setup automatically, the old `Makefile` approach felt a bit heavy for simple projects. Automation is still an important topic for more complex workflows, and I plan to revisit it in a future post.

## Archiving and Moving Forward

To keep the main page focused and relevant, I’ve moved many of my older posts to an **[archive](../archive)**. I also removed the apps I used to host. They were fun to make and served their purpose as a learning exercise for me. I tried to rebuild them for the new site, but they were taking too much time, and I figured it was better to focus on writing about more relevant stuff.

## Looking Ahead

My intention is to contribute more regularly from now on. I have evolved greatly since the last time I posted. My current role, where I work on climate modelling for Old Mutual Insure, has taken a lot of my focus. However, it developed my skills greatly. I have also written three longer form papers since posting here, two on LLMs, and one on mortality modelling.

I think AI is a double-edged sword. It is immensely useful and beneficial if used correctly, it can also be a huge hindrance to learning, quality, and uniqueness if used poorly. I plan to write more about this in future posts.

Thanks for reading, and stay tuned.
