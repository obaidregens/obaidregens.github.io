---
layout: post
title: "How I got into YC by hacking it"
date: 2026-07-18
image:
  path: /assets/yc-post-og.png
  width: 1200
  height: 630
  alt: "Tweet from Jared Friedman (@snowmaker): Impressive hacking! Sorry for all the hopefuls out there, but we have patched the bug :). Obaid - thanks for reporting the issue. Look forward to seeing you at Startup School in SF in two weeks!"
---
**tldr:** I uncovered Y Combinator was scoring 100k+ founders around the world through Paxel, I broke it (possible easter egg) + found a vulnerability that let anyone forge and push any score to their ranking database, courtesy of an unvalidated hmac

**Latest update:** YC admirably, didn't mind. In just a couple hours after first-public-disclosure Jared Friedman himself replied, announced the patch, and invited me to attend the Startup School in SF this summer!
I'd also disclosed it in private through email 12 days earlier to no response. But publicly at least the process works.

<style>
.tweet-shot { max-width: 440px; margin: 1.5rem auto; }
.tweet-shot > a { display: block; border-radius: 10px; overflow: hidden; line-height: 0; }
.tweet-shot > a:hover { display: block !important; padding: 0 !important; background: none !important; }
.tweet-shot img { width: 100%; border-radius: 10px; display: block; }
.tweet-shot figcaption { text-align: center; font-size: 0.85rem; color: #999; margin-top: 0.6rem; }
</style>
<figure class="tweet-shot">
  <a href="https://x.com/snowmaker/status/2075813151069925440" target="_blank" rel="noopener">
    <img src="/assets/jared-friedman-tweet.png" alt="Tweet from Jared Friedman (@snowmaker), replying to @wtfobaid: Impressive hacking! Sorry for all the hopefuls out there, but we have patched the bug :). Obaid - thanks for reporting the issue. Look forward to seeing you at Startup School in SF in two weeks! Posted 10:23 AM, Jul 11 2026.">
  </a>
  <figcaption><a href="https://x.com/snowmaker/status/2075813151069925440" target="_blank" rel="noopener">Jared Friedman, July 11 2026</a></figcaption>
</figure>

this is a re-write of an [earlier draft](/jotbook/2026/07/11/yc-startup-school-26-application-i-hacked-paxel.html){:target="_blank" rel="noopener"} where I first made the disclosure public. it was badly written, sleep-deprived and I didn't feel good enough about it to publicize

<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

It all started early June, when I found the application form for Startup School 26' (referred by Dhanush: shoutout Audora S26, incredible stuff coming!!). I found that this year, YC wanted me to use something called *Paxel* on my computer as part of the application.

I should run a script, a very easy-to-use cURL one-liner that installed something on my computer and analyzed every line of code I've written with a coding agent, compile a report, and upload it to YC's servers.

[Paxel's main site](https://paxel.ycombinator.com/){:target="_blank" rel="noopener"} tells me the main feature is I get to "visualize" my work and get assigned fun attributes like "Which archetype are you?" and "What's your biggest crashout?" That sounded fun.

But I wanted to know exactly *how* it did that, and when my curiosity starts creeping into obsessive territory it's basically a toss-up that either ends in a legendary crash-out or doing something great. thankfully, in this case it was the latter.

I also can't lie: I really wanted (or needed) to hack it. I knew I was starting from a disadvantage when filling out my application (no formal, ivy league education), but I knew this would be a fast-track, surefire way into confirming my acceptance. I'm not delulu, I knew it would be insane if I was able to do it, but why not go all in?

Based on Paxel's own site, **1.2 million+ coders** have so far uploaded their reports to YC. And seeing those numbers it's honestly shocking I was the first person in the world to figure and break all of this.

<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

> *As a side note* before I get into it, I think the relative achievement of a "hack" in the world has diminished manyfold since agent-capable LLMs have arrived. That of course, pars with reality because of how much easier LLMs have made doing those. But I do think that ease is somewhat overestimated, both because of the many strange blindspots they have as well as the lack of a certain "hacking" or combative approach to intelligence. Whether that's because of safety-neutering or simply the way they're trained is a discussion for another time.

> So although what they're world-changing at is helping you go through the same material in 10x, and sometimes 50x less time (research, investigation), it is often a struggle to communicate with LLMs and keep your own mind sharp and independent when LLMs insist everything hackable is not — with near-perfectly plausible logic.

<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

Paxel has an incredible UX, everything it does is handled from a single one-liner `curl -fsSL https://paxel.ycombinator.com/upload.sh | bash`. It will automatically scan your entire system, prompt you for questions, and handle the upload — you don't have to worry about a thing after.

So the first starting point, naturally, was this install script. I first split it into 4 separate modules. When I tried breaking it in full every LLM I gave it to started hallucinating really badly (context window size increases are not perfect!)

The install script, turns out, actually didn't run on its own. It downloaded an entire docker image hosting a ruby app, unwrapped that, and ran it locally through the docker installed on your computer. So the app is actually divided into two parts:

① ─▶ upload.sh 302KB install script. Handles auth, discovers projects, extracts git history, and initializes docker

② ─▶ the ruby app unwrapped from a docker image. it runs the actual full pipeline per-project.

1. It first groups all chat transcripts into a yc-invented unit of work, "episodes". Each episode is all the commits per PR, failing that ─▶ Each commit in a 2 hour burst period ─▶ failing that, every single chat session becomes an individual episode.
2. Then, it uploads them to a yc-sponsored (interesting discovery!) free gpt-5.5 proxy hosted @ paxel-llm.ycombinator.com
3. gets back a summary per episode, rolls it in with other data, and uploads the final report to paxel.ycombinator.com/api/v1/results
{:type="a"}

And this is where I found that every piece of work you've done has been graded, scored, ranked by YC, and 1.2 million reports on earth's coders have been compiled.

execution_leverage | steering | engineering_quality | product_thinking | planning

**These are the core 5 axes** the LLM grades you on and assigns a score between 1-10 with free-text notes.

And this, is also where I found the most gaping vulnerability. See, this program is a very good example of a distributed/decentralized app (not everything has be to ran and consolidated on a proprietary server).

But the thing about decentralized apps is they rely heavily on some very basic functions of cryptography. And this pipeline lacked a very, very important one.

The LLM proxy, along with each episode returns a nonce <!-- yc_verify:req_r43du20c5ef1:bb6az7d459032e86 -->, and this nonce is shared between the LLM servers and upload server. Theoretically, this should be passed from LLM ─▶ local ─▶ POST /v1/results which validates that none other than an original LLM result is accepted by the endpoint.

Theoretically.

What did happen though, is this nonce failed to encode a signature of the LLM's results, scores, and notes so even though it did validate the nonce (server correctly rejected requests with invalid or missing nonce, and burnt after one use), the missing signature meant the entire episode and its score could be changed to whatever and uploaded to YC.

And YC accepted it.

Not only accepted, but if I buffed the score or changed notes, the report of the same exact project differed wildly.

<div class="compare">
  <figure>
    <img src="/assets/paxel-regular.png" alt="Regular Paxel report">
    <figcaption>regular</figcaption>
  </figure>
  <figure>
    <img src="/assets/paxel-boosted.png" alt="Boosted Paxel report">
    <figcaption>boosted</figcaption>
  </figure>
</div>

<div style="text-align:center;margin:.35rem 0 2.5rem;"><span class="caption-note">exact same project, exact same chats.</span></div>

And I took it a step further. With the same one-liner (I love Paxel's UX!!) I made [paxel-boosted](https://paxel.obaid.wtf/){:target="_blank" rel="noopener"}, a hack that let anyone in the world upload forged reports the same by launching a mirroring tool. Self-sponsored the boosting proxy because needing to add env is terrible user experience.

{% include paxel-boosted-terminal.html %}

For the couple hours from publicization to YC announcing the patch, over 20 of my users were able to rank themselves as the world's top 1% in YC's database.

## the fix

two functions of basic cryptography were missing.

<a class="frame-link" href="/assets/paxel-payload-map.png" target="_blank" rel="noopener"><img src="/assets/paxel-payload-map.png" alt="LLM proxy responses vs upload payload — which fields are sealable, signable, local, or discarded" class="dark-frame"></a>

<div style="text-align:center;margin:-0.6rem 0 2rem;"><span class="caption-note">blue+green fields need to be signed in the hash. green fields sealed and encrypted as well</span></div>

We could categorize all the fields accepted by /v1/results into 3 categories (two being important, one covering all others), as visualized above.

**1) fields that are passed** near-verbatim from LLM ─▶ /v1/results (green+blue-highlighted in the graphic above), these should have all been rolled and hashed together into the nonce as an hmac. Nonces were already validated, and this would make sure each nonce was actually tied to the LLM's responses.

`nonce = hmac(request_id)`
─▶ `nonce = hmac(request_id + scores.steering + scores.product_thinking + ... + title)`

and this is actually the patch YC did deliver and announce, pretty much exactly as I suggested in the [original draft](/jotbook/2026/07/11/yc-startup-school-26-application-i-hacked-paxel.html){:target="_blank" rel="noopener"}.

**2) that are** (1) passed near-verbatim from the LLM ─▶ /v1/results AND (2) also never used within the client. A subset of the fields above (green-highlighted in the diagram), these should be encrypted with any AEAD cipher (or asymmetric pub/priv keys) only the servers possess and share so the client can't see details like the 5-axes scoring, episode title, and notes.

This one is optional and is essentially obscurity, but if it had been done from the start, I could have never known what to sniff, what to change, and it would have covered the most serious of impacts from the first vulnerability —

<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

It's possible that this entire "vulnerability" was a secret easter egg to find out who could hack it, or a honeypot that didn't throw a validation error but secretly monitored who discovered and was "hacking" around it, but looking at the way this pipeline and Paxel seems to be written makes me think that's likely not what it was.

Now, since Jared's reply this has obviously been patched but my tool is still helpful in showing you your raw scores! Feel free to [check it out](https://paxel.obaid.wtf/){:target="_blank" rel="noopener"}.

if you'll also be in SF next week (21 jul - 6th aug) around the Startup School dates feel free to reach on Linkedin or Twitter with a tip for places, events, or people  where i can find my next co-founder to build something timeline-changing with — and we can connect.