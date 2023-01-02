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

An in-depth writeup on ISITDTU CTF 2022 Finals - Slow.

<!--more-->

## Introduction

{{< admonition note "Challenge Information" >}}
* **Given binary:** [Get it here!](https://drive.google.com/file/d/1K2NjzRQadtL9CkbTINYDvrH7HRgSfDc1/view?usp=share_link)
* **Description:** If you can make the binary runs faster, you'll get the flag!
* **Category:** Reverse Engineering
{{< /admonition >}}

## Static Analysis

The challenge provides us with a single binary, named **slow.exe**. By using **IDA Pro** or **Ghidra** or any other kinds of decompiler, we will get the decompiled code.

Analyze the **main** function, we claim that the program initiates an array whose size is **45**, then modifies it through some more functions, as shown below.

```IDA Decompiled Pseudocode
int __cdecl main(int argc, const char **argv, const char **envp)
{
  void *Block; // [esp+4h] [ebp-BCh]
  int v5[45]; // [esp+8h] [ebp-B8h] BYREF

  v5[0] = 10;
  v5[1] = -3;
  ... snip
  v5[43] = 14;
  v5[44] = 16;
  Block = (void *)sub_401AC0(v5, 38, 0);
  sub_4013B0(Block);
  sub_401B40(Block);
  return 0;
}
```
