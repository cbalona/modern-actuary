---
title: "Python Preferred Practice 3: Formatting"
description: "Ensuring consistent code style and layout in Python projects."
date: "2025-11-19"
---

Single or double quotes? How should I name my function: `like_this`, `likeThis`, or `LikeThis`? How long should my lines be? You may have asked yourself these questions at some point. Or, someone may have looked at your code and thought: "what a mess" and changed the spacing and layout of things. You may have disagreed and changed it back. You may have had heated arguments over whether to use a tab or spaces for indentation.

Or this may be all completely new to you. In either case, code formatting is an often overlooked but important aspect of writing code. And in more ways than you may think.

## Why should we care about formatting?

You may think formatting is a silly thing to worry about. It doesn't impact what the code does, it just makes it look nicer. But just like reading a poorly formatted document can be a pain, reading poorly formatted code can be even more frustrating. And code is read much more than it is written.

Firstly, consistent formatting improves readability of code. This means using consistent indentation, spacing, line-breaks, punctuation, and naming conventions. Consider this block of code:

```python
def calcRes(l):
 x=0;
 for c in l:
  if c[1]=='long':f=1.5
  elif c[1]=="prop":f=0.8
  else:f=1.2
  y=c[0]*f*(
  1.05
  **c[2]
  );x=x+y
 return x
```

What on earth does it do? It is really tough to look at, difficult to read and comprehend, all round frustrating. It is filling my brain with frictional pain, friction of having to keep in my mind what each variable represents and how they relate to each other. But while doing that, I need to grapple with the layout, the mixed naming, the inconsistent use of whitespace, and the overall lack of structure.

Compare that with this:

```python
def calcRes(l):
    x = 0
    for c in l:
        if c[1] == "long":
            f = 1.5
        elif c[1] == "prop":
            f = 0.8
        else:
            f = 1.2
        
        y = c[0] * f * (1.05 ** c[2])
        x = x + y
    return x
```

Much clearer! It is much easier to follow the flow of logic, and the cognitive load is significantly reduced. I can quite easily read this and get an idea of the structure. And all that changed is the formatting. Despite the poor naming, hard-coded numbers and strings, and lack of documentation, the code is now much more approachable.

But, wait... someone said this looks better:

```python
def calcRes(l):
    x=0
    for c in l:
        if c[1]=='long': f=1.5
        elif c[1]=="prop": f=0.8
        else: f=1.2
        y=c[0]*f*(1.05**c[2])
        x=x+y
    return x
```

Not my cup of tea, but it is easier to format than the original, I guess. Although, someone else prefers this:

```python
def calcRes(l):
    x = 0
    for c in l:
        if   c[1] == 'long': f = 1.5
        elif c[1] == "prop": f = 0.8
        else:                f = 1.2

        y = c[0] * f * (1.05 ** c[2])
        x = x + y
    return x
```

Okay... I see what they did there. Trying to line things up, must have taken a while. It doesn't look bad. But which do we choose?

I guess the only way to settle this is some form of formatting policy. Maybe we can write up a style guide for our project, and everyone can agree to follow it. We can spend a few meetings debating the finer points of formatting, and come up with a definitive guide for our codebase.

But then how do we format that style guide?

## Don't bother, adopt a guide

Don't bother writing your own style guide. Formatting works because of consistency. The more we see similar formatting, the easier it is to read new code. People have done the hard work of debating and agreeing on formatting conventions already. We can just adopt one of those.

The official style guide for Python is [PEP 8](https://peps.python.org/pep-0008/). It covers a whole lot of things, from indentation to naming conventions to line length. It is a great place to start. Click that link and you will find a really long list of formatting rules. Now you may be thinking: "This is crazy! This is creating so much more work, I have to study a style guide, remember all the rules, and then apply them every time I write code."

Actually, adopting a style guide will *save* you time. Because you will never have to think of formatting again (and if you never did, you never will have to). Because automation exists, and we can use tools to automatically format our code for us.

## Black: the opinionated formatter

[`Black`](https://black.readthedocs.io/en/stable/) is a PEP 8 *compliant* code formatter for Python. And it is an opinionated formatter. Compliant means it follows the rules of PEP 8. Opinionated means it makes its own decisions about how to format code, and it sticks strongly to them. Sometimes, you don't get to choose.

Now, there are two camps in the world: those who want freedom of choice, and those who see the value in not having to choose. `Black` is for the latter camp. `Black` takes your code, and reformats it to its own carefully crafted style. You can control a few things, but generally you should just let it do its thing.

The best way to use `Black` is through something called [`ruff`](https://docs.astral.sh/ruff/formatter/). Remember when I spoke about `uv`? Well the same guys that made `uv` also made `ruff`, which is a *linter* and *formatter*. Don't worry about what a linter is just yet, we will get to that soon. For now, just know that `ruff` can format your code according to `Black`'s rules, and it can do so before you blink.

Let's apply `ruff` to our earlier examples. Here is the first messy code block after being formatted by `ruff`:

```python
def calcRes(l):
    x = 0
    for c in l:
        if c[1] == "long":
            f = 1.5
        elif c[1] == "prop":
            f = 0.8
        else:
            f = 1.2
        y = c[0] * f * (1.05 ** c[2])
        x = x + y
    return x
```

Look's just like the first improved example! And all I had to do was run `uvx ruff format filename.py`. No thinking, no debating, no arguing. Just let the tool do its thing.

> Side note: `uvx` is a command line tool that comes with `uv`, the python package and project manager we discussed in [PPP-2: Project Management](./ppp-2-project-management/). It makes it dead easy to run tools like `ruff` without having to install them globally or manage virtual environments. If you haven't checked out `uv` yet, I highly recommend you do so.

## The benefits are more than just looks

Another benefit of formatting our code (particularly with an opinionated guide like `Black`) in addition to improving readability, consistency, reducing cognitive load, and saving time debating formatting choices, is that it can help improve `git diffs`.

Not sure what `git` is? Refer to [this article](./what-is-git). But in short, `git` is a version control system that helps us track changes to our code. When we make changes to our code, `git` tracks those changes. We can then compare two versions of our code to see what has changed. This is called a `git diff`.

If code has inconsistent formatting, a lot of the changes in a `git diff` will be noise related to formatting changes, rather than actual code changes. This makes comparing versions more cumbersome. `Black` is designed in a way to minimise these formatting-related diffs. So, by using `Black`, we can make our `git diffs` cleaner and easier to read.

## Closing thoughts

My suggestion: don't look back, format your code with `ruff` and move on. Don't waste time trying to tweak how your code looks. Just let the tool do it for you. Focus on writing good code.

There are other style guides, but none as widely used as `Black`, so you will find hundreds of projects more familiar to read.

Next up, we will look at linting, which is another important aspect of code quality and consistency.
