---
title: "Why use Python if C is faster?"
description: "Exploring why Python remains the language of choice for data science and machine learning despite lower-level languages like C being inherently faster."
date: "2022-05-03"
archived: true
---

This is a really common question or comment I receive when demonstrating data science or machine learning in Python.

Yes, C and its derivatives are faster than Python. In fact, many programming languages are faster than Python. So, why do I bother writing an article about it? The answer to these questions is actually a bit more complicated than you might expect. And I feel like there is some valuable knowledge to be shared exploring it a bit more.

So let's dive into it.

# Three key reasons why Python is so popular for machine learning

There are three key reasons why Python is so widely used for machine learning:

- Popular machine learning libraries in Python more often than not are actually using C in the background. Python is just the interface, C does the heavy lifting.
- Computation speed is not the only metric we need to care about, in fact, development speed often matters more. And Python is blazingly fast in terms of development speed.
- Python is easy to learn and very kind to new programmers. C is difficult to learn, and can be very challenging. This means Python has a lower barrier to entry, and very clever people that aren't amazing programmers can contribute.

Let's explore each a bit more.

## Most machine learning libraries are using C in the background

Pure Python is slower than C and a lot of other programming languages. But, if you are using popular machine learning libraries, you are not using pure Python.

Browse through the <a href="https://github.com/scikit-learn/scikit-learn">scikit-learn source code</a> and you will see a lot of files with the extension .pyx or .pxd. These are files used by a library called <a hred="https://cython.org/">Cython</a> to compile the code to native C/C++ code for the performance benefits they provide. These files are littered all over the scikit-learn source code. So if you are using scikit-learn, you most likely are benefitting from the speed of C in any case.

It doesn't stop there, and it doesn't stop at just C. <a href="https://www.tensorflow.org/">Tensorflow</a>, a library developed by Google to train neural networks, is highly optimized in many ways. It is not at all written purely in Python. Optimizations in Tensorflow include <a href="https://www.prowesscorp.com/what-is-intel-avx-512-and-why-does-it-matter/">AVX-512</a> which improves learning time on the CPU. Even better, if you have an Nvidia GPU, you can leverage the <a href="https://developer.nvidia.com/cuda-toolkit">CUDA Toolkit</a> and its associated <a href="https://developer.nvidia.com/cudnn">cuDNN</a> library for blazing fast neural network training.

It goes even deeper than that, <a href="https://numpy.org/">NumPy</a>, the core to practically all numerical libraries in Python, is also basically C at its core, NumPy said it themselves:

> "The core of NumPy is well-optimized C code. Enjoy the flexibility of Python with the speed of compiled code."

If you are using these libraries, you are benefitting from C to a large degree anyway. Yes, it won't be *as* fast as pure raw C, but the differences are likely not material and the extra effort is not necessary. That brings me to the next point...

## Computation speed is not the be all and end all

Pure computation speed is not the only metric we should care about. For example, if you wanted to be a super fast delivery driver, and your only consideration was engine power, you'd buy a ship, those things generate ridiculous amounts of power. But, you would introduce a whole host of other difficulties. Or, if your only metric was speed, get a fighter jet. But again, you've just made your life very complicated. This is why delivery drivers typically using small bikes to zip through traffic. No one asks them: "Why didn't you use a fighter jet, they are so much faster?"

What often matters a lot more is development speed. Especially in experimental situations like data science and machine learning. Since Python is interpreted and built to be easily used, it is super fast to develop software. You don't have to worry about significant boilerplate code, compilation times, debugging mysteries, memory management, etc. These are all complexities of C and a lot of other compiled languages. With Python, it is really fast to get a prototype up and running because it is really easy to use. So you can get to a working product faster than you would with C. And maybe it does run 10x slower, but, it will probably give you results before you would get them with C if you included development time. That doesn't even consider time to learn each language, where Python again is faster. Which brings me to the final point...

## Python is easy to learn and use

Python is a really user friendly and easy to learn language. This means you don't need to spend years mastering it to start applying it to your field of work. This is super important, because it means really clever people with great ideas can easily contribute to the Python ecosystem. The barrier to entry is low, so many people get involved and provide useful tools to the community that others can use.

Plus, all this means it is also really easy to get help when you are stuck, and there is a lot of support and interest.

It also means it is popular. This drives more interest, more development, and more good things.

# So when should we use C?

There are definitely times when Python won't cut it. But these are the edge cases. Inference time can be important, and sometimes porting Python code to C or another lower level language will be needed. But, by this point, all the experimentation is done, and its about productionising code, so again it is a unique situation. Further, in very high performance environments (think high-frequency trading, deploying fraud models on banking transactions) where the response time needed is in the order of the low milliseconds thousands of times a second, then you need super optimized high performance code. However, in these cases, the solutions go well beyond C, and stretch as far as building custom hardware built specifically to run inference from machine learning models. Most of the time, Python is just fine.

And finally, the performance difference between Python and C is often not even perceptible in most cases. C might run something in a few nanoseconds, and Python will be 1000x slower, and run it in a few milliseconds. Is that really going to have a major impact? Unless you are running this calculation millions of times, likely not.

So don't worry about using Python even though it is slower than C. It most likely doesn't matter. And if it does matter, you'd be in a position where you'd know a lot more than you do now, and will be able to get the resources you need to tease our the performance you need.