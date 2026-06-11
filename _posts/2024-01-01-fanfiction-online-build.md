---
layout: post
title: "I built a fanfiction platform from scratch at 17. Here's what the code still says about it."
date: 2024-01-01 00:00:00 +0500
---

Since I was 7 years old, I've been an avid reader. When I look at how old kids are at 7 now it is hard to believe myself, but thankfully I do have the receipts which means I don't end up gaslighting myself — stale digital records of torrented books and pixelated videos through Nokia handhelds and me reading as people shout, tables fall, and my little world (the home I knew) descends into chaos all around.

Of course, I was a technically savvy kid. At around the same age (I don't remember when), there was an incident: somehow, I ended up changing the WiFi password of our network without knowing anything or ever remembering using the 192.168... local address. To this day, I don't know how that was possible, but I have a backup in trusted, shared memory from my brother who still remembers pressing me on how I did that — the answer I had for him then is the same I would have now: I was just playing with the settings and I don't know.

And after, pretty much when my brother (CS major and one of the first iOS developers at Venture Dive/Careem) became too busy, I was handed over the duties of managing the home's technical admin.

I was also creative: I remember using carefully placed mirrors to find people's device passwords and secretly used them at night when no one could find out — having bounded creativity and strict parents will do that to you.

The same restrictions extended to books. The way I used to devour books grew from initial support into apparently serious concern. My book-reading time became limited, and so did the restrictions on their content. They didn't understand it, and to this day a principle I've derived since is that it's not the worst thing in the world to be conservative — but one of the worst things you can do in any scenario is restrict and stop the things you don't understand.

I remember when I borrowed a book from the son of a family friend, *Alex Rider: Eagle Strike*, my mom had my brother read it cover-to-cover and with a black marker erase all text that had anything to do with girl-to-boy interactions or "kissing". I can't tell you what it did to my psyche over the next 10 years, but I can tell you that extensive control extended far further.

I cried when I found out, not because of the censorship, that I was used to, but because I didn't know I could explain the markings when giving it back. And my mother knew who I'd borrowed it from, so it was actually even more insane. I'm almost cracking up thinking about the absolute insanity of it now. Though in hindsight, that was probably for the better: at least someone from the outside had a window into this insanity.

This is sounding more like a confessional therapy session than it does a story about a fanfiction site, but perhaps that is the necessary prelude I've been wanting to put out all along.

---

I learned to torrent because of my obsession with books too. My mom used to take me to a used book stall in Hyderi, where the books were stacked taller than humans, no categorization, and prices were between Rs 100–400. Our monthly trip had a limit of 4 books per sibling, no more, and that, obviously, was not nearly enough for me.

I learned to torrent. I knew what it was because my siblings used to download matriarch-approved flicks to put on show for the family, but the recipes for those were always gatekept. As anything as an early GenZ, I used the internet to find that recipe.

The books I downloaded were nearly always continuations of series I'd started but never found the full cycles for, and soon I remembered not to beg my mom to go to Liberty Books or ask for books I couldn't find at the stalls. My reading had become all-digital.

I remember on our first-ever out-of-Karachi trip, to Islamabad, we stumbled into Saeed Book Bank and I found on the shelf the then newly-released finale of the Artemis Fowl series: *The Last Guardian*. I was hooked, but I knew to skim through for as long as we were there, and quietly get up and only launch uTorrent when I got back home to Karachi.

Soon, the desire for continuation turned into something else: the discovery of fanfiction. A way to stay in denial about the stories that I'd learned had already ended.

My sister had a role in that introduction to this world, and learning what I did later about the depths of insanity it went to, I often wondered about her adult due in that.

My life up till that point represented the new. I was determined to turn everyone using anything backwards up to that point — whether that was paper records not yet adapted to Google Sheets, or literally anything else — into the "modern" way. And that desire extended to my newly discovered fanfiction community with a new website, the "modern" way of reading fanfiction.

**fanfiction.online.**

---

I launched this under an anonymous name, very easy to do as I'd found in my Reddit stalking, primarily out of fear of retribution from my family or other circles I was in accidentally discovering me.

And I began making a more modern website. The thing is, I didn't know how. I'd used WordPress to create websites before and my early foray into it at 8/9, learned to make HTML and JavaScript websites, but the only full live tool I knew how to use was WordPress. I'd used WordPress to create a few sites then, and chose to use it again. And I did.

I knew WordPress.org existed with more customization. And I knew how to use one-click deployments. So I used my dad's newly (badly sustaining) business website that used a cPanel hosting and that I managed, and set up an alternate site on it.

And it was live. But the preset theme I used didn't make sense. And the admin panel, despite all the hooks and customizations to remove panels, was still clunky. And I didn't want the WordPress logo to show anywhere.

So one-by-one, step-by-step, in one of the greatest learning curves I think I have surpassed in my life, I learned to build all of that on PHP and from scratch, learning what code even was along the way. The process was simple: I saw a button I didn't like, and googled "hook to remove xyz button", kept researching until I found the right guide, article, reddit thread, or stack overflow post. Tried a few, then dug deep into the HOW when I found one that worked.

Slowly, this turned into me replacing the entire admin panel with a custom one, using the same APIs, and then even not, stripping away all aspects of the WordPress core until I was able to delete the entire wp_includes directory and only the MySQL database schema remained.

What was left at that point wasn't really WordPress anymore. The routing was a custom PHP `Router` class — a single `index.php` intercepting every request before WordPress ever touched it. The templates, the auth, the mail, the analytics — all replaced. A full PHP framework assembled one Stack Overflow answer at a time, wearing WordPress's database schema like a borrowed coat. All of this running on a **$5/mo cPanel shared hosting plan** shared with the barely-alive business site.

The version numbers alone tell the story of what followed: `15.5.12 → 15.10.8`, sometimes three releases in a single day across November and December 2020. Whatever "version 15" meant at the start, by the end it was a completely different animal.

---

The platform it promised authors wasn't a vague claim. Here's what it actually had:

**For readers:**
- Three reading themes (normal, pale sepia, white-on-black night mode) — persisted per account
- Per-paragraph bookmarks, server-side — not just "chapter 12" but the specific paragraph
- Font size (10–42px) and line-height controls
- Text-to-speech via the browser's built-in speech engine — added after git stopped watching
- Personalized feed filtered by fandom, rating, language
- A "currently reading" feed — the stories you're in the middle of, surfaced automatically
- Offline reading (PWA) with its own tracking

**For authors:**
- Story import from FFN — link your account, select stories, auto-syncs on every upstream update
- Blog-style update posts on author profiles, with pinned/sticky post support
- Draft system with folder organization
- Time-limited polls for readers (3-day default expiry, multiple options)
- Q&A: readers ask questions, author moderates pending/public, anonymous option available
- Chapter-level reviews with quote and reply — authors respond to specific reader comments
- Beta testing system: invite specific users to time-limited sessions before a feature releases

**For both:**
- Follow system for authors and collections, with per-follow notification preferences
- 10-type notification inbox, priority-ranked: `story_update`, `chapter_review`, `review_reply`, `follow_user`, `follow_collection`, `chapter_vote`, `user_update`, `beta_invite`, `stories_imported`, `account_verified`
- User-to-user chat with blocking support
- Faceted search: filter by fandom, tags, pairings, characters, word count — simultaneously, across the entire archive, using a precomputed inverted index and set algebra in memory

The analytics underlying all of this: a visitor fingerprint cookie with a 15-year lifetime, per-paragraph reading events logged in milliseconds, every search query archived with every filter parameter, 30-minute session deduplication for story stats. Built in from the start.

This was the pitch to authors: *your readers will read you more comfortably here.*

---

So I engineered a scraper that bypassed Cloudflare through a rotating outwards proxy, logged into fanfiction.net with 5 rotating accounts, and sent personal DMs to a total of 8,500+ top authors, inviting them to the website. I don't think I knew what cold outreach or email lists even was at the time, but I knew I wanted to speak to authors, and I'd figured out it was a numbers game.

All on a $5/mo cPanel hosting, shared with one more, though mostly dead website.

The targeting filter: only authors with 350+ favorites or follows. 8,378 profiled, 4,964 reached, one message every 35 seconds across 5 rotating accounts, each delivery confirmed by parsing the response page.

The response wasn't great. I learnt that people wouldn't use an empty site, even 1 out of 8,500+ of them. But it did get some results — multiple authors created threads on Reddit, Tumblr, and other forums about the horror of being approached like this and how I was a money-sucking leech (I'd never monetized it, but they assumed somehow) bonding in their trauma. Yes, the response was that negative, almost bordering on harassment.

I was struggling — months of development and all other corners of fanfiction communities, the people I was building it for, seemed to hate me. Only one corner of the internet, a Harry Potter-centered fanfiction Discord, seemed to welcome me and provided support and, might I say, older developers who offered me guidance.

Until my big lucky break.

---

A viral post on Tumblr ranted against Ao3 for various reasons and referenced my website as where they were moving. It was a miracle — overnight from 50 I hit 10,000+ signed-in users and could have been a lot more, except the cPanel hosting finally gave up, the internal email service I had used to deliver verification codes refused to deliver, and I was left stranded.

In all times of difficulties since then in my life, I've always had an inkling of an idea of what I would do. In this case, I had none.

At the same time, anticipating some need I had started making some money and had a whole $35 stuck in Payoneer. I knew within those limits I had to figure out a solution. So I started researching and learning what servers were — I spent night and day, and in the most literal sense possible. I didn't sleep for nearly 3 nights and days worried I would miss out on my lucky break of users — and I wasn't wrong, I did.

And I wasn't able to figure the migration and setup of my newly discovered $5 droplet on DO in time — the site was unavailable, and the hype died.

The migration did eventually get there: a DigitalOcean droplet at `167.99.11.178` running RunCloud as the server management panel, deployed via a Python script that zipped the codebase and SCPed it up, then SSHed in to unzip into the live app directory. Two separate webapps: main and beta, both on the same $5 droplet.

I was finally able to get it together and set up my own mail server, but that too, was eventually rate-limited.

Three attempts at email infrastructure: cPanel's internal service (which couldn't scale), a self-hosted server on the same droplet (rate-limited by receiving servers), and finally SendGrid — via API, with seven fully designed dynamic templates: `signup`, `OTP`, `change-email`, `notification`, `faq-alert`, `contact`, `contact-first`.

The last two commits in the entire project — *"Sending Mail"* and *"Updated Mail templates"*, May 20, 2021 — are about this. A fitting last word from the code: the thing that crashed the site when it finally got its moment, fixed, at the very end.

---

The final chapter in the codebase, also May 2021: a from-scratch, strictly-typed faceted search engine. Rather than slow joins across the story table, it precomputed an inverted index — every tag value mapped to the set of story IDs that carry it — and filtered entirely in memory as set algebra:

```
included = intersect(Romance, Adventure, Naruto)   // AND all included tags
included = diff(included, Crossover)               // MINUS excluded tags
included = intersect(included, titleSearch)        // refine by text search
return paginate(included)                          // fetch only this page
```

Wrapped in a hand-built PHP 8 type system — `Integer`, `LazyInteger`, `Range`, `Str`, `OneOf`, `TypedArray` — all throwing on bad input. Typed query args. Named arguments. The most architecturally ambitious thing in the entire codebase, from someone who learned what code was by Googling how to remove a WordPress button.

It got two commits. Then went quiet — caught mid-thought, a cathedral with the scaffolding still up.

---

The commit messages decay honestly as the months drag on — *"Whatever," "Stuff," "Something," "No Idea what this is."* That's not failure. That's the fingerprint of someone carrying an entire product on their own back, well past the point most would have stopped.

The hype window closed. The migration didn't happen fast enough. The outreach campaign produced backlash before it produced users. All of it on a $5 shared hosting plan the site was never meant to outlive — until the moment it needed to, and then three sleepless nights and the only $35 available went into fixing that.

The repos went quiet on May 20, 2021, with two commits about finally getting email right. The live site kept going — gaining features out past the reach of version control. The story that git can tell ends there.

298 commits. 5 repositories. 8,378 authors profiled. 10,000+ peak signed-in users. $5/mo.
