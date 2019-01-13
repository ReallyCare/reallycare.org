---
title: Better Care Guide is now Open Source
date: 2012-06-22 19:21:20
tags:
- open source
categories:
- Announcement
---
<p class="f6 lh-copy">Note to Non Techies in Social Care: </p>
<p class="f6 lh-copy">Please read this post - if you think that you cannot make a contribution to an open source project you are wrong!</p>

We have taken the decision that the time has come to open-source [BetterCareGuide.org](https://www.BetterCareGuide.org), which we have delayed for ages because, frankly, the code isn’t anything like as good as we would like (since it was the first app I wrote after a break of several years from programming, using a stack that was all new to me).  But I have heard from many people that the code quality of a new open source product isn’t the important thing - a road map, a vision and a simple working product are.  So I am taking the covers off the codebase in the hope that people will contribute and improve the code quality of BetterCareGuide while I concentrate on the easy stuff.

Vision
To provide a simple web site where the public can go to get information about UK care providers (though it should be equally applicable elsewhere) and the quality of care they deliver.  The information and its presentation should be independent of any financial involvement with the providers.  Small independent providers should not be discriminated against.  The licencing prohibits the software from being operated by a for-profit organisation.

Road Map (**bold** items need significant input from non techies)
- Move to a public continuous integration server
- Increase test coverage / quality of tests
- **Add an introduction to getting care section (at least one for each UK country)**
- **Sensible splits of services by service type (elderly / PD / LD etc)**
- **Additional indicators - as per white paper (when / if it happens)**
- Scraping improvements, esp required improvements (big red cross on CQC)
- APIs for reading ratings
- Monitor and flag changes of responsible person and care managers
- Handle anonymised requests for further information from multiple services
- Improve the visual design
- Improve UX - add double clicks and short cut keys where appropriate
- Add auto SMS send capability
- Have /town/  and /authority/ URLs and searches
- Security audit
- Sensible handling of services registered with multiple regulators

The pipe dream road map extends considerably further than this, but I will stop there for a while and see if anyone contributes with this bit.

So I have three requests:
Don’t laugh at the code.  If you feel like laughing it is because you could do better - do that instead, and submit a pull request.
If you like social care and open source (well, Ruby on Rails, really) have a look at youangel.org - I would like some help open-sourcing that.
Please, please don’t laugh at the code.