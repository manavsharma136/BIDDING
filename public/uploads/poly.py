# -*- coding: utf-8 -*-
"""
Created on Wed Sep 11 13:57:15 2019

@author: dell
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
dataset=pd.read_csv('Position_Salaries.csv')
x=dataset.iloc[:,1:2].values
y=dataset.iloc[:,-1].values
"""
from sklearn.preprocessing import LabelEncoder,OneHotEncoder
label=LabelEncoder();
x[:,0]=label.fit_transform(x[:,0]);
d=OneHotEncoder(categorical_features=[0])
x=d.fit_transform(x).toarray()
x=x[:,1:]"""


from sklearn.linear_model import LinearRegression 
linear = LinearRegression() 
linear.fit(x, y) 
from sklearn.preprocessing import PolynomialFeatures
poly=PolynomialFeatures(degree=4)
x_poly=poly.fit_transform(x)
poly.fit(x_poly,y)
lin2=LinearRegression()
lin2.fit(x_poly,y)
plt.scatter(x, y, color = 'blue') 
  
plt.plot(x, linear.predict(x), color = 'red') 
plt.show();
plt.scatter(x,y,color="blue")
plt.plot(x,lin2.predict(poly.fit_transform(x)),color="red")
plt.show()

  
plt.show() 

