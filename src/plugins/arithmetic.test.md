# Arithmetic

## Bitnot

```polygolf
$x:-oo..oo <- 0;
~ $x;
```

```polygolf arithmetic.removeBitnot
$x:-oo..oo <- 0;
-1 + (-1 * $x);
```

```polygolf
$x:-oo..oo <- 0;
$x + 1;
```

```polygolf arithmetic.addBitnot
$x:-oo..oo <- 0;
-1 * (~ $x);
```

```polygolf
$x:-oo..oo <- 0;
$x - 1;
```

```polygolf arithmetic.addBitnot
$x:-oo..oo <- 0;
~ (-1 * $x);
```

## Division ops

```polygolf
$a:-oo..oo <- 0;
$b:0..oo <- 0;
mod $a $b;
mod $b $a;
```

```polygolf arithmetic.modToRem
$a:-oo..oo <- 0;
$b:0..oo <- 0;
rem $a $b;
rem ((rem $b $a) + $a) $a;
```

```polygolf
$a:-oo..oo <- 0;
$b:0..oo <- 0;
div $a $b;
div $b $a;
```

```polygolf arithmetic.divToTruncdiv
$a:-oo..oo <- 0;
$b:0..oo <- 0;
trunc_div $a $b;
$b div $a;
```

## Equality to inequality

```polygolf
$a:-oo..oo <- 0;
($a mod 4) == 0;
($a mod 4) != 0;
($a mod 4) == 3;
($a mod 4) != 3;
```

```polygolf arithmetic.equalityToInequality
$a:-oo..oo <- 0;
($a mod 4) < 1;
($a mod 4) > 0;
($a mod 4) > 2;
($a mod 4) < 3;
```

## De Morgan's laws

```polygolf
$a:Int <- 0;
$b:Int <- 0;
not (or ($a == 5) ($b != 6));
$a:Int <- 0;
$b:Int <- 0;
```

<!-- `arithmetic.applyDeMorgans` cannot be used with `applyAll` (infinite loop) hence we test it on Python. -->

```python
a=b=0
a!=5 and b==6
a=b=0
```

```polygolf
$a:Int <- 0;
$b:Int <- 0;
~ ($a | $b);
$a:Int <- 0;
$b:Int <- 0;
```

```python
a=b=0
~a&~b
a=b=0
```

## Power

```polygolf
$a:-oo..oo <- 0;
(1 + $a) ^ 2;
```

```polygolf arithmetic.powToMul(2)
$a:-oo..oo <- 0;
(1 + $a) * (1 + $a);
```

```polygolf
$a:-oo..oo <- 0;
* 2 (1 + $a) $a (1 + $a);
```

```polygolf arithmetic.mulToPow
$a:-oo..oo <- 0;
* 2 ((1 + $a) ^ 2) $a;
```

## Mod & bitand

```polygolf
$a:0..oo <- 0;
$b:0..oo <- 0;
$a mod 7;
$a mod 8;
$a mod (2 ^ $b);
```

```polygolf arithmetic.modToBitand
$a:0..oo <- 0;
$b:0..oo <- 0;
$a mod 7;
$a & 7;
$a & ((2 ^ $b) - 1);
```

## Mod & bitand

```polygolf
$a:0..oo <- 0;
$b:0..oo <- 0;
$a & 8;
$a & 7;
$a & ((2 ^ $b) - 1);
```

```polygolf arithmetic.bitandToMod
$a:0..oo <- 0;
$b:0..oo <- 0;
$a & 8;
$a mod 8;
$a mod (2 ^ $b);
```

## Bitshifts

```polygolf
$a:-oo..oo <- 0;
* -3 $a 64;
```

```polygolf arithmetic.mulOrDivToBitShift()
$a:-oo..oo <- 0;
(-3 * $a) << 6;
```

```polygolf
$a:-oo..oo <- 0;
$b:0..oo <- 0;
* -3 $a (2 ^ $b);
```

```polygolf arithmetic.mulOrDivToBitShift()
$a:-oo..oo <- 0;
$b:0..oo <- 0;
(-3 * $a) << $b;
```

```polygolf
$a:-oo..oo <- 0;
$a div 64;
```

```polygolf arithmetic.mulOrDivToBitShift()
$a:-oo..oo <- 0;
$a >> 6;

```

```polygolf
$a:-oo..oo <- 0;
$b:0..oo <- 0;
$a div (2 ^ $b);
```

```polygolf arithmetic.mulOrDivToBitShift()
$a:-oo..oo <- 0;
$b:0..oo <- 0;
$a >> $b;
```

```polygolf
$a:-oo..oo <- 0;
$a << 6;
```

```polygolf arithmetic.bitShiftToMulOrDiv()
$a:-oo..oo <- 0;
64 * $a;
```

```polygolf
$a:-oo..oo <- 0;
$a >> 6;
```

```polygolf arithmetic.bitShiftToMulOrDiv()
$a:-oo..oo <- 0;
$a div 64;
```

## Comparison <-> division

```polygolf
$x: 0..199 <- 0;
$y: 100..oo <- 100;
bool_to_int ($x < $y);
```

```polygolf arithmetic.comparisonToDivision
$x: 0..199 <- 0;
$y: 100..oo <- 100;
$x div $y;
```

```polygolf
$x: 0..199 <- 0;
$y: 100..oo <- 100;
$x div $y;
```

```polygolf arithmetic.divisionToComparison
$x: 0..199 <- 0;
$y: 100..oo <- 100;
bool_to_int ($x < $y);
```
