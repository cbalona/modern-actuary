---
title: "Python Preferred Practice 4: Linting"
description: "Using linters to enforce code quality and consistency in Python projects."
date: "2026-01-03"
---

You certainly have heard of lint before... but probably not in your programming. Linting is the next step up in improving your code quality after formatting. While formatting focuses on how your code looks and reads, linting goes deeper; analysing your code for potential errors, code smells, and adherence to generally accepted coding standards.

Let's get into it.

## Why we need something like linting

Writing code is difficult and there is potential for mistakes. Wouldn't it be great if there was a tool that could analyse your code and find all the mistakes? That is not what a linter does unfortunately. It only finds _some_ of the more simple mistakes that can easily be avoided. Things that other people have bumped in to, and that are easy to check for automatically. Let's look at some examples.

Here is a really simple example:

```python
import math

def add_numbers(a, b):
    return a + b
```

If you were to run a linter on this code, it would likely complain that the `math` module is imported but never used. Now, this is not a major error. The code will run, the result will be correct. Having math imported will have no impact at all on the result. So why do we care? There can be many reasons that are not apparent to new programmers. In some cases, importing modules can have _side effects_; meaning, some code may run just by importing the module. In larger more complex codebases, this can actually lead to bugs that are hard to track down. But in most cases, this is just an example of carelessness and cluttered code. If we are not using `math`, we should not import it. It is just noise. And a linter will easily catch this for us, and spoiler, sometimes it will even fix it for us automatically. So it is one thing less to worry about.

Let's consider a more serious example:

```python
def add_numbers(a, b):
    return a + c
```

Here, we have a typo. We meant to add `a` and `b`, but instead we wrote `c`. This will lead to a runtime error when we try to run the code, because `c` is not defined. A linter can catch this kind of mistake before we even run the code.

But, if there is a runtime error, won't we find out about it when we run the code? Yes. But what if somewhere else in the file we did actually define `c`? Like this:

```python
... some code ...
c = 10
... some more code ...

def add_numbers(a, b):
    return a + c
```

Or, what if `c` was defined in another file that we imported? (Cue the side effect!). You can see the potential for bugs here. Yes, a fine-toothed review of the code could catch this, but why rely on humans and their tendency for human error? A linter can catch this for us automatically.

Both these examples are quite straightforward. But, there is a myriad of things linters can check for, including some really subtle issues that are hard to spot. Here is an example of a more subtle issue:

```python
def add_to_list(item, some_list=[]):
    some_list.append(item)
    return some_list

l1 = add_to_list(1)
l2 = add_to_list(2)
```

Looks fine on the surface. But, that function is not a pure function (meaning, it has _side effects_ ... these are coming up a lot). The default value for `some_list` is created once when the function is defined, not each time the function is called. That means that the second time we call `add_to_list`, it is appending to `some_list`; a list which was created when we defined the function, and has `1` added to it already. So `l2` will be `[1, 2]`, not `[2]` as we might expect. A toy example, but, this pattern happens a lot in much more complicated situations.

Ever seen the `SettingWithCopyWarning` message pop up when working with pandas dataframes? Chances are, you may have even silenced it because it was annoying. But, warnings exist for a reason, and that warning is telling you something very similar to the above example. In Python, creating a new variable does not always create a new object in memory, sometimes it just creates a sort of reference or "pointer" to the original object. This is done for various reasons and catches a lot of new, and even experienced, Python programmers out.

Being aware of all these different kinds of bugs and mistakes is challenging, and as far as possible we should try to reduce our mental burdens and offload these tasks to automated tools. Linters do exactly that.

## Okay, how do I "lint"?

There are several linters available for Python that focus on different issues. A few years back, setting them all up was a bit of a nightmare. But once again, our trusty friends at Astral, the creators of `uv` and `ruff`, come to the rescue. [`ruff`](https://docs.astral.sh/ruff/), which we used for formatting in [PPP-3: Formatting](./ppp-3-formatting), is also a linter.

I won't write a tutorial on how to install and use `ruff` here, because that is already covered in the [official documentation](https://docs.astral.sh/ruff/tutorial/#getting-started). But, I will give you a few quick tips from my usage.

### Tip #1: Integrate linting into your editor and workflow

The first tip, is that you can use `ruff` through your editor. If you are using VS Code, there is an [extension for Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) that integrates `ruff` directly into your editor. It will underline issues in your code for easy reference, and you can even auto-fix issues directly from the editor.

I recommend using it along with [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) which makes the issue display alongside the line of code, rather than in a separate panel. This makes it much easier to see and fix issues as you code.

### Tip #2: Configure ruff subtractively

The second tip, is to configure `ruff` "subtractively". What I mean by that is: `ruff` by default does not enable all the possible checks it can do. You have to explicitly enable some of them. Instead of finding rules to enable, I recommend you enable them _all_, and then rather ignore (or "subtract") certain rules you don't agree with, or that don't make sense for your project. This way, you get the full benefit of linting, and you can learn along the way. When you first do this, you will probably see tens or even hundreds of issues pop up in your code. Don't be discouraged. Just take it one step at a time. Each day, choose a different rule to look into and understand. Learn what it is trying to prevent, and decide if you want it.

Commonly ignored rules include line length (E501), because sometimes long lines are unavoidable, missing docstrings (D10\*), and certain complexity checks (like C901) because sometimes complex code is necessary. However, I recommend you don't ignore too many rules at a global level. Instead, if you have a specific case where you need to break a rule, you can add an inline comment to ignore that specific instance. This actually aids future readers of your code by explicitly stating that you are aware of the rule, but have chosen to break it for a specific reason.

Yes, they can be overwhelming and annoying, but taking the time to understand and address linting issues will make you a better programmer in the long run. When you get overwhelmed, just turn off linting for a bit.

### Tip #3: Let ruff auto-fix what it can

The last tip is to let ruff auto-fix what it can. You can do this by running `uvx ruff check --fix` in your project directory. This will automatically fix any issues that won't change the operation of your code (make sure you have `uv` installed first). This way, you don't manually fix things. Plus, there are also "unsafe" fixes that you could allow `ruff` to do, but these may change the operation of your code, so be careful with those, and check whether you want to allow them. These can be enabled in your configuration file like so:

```toml
[tool.ruff.lint]
extend-safe-fixes = [ "EM102" ]
```

## The limitations of linting

Linters have limitations. For one, they aren't perfect, and both false positives and false negatives can occur. A false positive is when the linter flags something as an issue when it is actually fine. A false negative is when the linter misses an actual issue. In my experience, these are very rare, but they can happen.

Linters also won't catch all issues. They are limited to the rules they are programmed to find, which cover general language usage and some libraries. They won't be able to catch logical, design, architectural, mathematical, or business-specific errors. They won't tell you if you incorrectly derived your loss development factors, or if you reversed a sign in a formula. That is up to good old fashioned code review and testing.

## Closing thoughts

Linting will be a huge help in improving your code quality. Annoying at first, over time it will iron out a lot of bad habits and help you become a better programmer. It will also make your code more consistent and easier to read for others. In my opinion, it is essential, and I don't go anywhere without linting, in any language.
