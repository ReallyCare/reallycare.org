---
title: Really Embracing Web Standards
date: 2022-07-04 11:30:14
description: Release announcement
tags:
- News
- Release
categories:
- Announcement
---
## New preview release

### We have fixed our links (and we know some of you won't like it)
We have just completed deploying a new preview release which has a number of user interface changes.

Because we have always been developing new features as rapidly as possible, we have occasionally taken a short cut or two, and one of the ones that irritated us most was using programatic links rather than web standard links.  This has meant that in a few places users have not been able to right click / Cmd+click on a link and open the page in a new tab.![Right click on link menu in Chrome](/img/browser-right-click.png)

Probably the worst offender was the drill down to a booking from a calendar, which meant that calendars had to be refreshed more often that you would want.  Believe me, we felt your pain!

I am happy to announce that we have now removed a large number of these links, so almost all links should now support the right click / Cmd+click functionality.  In fact we may have got rid of all of them, but we aren't sure!  Please let us know if you find one and we will get rid of it for you.

One of the problems of programatic links is that we had to decide for you whether to open the link in the current tab or a new tab.  This is [most anti-social](https://css-tricks.com/use-target_blank), but we had no choice.  

The unfortunate consequence is that now we have fixed the problem, some users are going to want the old behaviour, because it is familiar, even though it deprives them of options.  We don't entirely sympathise, but to head them off at the pass we have put in a new option at the organisation level and at the user level, to make *all* links open in a new tab.  We hope that no-one is going to use it!

### Other new features

#### Location added to employee resource pop-up

In these days of nearly £2 / litre for petrol, minimising carer travel is more important than ever.  We have therefore exposed the client location on the pop-up on the Plan calendar.  Please let us know if you have any other ideas about how we can make it easier for you to save travel time and distance.
![Location link shown on event pop-up](/img/location-on-popup.png)
The link takes you to a map (remember to right click / Cmd+click on it to choose where it opens)

#### Overdose warning
It has long been possible as part of the organisation medication setup to show the care worker when a medication was last administered.
![How PRN meds appear in Plait Mobile](/img/med-last-taken.png)
The new feature in the image is that, if the medication (or one with the same active ingredient) was last administered within a time period set up in medication session, the green button has a flask instead of a tick.  And if the care worker tries to administer it before appropriate time, they get a scarey alert.
![Scary overdose alert](/img/potential-overdose.png)
You can start with the set up for this now, and the mobile release that it depends on has just gone into beta test and should be generally available in a week or so.

#### Fixes
As usual there are a number of small fixes, but worthy of note this time is that we have (finally?) got the recurring reports working properly with date parameters, so if you want an email every morning telling you what the bookings for the day are (in case your ISP or Amazon Web Services temporarily disappear) you can do so.