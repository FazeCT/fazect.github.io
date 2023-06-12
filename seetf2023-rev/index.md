# SEETF 2023 - Reverse Engineering Writeups


Short, descriptive write-ups for challenges I did from the competition.

<!--more-->

## Overview

Despite my limited time for CTFs this week, I solved 5 out of 8 reverse challenges.

The challenges (that I did) were quite fun, and without further ado, let's hop into the solutions!

## decompile-me

{{< admonition note "Challenge Information" >}}
* **Given file:** [Get it here!](https://drive.google.com/file/d/13vXpb_AoEuOIaFPe8LXUTaXrhrMXRmZj/view?usp=sharing)
* **Description:** GO DECOMPILE ME NOW!!!
* **Category:** Reverse Engineering
{{< /admonition >}}

We are given 2 files, `decompile-me.pyc` and `output.txt`. For `decompile-me.pyc`, I used [uncompyle6](https://pypi.org/project/uncompyle6/) to decompile pyc file to python source code.

We get the following Python source to work with.

```Python
from pwn import xor
with open('flag.txt', 'rb') as (f):
    flag = f.read()
a = flag[0:len(flag) // 3]
b = flag[len(flag) // 3:2 * len(flag) // 3]
c = flag[2 * len(flag) // 3:]
a = xor(a, int(str(len(flag))[0]) + int(str(len(flag))[1]))
b = xor(a, b)
c = xor(b, c)
a = xor(c, a)
b = xor(a, b)
c = xor(b, c)
c = xor(c, int(str(len(flag))[0]) * int(str(len(flag))[1]))
enc = a + b + c
with open('output.txt', 'wb') as (f):
    f.write(enc)
```

Quite tricky at first, but after a while, I got the flag using the script below.

```Python
from pwn import xor

with open('D:/ctf/revChalls/SEETF 2023/decompile-me/output.txt', 'rb') as f:
    i = f.read()
    a, b, c = i[0:9], i[9:18], i[18:27]

    tmp_a = xor(b, b'l_D3c0mp1', a, 9)
    tmp_b = xor(c, 14)  # b'l_D3c0mp1'
    tmp_c = xor(a, b'l_D3c0mp1')

    print((tmp_a + tmp_b + tmp_c).decode())
```

Flag is: **SEE{s1mP4l_D3c0mp1l3r_XDXD}**

## Data Structures and Algorithms

{{< admonition note "Challenge Information" >}}
* **Given file:** [Get it here!](https://drive.google.com/file/d/1JOW1q0v_MhH_HVtEAsTCbQCMaQPDA6rd/view?usp=sharing)
* **Description:** It's your second semester in SEE-IA, and they're making you learn about data structures & algorithms. You don't get what it has to do with anything you'll be doing - how does capturing a bunch of escaped hackers need boring linked lists and trees? Classes are so boring, and sometimes you wish you could just drop out if the fate of the world wasn't hanging in the balance. But oh well, this is your last assignment. Better do a good job of it!
{{< /admonition >}}

We are given an executable for this challenge. Load the executable into IDA, I immediately recognized that in `sub_140001970`, some [Postfix Expressions](https://math.oxford.emory.edu/site/cs171/postfixExpressions/) are initiated (I learned DSA at my university before). Below is the first one implemented in `sub_140001970`.

```C
sub_14000F050(v2340, "2");
sub_14000F050(v2341, "2");
sub_14000F050(v2342, "*");
sub_14000F050(v2343, "2");
sub_14000F050(v2344, "*");
sub_14000F050(v2345, "7");
sub_14000F050(v2346, "+");
sub_14000F050(v2347, "2");
sub_14000F050(v2348, "2");
sub_14000F050(v2349, "*");
sub_14000F050(v2350, "2");
sub_14000F050(v2351, "*");
sub_14000F050(v2352, "+");
sub_14000F050(v2353, "2");
sub_14000F050(v2354, "2");
sub_14000F050(v2355, "*");
sub_14000F050(v2356, "2");
sub_14000F050(v2357, "*");
sub_14000F050(v2358, "+");
sub_14000F050(v2359, "7");
sub_14000F050(v2360, "+");
sub_14000F050(v2361, "2");
sub_14000F050(v2362, "2");
sub_14000F050(v2363, "*");
sub_14000F050(v2364, "3");
sub_14000F050(v2365, "*");
sub_14000F050(v2366, "+");
sub_14000F050(v2367, "7");
sub_14000F050(v2368, "+");
sub_14000F050(v2369, "2");
sub_14000F050(v2370, "2");
sub_14000F050(v2371, "*");
sub_14000F050(v2372, "2");
sub_14000F050(v2373, "*");
sub_14000F050(v2374, "+");
sub_14000F050(v2375, "2");
sub_14000F050(v2376, "5");
sub_14000F050(v2377, "*");
sub_14000F050(v2378, "+");
sub_14000F050(v2379, "2");
sub_14000F050(v2380, "2");
sub_14000F050(v2381, "*");
sub_14000F050(v2382, "2");
sub_14000F050(v2383, "*");
sub_14000F050(v2384, "+");
```

We get `2 2 * 2 * 7 + 2 2 * 2 * + 2 2 * 2 * + 7 + 2 2 * 3 * + 7 + 2 2 * 2 * + 2 5 * + 2 2 * 2 * +` as our postfix expression.

Test it out on [this postfix calculator](https://devonsmith.github.io/cs460/hw2/demo/), we get `83`, which maps to character `S`.

At this point, I was quite confident to conclude that each postfix expression calculates the ASCII value of a character in our flag.

Dumped out each expression, then used the below script for each expression, I got the flag.

```Python
def evaluate_postfix(expression):
    stack = []

    tokens = expression.split()

    for token in tokens:
        if token.isdigit():
            stack.append(int(token))
        else:
            operand2 = stack.pop()
            operand1 = stack.pop()

            result = perform_operation(token, operand1, operand2)
            stack.append(result)

    return stack.pop()

def perform_operation(operator, operand1, operand2):
    if operator == '+':
        return operand1 + operand2
    elif operator == '-':
        return operand1 - operand2
    elif operator == '*':
        return operand1 * operand2
    elif operator == '/':
        return operand1 / operand2
```

Flag is: **SEE{5w1n61n6_7hr0u6h_7h3_7r335_51e72e7f398a4fb0e3b8cg8457167552}**

## Woodchecker

{{< admonition note "Challenge Information" >}}
* **Given file:** [Get it here!](https://drive.google.com/file/d/1ktuf_SXL2JIgPdfopOcvLx0SEyHIhq1N/view?usp=sharing)
* **Description:** Entering the realm of the Woodpecker's Nest, you discover that the Woodpecker is nothing more than a low-level drone that only knows four instructions. Decode the enigmatic instructions and unveil the secrets that soar beyond the skies.
{{< /admonition >}}

A VM reverse challenge with 2 files given, `cpu.py` and `woodchecker.wpk`. Analyze the given `cpu.py`, we can see that our VM supports 4 opcodes, `INC`, `INV`, `LOAD` and `CDEC`. To tackle a VM-based challenge, we should first write a script to interpret the function calls. Below are the interpreter and result with input `SEE{aaaaaaaaaaaaaaaa`.

```Python
f = open("D:/ctf/revChalls/SEETF 2023/Woodchecker/woodchecker.wpk").readlines()
flag = b"SEE{aaaaaaaaaaaaaaaa"

addr = 0
store = 0
mem = bytearray(1 << 29)
mem[:len(flag)] = flag
op = 0
cnt = 0
for i in f:
    if 'INC' in i:
        addr += 1
        print('addr +=1, addr =', addr)

    elif 'INV' in i:
        mem[addr // 8] ^= 1 << (addr % 8)
        print('mem[' + str(addr // 8) + '] ^= 1 << (' + str(addr % 8) + '), mem[addr // 8] =', mem[addr // 8])

    elif 'LOAD' in i:
        store = mem[addr // 8] >> (addr % 8) & 1
        print('store = mem[' + str(addr // 8) + '] >> (' + str(addr % 8) + ') & 1, store =', store)

    elif 'CDEC' in i:
        addr -= store
        print('addr -= store, addr =', addr)
```

```
addr +=1, addr = 1
addr +=1, addr = 2
addr +=1, addr = 3
addr +=1, addr = 4
addr +=1, addr = 5
[...]							
store = mem[20] >> (0) & 1, store = 1
addr -= store, addr = 159
store = mem[19] >> (7) & 1, store = 1
addr -= store, addr = 158
store = mem[19] >> (6) & 1, store = 1
addr -= store, addr = 157
store = mem[19] >> (5) & 1, store = 1
addr -= store, addr = 156
store = mem[19] >> (4) & 1, store = 0
addr -= store, addr = 156
store = mem[19] >> (4) & 1, store = 0
addr -= store, addr = 156
store = mem[19] >> (4) & 1, store = 0
addr -= store, addr = 156
store = mem[19] >> (4) & 1, store = 0
addr -= store, addr = 156
store = mem[19] >> (4) & 1, store = 0
addr -= store, addr = 156
[...]
```

By reading the result above, I came to some conclusions.

{{< admonition tip "How the VM works" >}}
* Our input is saved in `mem[0:20]`.
* The VM does some encryption (which I didn't really care much about).
* The part `mem[0:20]` is checked.
{{< /admonition >}}

Looking closer at the output, we can see that the part `mem[0:20]` is checked backward, from this I tried to input `SEE{aaaaaaaaaaaaaaa}` to see what happens next.

```
store = mem[20] >> (0) & 1, store = 1
addr -= store, addr = 159
store = mem[19] >> (7) & 1, store = 1
addr -= store, addr = 158
store = mem[19] >> (6) & 1, store = 1
addr -= store, addr = 157
store = mem[19] >> (5) & 1, store = 1
addr -= store, addr = 156
store = mem[19] >> (4) & 1, store = 1
addr -= store, addr = 155
store = mem[19] >> (3) & 1, store = 1
addr -= store, addr = 154
store = mem[19] >> (2) & 1, store = 1
addr -= store, addr = 153
store = mem[19] >> (1) & 1, store = 1
addr -= store, addr = 152
store = mem[19] >> (0) & 1, store = 1
addr -= store, addr = 151
store = mem[18] >> (7) & 1, store = 1
addr -= store, addr = 150
store = mem[18] >> (6) & 1, store = 1
addr -= store, addr = 149
store = mem[18] >> (5) & 1, store = 0
addr -= store, addr = 149
store = mem[18] >> (5) & 1, store = 0
addr -= store, addr = 149
store = mem[18] >> (5) & 1, store = 0
addr -= store, addr = 149
[...]
```

This unraveled the last part (i.e. the part that checks `mem[0:20]`). The program checks backward, bit-by-bit (also backward), and if that bit is correct, the VM sets `store = 1` to let the `addr` moves to the next position to check. Else, the addr would stuck and never changes its position again.

From this, I wrote a script to bruteforce each character of the flag, backward.

```Python
f = open("D:/ctf/revChalls/SEETF 2023/Woodchecker/woodchecker.wpk").readlines()

base2 = 482
out = b''
for _ in range(20):
    base = base2
    for ch in range(32, 128):
        flag = chr(ch).encode() + out
        while len(flag) < 20:
            flag = b'a' + flag
        addr = 0
        store = 0
        mem = bytearray(1 << 29)
        mem[:len(flag)] = flag
        op = 0
        cnt = 0
        for i in f:
            if 'INC' in i:
                addr += 1

            elif 'INV' in i:
                mem[addr // 8] ^= 1 << (addr % 8)

            elif 'LOAD' in i:
                store = mem[addr // 8] >> (addr % 8) & 1
                op += 1

            elif 'CDEC' in i:
                addr -= store

            if op == base:
                if store == 1:
                    cnt += 1
                    base += 1
                    if cnt == 8:
                        out = chr(ch).encode() + out
                        print(out.decode())
                        base2 = base
                        break
                else:
                    base = base2
```

I know it looks ugly, but it works.

Flag is: **SEE{pIcKyP1CIF0rmeS}**

## Sleight of Hand

{{< admonition note "Challenge Information" >}}
* **Given file:** [Get it here!](https://drive.google.com/file/d/1REyW-ct5LQbRCbEW1v_7RARC790cB65F/view?usp=sharing)
* **Description:** Yet another flag encryptor, but this time with an embedded magic trick. Encrypted Flag: fde5f5e12640b9860f526a9601861e752e84d866825c415549f454fe8ba3. The password for the ZIP file is infected. While the binary will not harm your system, I suggest analyzing everything in a Virtual Machine with antiviruses switched off.
{{< /admonition >}}

We are given an executable to work with. Load it in IDA, and from the bunch of functions, `sub_EC1260()` looks like the main function of the encryptor.

{{< admonition tip "Encryption" >}}
* sub_EC1070: A keystream is generated from the passphrase `hithisisakey`, using `RC4 KSA algorithm`.
* sub_EC1140: Encrypts the plaintext using above keystream.
{{< /admonition >}}

From `sub_EC1140()`, we can easily see that each character of the input is encrypted separately. Knowing that, I wrote a script to bruteforce the input (again?).


```Python
from pwn import *

enc = 'fde5f5e12640b9860f526a9601861e752e84d866825c415549f454fe8ba3'
flag = 'SEE{'

while flag[-1] != '}':
    for ch in range(32, 127):
        arg = flag + chr(ch)
        io = process(["/mnt/d/ctf/revChalls/SEETF 2023/Sleight of Hand/sleight-of-hand.exe", arg])
        ct = io.recv().decode().split(' ')[1]
        if ct in enc:
            flag += chr(ch)
            print(flag)
            break
```

Since pwntools doesn't let us open too many processes, we should bruteforce and append the result into the flag variable, and by doing so many times, we get our flag.

Flag is: **SEE{y0u_saw_thr0ugh_mY_tr1ck!}**

## NOW

{{< admonition note "Challenge Information" >}}
* **Given file:** [Get it here!](https://drive.google.com/file/d/1Y6vFNhYEfvbUvuAcIHPxg2P6-yN58rtk/view?usp=sharing)
* **Description:** Aaaa why does this binary take so long?! I want the flag NOW, N. O. W. NOW!!!!!
{{< /admonition >}}

We are given a 64-bit ELF file to work with. Decompile it using IDA, and we are greeted with `sub_12FE()`, `sub_1A48()` and some big hex strings.

`sub_12FE()` is simply just invert a hex string (e.g. `abcd` would evaluate into `5432`).

`sub_1A48()` is more complicated, and by analyzing that function, I quickly realized that it does [Modular Exponentiation](https://www.geeksforgeeks.org/modular-exponentiation-power-in-modular-arithmetic/), using an algorithm with `O(log2n)` complexity.

I then greadily wrote a script to try calculating the flag, as below.

```Python
from Crypto.Util.number import *

# v1 = 'e7787d3f8c184210c0f99dc6ea823ab6334e2d9ae8acaa00d94eed4ef44e68ad76343fea24e2ccfb4ae358a7101e85ae23a3df24149748677b4f7b062a55ad726539dd51844efda612c38edd194d6c6b5117b569bce7a9cbc4b4bc3f73eab892b1795ca60e485aebe900fcdef242c2344d407e9d06b05e77db8c27c37552bd902a4a520f79f3e1a5e9fd3f182f5e16e117bbdbfe3225a45ce956181cc16f166a58abcbe345543709d1703acc8a27d9eaadcf1d67544ce45ce83985d1c5e45cc3a89f46faa80876f906aa444b7a520a9f1d1eec068c559b35b92f062cbae2e5bcc279c3ff93460ea04649696067854b3dd699e92992a8b883e0f4d291bbe79417d5defe75baa3c9de6cef7279d4cb19d1f40eedf90928165f3d4be915e206cdeb732f1fda3c3fd88ca089719cb3ef38c6040602625e466765c47637185605bece27a0640f42d29e78aa233735402c795b8401b70e72fae7e9bb24696b41844e24f3b197a277cf603aa25127028023de12044efa4b020202e2acdb5612e990556599d4c0f9fc37404dcf5d4ab07dc4ba8b0d0e03420a08db3e0a85faa77d2538ba11f64269e7ae049cc83e45780c0ed9f7c101dcf8dac55b5edc04a00a806f496beee6f33680eab37da22061573f8c933226b1a8e3af754ceba20c42786e78a6a30c19e46f5a7e12ce989a67ab84c79a8f3c571e32af64d031bf3b2c65538b4a19'
v1 = '188782c073e7bdef3f066239157dc549ccb1d265175355ff26b112b10bb1975289cbc015db1d3304b51ca758efe17a51dc5c20dbeb68b79884b084f9d5aa528d9ac622ae7bb10259ed3c7122e6b29394aee84a96431856343b4b43c08c15476d4e86a359f1b7a51416ff03210dbd3dcbb2bf8162f94fa1882473d83c8aad426fd5b5adf0860c1e5a1602c0e7d0a1e91ee8442401cdda5ba316a9e7e33e90e995a754341cbaabc8f62e8fc53375d826155230e298abb31ba317c67a2e3a1ba33c5760b90557f78906f955bbb485adf560e2e113f973aa64ca46d0f9d3451d1a433d863c006cb9f15fb9b6969f987ab4c2296616d66d57477c1f0b2d6e44186be82a21018a455c362193108d862b34e62e0bf11206f6d7e9a0c2b416ea1df932148cd0e025c3c027735f768e634c10c739fbf9fd9da1b9989a3b89c8e7a9fa4131d85f9bf0bd2d618755dcc8cabfd386a47bfe48f18d05181644db9694be7bb1db0c4e685d88309fc55daed8fd7fdc21edfbb105b4fdfdfd1d5324a9ed166faa9a662b3f0603c8bfb230a2b54f823b4574f2f1fcbdf5f724c1f57a055882dac745ee09bd961851fb6337c1ba87f3f126083efe2307253aa4a123fb5ff57f90b69411190cc97f154c825ddf9ea8c0736ccdd94e571c508ab3145df3bd879187595cf3e61b90a581ed31676598547b386570c3a8e1cd509b2fce40c4d39aac74b5e6'
v2 = '72feecd39ab2b416966c16b6cfa3b55ce50ffa5d02dbca44d56377be2d8f00e8f8df5548651b1ea37ffe37b9937a0673b1d5756f057625f76c82a6e9daa180baaef543e3bac57c95326e65315831d76b766d354495a2e233d76bfe80b404c0d254ecdc4107704966d1cd959bb26802a7d505250710047497b5dfde45bd9164700d5d3dfa40900fbaa02ae1a047eaac262d1069211fe0b39d86516dde1fe3144120bcbecf6a0c8a50d068cff5b55a1187765bfefc288f5c511ff217c2f435f2ff4524b513d8625aa87239f287423febb8ada47b0f6aaeac71be7355b4e9b12c20de815a052108edc78325b3b3a993ee4612efd17a30626d375f0669adb2632222c5a922cef0a515d848877b2f440f38b3554decd8fda0327995df2a64a426088389495caf89a540a69d2c048d46a29d9d90a560deb1859898398d46a3fe8070d07a34e1da5f8108c2f0a1012e76f422c09a6847cf9b16653c77bca3e3939e14dc01a2757b32ff0ccf0ab62d28c8266c8e1f47e7e25a444e48ffd4f0288e158a9404947786a11e869b6fdc3204b9fc433ba28ac77775ff4b51b1df668154d32e30b01a0ff5968f9bb7b4f5bc772ffc4b1c5af1859dae67552e077f650842c60f4fe1929468f5a701b66bdd9d01c1ce22496c49091f225a26987e3e0f2d7a7f27ab20fd3448450794835477786f6b9a97bf4d4091c9b261d75d62120138b3104f76'
v3 = '780c9276bf474a488e56d5ec3a4827b8cffeca20cfb3dc5f53b25bc6b4d61152de663e13613222d8b1425a4e3329ac9b302586a0a097e74058466d070fba734ceedde9ef151611e937f249cb4f70e303efc2a96a0b586757a2bb517019aecc9a2cf2bbf6ffc0b496276a2366d2d0131d2829829a100a37e0da3a755aa6ab372430a3c0a666a7a502098a98315684a1c92c53cbafe3d4fbedfc671e1265fbd668c7f399a2371f0c2ad0b16c56ee0478290c34da9cbb8ba6bfc1409c57f5ef1cfaa7517cfe02674479f2f4ec5d1d090f1efa3b04a9d9df178a94c277d8b32a6bf030efe2a7e746c055684bc308c8e5776f0fdf88b52155c149b6810cade8c52f83998f111c773e91e887ce5b2ef1db10ecbc3a5e4aca6a75d426d7334799ebd7cd688fc75de08f7555e791b5e8634a7cdbb1e118ea2e61e287b332f00cf4cafff1b2fa7484aa2eebfb785df0e39dcac7bddb2a085d7bc845c52489202cb48b0e5efcd1ff538df61b6f93578858316fc51be6e5e0eb77fab23b5f94afca48a817f94145c3e66f62a8852e8cbc5de197cf03a7ebf20c6137d9404260b1600e913c946a987d9fd25d98dffc7d0f2b534cee3482789d06191fa10133fda862337cf4e000586f188bcab5d05b8e40726040e7c5aa762b789ed09ff5c0faf39e9e18821cd020f1ca7b16a993219a2172a1af5a78b798ae1522f2f6bfc6657db3b6620a69'

print(long_to_bytes(pow(int(v2, 16), int(v1, 16), int(v3, 16))))
```

What??? It didn't yield the flag as expected? At this point, I started to do some further analysis into the implementation of the other helper functions. Things start to get interesting inside `sub_171E()`, and after some time reviewing the implementation, I saw that it does multiplication between `arg_1` and `arg_2`, modulo the constant `780c9276...`.

I did some debugging to verify my thought processs, but once again it didn't do multiplication as expected. Inputting `a` and `a` would still yield `90` (`144` in decimal), but not if I input the constant `72feecd3...`. I started to look at the function again, and I realized that the multiplication is done with the reversed inputs (i. e. both of the two arguments, and the modulo are reversed before doing multiplication).

With that fact, I rewrote the above script to try calculating the flag.

```Python
from Crypto.Util.number import *

# v1 = 'e7787d3f8c184210c0f99dc6ea823ab6334e2d9ae8acaa00d94eed4ef44e68ad76343fea24e2ccfb4ae358a7101e85ae23a3df24149748677b4f7b062a55ad726539dd51844efda612c38edd194d6c6b5117b569bce7a9cbc4b4bc3f73eab892b1795ca60e485aebe900fcdef242c2344d407e9d06b05e77db8c27c37552bd902a4a520f79f3e1a5e9fd3f182f5e16e117bbdbfe3225a45ce956181cc16f166a58abcbe345543709d1703acc8a27d9eaadcf1d67544ce45ce83985d1c5e45cc3a89f46faa80876f906aa444b7a520a9f1d1eec068c559b35b92f062cbae2e5bcc279c3ff93460ea04649696067854b3dd699e92992a8b883e0f4d291bbe79417d5defe75baa3c9de6cef7279d4cb19d1f40eedf90928165f3d4be915e206cdeb732f1fda3c3fd88ca089719cb3ef38c6040602625e466765c47637185605bece27a0640f42d29e78aa233735402c795b8401b70e72fae7e9bb24696b41844e24f3b197a277cf603aa25127028023de12044efa4b020202e2acdb5612e990556599d4c0f9fc37404dcf5d4ab07dc4ba8b0d0e03420a08db3e0a85faa77d2538ba11f64269e7ae049cc83e45780c0ed9f7c101dcf8dac55b5edc04a00a806f496beee6f33680eab37da22061573f8c933226b1a8e3af754ceba20c42786e78a6a30c19e46f5a7e12ce989a67ab84c79a8f3c571e32af64d031bf3b2c65538b4a19'
v1 = '188782c073e7bdef3f066239157dc549ccb1d265175355ff26b112b10bb1975289cbc015db1d3304b51ca758efe17a51dc5c20dbeb68b79884b084f9d5aa528d9ac622ae7bb10259ed3c7122e6b29394aee84a96431856343b4b43c08c15476d4e86a359f1b7a51416ff03210dbd3dcbb2bf8162f94fa1882473d83c8aad426fd5b5adf0860c1e5a1602c0e7d0a1e91ee8442401cdda5ba316a9e7e33e90e995a754341cbaabc8f62e8fc53375d826155230e298abb31ba317c67a2e3a1ba33c5760b90557f78906f955bbb485adf560e2e113f973aa64ca46d0f9d3451d1a433d863c006cb9f15fb9b6969f987ab4c2296616d66d57477c1f0b2d6e44186be82a21018a455c362193108d862b34e62e0bf11206f6d7e9a0c2b416ea1df932148cd0e025c3c027735f768e634c10c739fbf9fd9da1b9989a3b89c8e7a9fa4131d85f9bf0bd2d618755dcc8cabfd386a47bfe48f18d05181644db9694be7bb1db0c4e685d88309fc55daed8fd7fdc21edfbb105b4fdfdfd1d5324a9ed166faa9a662b3f0603c8bfb230a2b54f823b4574f2f1fcbdf5f724c1f57a055882dac745ee09bd961851fb6337c1ba87f3f126083efe2307253aa4a123fb5ff57f90b69411190cc97f154c825ddf9ea8c0736ccdd94e571c508ab3145df3bd879187595cf3e61b90a581ed31676598547b386570c3a8e1cd509b2fce40c4d39aac74b5e6'
v2 = '72feecd39ab2b416966c16b6cfa3b55ce50ffa5d02dbca44d56377be2d8f00e8f8df5548651b1ea37ffe37b9937a0673b1d5756f057625f76c82a6e9daa180baaef543e3bac57c95326e65315831d76b766d354495a2e233d76bfe80b404c0d254ecdc4107704966d1cd959bb26802a7d505250710047497b5dfde45bd9164700d5d3dfa40900fbaa02ae1a047eaac262d1069211fe0b39d86516dde1fe3144120bcbecf6a0c8a50d068cff5b55a1187765bfefc288f5c511ff217c2f435f2ff4524b513d8625aa87239f287423febb8ada47b0f6aaeac71be7355b4e9b12c20de815a052108edc78325b3b3a993ee4612efd17a30626d375f0669adb2632222c5a922cef0a515d848877b2f440f38b3554decd8fda0327995df2a64a426088389495caf89a540a69d2c048d46a29d9d90a560deb1859898398d46a3fe8070d07a34e1da5f8108c2f0a1012e76f422c09a6847cf9b16653c77bca3e3939e14dc01a2757b32ff0ccf0ab62d28c8266c8e1f47e7e25a444e48ffd4f0288e158a9404947786a11e869b6fdc3204b9fc433ba28ac77775ff4b51b1df668154d32e30b01a0ff5968f9bb7b4f5bc772ffc4b1c5af1859dae67552e077f650842c60f4fe1929468f5a701b66bdd9d01c1ce22496c49091f225a26987e3e0f2d7a7f27ab20fd3448450794835477786f6b9a97bf4d4091c9b261d75d62120138b3104f76'
v3 = '780c9276bf474a488e56d5ec3a4827b8cffeca20cfb3dc5f53b25bc6b4d61152de663e13613222d8b1425a4e3329ac9b302586a0a097e74058466d070fba734ceedde9ef151611e937f249cb4f70e303efc2a96a0b586757a2bb517019aecc9a2cf2bbf6ffc0b496276a2366d2d0131d2829829a100a37e0da3a755aa6ab372430a3c0a666a7a502098a98315684a1c92c53cbafe3d4fbedfc671e1265fbd668c7f399a2371f0c2ad0b16c56ee0478290c34da9cbb8ba6bfc1409c57f5ef1cfaa7517cfe02674479f2f4ec5d1d090f1efa3b04a9d9df178a94c277d8b32a6bf030efe2a7e746c055684bc308c8e5776f0fdf88b52155c149b6810cade8c52f83998f111c773e91e887ce5b2ef1db10ecbc3a5e4aca6a75d426d7334799ebd7cd688fc75de08f7555e791b5e8634a7cdbb1e118ea2e61e287b332f00cf4cafff1b2fa7484aa2eebfb785df0e39dcac7bddb2a085d7bc845c52489202cb48b0e5efcd1ff538df61b6f93578858316fc51be6e5e0eb77fab23b5f94afca48a817f94145c3e66f62a8852e8cbc5de197cf03a7ebf20c6137d9404260b1600e913c946a987d9fd25d98dffc7d0f2b534cee3482789d06191fa10133fda862337cf4e000586f188bcab5d05b8e40726040e7c5aa762b789ed09ff5c0faf39e9e18821cd020f1ca7b16a993219a2172a1af5a78b798ae1522f2f6bfc6657db3b6620a69'

print(long_to_bytes(pow(int(v2[::-1], 16), int(v1[::-1], 16), int(v3[::-1], 16))))
```

This time, I got the flag!

Flag is: **SEE{bTw_NOW_1s_riv3st_sH4m1r_Adl3m4n_cAEs4r_sh1Fted_tw3ntY_tWO}**

{{< admonition tip "Appendix" >}}
In the above two scripts, I manually inverted the constant `e7787d3f...` before, thats why I commented it out and replace `v1` with `188782c0...`.
{{< /admonition >}}

