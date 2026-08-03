---
layout: post
title: "announcing pivotal ☀️"
date: 2026-08-02
---

☀️ **a new universal-workspace model for agent harnesses** <a href="https://github.com/obaidregens/pivotal" target="_blank" rel="noopener" style="float:right;color:#999;text-decoration:none"><code>[Github]</code></a>

_no jargon explanation:_
\
this tool will categorize everything you do on claude code into topics so you can resume work easier and efficiently combine context of the same work across chats. doesn't interfere with claude code.

quick install for non-readers:
```sh
curl -fsSL https://pivotal.obaid.wtf/install.sh | bash
```

**Before:**
\
-> you compressed images into a hyper-niche jpeg2000 format with claude code before. need to compress another.

-> can't remember which directory claude launched in so need to look through every single directory's /resume.

**Now:**
\
-> Recall and select work you've done across any codebase
- "did research on user me@obaid.wtf"
- "compressed images to jpeg2000"
- "built pivotal tool, a claude universal knowledge-base"

-> as a plus, automatically combines context across all chats dealing with the topic so when you resume it's fully batteries-charged

<img style="max-width:100%;height:auto;width:auto" alt="pivotal demo" src="https://github.com/user-attachments/assets/5a01a994-85bf-4600-b738-e5201f817648" />

---

i've worked extremely carefully myself to make the UX as delightful and simple as I always do, and the `install.sh` experience is part of it

## Install

everything is handled by `install.sh`, first time it runs it will walk you through the installation, and the next time it will detect your set up and give you configuration options as well as cleanly uninstalling or changing your installation from prod to dev (realtime changes reflected) mode.

<img style="max-width:100%;height:auto;width:auto" alt="the pivotal installer" src="https://github.com/user-attachments/assets/806ee214-35e3-4428-94e3-efdf9c7c0595" />

Production (one-off — downloads and sets up the app at `~/.local/share/pivotal`):

```sh
curl -fsSL https://pivotal.obaid.wtf/install.sh | bash
```

Development (clone anywhere; every edit is live immediately):

```sh
git clone https://github.com/obaidregens/pivotal.git && cd pivotal
bash install.sh   # this install.sh auto-detects project directory and offers "Install dev version"
```

## how it works

It directly installs into your terminal, so just doing `↓ DOWN ARROW` (unmapped key) will let you navigate through your topics like `↑ UP ARROW` does terminal history

select any topic to open a new chat condensing discoveries from the topic across chats, latest steps and reference to original chat sessions used-as-needed.

<img style="max-width:100%;height:auto;width:auto" alt="the pivotal topic selector in action" src="https://github.com/user-attachments/assets/787494e6-835c-4051-a2be-83bb5ba93af1" />

the `install.sh` and permanent help badge after should be pretty self-explanatory hand-holding! but if you go off a wrong path or something is not extremely explanatory just dm me on twitter @wtfobaid or text @ +1 940-745-8318 with a link to the repo and what you went through.

but if you still want the full deets, the LLM-written half of the [repo README](https://github.com/obaidregens/pivotal#explained-by-my-llm) goes all the way down.

**why not openclaw?**

the first time I used it, it ate an absurd amount of tokens and then proceeded to accidentally wipe my entire work for the day. i think claude code's context isolation is better, although the lack of fluidity between work is something I've tried to strike a balance with in pivotal.

feel free to hammer me with all the detailed reasoning for why pivotal is reinventing the openclaw wheel, i might not reply but I will read all of it earnestly and think about it deeply.

## thesis
claude code is being used for a lot more than coding now. I do everything from learning and research to compressing/converting files, connecting mcps and handling my mail.

so the assumed model of claude code that handles project directories and chat sessions with fresh contexts has become limiting enough for me that I've almost considered breaking claude code to roll my own harness. almost.

but thus far, I'm choosing to keep and extend it as much as possible until I run into the wall
