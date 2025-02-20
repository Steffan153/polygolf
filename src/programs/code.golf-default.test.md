# Default code.golf code

Polygolf equivalent of the prefilled code on code.golf. Note that the default code.golf code tends to be written in a way that works for any argc, while in many langs knowing an upper bound allows for shorter code.

_Polygolf_

```polygolf
% Printing
println "Hello, World!";

% Looping
for $i 10 {
    println_int $i;
};

% Accessing arguments
for_argv $arg 1000 {
    println $arg;
};
```

_Golfscript_

```gs
:a;"Hello, World!
"10,{:i;i n}%a{:b;b n}%
```

_Javascript_

```javascript
p=print
p`Hello, World!`
for(i in''+1e9)p(i)
for(a of arguments)p(a)
```

_Lua_

```lua
p=print
p("Hello, World!")
for i=0,9 do p(i)end
for a=1,1e3 do p(arg[a])end
```

_Nim_

```nim
import os
echo"Hello, World!"
for i in..9:echo i
for a in..999:echo paramStr 1+a
```

_Python_

```python
import sys
p=print
p("Hello, World!")
for i in range(10):p(i)
for a in sys.argv[1:]:p(a)
```

_Swift_

```swift
print("Hello, World!")
for i in 0...9{print(i)}
for a in CommandLine.arguments[1...]{print(a)}
```
