---
title: "I'm an Actuary: What is Docker and do I need to use it?"
description: "A practical guide for actuaries to understand containerization, what Docker is, and whether it’s necessary for traditional valuation, isolated data science, or complex application deployment."
date: "2021-07-09"
archived: false
---

If you are an actuary with an interest in applying data science to your work, you have probably heard numerous words that everyone says you need to know. Words such as git, Docker, tensorflow, cross-validation, etc. You may have found yourself overwhelmed with all these new things to learn and not know where to start. Well, hopefully, I can help with some of that. This one is about Docker.

## So what is Docker?

Let's see what Docker themselves have to say:

> Docker is an open platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can manage your infrastructure in the same ways you manage your applications. By taking advantage of Docker’s methodologies for shipping, testing, and deploying code quickly, you can significantly reduce the delay between writing code and running it in production.
> <a href="https://docs.docker.com/get-started/overview/">https://docs.docker.com/get-started/overview/</a>

If you are not familiar with the computer science world already, that may sound very confusing. So let's try bring it back a step and relate it to our world.

Let's say we want to perform a valuation. We need the following things:
- A valuation model (perhaps an excel workbook)
- A software to run the valuation model (Microsoft Excel, probably)
- An operating system to run the software (Windows, probably)
- A plact to store our saved files (a local Windows folder)

Typically, in our workplace, we have all of the above ready for us immediately. We all have a computer with Windows as the operating system, a copy of Microsoft Excel, and a valuation model made by someone before us most likely saved on a shared network folder. So all we normally do when we start a new valuation is make a new folder to store our valuation workings, and copy the valuation model from the shared network folder, and double-click it to open excel and get running.

**So in our day to day lives, we have no need for something like Docker.**

But now let's imagine that had a very difficult manager who uses some flavor of Linux and refuses to install Microsoft Excel, and hence can't run the valuation model. Then, every time we needed to recalculate and communicate results, we needed to find a way to run the model on their PC without impacting their system. One way, is we could run a virtual machine (an operating system inside an operating system), install Windows on it, install Excel, copy over the model, and open it up to show them.

*Exhausting.*

We may not be familiar with this process, but it is similar to something that occurs often in other domains, such as web development. Docker exists in part to address this problem.

With Docker we can define a set of rules to automatically perform all the set up steps above inside an isolated environment known as a **container**. These rules are defined in a file called a *Dockerfile*. In that file, we will specify the container environment (analogous to the operating system), the software we need, the folders we where we want to store our work, and the data we want to copy over. Docker can then automatically run all the steps and set up a fresh clean environment very efficiently. Let's give a dummy example of such a file:

```python
# Note, this is just a rough, simplified example of how a Dockerfile looks. It won't actually work!

# Tell docker to install Windows 10 as the operating system*
FROM windows:install-windows-10 
# Tell docker we want Microsoft Excel on the operating system
RUN install "Microsoft Excel"
# Make a folder for our valuation
FOLDER "C:/Work/ClientValuation/"
# Copy our valuation to the folder we made
COPY "//WORKSERVER/ValuationModel.xlsx" to "C:/Work/ClientValuation/"
# Open up excel
RUN "Excel.exe"
# Open our valuation model using Excel
OPEN "ValuationModel.xlsx"
```

Now, every time we want to show results to our manager, we just run the script above using Docker and we get a fresh environment with our work to show our manager.

## I am an Actuary, I mainly do traditional actuarial work, do I need it?

You may be thinking. What is the big deal? I don't think that is valuable, because everyone has Windows, with Excel and I can just email the file. Yes, that is true. And in 99% of actuarial use cases, you won't need Docker.

There are other advantages to Docker, which I won't go into here, but most of these also aren't enough to drastically improve our workflow.

So as an actuary, in your day to day work, no, you won't need it. And even if you are starting to explore data science, and you read everywhere that you need it, you still probably don't need it. And learning it will just make you confused, frustrated, and delay progress. Even if it is quite simple to grasp the basics.

## I am an Actuary, I do a lot of isolated data science projects in jupyter notebook, R, and VSCode, do I need it?

This one is more difficult to answer, and I am sure opinions will differ here. But my answer is no, you still don't **need** it. But, you may benefit from learning it a bit to understand if you **want** to use it and **if** you should use it.

Some will make the argument that Docker is the ultimate solution to having isolated, reconstructable, predictable coding and running environments. And that is quite true. If you have ever moved your code to another PC, you have had the pain of needing to install Python, pip install all your packages, install some random dependencies you may need (MiKTeX maybe?), etc. Docker can automate all this for you, so that you can just run and serve your notebook from a Docker container.

But to me, in most cases, the amount of set up needed is too much, and the overhead of running an entire Docker container is a bit too demanding for isolated data science projects, even if they are more complex. Also, there are more lightweight and simpler alternatives. Some examples are: a virtual environment with a requirements file, a conda environment, or for those of us looking for a bit more: a Makefile.

## I am an Actuary, I develop complex applications that need to be deployed frequently in a quick and efficient manner on remote servers, do I need it?

Yes, now I think you need it. Learn it and see the benefit.

As an example, this website is deployed using Docker containers. After I log in to my hosting server, I need to run two commands to completely tear down and rebuild and deploy the entire website using my latest code. And it takes about 1 minute to do that, without my input.

So if you are a consultant for example, and you develop web dashboards for your clients, and you frequently update the dashboard and data. Docker will greatly improve that process.

## Okay, I want to learn Docker. How should I do it?

Docker actually has a fantastic getting started guide built into it. I recommend using the following website first before trying to download and install Docker on your own PC:

https://labs.play-with-docker.com/

1. Click on the link above. You will be taken to a website with the Docker logo.
2. Click login and select Docker. You will then need to create a Docker account if you don't already have one.
3. Once you have logged in, click "+ ADD NEW INSTANCE" on the top left.
4. Paste this command: `"docker run -dp 80:80 docker/getting-started:pwd"` in the black terminal that comes up. (Hint: CTRL + SHIFT + V)
5. Hit enter, you will see a few commands running, and then it will stop.
6. You should see a blue "80" appear on the top next to the button labelled "OPEN PORT". Click the 80 and a new tab will open. (If the blue 80 doesn't show, click "OPEN PORT", type 80, and hit enter.)
7. The new tab that opens is actually a website running from within a Docker container, being served to you from a remote server. That command you ran was actually a command to create and run a Docker container!
8. Follow the guide, and learn.

Alternatively, if you do want to install Docker on your PC, it is not very straightforward. Have a look here: https://docs.docker.com/desktop/ and select the operating system you use.

Then, follow the guide under "Docker Desktop" here: https://www.docker.com/101-tutorial

## Conclusion

I hope this is useful to anyone wondering what Docker is all about. If you'd like me to explore another topic, send me a message or comment on LinkedIn.
