
$U[0,1]$ Sample Generation
===


1- calculate $Z_1, Z_2 \cdots$ given by the Linear Congruential Generator: $Z_i = (aZ_{i-1} + c) \mod{m}$, where $m$ (modulus), $a$, $c$ and $Z_0$ (seed) are non-neg integers


2 - take $U_i = Z_i/m$ as a proxy to an independent sequence of $U[0,1]$ random variates (note: $0 \leq U_i \leq 1$ for all $i$)


**Example:** $Z_i = (11Z_{i-1}) \mod{16}$

$Z_0 = 1$
$Z_1 = (11) \mod{16} = 11$
$Z_2 = (121) \mod{16} = 9$
$Z_3 = (99) \mod{16} = ?$
$Z_4 = (33) \mod{16} = ?$


- Huge literature on LCG periods, parameter choice, statistical tests for randomness ...
- Crystal Ball uses $Z_i = (630360016Z_{i-1}) \pmod{2^{31}-1}$



Exponential Distribution

- Variable $\operatorname{exp}(\lambda)$ has cdf. $F(t) = 1-\operatorname{exp}(-\lambda t)$; $F^{-1} = -log(1-y)/\lambda$