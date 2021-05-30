from scipy import stats
import numpy as np

x = np.array([117,122,135,179,123,117,189,117,128,181])

k2, p = stats.normaltest(x)
alpha = 1e-3
print("p = {:g}".format(p))
p = 3.27207e-11
if p < alpha:  # null hypothesis: x comes from a normal distribution
    print("The null hypothesis can be rejected")
else:
    print("The null hypothesis cannot be rejected")

print("Mean: " + str(x.mean()))
print("Std: " + str(x.std()))




