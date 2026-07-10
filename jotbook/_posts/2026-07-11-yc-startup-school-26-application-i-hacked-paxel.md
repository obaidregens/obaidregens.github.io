---
layout: post
title: "I've hacked Paxel as part of my YC Startup School 26' application"
date: 2026-07-11
---
yes i've hacked paxel. this is a public disclosure in real-time, with a tool anyone in the world can use to make their analysis top 1%, and @YC i've indicated some basic cryptography that is missing and can be used to patch this [me@obaid.wtf, twitter:@wtfobaid]

<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

early june when I found the application form for Startup School 26' (referred by Dhanush, shoutout: Audora S26!) part of the extreme delay in me applying was just that I really wanted to know what Paxel did — like really really badly [prioritizing curiosity over all else can sometimes become procrastinatory]

if it was being used to grade applications for startup school, it must be acting as a competitive ranker. and if so, why wouldn't i try and hack it to give myself that edge?

nearly 12 days later i finished my application simultaneously with a companion email to YC sent called "Disclosed a vulnerability in Paxel as part of my YC SS26 application."

No details, the body was empty. Granted, I wanted to be cool and send them panicking and looking for my application to make it stand out among the 30k+ others. but anyone who was at YC likely has enough agency to cross-reference my email against the applications database and find the detailed disclosure

this was sent on the 24th of Jun. I was invited to Startup School 6 days later, but I didn't get a response back for that email, and neither from the applications team where I disclosed more details

Since all this, the only update to the paxel install script I checked has been adding support for VSCode Copilot, so the bug hasn't been patched (unless they quietly built a honeypot in that time, but indications in the way the code is structured tells me that isn't likely) — so i think it's now appropriate to make this disclosure public. i'll try to simplify my explanation of the hack even for the non-technical, along with the solution that shouldn't have been missing from the outset: just 2 functions of basic cryptography

<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

there are 2 ways you can learn this. One is to continue with reading the writeup below, and the other, preferable for people like me, is in baby-steps, and by-doing.

With the exact same ux as the original paxel, I've created a fork hosted at [https://paxel.obaid.wtf](https://paxel.obaid.wtf) that you can use in as a drop-in replacement.

It uses the same YC servers and runs the exact same pipeline as Paxel (code preserved bit-for-bit) but at the last step just before it uploads to YC, it intercepts the "scoring" and "notes" parameter, sending them to an LLM gateway hosted on my servers (no logs, secure, powered by cloudflare ai gateway) and returns them "buffed": i.e: increasing the score in a realistic way, while identifying qualities in your code the original LLM analysis does not do.

then it uploads it, back to yc. and yc accepts it. and not only does it accept it, but along with hidden scoring parameters used by yc's backend, even the visible report strength of the same project uploaded through "regular" and "boosted" paxel differs wildly.

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

at this point, i would encourage you to use the tool, preferably with a custom OPENAI_API_KEY if you can afford it so my $ donated for this educational venture are not finished overnight, share with your curious friends, and then come back after to continue reading

<img src="/assets/paxel-landing.png" alt="Paxel boosted landing page" class="red-frame">

<div style="text-align:center;margin:.6rem 0 0;"><a class="caption-link" href="http://paxel.obaid.wtf" target="_blank" rel="noopener">paxel.obaid.wtf&nbsp;<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:baseline;"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></a></div>


<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

first, it was difficult to analyze the install script because it is huge, but after struggling a lot with Opus' context length degradation I just realized the stupid simple solution of asking it to first break it up into multiple, logical modules.

### How it works

**Step 1:** Local chat transcripts and git history are packed into one — and uploaded to paxel-llm.ycombinator.com, a free OpenAI proxy hosting gpt-5.5 and sponsored by YC.

(fyi: and if you're wondering whether this OpenAI proxy can be abused, I already tried, the proxy is hash-guarded so only a few system prompts are allowed that are needed for Paxel are allowed)

**Step 2:** The various scores, axes, and vectors, and summaries used and returned to grade each "episode" or "session" are again packed with some local metadata and uploaded to another YC endpoint paxel.ycombinator.com/api/v1/results

(for the technically curious, the install script is just the harness, it actually unpacks a docker container running a ruby app that does all this extraction+parsing)

now, keeping logical purity aside both of these steps can obviously be just one endpoint so it does seem an interesting decision not to do that

but the more interesting part, is for security and to prevent forgery, the first LLM endpoint returns nonces like `<!-- yc_verify:req_9a250c66771c:842c6529185dfce9 -->` that must be passed to the second endpoint to validate.

these are stored and shared somewhere between the servers because without them, no call to the second endpoint `/api/v1/results` succeeds: they're all rejected with an error message for tampering. and these nonces are burned on use, so if one has been already been sent to `/api/v1/results`, it can never be used again.

cool secure protocol so far.

but even though nonces are correctly validated from LLM-to-upload, the scoring, it turns out, is not. as long as a valid nonce is present from a valid LLM call, the "episodes" and their scoring can be completely fabricated

and what can be forged then? everything. How long was the session, how much time you spent, what you built itself, and the secret 0-10 objective scoring paxel does across 5 different axes, all of it and everything else too.

it doesn't have to be this way. this is a gap in the security scaffolding and it can be fixed with just two, simple cryptographic functions while keeping the two-endpoint, local control model.

### how to fix

**One,** the nonce should be hashed with every single field being passed verbatim from the LLM result -> upload payload.

=> hmac would work best for this, and it does look like someone started on the implementation, nonce key is broken into `<!-- yc_verify:{req_id}:{hmac} -->`, but the server-side validation never happens (honeypot is possible yes, but the relative simplicity of the security protocols used leads to me think that is not likely)

**Two,** a subset of them, every field that is not printed or used by the client to compute other fields should be signed and encrypted by a key only the server has so they aren't crackable.

=> signed and encrypted with any AEAD cipher.

one technicality here that some minor transformations/data correction are applied to these fields on the client that will have to be shifted to the server as the client won't be able to access them anymore. simple stuff, like making the llm score clamp 0-10 IF for instance it isn't: which never happens with the default gpt5.5.

<a class="frame-link" href="/assets/paxel-payload-map.png" target="_blank" rel="noopener"><img src="/assets/paxel-payload-map.png" alt="LLM proxy responses vs upload payload — which fields are sealable, signable, local, or discarded" class="dark-frame"></a>

<div style="text-align:center;margin:.35rem 0 0;"><span class="caption-note">blue+green fields need to be signed in the hash. green fields sealed and encrypted</span></div>

<div style="text-align:center;margin:2.5rem 0;color:#999;">— &nbsp; — &nbsp; —</div>

comments and discussion will be available on twitter, hackernews, various reddit posts, linkedin.

paxel.obaid.wtf is available until my the fixed credits I set for it end.