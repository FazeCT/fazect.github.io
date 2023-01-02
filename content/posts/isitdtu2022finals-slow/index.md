---
weight: 1
title: "ISITDTU CTF 2022 Finals - Slow"
date: 2023-01-02T15:09:01+07:00
lastmod: 2023-01-02T15:09:01+07:00
draft: false
author: "FazeCT"
authorLink: "https://fazect.github.io"
description: "An in-depth writeup on ISITDTU CTF 2022 Finals - Slow"

tags: ["RE", "isitdtu"]
categories: ["Writeups"]

lightgallery: true

toc:
  auto: true
---

An in-depth writeup on ISITDTU CTF 2022 Finals - Slow

<!--more-->

## Introduction

Description goes here!

{{< admonition note "Challenge Information" >}}
* Given binary: [Get it here!](https://drive.google.com/file/d/1K2NjzRQadtL9CkbTINYDvrH7HRgSfDc1/view?usp=share_link)
* Description: If you can make the binary runs faster, you'll get the flag!
* Category: Reverse Engineering
{{< /admonition >}}

## Static Analysis

The challenge provides us with a single binary, named **slow.exe**. By using **IDA Pro** or **Ghidra** or any other kinds of decompiler, we will get the decompiled code.
