# Control flow

## Chained if

```polygolf
if true {
    println "a";
} {
    if true {
        println "b";
    };
};
```

_Janet_

```janet nogolf
(cond true(print"a")true(print"b"))
```

_Javascript_

```js nogolf
if(true)print`a`else if(true)print`b`
```

_Nim_

```nim nogolf
if true:echo("a")elif true:echo("b")
```

_Python_

```py nogolf
if 1:print("a")
elif 1:print("b")
```

```polygolf
if true {
    println "a";
} {
    if true {
        println "b";
    } {
        println "c";
    };
};
```

_Janet_

```janet nogolf
(cond true(print"a")true(print"b")(print"c"))
```

_Javascript_

```js nogolf
if(true)print`a`else if(true)print`b`else print`c`
```

_Nim_

```nim nogolf
if true:echo("a")elif true:echo("b")else:echo("c")
```

_Python_

```py nogolf
if 1:print("a")
elif 1:print("b")
else:print("c")
```

## Loop over a list

```polygolf
$list <- (list "aaa" "bb" "c");
for $x $list {
    println $x;
};
```

_Janet_

```janet nogolf
(var l @["aaa""bb""c"])(each x l(print x))
```

_Javascript_

```js nogolf
l=["aaa","bb","c"]
for(x of l)print(x)
```

_Lua_

```lua no:hardcode
l={"aaa","bb","c"}
for x=1,#l do print(l[x])end
```

_Nim_

```nim nogolf
var l= @["aaa","bb","c"]
for x in l:echo(x)
```

_Python_

```py nogolf
l=["aaa","bb","c"]
for x in l:print(x)
```

_Swift_

```swift nogolf
var l=["aaa","bb","c"]
for x in l{print(x)}
```

## Loop over characters of a text

```polygolf
$text <- "asdfgh";
for[Ascii] $x $text {
    println $x;
};
```

_Janet_

```janet nogolf
(var t"asdfgh")(for x 0(length t)(var X(slice t x(+ 1 x)))(print X))
```

_Javascript_

```js nogolf
t="asdfgh"
for(x of t)print(x)
```

_Lua_

```lua nogolf
t="asdfgh"
for x=0,t:len()-1 do X=t:sub(1+x,1+x)
print(X)end
```

_Lua - golfed_

```lua no:hardcode
for x=1,6 do print(("asdfgh"):sub(x,x))end
```

_Nim_

```nim nogolf
var t="asdfgh"
for x in t:echo(x)
```

_Python_

```py nogolf
t="asdfgh"
for x in t:print(x)
```

_Swift_

```swift nogolf
var t="asdfgh"
for x in t{print(x)}
```

## Loop over a 1-step range

```polygolf
$n <- 20;
for $x (0..<$n 1) {
    println $x;
};
```

_Golfscript_

```gs nogolf
20:N;N,{:x;x"
"+}%
```

_Janet_

```janet nogolf
(var n 20)(for x 0 n(pp x))
```

_Javascript_

```js nogolf
n=20
for(x=0;x<n;++x)print(x)
```

_Lua_

```lua nogolf
n=20
for x=0,n-1 do print(x)end
```

_Nim_

```nim nogolf
var n=20
for x in 0..<n:echo(x)
```

_Nim - golfed_

```nim
for x in..19:echo x
```

_Python_

```py nogolf
n=20
for x in range(n):print(x)
```

_Swift_

```swift nogolf
var n=20
for x in 0..<n{print(x)}
```

## Loop over a range with step

```polygolf
$a <- -20;
$n <- 20;
$k <- 3;
for $x ($a..<$n $k) {
    println $x;
};
```

_Golfscript_

```gs nogolf
-20:A;20:N;3:k;N A-,k%{A+:x;x"
"+}%
```

_Janet_

```janet nogolf
(var a -20)(var n 20)(var k 3)(loop[x :range[a n k]](pp x))
```

_Javascript_

```js nogolf
a=-20
n=20
k=3
for(x=a;x<n;x+=k)print(x)
```

_Lua_

```lua nogolf
a=-20
n=20
k=3
for x=a,n-1,k do print(x)end
```

_Nim_

```nim nogolf
var
 a= -20
 n=20
 k=3
for x in countup(a,n,k):echo(x)
```

_Python_

```py nogolf
a=-20
n=20
k=3
for x in range(a,n,k):print(x)
```

_Swift_

```swift nogolf
var a = -20,n=20,k=3
for x in stride(from:a,to:n,by:k){print(x)}
```
