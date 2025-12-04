---
title: "I'm an Actuary: What is Git and do I need to use it?"
description: "A guide for actuaries on understanding Git and GitHub, its role in collaborative version control, and when it becomes essential for code-based actuarial work."
date: "2022-04-18"
archived: false
---

If you are an actuary with an interest in applying data science to your work, you have probably heard numerous words that everyone says you need to know. Words such as git, Docker, tensorflow, cross-validation, etc. You may have found yourself overwhelmed with all these new things to learn and not know where to start. Well, hopefully, I can help with some of that. This one is about Git.

## So what is Git?

You have probably heard about Git in some way or form, most likely through being linked to some code or repository ("repo") on GitHub. You may even know that it has something to do with storing code or version control. And I am willing to bet in many cases the thought is Git = GitHub, some form of code storage website. This article aims to shed some light on the mysterious Git, and demonstrate some of its usefulness.

Let's start with a definition of Git:

> Git is software for tracking changes in any set of files, usually used for coordinating work among programmers collaboratively developing source code during software development.
> <a href="https://en.wikipedia.org/wiki/Git">https://en.wikipedia.org/wiki/Git</a>

Let me break it down a bit further and relate it to a typical actuarial workflow. As with the Docker article, I will use an actuarial valuation as our example.

Consider you are in a reserving team of 3 or more members. There is a particularly large valuation that you and a few of your team mates are working on. Problem is, there is one Excel workbook that holds all the data and workings, and one Word report. This is typically the case. The deadline is tomorrow, you open up the workbook, and you get an alert window saying: "abc-valuation.xlsx is locked for editing by...".

Okay... annoying. They are on study leave today and they left it open and we can't get hold of them. Typical. No worries, just make a copy of the workbook and call it **abc-valuation (yourname).xlsx** we can combined the changes later.

A few hours pass and you've done some great reserving. You save the workbook, but in the folder you see this: **abc-valuation v2.xlsx**. You ask around, another team mate found an error in the valuation workbook that they have fixed. Great, you now have to move everything over to the new workbook, or bring the changes in. You bring the changes in to yours.

Later that day, you add your reporting into **valuation-report DRAFT V3.docx**. Everyone has their changes in, so you send it for review.

Your manager is not happy, the results are inconsistent, and in some cases the error fixed in v2 of the valuation still remains. Turns out when you brought the changes in, you missed a few things because it was not easy to tell what had changed. Okay, lets all make the fixes in our separate copies and combine again. **valuation-report FINAL V3 (teammate edit) (yourname check).docx**. It is 1am. The report is finalised. Time to sleep.

The next day, things are haywire. Your manager doesn't know what to check because so much has changed and there is no clear record of changes. Even worse, new regulation says we need to include a certain sensitivity analysis into the report. Your team frantically works all day, copying and passing around files, the folder looks something like this:

- abc-valuation (yourname).xlsx
- abc-valuation v2.xlsx
- abc-valuation v2 (teammate 1).xlsx
- abc-valuation (teammate 2).xlsx
- abc-valuation v2.1 (just trying something dont use this one).xlsx
- abc-valuation v2.1 (USE THIS ONE).xlsx
- abc-valuation v4 (combined draft).xlsx
- abc-valuation sensitivity addition v1 valuation v4.xlsx
- valuation-report DRAFT.docx
- valuation-report DRAFT V2.docx
- valuation-report DRAFT V2.1 (minor edit).docx
- valuation-report DRAFT V3.1 (just.docx
- valuation-report DRAFT V3.docx
- valuation-report FINAL V3 (teammate edit) (yourname check).docx
- valuation-report FINAL V3 sensitivity added FINAL DRAFT.docx
- valuation-report FINAL V3 sensitivity added DRAFT FINAL v2 (i know there is a final final but review th.docx
- valuation-report FINAL V3 sensitivity added FINAL FINAL v2 (manager review).docx

If you are stressed out now, I apologise. But I am sure we are all very familiar with the above workflow. Now imagine that, but in a much more complex environment of python code, jupyter notebooks, reports, presentations, data, etc. It is a nightmare.

Git exists to completely automate and mitigate the problems created above. It is a version control system and source code management software.

Here are some of the key problems in the above workflow and how Git addresses them:

**<font color="red">Problem 1</font>**: You couldn't work on the workbook while someone else had it open.

**<font color="green">Solution 1</font>**: Git (when combined with a website like GitHub or Bitbucket) creates a single source of truth for the work stored in a centrally accessible location. When two people want to work simultaneously on it, they each **_pull_** a copy of the workings to their own device. Allowing them each to work independently and simultaneously.

**<font color="red">Problem 2</font>**: Someone made changes to the core workings of the model. Now you have to manually find the changes and manually bring them in.

**<font color="green">Solution 2</font>**: Because there is a single source of truth, when you **_push_** your changes back up to the single source of truth, Git automatically highlights any differences and changes between the two versions. You can then **_merge_** the two different versions into a single source of truth again, with a clear record of what changed. (A bit like track changes in word, but all changes ever are always tracked, and they are not lost once they are accepted).

**<font color="red">Problem 3</font>**: There is a team of individuals working on a single project, and it is time consuming and error prone to combine everything.

**<font color="green">Solution 3</font>**: As with the previous problem, Git tracks all changes, who made the change, and allows a clear concise way to merge all the different versions together again.

**<font color="red">Problem 4</font>**: We need to add in something new and see how it impacts results. But we need to do this separately so we don't impact the main workflow. Problem is, with so many people working, it is not clear which version to use, and which is the latest.

**<font color="green">Solution 4</font>**: If we need to **_branch_** off to add something else, or try something out, we can easily do so with Git, by making a separately tracked copy of our single source of truth that does not impact our **_master_** source of truth. When we are ready, we can either merge our new branched workflow back into master, or discard it cheaply. Even better, our manager knows exactly which version to check: the master version with the latest **_committed_** changes.

That is, at a very basic level, what Git is. It provides the tools to manage and address the problems I highlighted above (and so many other problems too). Note the emphasised words, I purposefully highlighted these to help you understand the key words which can be confusing when first learning Git. I will link to a Git tutorial below, and if you ever feel confused by those words, just refer back here. But before you jump into learning Git, **read on to find out when is the best time to learn Git.**

### Quick aside: Does Git = GitHub?

No. It is important to understand that Git itself is a software used to manage source code. Wherase GitHub is a central *hub* for code **repositories**. I will break this down a bit more.

In order to manage versions of your code automatically, you need to install the Git software. This software runs on your computer and automates some of the tasks like comparing code, pulling code, pushing code, branching, merging, etc. You can save the code anywhere on your computer.

Now, if someone else wants code on your computer, it is difficult for them to fetch it. You could email it, or put it on a flash drive, but that is painfully manual. Instead, websites like GitHub exist to store code in central *repositories* that your teammates can access. Much like the network drives you likely store your files on in your company, but built to work directly with git.

Other types of version control software exists, such as Mercurial, but Git is by far the most popular. Other repository hosting websites like GitHub also exist, for example, BitBucket. But again, GitHub is most popular.

## I am an Actuary, I mainly do traditional actuarial work, do I need it?

Now, if you are primarily working in the Microsoft suite, or using proprietary actuarial software, Git is not going to help you unfortunately. There are ways to make Git work with Excel or Word, but due to how Excel and Word are made, it is not easy and user friendly. So in this case, you don't need Git. In fact, a much better option is to use Office 365 and work in the cloud, where a lot of these capabilities are being introduced. For example, multiple users can work on the same Excel file if it is stored on OneDrive, and version control is available to a limited extent.

If you are using proprietary actuarial software, then unless the company that develops the software builds in capabilities to work with Git (which is highly unlikely and likely not possible) then it is also not useful.

So as an actuary, in your day to day work, no, you won't need it, and you shouldn't spend time learning it unless you are interested in it outside of work.

## I am an Actuary, I do a lot of my actuarial work independently using open-source code based software, do I need it?

If you are working by yourself and you don't run into the problems I highlighted above, you don't really need it. Also, if you have a central place to store your code with some form of version control, again, its use is limited.

But, I will add, if you want to take your work to the next level and ease your workflow, I would recommend learning it and bringing it into your processes because it is extremely powerful and I use it daily. Every project I start, starts with a Git repository. It does have a bit of a steep learning curve, but there are ways to make your life easier, which I will expand on below.

## I am an Actuary, I work in a team of actuaries, and we work collaboratively using open-source code based software, do I need it?

Yes, you do, and you should be using it. In my team, Git is non-negotiable and it is built into our processes. The amount of headaches and problems it solves is well worth the minimal added effort.

## Okay, I want to learn Git. How should I do it?

Git has a bit of a steeper learning curve, and I have found it is tricky for people to pick up. There are two ways to use Git, one, is through the command line (the tricker approach), the other is through your code editor or development enviroment.

You can search online for hundreds of Git tutorials. Here are some that I browsed and found quite accessible.

**Command line based:**

[https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)

If your company uses BitBucket, this one is good too: [https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud)

Although, it won't matter much whether you use BitBucket or GitHub, they both work similarly and you can easily transfer the skills and ideas.

**Code editor based:**

I personally use VS Code, so this one seemed great to me: 

[https://www.digitalocean.com/community/tutorials/how-to-use-git-integration-in-visual-studio-code](https://www.digitalocean.com/community/tutorials/how-to-use-git-integration-in-visual-studio-code)

### Tip on learning a new technology

I thought I'd add a quick tip on learning a new technology.

**Learn by doing.**

I cannot stress this enough. With programming, data science, and in fact most if not all things, passive learning will not help you. Get involved, get your hands dirtly, and struggle through the tricky bits. It will be tough, it will be time consuming, but that is how you learn long lasting skills.

Don't fight yourself either. *You have time.* Take the time and enjoy the journey.

How long did it take me to learn how to build this website? Over two years. And in that time I went through many ups and downs. I'd spend hours on the weekends contorting my brain to understand these things, restarting projects, rebuilding, failing, and trying again. Eventually, I did it. And althought at times it was tough, I did enjoy it.

## Conclusion

I hope this is useful to anyone wondering what Git is all about. If you'd like me to explore another topic, send me a message or comment on LinkedIn. If you find a problem with this post or would like to see something added, reach out on LinkedIn!