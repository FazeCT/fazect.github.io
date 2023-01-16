---
weight: 1
title: "IDEK CTF 2022 - Osint/Osint Crime Confusion 3: W as in Who"
date: 2023-01-15T22:05:54+07:00
lastmod: 2023-01-15T10:21:54+07:00
draft: false
author: "FazeCT"
authorLink: "https://fazect.github.io"
description: "An in-depth writeup on IDEK CTF 2022 - Osint/Osint Crime Confusion 3: W as in Who"

tags: ["osint", "idek","english"]
categories: ["Writeups"]

lightgallery: true

toc:
  enable: true
---

An in-depth writeup on IDEK CTF 2022 - Osint/Osint Crime Confusion 3: W as in Who.

<!--more-->

## Introduction

{{< admonition note "Challenge Information" >}}
* **Given image:** [Get it here!](https://drive.google.com/file/d/1sYKHJvmFAB0yjWCTEdp_ZL9g1Eh0G56x/view?usp=share_link)
* **Description:** I feel the killer might be dangerous so I have some info to give you but I don't want to disclose my email just like that. So find my review from the image below and send me an email asking for info. Be creative with the signature so I know its you. It is time to find Who is the killer.
* **Category:** OSINT
{{< /admonition >}}

## Finding the location
 
From the given image, I managed to have found the location on **Google Maps** at **41.154248, -8.682320**. 

<img src="map.png" alt="Location" width="1000"/>

Then in the comment section of the location, I got the mentioned secret email, labeled **noodlesareramhackers@gmail.com**.

<img src="comment.png" alt="Comment" width="1000"/>

## Getting further informations

I then sent an email to the email above, and got the next instructions.

{{< admonition note "From: Ramo HackerNoodles (noodlesareramhackers@gmail.com)" >}}
So... I got some stuff to tell you. I think the killer is probably watching us. The killer used a weird weapon as you have found out. Look, the info I have is that weirdly enough the university page of Heather tweeted something that might lead you to the killer. They deleted it though. Luckily these days you can just walk back in time! Ah, the tweet was 1612383535549059076. When you have the info look in github!
Good Luck! 
{{< /admonition >}}

## Finding the deleted tweet

In the first challenge of the **Osint Crime Confusion set (W is for Where)**, I found the instagram of a person named [Heather James](https://www.instagram.com/hjthepainteng/).

<img src="ins.png" alt="Instagram" width="1000"/>

Then from this person's informations, I found the twitter account of [University of Dutch ThE of Topics in Science](https://twitter.com/UThE_TS).

<img src="uni.png" alt="Twitter" width="1000"/>

I then immediately knew we have to bring the account to the [Wayback Machine](https://web.archive.org) to gain access to the deleted tweet. The email did mention about the tweet's id **(1612383535549059076)**, so we can paste the below **URL** into the **Wayback Machine**.

{{< admonition note "URL" >}}
https://twitter.com/UThE_TS/status/1612383535549059076
{{< /admonition >}}

We successfully gained access to the deleted tweet!

<img src="tweet.png" alt="Tweet" width="1000"/>

## Exploring the killer's GitHub

From the email, we also know that we should continue searching in **GitHub**. Frankly enough, when I tried to search for **"potatoes eating camels"** in GitHub, this showed up:

<img src="git.png" alt="Git" width="1000"/>

The descriptions imply that the person is **"still improving wiki"**. We then head into the **wiki** of this repository to find out the end of our journey.

<img src="wiki.png" alt="Wiki" width="1000"/>
<img src="flag.png" alt="Flag" width="1000"/>

Concatenate the first letters of the last **7 sentences** of the poem, we have our flag for the challenge: **idek{JULIANA_APOSIDM723489}**.

## Conclusion

A good OSINT challenge overall, consist of several general skills in the field of OSINT, such as **using Wayback Machine** or **finding locations on Google Maps**.

