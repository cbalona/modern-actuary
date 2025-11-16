---
title: "Python Preferred Practice 3: Project Automation"
description: "Automating common Python project tasks, like dependency management, environment setup, and data pipelines, using Makefiles for efficiency and reproducibility."
date: "2023-08-01"
archived: true
deprecated: true
deprecation_note: "This post has been deprecated. With the introduction of `uv` for managing Python versions and dependencies, much of the automation discussed here can be simplified. I recommend checking out [PPP 1](./ppp-1-python/) and [PPP 2](./ppp-2-dependency-management/) for updated practices. There is still place for project automation in more complex projects. In these cases I now use `justfiles`, which I will discuss in a future post."
---

In PPP 2 I discussed how I prefer to do dependency management within Python. I prefer simple and lightweight. This meant using basic libraries like `virtualenv` and `pip-tools` over heavier approaches such as Poetry or Conda. This bare bones approach also led to quite a few commands to be memorised and used over and over. If you are like me you don't like to do repetitive tasks. You would rather automate them.

In this post, I will show you how to automate the process of creating a virtual environment and installing dependencies. This will make it easier to get started with a new project. It will also make it easier to share your project with others. They will be able to get started with your project with one or two commands. As a bonus, the approach I will show you will can be used to automate other tasks as well. It is not even Python specific. In fact, it dates back to the 1970s.

## make

Ever heard of **Make**? Chances are its been around longer than you have. It's certainly been around longer than I have. Make is software tool that is used to automate building software. When I say building software, I don't mean the coding. I mean the compiling of the code into the final software product, and other tasks.

If you have only used Python (or are new to programming altogether) you may not be familiar with the need to compile code. Python is an interpreted language. This means the code is interpreted and ran as it is typed. The same is true for other languages like R and JavaScript. Many other languages are compiled. This means the code is first translated into a lower level language and packaged into a file. This file is then what is executed. This is a simplified explanation (and I am not going into further detail about the differences) but what this means is that there are a series of tasks that need to be completed before getting to the final code. In complex projects this meant a lot of steps that depended on each other. Make was created to automate this process.

Make allows you to specify a list of tasks and how to run them. It also allows you to specify how these tasks depend on each other. This creates a graph of tasks to be completed. You can then run Make and it will check which tasks need to be run by checking which files have changed since the last time it ran. It is a bit more complicated than this, but this is the basic idea.

## But Python is not compiled, why use Make?

Make can be used for more than just compiling code. It can be used to automate any task if you configure it that way. Over the next few sections I will build up what is called a `Makefile`. A `Makefile` is a file that holds the tasks that Make will run. Just like Python code is in a `.py` file, Make code is in a `Makefile`.

In the next few sections I will build up a `Makefile` that will automate the dependency management tasks of discussed in PPP 2. I would recommend you read through these sections before trying to use the `Makefile` yourself. The reason I recommend this is because I don't want you to get bogged down in the OS specific details of using Make.

Unfortunately, since Make uses your systems terminal commands it means that the commands will differ if you use a different system than I do. Since I use WSL (Linux on Windows) the commands will most likely differ as I imagine most readers will be on Windows. I will give a Windows version of the Makefile at the end. I have specifically opted to demonstrate using Linux Make commands (or `bash` commands, specifically) because I find it much easier to follow compared to the equivalent Windows commands (which can be quite messy). This is actually one of the reasons I use WSL: Make is much easier to use.

## Automating the creation of the virtual environment

When starting a new Python project the first thing I do is make a virtual environment, update `pip`, `setuptools`, and `wheel` and install `pip-tools`. I did not discuss updating these packages, but it is good practice to use their latest versions. If you are not familiar with them:
* `pip` is the package installer for Python
* `setuptools` is used to build and install Python packages from source
* `wheel` is used to install Python packages that have been pre-built as `.whl` files

It is good to have these packages updated to the latest version to ensure no bugs interfere with your installation of packages.

The commands that you would run to do this are:

```bash
virtualenv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install --upgrade setuptools wheel
pip install pip-tools
```

That is 5 commands that you would run over and over every time you start a new project. Sure, that might not be very often, but it is easy to forget one or two, and it is a lot of typing. So, let's use Make!

We create a `Makefile` in the root of our project, and add a task called `setup` that will run all of the commands above.

```makefile
setup:
	virtualenv .venv
	source .venv/bin/activate; pip install --upgrade pip
	source .venv/bin/activate; pip install --upgrade setuptools wheel
	source .venv/bin/activate; pip install pip-tools
```

Let's go through those commands one by one.

We first create our virtual environment using `virtualenv .venv`. This places our virtual environment in the `.venv` folder in our directory. Then, we activate it using `source .venv/bin/activate` and upgrade `pip` using `pip install --upgrade pip`. Note here I have the activation and the `pip` command in the same line separated by a `;`. This means that the commands will be executed one after the other and within the same shell.

In a Make "*recipe*" each new line is independent of the previous one. If instead I had activated first, then on a new line upgraded, it would mean that the second line would not run within the activated environment. It would be completely independent of the previous one. So the `;` ensures that the lines are executed in the same shell. This is important to remember when writing your own Makefiles. Just imagine each line is like opening an entirely new command line / shell and executing the command there.

Then, after upgrading `pip`, I use a similar set of commands to upgrade `setuptools` and `wheel`. Finally, I install `pip-tools` using `pip install pip-tools`.

This is our first Makefile recipe! We can run it by typing `make setup` in our terminal. It will run each of the commands in the recipe one by one.

## Make variables

Notice that we have to activate the virtual environment every time we need to use it. This can get a bit tedious to type out. We can instead specify a variable that we can use in place of the `source .venv/bin/activate` command every time we need it.

I specify this variable at the top of my `Makefile` by adding the line `VENV := source .venv/bin/activate`. Now, we can replace `source .venv/bin/activate` with `$(VENV)` in our `Makefile` and it will work the same way. This makes our `Makefile` more concise, easier to read, and easier to maintain. Now it looks like this:

```makefile
VENV := source .venv/bin/activate

setup:
	virtualenv .venv
	$(VENV); pip install --upgrade pip
	$(VENV); pip install --upgrade setuptools wheel
	$(VENV); pip install pip-tools
```

## Automating syncing our Python packages

Recall from PPP 2 that I prefer to specify the packages my Python code depends on in a requirements.in file. I then use `pip-compile` to compile this into a `requirements.txt` file. I then use `pip-sync` to synchronise my virtual environment with the packages specified in the `requirements.txt` file. (If you are confused where `pip-compile` and `pip-sync` come from, they are the tools in the `pip-tools` package.)

The process goes like this:
1. Update the `requirements.in` file by adding / removing / editing the `requirements.in` file.
2. Compile the `requirements.in` file into a `requirements.txt` file by running `pip-compile requirements.in`.
3. Synchronise the virtual environment with the packages specified in the `requirements.txt` file by running `pip-sync requirements.txt`.
4. Repeat as necessary.

Ideally, we want to automate this process so that we can run a single command whenever we change the `requirements.in` file and it will automatically compile the `requirements.in` file into a `requirements.txt` file and then synchronise the virtual environment with the packages specified in the `requirements.txt` file.

To achieve this we need a few things:
1. A way to check if the `requirements.in` file has changed.
2. A way to compile the `requirements.in` file into a `requirements.txt` file if `requirements.in` has changed.
3. A way to check if the `requirements.txt` file has changed.
4. A way to synchronise the virtual environment with the packages specified in the `requirements.txt` file if `requirements.txt` has changed.

This creates a dependency graph because our virtual environment depends on the packages specified in the `requirements.txt` file, which depends on the packages specified in the `requirements.in` file.

Let's focus on dependency between `requirements.txt` and `requirements.in` first. Remember that Make lets you specify which files depend on which other files. We can use this to specify that `requirements.txt` depends on `requirements.in`. Make will then compile `requirements.in` into `requirements.txt` if `requirements.in` has changed. Here is the recipe:

```makefile
requirements.txt: requirements.in
	$(VENV); pip-compile requirements.in
```

This says that `requirements.txt` depends on `requirements.in` and the commands below the "*target*" line are the commands to run whenever `requirements.txt` is older than `requirements.in` and we run Make.

Now, if I run `make requirements.txt` it will run the commands below the "*target*" line. In this case, it will run `pip-compile` to generate `requirements.txt` from `requirements.in`.

The next dependency is between `requirements.txt` and our virtual environment. We want to make sure that our virtual environment is up to date with the packages in `requirements.txt`. We can do this by specifying a dependency between `requirements.txt` and the virtual environment. To do this, we need a way to track if our virtual environment has changed. This is a tiny bit of a hack, but what I do is create what is known as a *touchfile* within my virtual environment folder (`.venv`). It is a trick I picked up from a Stack Overflow post many moons ago. The *touchfile* is a file that has its modification time updated whenever the virtual environment is updated. My Make recipe checks the modification time of the *touchfile* and if it is older than `requirements.txt` then it will run the commands below the "*target*" line. In this case, it will run `pip-sync` to update the virtual environment with the packages in `requirements.txt`.

Here is the recipe:

```makefile
.venv/touchfile: requirements.txt
	$(VENV); pip-sync
	touch .venv/touchfile
```

This says that `.venv/touchfile` is a target that depends on `requirements.txt`. If `requirements.txt` changes, then we run `pip-sync` to update the virtual environment and mark it as up-to-date by "touching" the *touchfile*. (In Unix, the `touch` command updates the timestamp of a file, or creates it if it doesn't exist.)

Great! Now we can run `make .venv/touchfile` to update the virtual environment. But, again, note that we have these two commands to run whenever we want to update the virtual environment: `make requirements.txt` and `make .venv/touchfile`. We can combine these into a single command by making a final target that depends `venv/touchfile`.

```makefile
venv: .venv/touchfile

.venv/touchfile: requirements.txt
	$(VENV); pip-sync
	touch .venv/touchfile

requirements.txt: requirements.in
	$(VENV); pip-compile requirements.in
```

Quick recap:
1. `venv` is a target that depends on `.venv/touchfile`
2. `.venv/touchfile` is a target that depends on `requirements.txt`
3. `requirements.txt` is a target that depends on `requirements.in`

Now, we simply run `make venv` and Make will figure out the rest. If `requirements.in` changes, Make will rebuild `requirements.txt` and sync the virtual environment. If `requirements.txt` changes, Make will sync the virtual environment.

And finally, to top it all off, we can make `venv` the default target, so that we can simply run `make` to sync the virtual environment. To do this, we simply have `venv` as the first target in the Makefile. And guess what, it already is!

Now, whenever we change our project dependencies we just run `make` and we're good to go. Make will figure out what needs to be done and do it for us.

## But it doesn't stop there

Make is the gift that keeps on giving. The above commands are really the most basic starting point. We can take it so much further. For example, let's say I have a Python project where I fetch the latest claims data from a server folder and process it into a triangle for reserving purposes. I can create a Makefile that will do all of the following:

- Fetch the latest data from the server
- Process the data into a triangle
- Run unit tests on the triangle

Here it is:

```makefile
VENV := source .venv/bin/activate

SERVER_FOLDER := /path/to/server/folder

RAW_DIR := "data/raw"
PROCESSED_DIR := "data/processed"

folders:
	mkdir -p $(RAW_DIR) $(PROCESSED_DIR)

sync: folders
	@echo ">>> Transferring received data from network drive to local"
	@echo ">>> This may take a while..."
	rsync -az --progress --update "$(SERVER_FOLDER)" "$(RAW_DIR)"
	@echo ">>> Data successfully synced"

unzip: sync
	find $(RAW_DIR) -type f -name "*.xz" -exec xz -d -f -k {} \;

triangulate: unzip
	@echo ">>> Cleaning data"
	$(VENV); python src/data/clean.py --input_dir $(RAW_DIR) --output_dir $(PROCESSED_DIR)
	@echo ">>> Triangulating data"
	$(VENV); python src/data/triangulate.py --input_dir $(PROCESSED_DIR) --output_dir $(PROCESSED_DIR)

data: triangulate
	@echo ">>> Testing data"
	$(VENV); python src/data/test.py
```

The `Makefile` above will:
1. Make the data folders if they don't exist
2. Sync the data from the source on the server to the local data folders
3. Unzip the data
4. Clean the data and triangulate the data using Python scripts
5. Unit test the data using Python scripts to ensure the data is valid

All with one command: `make data`.

`data` depends on `triangulate` which depends on `unzip` which depends on `sync` which depends on `folders`. Only the `data` target is needed to be run, and the rest will be run automatically and in the correct order without re-running targets that have already been run and are up to date.

## make conclusion

Make is one of the tools I use the most in my day to day work. It just makes things so much easier. I have recipes strewn all over my PC that I sample from all the time. I sync data, build software, generate reports, deploy this blog, and much more with it. Once you have built the recipes it is a major time saver.

I do have some cautions however, before I give a sample of my personal `Makefile`:
1. Make is old, and it can be tricky. Unfortunately, it does have its rough edges. The more fancy you try to get, the more likely you are to run into them. If you start to write massive recipes, you may want to consider just writing a script in Python or `bash` instead, and using that in your `Makefile`.
2. Make is not OS agnostic. Make runs the commands in your OS default terminal. On Windows, this is most likely command prompt or PowerShell. On Linux, it is probably `bash`. This means that if you want to use Make on Windows your recipes need to be written in a way that is compatible with the Windows terminal you use. This is not a huge issue, but it is something to be aware of. These days with ChatGPT is easy really easy to translate between `bash` and `cmd`/`PowerShell` if you need to.
3. Make is a build automation tool, not a general purpose automation tool. It is not meant to be used for everything. It is meant to be used for building software. Granted, I tend to abuse it a bit, but I do try to keep it limited to running commands like I've shown above. If you are trying to do something more complicated, you may want to consider using a different tool specifically designed for that purpose.
4. Finally, I am not a Make expert. I have been using it for a while and I am comfortable with it. There are other tools out there that do similar things, and you could also just write a script in Python or `bash` instead. This is just my preferred practice :).

Now that I have that out of the way, here is a sample of my personal `Makefile` that I use across almost all Python projects. I hope it serves you well if you decide to use it! And I hope I have opened up a new world of possibilities for you if you have never used Make before. As we progress through the PPP series, don't be surprised if we add a few more recipes to this file.

### Sample Makefile

Note, to install make:

For Linux / WSL: `sudo apt install make`
For Mac: `brew install make`

For Windows it is a bit trickier. I'd strongly recommend you use [chocolatey](https://chocolatey.org/) to install make. It is a package manager for Windows. Once you have chocolatey installed, you can install make by running `choco install make`. If you don't want to use chocolatey, you can follow the instructions here:
https://leangaurav.medium.com/how-to-setup-install-gnu-make-on-windows-324480f1da69

**Makefile using bash**
```makefile
.PHONY: venv setup

SHELL := /bin/bash

PROJECT_NAME := project_name
PROJECT_DIR := ${CURDIR}

VENV := source .venv/bin/activate
PROJECT_CONFIG := requirements.in

venv: .venv/touchfile

.venv/touchfile: requirements.txt
	$(VENV); pip-sync
	touch .venv/touchfile

requirements.txt: $(PROJECT_CONFIG)
	$(VENV); pip-compile --output-file=requirements.txt --resolver=backtracking $(PROJECT_CONFIG)

setup:
	virtualenv .venv
	$(VENV); pip install pip-tools
	$(VENV); pip install --upgrade pip setuptools wheel
```

**Makefile using cmd**
*Note I have not used this in a while, so it may not work as expected*
```makefile
.PHONY: venv setup

SHELL := cmd

PROJECT_NAME := project_name
PROJECT_DIR := $(CURDIR)

VENV := .venv\Scripts\activate
PROJECT_CONFIG := requirements.in

venv: .venv\touchfile

.venv\touchfile: requirements.txt
	$(VENV) && pip-sync
	type nul > .venv\touchfile

requirements.txt: $(PROJECT_CONFIG)
	$(VENV) && pip-compile --output-file=requirements.txt --resolver=backtracking $(PROJECT_CONFIG)

setup:
	virtualenv .venv
	$(VENV) && pip install pip-tools
	$(VENV) && pip install --upgrade pip setuptools wheel
```