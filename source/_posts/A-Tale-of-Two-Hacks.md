---
title: A Tale of Two Hacks
description: Other government departments can make data available - why not the NHS?
image: /img/rough_logo_transparent.png
date: 2019-03-27 12:16:49
tags:
  - transparency
  - open data
  - nhs
categories:
  - Reflection
---
I spent the last two days attending the [Digital Health REWIRED hack](https://digitalhealthrewired.com/rewired-hack-day/) in London. My intention was to come away with a proof of concept of interfacing the ReallyCare Plait system with the [GP Connect](GP Connect) interface. I left a couple of hours into day two, having convinced myself that not only was such a thing impossible now, but it would be for at least a few years.

As it became clear to me just how much of a mess NHS IT was still in I remembered my first ever Hack Day -  "National Hack the Government" in 2012. I turned up at 9 on a Saturday morning, not even really knowing what a hack was, to find that three government departments were looking for developers to do something useful with their freshly released APIs to test / publicise them. Before the show-and-tell that afternoon I had: skimmed over the capabilities of the APIs; decided on a use-case; signed up as a consumer (there was some friction here, but the met office were paying someone to work at the weekend to sort it out); written a functional back end; written a simple user interface and rehearsed my demo. I must have had something that vaguely worked as the demo went well enough to win me a £250 prize.

Contrast that with my experience with the NHS APIs:

My first encounter was in (I think) 2004 when I went to a meeting in Leeds to learn about whether the National Program for IT would enable my company of the time to do things that seemed to me to be obvious.  At the time we were developing a mobile system for care workers to tell them what their next visit was. I thought it would be great if we could check before each job if the customer had been admitted to hospital. This is still not possible. As was shown on a TV fly-on-the-wall show a little while ago, adult social care departments can still come to a stand-still while they phone round the local hospitals looking for a missing service user. It was clear that the powers that be had no real understanding of what social care was, what technology was available to social care providers or what budget was reasonable for them to connect to the NHS network. Their system was there to give information to those who met very strict Information Governance (IG) guidelines, could afford to go through the super-onerous process of getting access to it, and had the budgets to connect to their closed network. When I said that domiciliary care providers almost always had more up to date demographic data than the NHS (as they need to know where people move to in order to visit them, duh) and enquired how they might feed changes back, I was greeted with blank stares.

I was stupid enough to have another look at connecting a few years later, just before I sold that company, and nothing had changed.

After setting up ReallyCare, perhaps influenced by my good experiences of the met office APIs (and the 250 quid prize!), I went to an ‘attach to the spine’ workshop in about 2015. This proved that, despite pretty horrendous documentation, it was technically easy to access the test spine – at least when there were experts in the room. So I logically asked when a social care provider would get access.  Over the internet. Still no prospect. Nothing had changed.

Recently, Matt Hancock announced that henceforth interfaces were going to be [“internet first”](https://government.diginomica.com/2018/10/17/health-secretary-launches-open-standards-and-cloud-first-strategy-for-nhs-vendors-that-dont-comply-will-be-phased-out/), so I decided to go along to this week’s hack and build myself a proof of concept. Turns out that “internet first” translates to “we have a roadmap to port services onto a sensible network, but the timescales are pretty fuzzy and distant”. The [Caldicott 2 IG principle](https://www.igt.hscic.gov.uk/Caldicott2Principles.aspx) that “The duty to share information can be as important as the duty to protect patient confidentiality” has kind of started having an impact but NHS Digital staff are quite confusing about it (perhaps because they themselves are confused). The nuts and bolts of taking advantage of this (possible) loosening up are far from clear or simple, however.

Once I realised that I could do nothing of value at the hack I went to the main REWIRED venue, where I watched [Hadley Beeman](https://www.digitalhealth.net/2019/03/hancock-chief-tech-advisor-nhs-digital-rewired/) (tech advisor to Matt Hancock) speak. She said that developers **hate** working with the NHS (+1 to that), and that NHSX aims to make it as easy for devs to interface with the NHS as it is to use OpenStreetMap’s APIs. Given the amount of innovation that has happened in mapping apps since OpenStreetMaps became a thing (or in public transport planning since TFL etc opened up their APIs) you would imagine that the same thing happening in health and social care would have a significant, even transformative, impact. Will it happen? Over to you Ms Beeman.

My first attempt to integrate domiciliary care software with the NHS data came (I think) 15 years ago. Mark Zuckerberg would have still been enrolled at Harvard. [Thefacebook](https://www.forbes.com/pictures/fi45eefdgd/2004-welcome-to-thefacebook-com-2/#154d9bb52e3c) has come a long way in that time, but I’m not sure that accessing health data in the UK has. In the time that Zuck has taken to build the world’s biggest social network (and become the 8th richest person in the world) those in charge of technology for Health and Social Care in the UK have spent an amount close to Zuck’s net worth and achieved very little for health and, as far as I can see, nothing for social care.

If you want to shoot me down in flames over this, or if you want to add your voice, use Twitter and hashtag [#TaleOf2Hacks](https://twitter.com/search?q=%23TaleOf2Hacks)
