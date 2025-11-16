---
title: "Python Preferred Practice 2: Dependency Management"
description: "Understanding and implementing effective dependency management strategies."
date: "2023-07-25"
---

Dependency management is one of those topics that feels like a chore when you're first
learning Python. If your script runs, who cares what version of `pandas` you're using,
right? But as you start building more complex applications, collaborating with others,
or deploying your work, you'll quickly realize that disciplined dependency management is
the bedrock of reliable and professional software.

## What is Dependency Management?

Dependency management encompasses the approaches taken to manage the dependencies of a
piece of software. If you are writing a Python script, there are far more dependencies
than you might think. The most obvious dependencies are the Python packages that you
import into your script. When you `pip install` something, you are actually fetching a
specific version of that something. Further, there are also dependencies on the version
of Python that you are using (like I discussed in my last PPP), and on the operating
system that you are running on. You may not know it, but there are innumerable things
happening beneath the surface that often just work for us. It is actually amazing when
you think about it.

Those packages you use? They depend on packages too. And those packages depend on other
packages. Sometimes, they depend on other operating systems. Some packages are written
to run purely on Linux, other, on Windows. Some depends on certain hardware, like
[RAPIDS](https://rapids.ai/) which requires an NVIDIA graphics card. I mean, your actual
computer depends on the voltage of the electricity that is supplied to it. It's all
dependencies. It always has been.

![Dependency Tree Meme](./media/dependency-meme.jpg)

So where do we start? It seems a bit overwhelming.

Well. A good place to focus is just on your software, and what it needs. There are two
things I am going to focus on in this PPP: 1) Ring-fencing your dependencies, and 2)
defining your dependencies.

## Ring Fencing Your Dependencies: Or how I learned to stop worrying and love virtualenv

You may have heard of virtual environments and that you should be using them. But what
are they? And why should you use them?

Let's ignore the name for now. Let's focus on a problem and see how virtual environments
are the solution.

You are writing a script. But, you need a specific version of a package. Turns out, the
package you were using removed a feature, or changed how it worked, significantly. You
need to use the old version. However, you also need to use the new version for another
script. What do you do?

You can completely change your code to use the new version only. But, thats not
realistic. In practice, so many things are changing that you simply can't keep
re-writing all your code all the time every time a package updates. Ain't nobody got
time for that.

So ideally, you could have both versions installed, and specify which version to use.
Starting to sound familiar? This is the same problem we have with Python versions.
Ideally, you want a way to manage different versions of this package, and specify which
version to use for which script.

Virtual environments solve this problem, and a whole host of other problems.
Essentially, what they do is create a specific environment within which you will
operate. This environment is completely separate from any other environment you may
have. It has its own Python version, its own packages, its own everything. This is a
completely separate environment. It is like a little bubble that you can do whatever you
want in, and it won't affect anything outside of that bubble. (The very astute of you
may disagree, but in 99.9% of cases this is true.)

For every new project, you ideally want to give it its own space where it can live its
own life, unhindered. This is what virtual environments do. They ring-fence your
dependencies. Let's see how it works, in detail.

## Enter: virtualenv

There are so many ways to create and manage virtual environments. You might come across:
venv, virtualenv, poetry, pip-env, conda, virtualenvwrapper, and many more. I am going
to focus on virtualenv, because it is the one I use, and it is the one I prefer. Why do
I prefer it? Simplicity.

When you want a virtual environment, there are two-point-five things you need to do:
0) install virtualenv if you don't already have it `pip install virtualenv`
1) create it
2) activate it

That's it. That's all you need to do. And virtualenv does just that. It creates a
virtual environment, and it activates it. It is that simple. Let's see how it works.
You'd create a project in a folder, and then create a virtual environment in that folder
and activate it. You can do this by running the following commands in your command line
or terminal:

```bash
# create a new virtual environment
virtualenv .venv

# activate the virtual environment
source .venv/bin/activate # on windows: .venv\Scripts\activate
```

That's it, now you are in your virtual environment. Anything you do, as long as the
environment is activated, will happen within this virtual environment. Where is this
virtual environment? It is in the folder where you created it.

If you look in that folder, there will be a ".venv" folder, and in that folder will be
your Python version, and all the packages you install. It all happens in this folder.
Its all ring-fenced here.

Want a new package? Make sure your environments is activated and `pip install pandas`.
Now, this version of `pandas` will exist only in this folder for this environment.

Now, notice earlier I said two-point-five things to do? Yea, you need to install
virtualenv globally first. But, you only need to do that once. So, it is really just two
things to do once you have it installed. Also, don't forget, if you are using `pyenv` to
manage your Python versions, you need to make sure you have the version you want to use
installed and activated before you create your virtual environment or install
`virtualenv`.

## Okay, we have ring-fenced our environment. Where is the dependency management?

Okay, yea, no dependency management yet. You got me! However, dependency management
needs a strictly controlled environment before its useful. So, now that we have that, we
can enforce our dependencies.

We need a way to tell users of our software what versions we depend on. A natural way to
do this is to create a file that lists all the packages we depend on, and their
versions. In Python, this is the `requirements.txt` file. In this file, you simply list
your projects requirements. A nice easy way has always been to say `pip freeze >
requirements.txt`. What this does is write *aaaallll* your installed packages and their
versions to the `requirements.txt` file. But I don't like that. It's verbose, and it
feels the wrong way around.

It feels weird to me to install what I need, and then define a file to say what I need,
based on what I needed. Right? Weird. Also, sometimes there might be conflicts. If I
just install what I need and then say what I need, I have not checked what my
dependencies need. And there is **no way** I am going through all the dependencies of my
dependencies to check their dependencies. That's just silly.

Rather, I would want to define upfront what I need (and change it as I go along) and
have my `requirements.txt` automatically created based on my specifications, and to
check all my depencencies dependencies.

Again, some virtual environment managers do this for you. But, I like to keep things
simple. I like simple. So, I use `pip-tools`.

`pip-tools` is a collection of tools (really only two tools) that can help me manage my
dependencies. It is a Python package, so you can install it with `pip install
pip-tools`. It has two tools: `pip-compile` and `pip-sync`. Let's see how they work.

## pip-compile: compiling my requirements.txt

Instead of a `requirements.txt`, I can instead create a `requirements.in` file. Within
this file, I list my dependencies:

```text
pandas==1.0.3
numpy==1.18.2
chainladder==0.8.3
```

And so forth. Now, this is not much different to simply doing the same in a
`requirements.txt` file. But, the real magic comes in when we run:

```bash
pip-compile requirements.in
```

What this does, is it creates our `requirements.txt` file by checking all dependencies
and dependencies dependencies. What we get is a much more robust `requirements.txt` file
that is based on our `requirements.in` file. This is much better. Now, we can simply run
`pip install -r requirements.txt` and we will have all our dependencies installed. But,
we can do better.

## pip-sync: syncing our virtual environment with our requirements

We can simply run `pip-sync` to sync our virtual environment with our requirements. This
will make sure our installed packages exactly match our requirements. Any packages we
don't need are removed, any packages we don't have are installed, and any packages that
don't meet our version constraints are upgraded or downgraded to meet our requirements.
All we need is `pip-sync`.

## This is starting to become a lot of commands

Yes, yes it is. And if you are like me, you don't want to remember them all, let along
type them all out, time and time again. I have a solution to that. But, I will leave it
for PPP 3: Project Automation.

What I have shown in this PPP, is my preferred way to set up a virtual environment and
define my dependencies. We've discussed `virtualenv`, my preferred virtual environment
manager, and `pip-tools`, my preferred dependency manager. I have shown how to use them,
and why I prefer them. I have also shown how to use them together to create a robust
dependency management system.

I hope this has been valuable. I look forward to writing up the next one.