---
title: "The power of plain text and the necessary evil of Word"
description: "Why I write everything in plain text, and how I deal with the world that doesn't."
date: "2026-02-28"
---

You're fighting with a table that won't align. You're chasing a rogue paragraph indent
that appeared from nowhere. You're copying text in from an email and suddenly everything
is a different font, and the heading styles are all broken. You spend twenty minutes on
something that should have taken two. The content is what matters but you're stuck
wrestling with the format.

There is a better way. It involves typing symbols like `#` and `*` directly into a plain
text file to specify your formatting. A syntax that's simple, consistent, and portable.
I know how that sounds. "A syntax? I need to know a syntax now just to write a
document!?". It sounds more difficult, more technical, more arcane than just clicking
around in Word. But hear me out.

> [!NOTE] This is aimed at people who work with code, data, are already technical, or
> who are exploring more technical workflows. If you're writing a two-page memo once a
> month, Word is probably fine. But if you're writing regularly, collaborating with
> technical people, already living in a terminal and a text editor, or want to consider
> ways to automate and improve how you work, this is worth considering.

## What is Markdown?

Markdown is a lightweight markup language created by John Gruber in 2004. The idea is
simple: you write plain text, and you use a small set of symbols to convey structure.
That's it.

A `#` makes a heading. Two `##` makes a second-level heading. A `-` starts a list. A
number (literally any number, it doesn't matter which one) starts a numbered list. Wrap
something in `*asterisks*` for *italics*. Double up for **`**bold**`**. Square brackets
for a `[link](https://example.com)`, with the URL in parentheses right after.

That's most of what you'll ever need. No clicking around. No ribbon. No styles panel.
Just text.

If you've never used it before, [this tutorial](https://www.markdowntutorial.com/) will
have you comfortable in a few minutes. It's genuinely that simple.

## But Word is easier! You can see what you're getting

I'd push back on that. I think Word *feels* easier because it's familiar. We've been
using it since school. We know where the buttons are. But familiarity isn't the same as
simplicity.

Think about *mise-en-place*. If you are not familiar, *mise-en-place* is a practice
chefs use of prepping and organising everything before you start cooking. To someone
who's never done it, it sounds like extra work. Why set out all your ingredients and
measure them beforehand, when you can just grab things as you go? But anyone who's
actually cooked that way knows: it makes the cooking itself effortless. The chaos is
dealt with upfront so it doesn't ambush you in the middle. Clean-as-you-go is a similar
idea. It feels like extra work, but it saves you from a mess later on. Pair the two
together and you have a smooth, efficient cooking process you might actually enjoy.

Markdown is like that. The "overhead" of learning a few symbols up front pays back every
time you sit down to write. And unlike Word, there's nothing to fight. The structure you
write is the structure you get. No surprises.

Tables get a bit fiddly, I'll admit. And if you want fancy multi-column layouts or
fine-grained control over typography, Markdown will shrug at you. But how often do you
actually need that? Really? Most of what we write day-to-day is just... text. Headings,
paragraphs, the occasional list. Markdown handles all of that without breaking a sweat.

## The actual advantage: version control

Here's another thing: plain text files play beautifully with `git`.

If you've read the other pieces I've written, you'll know I'm a fan of version control.
Tracking changes, seeing diffs, collaborating without emailing
`report_final_v3_ACTUAL_FINAL.docx` back and forth. In a `.docx` file, track changes can
tell you what changed, but once you've accepted or rejected them, the history is gone.
You can't see the evolution of the document, you can't easily compare two versions, and
you can't collaborate without a shared platform.

With a markdown file (an `.md` file), every change is visible, readable, and diffable.
You can see exactly which sentence was edited, which paragraph was added, which heading
was reworded, and you can track the history of the document and easily revert. Version
control for documents, the way it should work.

I write everything in Markdown now. Notes, articles, reports, documentation. It lives in
git. It's searchable. It's portable. It opens in any text editor. It will open in a text
editor in twenty years without any compatibility drama.

## A note on corporate document chaos

There is another reason I lean toward plain text that goes beyond personal preference.
In most organisations, documents are a mess. Heavy Word files scattered across network
drives, SharePoint folders nested six levels deep, filenames like
`Policy_v2_FINAL_JoReview_March_USE_THIS_ONE.docx`. Nobody can find anything. Anyone can
change anything. The history is gone the moment someone saves over it. Formal sign-off
processes exist precisely because there is no other way to know what version is
authoritative.

For teams that work with data, code, or anything technical, this is particularly
jarring. You would never manage your code this way. The idea of having no version
history, no change tracking, no single source of truth for your codebase is unthinkable.
And yet the documentation that supports the team lives on a shared drive somewhere,
slowly rotting.

If you are running or a part of a technical team, consider a team admin repository.
Plain text files, version controlled, centrally stored. Every policy, every process
document, every piece of internal documentation in Markdown, in git. The benefits stack
up quickly. Full history of every change and who made it. A single authoritative
version, always. Lightweight files that will open without issue in ten or twenty years.
Easily searchable, easily shared with a link rather than an attachment. And if you are
already using AI tools in your workflow, plain text is trivially easy for them to read
and trawl. Try getting a model to reason coherently over a deeply nested Word document
with tracked changes and embedded tables.

It is a small culture shift, but the payoff is significant. And for technical teams
especially, it is the natural extension of practices you already apply to your code.

You might be thinking: Google Docs or SharePoint already solves most of this. Central
storage, version history, easy sharing, collaborative editing. And you're not wrong. It
is a meaningful improvement over emailing Word documents around. But you're still locked
into a proprietary platform, your documents are only as accessible as your internet
connection and your account, and the files themselves, aren't really yours in any
portable sense. Plain text files live on your machine, in your repo, in any editor you
choose. They'll be readable long after Google or Microsoft has pivoted to something
else.

## The necessary evil

But here's the thing. We live and work in a world where Microsoft Office is the *de
facto* standard. You can't send a `.md` file to your manager or a client and expect
anything good to happen. They'll either be confused, or, worst case scenario, they'll go
looking for software to open it and probably download some malware in the process.

So if you want the benefits of writing in Markdown (the simplicity, the portability, the
version control) you need a bridge to the `.docx` world. That bridge is
[Pandoc](https://pandoc.org/).

Pandoc is a command-line tool that converts between document formats. Markdown to DOCX,
DOCX to PDF, PDF to anything, anything to anything — it can do a lot. For our purposes,
we care about one direction: Markdown in, DOCX out.

The basic command looks like this:

```bash
pandoc my-document.md -o my-document.docx
```

That's it. You get a DOCX file. It won't win any design awards, but it's readable, it's
structured, and it has all your content. Good enough for most purposes. And arguably,
most Word documents people send around aren't winning design awards either, so we're
level.

If you want it to look like your corporate template, i.e. with your fonts, your heading
styles, your footer, you can pass Pandoc a reference document:

```bash
pandoc my-document.md -o my-document.docx --reference-doc=template.docx
```

Pandoc will use the styles from your template and apply them to the output. So you write
in plain text, and out comes something that looks like it came from your company's Word
template. Pretty neat.

One catch, that reference document is a specific `.docx` file you will need to create
first. It's easy to generate a plain one from pandoc itself:

```bash
pandoc -o reference-doc.docx --print-default-data-file reference.docx
```

Then you can open that in Word, apply your corporate styles, save it, and use it as the
reference for all your conversions. It's a one-time setup cost that pays off every time
you generate a DOCX.

On top of that, you can also use a template file to specify how the content is
structured in the output. You can generate a default one with:

```bash
pandoc -o template.openxml --print-default-template=openxml
```

I don't use that myself, but if you have specific requirements for how your DOCX should
be structured, you can customize that template and pass it to Pandoc as well.

Using the template and reference document together, you can get a DOCX that looks like
it came from your company's Word template, with the structure you want, all generated
from your Markdown source:

```bash
pandoc my-document.md -o my-document.docx --reference-doc=template.docx --template=template.openxml
```

There are also various other options you can use to control the output, like whether you
want a table of contents, how numbering should be done, etc. The Pandoc documentation is
pretty good, and there is the wonderful world of AI to help you figure out the exact
command you need for your specific use case.

## The workflow, in practice

Here's how it looks day-to-day:

1. Write the document in Markdown, in whatever editor you prefer (I use VS Code).
2. Commit changes with git as you go or at the end, whatever you prefer.
3. When you need to share with non-technical people, run the conversion command to
   generate the DOCX.
4. Send the DOCX.

The Markdown file remains the source of truth. The DOCX is a generated artefact, like a
build output. You don't edit the DOCX and try to sync it back. You edit the Markdown and
regenerate. Simple.

Is this overkill for a two-page memo? Probably. But once you've felt what it's like to
write without fighting your tools, it's hard to go back. And if you're already using git
for your code, there's a certain satisfaction in having your documents live there too.

The fancy tool is there when you genuinely need it. Most of the time, you don't.
