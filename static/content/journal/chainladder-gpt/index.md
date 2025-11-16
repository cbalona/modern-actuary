---
title: "ChainladderGPT: Large Language Reserving"
description: "An experimental approach to actuarial reserving, testing GPT-3.5 and GPT-4's ability to complete claims development triangles by treating them as 'numeric sentences'."
date: "2023-07-03"
archived: true
---

Here is a fun thought I had the other day: ChatGPT is a conversational model. But, in addition to deep meaningful conversations (DMCs), it can also complete things. So... can it complete a triangle?

Let's find out :)

## The Data: A Claims Development Triangle

First, we need a triangle. `chainladder-python` can help with that:

```python
import chainladder as cl
import pandas as pd

data = cl.load_sample('raa')
data
```

<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>12</th>
      <th>24</th>
      <th>36</th>
      <th>48</th>
      <th>60</th>
      <th>72</th>
      <th>84</th>
      <th>96</th>
      <th>108</th>
      <th>120</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1981</th>
      <td>5,012</td>
      <td>8,269</td>
      <td>10,907</td>
      <td>11,805</td>
      <td>13,539</td>
      <td>16,181</td>
      <td>18,009</td>
      <td>18,608</td>
      <td>18,662</td>
      <td>18,834</td>
    </tr>
    <tr>
      <th>1982</th>
      <td>106</td>
      <td>4,285</td>
      <td>5,396</td>
      <td>10,666</td>
      <td>13,782</td>
      <td>15,599</td>
      <td>15,496</td>
      <td>16,169</td>
      <td>16,704</td>
      <td></td>
    </tr>
    <tr>
      <th>1983</th>
      <td>3,410</td>
      <td>8,992</td>
      <td>13,873</td>
      <td>16,141</td>
      <td>18,735</td>
      <td>22,214</td>
      <td>22,863</td>
      <td>23,466</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>1984</th>
      <td>5,655</td>
      <td>11,555</td>
      <td>15,766</td>
      <td>21,266</td>
      <td>23,425</td>
      <td>26,083</td>
      <td>27,067</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>1985</th>
      <td>1,092</td>
      <td>9,565</td>
      <td>15,836</td>
      <td>22,169</td>
      <td>25,955</td>
      <td>26,180</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>1986</th>
      <td>1,513</td>
      <td>6,445</td>
      <td>11,702</td>
      <td>12,935</td>
      <td>15,852</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>1987</th>
      <td>557</td>
      <td>4,020</td>
      <td>10,946</td>
      <td>12,314</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>1988</th>
      <td>1,351</td>
      <td>6,947</td>
      <td>13,112</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>1989</th>
      <td>3,133</td>
      <td>5,395</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>1990</th>
      <td>2,063</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

## The Language Model Approach

Now, we need to think about how we ask ChatGPT to reserve this triangle. The easy option is to leverage **CodeInterpreter** which is a ChatGPT plugin that allows ChatGPT to run code. But that's a bit boring. It will just use the `chainladder-python` package and apply chainladder. I want ChatGPT to really think about what its doing.

What if, we trick ChatGPT to think of a triangle as a numeric sentence? Then, ChatGPT can use all its great language knowledge to complete the sentence!

But, how do we make a triangle a sentence?

Well, each accident year is like a line in a story. And for some reason we have cut the triangle across the diagonal to lose half of it. Getting the idea?

Like this:

```python
# First sentence:
data.to_frame().iloc[0].to_csv()

# Second sentence:
data.to_frame().iloc[1].to_csv()

# ... and so forth
```

So let's give this a shot.. Let's make the latest diagonal of our triangle a series of placeholders and ask ChatGPT to fill them in. No other guidance!

```python
train_data = data.copy().to_frame()
for j, accident_date in enumerate(train_data.index):
    train_data.iloc[len(train_data.index) - j - 1, j] = "BLANK"
    
train_data
```

<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>12</th>
      <th>24</th>
      <th>36</th>
      <th>48</th>
      <th>60</th>
      <th>72</th>
      <th>84</th>
      <th>96</th>
      <th>108</th>
      <th>120</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1981-01-01</th>
      <td>5012.0</td>
      <td>8269.0</td>
      <td>10907.0</td>
      <td>11805.0</td>
      <td>13539.0</td>
      <td>16181.0</td>
      <td>18009.0</td>
      <td>18608.0</td>
      <td>18662.0</td>
      <td>BLANK</td>
    </tr>
    <tr>
      <th>1982-01-01</th>
      <td>106.0</td>
      <td>4285.0</td>
      <td>5396.0</td>
      <td>10666.0</td>
      <td>13782.0</td>
      <td>15599.0</td>
      <td>15496.0</td>
      <td>16169.0</td>
      <td>BLANK</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1983-01-01</th>
      <td>3410.0</td>
      <td>8992.0</td>
      <td>13873.0</td>
      <td>16141.0</td>
      <td>18735.0</td>
      <td>22214.0</td>
      <td>22863.0</td>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1984-01-01</th>
      <td>5655.0</td>
      <td>11555.0</td>
      <td>15766.0</td>
      <td>21266.0</td>
      <td>23425.0</td>
      <td>26083.0</td>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1985-01-01</th>
      <td>1092.0</td>
      <td>9565.0</td>
      <td>15836.0</td>
      <td>22169.0</td>
      <td>25955.0</td>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1986-01-01</th>
      <td>1513.0</td>
      <td>6445.0</td>
      <td>11702.0</td>
      <td>12935.0</td>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1987-01-01</th>
      <td>557.0</td>
      <td>4020.0</td>
      <td>10946.0</td>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1988-01-01</th>
      <td>1351.0</td>
      <td>6947.0</td>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1989-01-01</th>
      <td>3133.0</td>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1990-01-01</th>
      <td>BLANK</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>

## Testing GPT-3.5 (The Control Group)

Now we convert the triangle to a sentence:

```python
triangle_sentence = ""

for i in range(train_data.shape[0]):
    triangle_sentence += train_data.iloc[i].dropna().to_csv()
    
triangle_sentence
```
(Output removed for brevity, as it is a long CSV string.)

Finally, let's ask the latest (at the time of writing) GPT-3.5 model behind ChatGPT to fill in the blanks!

*(Note: API setup code and the large system prompt are omitted for readability.)*

The calculated Root Mean Square Error (RMSE) against the actual known completion values was:

```
3985.3233871293305
```

Not a very good showing, at all. In fact, there seems to be no real reasoning to what ChatGPT is doing.

Could it be the GPT-3.5 model? What blew us away late last year has been eclipsed by GPT-4. GPT-3.5 is basically useless now (just kidding).

## Testing GPT-4 (The Chainladder Contender)

Let's try GPT-4. I don't have API access to it so I had to do the prompt manually using the website. So imagine me typing it in laboriously before realising I can copy and paste.

...

Using GPT-4, the response is a lot more enjoyable! Here it is:

***To fill in your triangle, I'll need to use some form of actuarial reserving methods. In actuarial science, common techniques include the chain ladder method, the Bornhuetter-Ferguson method, or the Cape Cod method.***

***However, as you've mentioned, the Chain Ladder method is too interpretable, so I'll be using a method that respects trends in data but also tries to find a pattern for the incremental data to fill in the blanks. This method is not guaranteed to always provide the best results, as it depends heavily on the nature of the data and underlying claims development.***

***Here are the filled blanks for your data:***

***120, 18735.0
108, 16423.0
96, 23357.0
84, 26775.0
72, 26632.0
60, 13317.0
48, 11300.0
36, 7200.0
24, 5500.0
12, 2000.0***

***Please note that the exact values could be different if different methods or different assumptions are used. Each claim development triangle is unique and may require different approaches based on the nature and the distribution of the data. Therefore, I recommend consulting with an actuary or data scientist for an in-depth analysis and completion of your triangle.***

The calculated RMSE for the GPT-4 predictions against the actual diagonal values was:

```
2069.0908631570533
```

Much better! One of the downsides however is that if you input the exact same prompt, you likely will get a different answer. Not good for reserving, but great for bootstrapping :).

Using the API, we can set a low *temperature* to be more deterministic. *Temperature* is a parameter that controls the creativity of GPT-3.5 and GPT-4. But without API access for GPT-4, we just have to settle on chaos.

## Comparison with Basic Chainladder

How do our results compare to a basic chainladder (BCL) run using `chainladder-python`?

First, the BCL score (excluding the latest accident year, as BCL cannot predict it without assumption):

**Basic Chainladder RMSE (1981-1989):**
```
2476.6124040713353
```

And our GPT-4 score for the comparable set (1981-1989)... *drumroll*...

```python
np.mean((actual[:-1] - gpt4_preds[:-1]) ** 2) ** 0.5
```

**Adjusted GPT-4 RMSE (1981-1989):**
```
2180.9121689992216
```

Better than a basic chainladder! Not bad. Not bad at all.

Of course, this is an actuaries worst nightmare. Its the most opaque black box, the least parsimonous, least understood way to get an IBNR reserve. And worst of all, it didn't use Excel!

But an interesting test, nonetheless.