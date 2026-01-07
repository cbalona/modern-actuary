---
title: "Python Preferred Practice 1: Python Version Management"
description: "Choosing the right Python version and using uv to manage installations across different projects seamlessly."
date: "2023-07-17"
changelog:
  - date: "2025-11-16"
    description: "Changed `pyenv` to `uv`"
---

It can be daunting to learn a new programming language, especially if its your first
one. Even more confusing, is that everyone will have different ways of doing things, and
there is no one right way, and often conflicting ways of doing things. If you are new to
Python, or programming in general, I will be sharing what I term my "Python Preferred
Practices" (PPP) for doing things in Python. This is not the only way to do these
things, but it is the way I do things, and I have found it to be a good way to do
things. I prefer it. I hope you will too.

This is not a tutorial on Python. I will not be teaching you how to program in Python. I
will be showing you how I prefer to do things in and around Python. It makes sense to me
to start from the beginning, so I will start with how I prefer to install and manage
Python on my computer. Which is not as immediately obvious as it might seem.

## "So I don't just download the latest one?"

You may be thinking exactly that: "Uh, just download it from the Python website and
install it? Simple?"

Yes, that is simple. And it works most of the time. Until it doesn't. What does that
mean? See, those new to programming or computer software in general may think that
making sure they have the latest and greatest version is all they need to do. In most
cases yes. But for programming, you are often making use of a wide variety of other
software and code alongside Python. This software and code is evolving and growing too.
And they have their own versions. And these versions can often conflict with the version
of Python you are using.

See, if you use the very latest version of Python, there is a chance that some of the
packages you use (like `pandas`, `scikit-learn`, `tensorflow`) have not had time to
update themselves for the latest version of Python. So as soon as you update Python, you
may not be able to install these packages or your code may not even work as expected.
Plus, the very latest version of Python may have some undiscovered bugs in it that still
need to be ironed out.

So what I do, my preferred way, is to use last years version of Python. What does this
mean? It means if 3.11 was released this year, I use 3.10. When 3.12 gets released, I
start to use 3.11 more generally, and bump new projects up to it. Why do I do it like
this? I have found over the last several years that it has worked nicely for me in
avoiding version conflicts and bugs. I have no detailed rationale for it. Its just how I
prefer it, and it seems safe. After a year, major bugs should be ironed out, and popular
packages will almost certainly be updated for the new version by then.

I think you should find a flow that works for you. Maybe it is 6 months, maybe it is 3,
maybe it is 9. For me, about a year give or take works well.

## "Okay but wait, I am using 3.11.3, but 3.11.4 just got released."

"So do I wait a year before using that? But then 3.12 will be out? What gives man?"

Good question. Let me introduce you to ["semantic versioning"](https://semver.org/). You
see all those version numbers for software? Things like `5.25.3`, `9.0.4`, `2.11.4b`,
etc. There is a good chance that the versioning system of the software is semantic
versioning. That means there is a logical system to how the versions are decided.

So how does it work? It gets a bit complicated, but you will generally only have to
worry about the first 2 numbers in a version. The versions typically follow this
pattern: `MAJOR.MINOR.PATCH`.

Increases to `MAJOR` are **MAJOR**. As the name suggests. Which means, the changes will
likely break your code, and significantly change how things work. If you want a prime
example of how crazy this can get, just read up on the update from Python 2 to Python 3.
It was a wild ride. Now, there is not expected to be a Python 4 anytime soon, if ever.
So you won't really have to worry about that. But, for other software, or Python
packages like `pandas` for example, you know that if the **MAJOR** unit changes, then
things will be changing majorly. `Pandas` did this very recently, from a major of 1 to a
major of 2. Have a look at the [release
notes](https://pandas.pydata.org/docs/dev/whatsnew/v2.0.0.html) to get a feel of how
things change, particularly the "_Backwards incompatible API changes_" section. Thats
the key with a major change, old code most likely won't work with the new version.

Then there is the `MINOR` item. As suggested, minor changes that won't break older code
have been made, in addition to new functionality being added. This is generally true,
but sometimes its not always possible, so there may be cases where a minor change does
break functionality, but its generally avoided if it can be. Python itself does not
strictly follow semantic versioning, and so it can certainly happen (but I don't recall
it ever being an issue for me, personally).

Finally, the `PATCH` item changes when there are bug fixes and patches. So no new
functionality, no changes to how things work outside of fixing things that went wrong in
the **MAJOR** or **MINOR** update.

So, this should lead to a clearer strategy to updating Python. I wait a yearish between
**MINOR** updates, I immediately update for **PATCHES** because they fix bugs. I was not
writing and maintaining significant code bases when Python's last **MAJOR** change was
made, so I am undecided on that. But I would probably wait a few years.

## "Cool cool cool. Is there an easy way to manage this?"

Yes there is. My preferred way is using [`uv`](https://docs.astral.sh/uv/).

What is `uv`? It is a Python package and project manager that provides plenty of really
useful functionality (something I plan to expand on in future posts). But the part I
want to focus on here is its ability to manage multiple Python versions on your
computer, and let you easily switch between them.

```bash
uv python install 3.11
```

Now you have the latest `patch` version of Python 3.11. But wait, you are working on a
project where one of the packages you require works only on Python 3.10! Before `uv` you
might have downloaded and installed Python 3.10 alongside 3.11. But that's asking for
trouble. When you run Python, which version does your system use? If you run `pip`,
which version gets the package installed? It's not clear!

Maybe you uninstall 3.11? Then you have to reset all your system settings to point to
3.10 and not 3.11. And some code you wrote uses features only in 3.11! I guess another
option is to be explicit about which Python version to use every time you run a file.
But that's going to be horribly annoying!

Or, you just use `uv`:

```bash
uv python install 3.10
cd /project/folder/
uv python pin 3.10
```

A small `.python-version` file is created in the project folder. Now, that folder always uses 3.10. New version comes out? Easy!

```bash
uv python upgrade
```

New version! No hassle.

It is fantastic and I strongly recommend using it to manage your Python installations
outright. No more `python: command not found` errors anymore.

## Some extra remarks

Okay, let's leave it there for this one. But before you go, a few more footnotes I have
regarding managing Python.

### "Bro, just use Anaconda!"

Anaconda (and `conda`) were super popular a few years back. And its influence is still
big, although I've noticed it losing popularity. Why was it so popular? It made using
Python for data science really easy if you didn't want to worry about Python versions,
version control for packages, complicated installs, etc. It basically pre-built and
prepackaged things for you. Like buying a ready made sandwich instead of the bread,
meat, cheese and butter, and making it yourself.

Yes, it made things simple. But my goodness, I hated it every time I used it. It's super
bloated, slow, and always out of date. And worst of all, it tended to break so many
things on my computer. Maybe I just didn't know how to use it properly, but I never
liked it. And I never liked needing to download gigabytes of software to write a 5
kilobyte script, and having all that software hang around. Also, it's really focused on
data science, so if you aren't doing much of that work, its not really for you.

I much preferred managing Python myself and creating my own _virtual environments_
(don't worry if that sounds foreign to you, that's the next one I am tackling), with
only the essentials. I also like the freedom of choosing what I put on my sandwich, and
how I cut it.

Granted, several years back, things were trickier if you did it yourself. But lately, it
is massively easier to just use `uv` and manage things myself. Hopefully I'll
demonstrate the advantages in the next few articles.

If you are a die hard Anaconda / `conda` fan and you refuse to give my preferred
practice a go, I would say: have a look at
[`mamba`](https://mamba.readthedocs.io/en/latest/user_guide/mamba.html) or it's lighter
version
[`micromamba`](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html). I
have tried them briefly, and they are waaay nicer than `conda` in my opinion. Fast and
clean.

### Python is technically not the beginning, there is another choice.

Windows, Mac, or Linux?

Yes, it's a big one. It's an advanced one. I do have a preference. But I think we should
leave it for later.

The reason I did not tackle this first is because I think most people new to Python and
programming are likely to be using Windows primarily for all their work (at least in my
experience, I know Mac is much more popular outside my home country). If you are at the
stage where you are considering choosing between systems, you are likely at a stage
where you understand things more deeply and are reading this article mainly for interest
sake, or to evaluate the practices of others. If you are using Linux already as your
main driver, then I doubt you are considering Windows or Mac!

Spoiler alert: I prefer Linux for programming, but I prefer Windows for everything else.
Truth is, they can co-exist very nicely without dual-booting your system (where you have
both Windows and Linux installed, which can be messy). You guessed it: I use Windows
Subsystem for Linux (WSL) for all my programming.
