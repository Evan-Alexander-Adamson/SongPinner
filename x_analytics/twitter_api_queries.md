```markdown
# Build a Query

## Building Queries for Search Posts
The search endpoints accept a single query with a GET request and return a set of historical Posts that match the query. Queries are made up of operators that are used to match on a variety of Post attributes.

### Table of Contents
- Building a query
- Query limitations
- Operator availability
- Operator types: standalone and conjunction-required
- Boolean operators and grouping
- Order of operations
- Punctuation, diacritics, and case sensitivity
- Specificity and efficiency
- Quote Tweet matching behavior
- Iteratively building a query
- Adding a query to your request
- Query examples
- List of operators

## Building a Query

### Query Limitations
Your queries will be limited depending on which access level you are using. 

- If you have Basic or Pro access, your query can be 512 characters long for the recent search endpoint.
- If you have Pro access, your query can be 1,024 characters long for the full archive search endpoint.

### Operator Availability
While most operators are available to any developer, there are several that are reserved for certain access levels. We list which access level each operator is available to in the list of operators table using the following labels:
- **Core operators:** Available when using any Project.
- **Advanced operators:** Available when using a Project with certain access levels.

### Operator Types: Standalone and Conjunction-Required
Standalone operators can be used alone or together with any other operators (including those that require conjunction).

For example, the following query will work because it uses the `#hashtag` operator, which is standalone:
```
#xapiv2
```

Conjunction-required operators cannot be used by themselves in a query; they can only be used when at least one standalone operator is included in the query. This is because using these operators alone would be far too general and would match on an extremely high volume of Posts.

For example, the following queries are not supported since they contain only conjunction-required operators:
```
has:media has:links OR is:retweet
```

If we add in a standalone operator, such as the phrase “X data”, the query would then work properly:
```
“X data” has:mentions (has:media OR has:links)
```

### Boolean Operators and Grouping
If you would like to string together multiple operators in a single query, you have the following tools at your disposal:

- **AND logic:** Successive operators with a space between them will result in boolean “AND” logic, meaning that Posts will match only if both conditions are met. For example, `snow day #NoSchool` will match Posts containing the terms snow and day and the hashtag `#NoSchool`.
- **OR logic:** Successive operators with `OR` between them will result in OR logic, meaning that Posts will match if either condition is met. For example, specifying `grumpy OR cat OR #meme` will match any Posts containing at least the terms grumpy or cat, or the hashtag `#meme`.
- **NOT logic, negation:** Prepend a dash (-) to a keyword (or any operator) to negate it (NOT). For example, `cat #meme -grumpy` will match Posts containing the hashtag `#meme` and the term cat, but only if they do not contain the term grumpy. One common query clause is `-is:retweet`, which will not match on Retweets, thus matching only on original Posts, Quote Tweets, and replies. All operators can be negated, but negated operators cannot be used alone.
- **Grouping:** You can use parentheses to group operators together. For example, `(grumpy cat) OR (#meme has:images)` will return either Posts containing the terms grumpy and cat, or Posts with images containing the hashtag `#meme`. Note that ANDs are applied first, then ORs are applied.

### A Note on Negations
- The operators `-is:nullcast` must always be negated.
- Negated operators cannot be used alone.
- Do not negate a set of operators grouped together in a set of parentheses. Instead, negate each individual operator. For example, instead of using `skiing -(snow OR day OR noschool)`, we suggest that you use `skiing -snow -day -noschool`.

### Order of Operations
When combining AND and OR functionality, the following order of operations will dictate how your query is evaluated:
1. Operators connected by AND logic are combined first.
2. Then, operators connected with OR logic are applied.

For example:
```
apple OR iphone ipad would be evaluated as apple OR (iphone ipad)
ipad iphone OR android would be evaluated as (iphone ipad) OR android
```

To eliminate uncertainty and ensure that your query is evaluated as intended, group terms together with parentheses where appropriate. 

For example:
```
(apple OR iphone) ipad
iphone (ipad OR android)
```

### Punctuation, Diacritics, and Case Sensitivity
If you specify a keyword or hashtag query with character accents or diacritics, it will match Post text that contains both the term with the accents and diacritics, as well as those terms with normal characters. For example, queries with a keyword `Diacrítica` or hashtag `#cumpleaños` will match `Diacrítica` or `#cumpleaños`, as well as with `Diacritica` or `#cumpleanos` without the tilde í or eñe.

Characters with accents or diacritics are treated the same as normal characters and are not treated as word boundaries. For example, a query with the keyword `cumpleaños` would only match activities containing the word `cumpleaños` and would not match activities containing `cumplea`, `cumplean`, or `os`.

All operators are evaluated in a case-insensitive manner. For example, the query `cat` will match Posts with all of the following: `cat`, `CAT`, `Cat`.

The filtered stream matching behavior acts differently from Search Posts. When building a filtered stream rule, know that keywords and hashtags that include accents and diacritics will only match on terms that also include the accent and diacritic, and will not match on terms that use normal characters instead.

For example, filtered stream rules that include a keyword `Diacrítica` or hashtag `#cumpleaños` will only match the terms `Diacrítica` and `#cumpleaños`, and will not match on `Diacritica` or `#cumpleanos` without the tilde í or eñe.

### Specificity and Efficiency
When you start to build your query, it is important to keep a few things in mind.

Using broad, standalone operators for your query such as a single keyword or `#hashtag` is generally not recommended since it will likely match on a massive volume of Posts. Creating a more robust query will result in a more specific set of matching Posts, and will hopefully reduce the amount of noise in the payload that you will need to sift through to find valuable insights. 

For example, if your query was just the keyword `happy`, you will likely get anywhere from 200,000 - 300,000 Posts per day. Adding more conditional operators narrows your search results, for example:
```
(happy OR happiness) place_country:GB -birthday -is:retweet
```

Writing efficient queries is also beneficial for staying within the characters query length restriction. The character count includes the entire query string including spaces and operators. For example, the following query is 59 characters long:
```
(happy OR happiness) place_country:GB -birthday -is:retweet
```

### Quote Tweet Matching Behavior
When using the Search Posts endpoints, operators will not match on the content from the original Post that was quoted, but will match on the content included in the Quote Tweet.

However, please note that filtered stream will match on both the content from the original Post that was quoted and the Quote Tweet’s content.

### Iteratively Building a Query
#### Test Your Query Early and Often
Getting a query to return the “right” results the first time is rare. There is so much on X that may or may not be obvious at first and the query syntax described above may be hard to match to your desired search. As you build a query, it is important for you to periodically test it out.

For this section, we are going to start with the following query and adjust it based on the results that we receive during our test: 
```
happy OR happiness
```

#### Use Results to Narrow the Query
As you test the query, you should scan the returned Posts to see if they include the data that you are expecting and hoping to receive. Starting with a broad query and a superset of Post matches allows you to review the result and narrow the query to filter out undesired results.  

When we tested the example query, we noticed that we were getting Posts in a variety of different languages. In this situation, we want to only receive Posts that are in English, so we’re going to add the `lang:` operator:
```
(happy OR happiness) lang:en
```

The test delivered a number of Posts wishing people a happy birthday, so we are going to add `-birthday` as a negated keyword operator. We also want to only receive original Posts, so we’ve added the negated `-is:retweet` operator:
```
(happy OR happiness) lang:en -birthday -is:retweet
```

#### Adjust for Inclusion Where Needed
If you notice that you are not receiving data that you expect and know that there are existing Posts that should return, you may need to broaden your query by removing operators that may be filtering out the desired data. 

For our example, we noticed that there were other Posts in our personal timeline that expressed the emotion that we are looking for and weren’t included in the test results. To ensure we have greater coverage, we are going to add the keywords, `excited` and `elated`:
```
(happy OR happiness OR excited OR elated) lang:en -birthday -is:retweet
```

#### Adjust for Popular Trends/Bursts Over the Time Period
Trends come and go on X quickly. Maintaining your query should be an active process. If you plan to use a query for a while, we suggest that you periodically check in on the data that you are receiving to see if you need to make any adjustments.

In our example, we notice that we started to receive some Posts that are wishing people a “happy holidays”. Since we don’t want these Posts included in our results, we are going to add a negated `-holidays` keyword:
```
(happy OR happiness OR excited OR elated) lang:en -birthday -is:retweet -holidays 
```

### Adding a Query to Your Request
To add your query to your request, you must use the `query` parameter. As with any query parameters, you must make sure to HTTP encode the query that you developed.

Here is an example of what this might look like using a cURL command, with an additional `tweet.fields` and `max_results` parameter included. If you would like to use this command, please make sure to replace `$BEARER_TOKEN` with your own Bearer Token:
```
curl https://api.x.com/2/tweets/search/recent?query=cat%20has%3Amedia%20-grumpy&tweet.fields=created_at&max_results=100 -H "Authorization: Bearer $BEARER_TOKEN"
```

### Query Examples

#### Tracking a Natural Disaster
The following query matched on original Posts coming from weather agencies and gauges that discuss Hurricane Harvey, which hit Houston in 2017.

Here is what the query would look like without the HTTP encoding:
```
has:geo (from:NWSNHC OR from:NHC_Atlantic OR from:NWSHouston OR from:NWSSanAntonio OR from:USGS_TexasRain OR from:USGS_TexasFlood OR from:JeffLindner1) -is:retweet
```

And here is what the query would look like with the HTTP encoding, the query parameter, and the recent search URI:
```
https://api.x.com/2/tweets/search/recent?query=-is%3Aretweet%20has%3Ageo%20(from%3ANWSNHC%20OR%20from%3ANHC_Atlantic%20OR%20from%3ANWSHouston%20OR%20from%3ANWSSanAntonio%20OR%20from%3AUSGS_TexasRain%20OR%20from%3AUSGS_TexasFlood%20OR%20from%3AJeffLindner1)
```

#### Reviewing the Sentiment of a Conversation
The next rule could be used to better understand the sentiment of the conversation developing around the hashtag, `#nowplaying`, but scoped to just Posts published within North America.

Here is what the two different queries, one for positive and one for negative, would look like without the HTTP encoding:
```
#nowplaying (happy OR exciting OR excited OR favorite OR fav OR amazing OR lovely OR incredible) (place_country:US OR place_country:MX OR place_country:CA) -horrible -worst -sucks -bad -disappointing

#nowplaying (horrible OR worst OR sucks OR bad OR disappointing) (place_country:US OR place_country:MX OR place_country:CA) -happy -exciting -excited -favorite -fav -amazing -lovely -incredible
```

And here is what the query would look like with the HTTP encoding, the query parameter, and the recent search URI:
```
https://api.x.com/2/tweets/search/recent?query=%23nowplaying%20(happy%20OR%20exciting%20OR%20excited%20OR%20favorite%20OR%20fav%20OR%20amazing%20OR%20lovely%20OR%20incredible)%20(place_country%3AUS%20OR%20place_country%3AMX%20OR%20place_country%3ACA)%20-horrible%20-worst%20-sucks%20-bad%20-disappointing

https://api.x.com/2/tweets/search/recent?query=%23nowplaying%20(horrible%20OR%20worst%20OR%20sucks%20OR%20bad%20OR%20disappointing)%20(place_country%3AUS%20OR%20place_country%3AMX%20OR%20place_country%3ACA)%20-happy%20-exciting%20-excited%20-favorite%20-fav%20-amazing%20-lovely%20-incredible
```

#### Find Posts That Relate to a Specific Post Annotation
This rule was built to search for original Posts that included an image of a pet that is not a cat, where the language identified in the Post is Japanese. To do this, we used the `context:` operator to take advantage of the Post annotation functionality. We first used the Post lookup endpoint and the `tweet.fields=context_annotations` fields parameter to identify which domain.entity IDs we need to use in our query:

- Posts that relate to cats return domain 66 (Interests and Hobbies category) with entity 852262932607926273 (Cats).
- Posts that relate to pets return domain 65 (Interests and Hobbies Vertical) with entity 852262932607926273 (Pets).

Here is what the query would look like without the HTTP encoding:
```
context:65.852262932607926273 -context:66.852262932607926273 -is:retweet has:images lang:ja
```

And here is what the query would look like with the HTTP encoding, the query parameter, and the recent search URI:
```
https://api.x.com/2/tweets/search/recent?query=context%3A65.852262932607926273%20-context%3A66.852262932607926273%20-is%3Aretweet%20has%3Aimages%20lang%3Aja
```

Try out the query builder tool for additional support.

### Operators

#### Operator Guide
| Operator | Type | Availability | Description |
|----------|------|--------------|-------------|
| keyword | Standalone | Essential | Matches a keyword within the body of a Post. This is a tokenized match, meaning that your keyword string will be matched against the tokenized text of the Post body. For example, a Post with the text “I like coca-cola” would be split into the following tokens: I, like, coca, cola. These tokens would then be compared to the keyword string used in your query. To match strings containing punctuation (for example coca-cola), symbol, or separator characters, you must wrap your keyword in double-quotes. Example: `pepsi OR cola OR "coca cola"` |
| emoji | Standalone | Essential | Matches an emoji within the body of a Post. Similar to a keyword, emojis are a tokenized match, meaning that your emoji will be matched against the tokenized text of the Post body. Note that if an emoji has a variant, you must wrap it in double quotes to add to a query. Example: `(😃 OR 😡) 😬` |
| ”exact phrase match” | Standalone | Essential | Matches the exact phrase within the body of a Post. Example: `("X API" OR #v2) -"recent search"` |
| # | Standalone | Essential | Matches any Post containing a recognized hashtag, if the hashtag is a recognized entity in a Post. This operator performs an exact match, NOT a tokenized match, meaning the rule `#thanku` will match posts with the exact hashtag `#thanku`, but not those with the hashtag `#thankunext`. Example: `#thankunext #fanart OR @arianagrande` |
| @ | Standalone | Essential | Matches any Post that mentions the given username, if the username is a recognized entity (including the @ character). Example: `(@XDevelopers OR @API) -@X` |
| $ | Standalone | Elevated | Matches any Post that contains the specified ‘cashtag’ (where the leading character of the token is the ‘$’ character). Example: `‘twtr OR @XDevelopers -$fb` |
| from: | Standalone | Essential | Matches any Post from a specific user. The value can be either the username (excluding the @ character) or the user’s numeric user ID. You can only pass a single username/ID per from: operator. Example: `from:XDevelopers OR from:API -from:X` |
| to: | Standalone | Essential | Matches any Post that is in reply to a particular user. The value can be either the username (excluding the @ character) or the user’s numeric user ID. You can only pass a single username/ID per to: operator. Example: `to:XDevelopers OR to:API -to:X` |
| url: | Standalone | Essential | Performs a tokenized match on any validly-formatted URL of a Post. This operator can match on the contents of both the url or expanded_url fields. Example: `from:XDevelopers url:"https://developer.x.com"` |
| retweets_of: | Standalone | Essential | Matches Posts that are Retweets of the specified user. You can only pass a single username/ID per retweets_of: operator. Example: `retweets_of:twitterdev OR retweets_of:twitterapi` |
| in_reply_to_tweet_id: | Standalone | Essential | Available alias: in_reply_to_status_id Matches on replies to the specified Post. Example: `in_reply_to_tweet_id:1539382664746020864` |
| retweets_of_tweet_id: | Standalone | Essential | Available alias: retweets_of_status_id Matches on explicit (or native) Retweets of the specified Post. Example: `retweets_of_tweet_id:1539382664746020864` |
| quotes_of_tweet_id: | Standalone | Essential | Available alias: quotes_of_status_id Matches on Quote Tweets of the specified Post. Example: `quotes_of_tweet_id:1539382664746020864` |
| context: | Standalone | Essential | Matches Posts with a specific domain id/entity id pair. To learn more, visit the annotations page. Example: `(context:47.1139229372198469633 OR context:11.1088514520308342784)` |
| entity: | Standalone | Essential | Matches Posts with a specific entity string value. Visit the annotations page for details. Example: `entity:"Michael Jordan" OR entity:"Barcelona"` |
| conversation_id: | Standalone | Essential | Matches Posts that share a common conversation ID. Example: `conversation_id:1334987486343299072` |
| list: | Standalone | Elevated | Matches Posts posted by users who are members of a specified list. Example: `list:123` |
| place: | Standalone | Elevated | Matches Posts tagged with the specified location or X place ID. Example: `place:"new york city" OR place:seattle` |
| place_country: | Standalone | Elevated | Matches Posts where the country code associated with a tagged place/location matches the given ISO alpha-2 character code. Example: `place_country:US` |
| point_radius: | Standalone | Elevated | Matches against the place.geo.coordinates object of the Post when present, and in X, against a place geo polygon. Example: `point_radius:[2.355128 48.861118 16km]` |
| bounding_box: | Standalone | Elevated | Available alias: geo_bounding_box Matches against the place.geo.coordinates object of the Post when present. Example: `bounding_box:[-105.301758 39.964069 -105.178505 40.09455]` |
| is:retweet | Conjunction required | Essential | Matches on Retweets that match the rest of the specified rule. Example: `data @XDeveloeprs -is:retweet` |
| is:reply | Conjunction required | Essential | Matches explicit replies that match a rule. Example: `from:XDeveloeprs is:reply` |
| is:quote | Conjunction required | Essential | Returns all Quote Tweets, also known as Posts with comments. Example: `"sentiment analysis" is:quote` |
| is:verified | Conjunction required | Essential | Deliver only Posts whose authors are verified by X. Example: `#nowplaying is:verified` |
| -is:nullcast | Conjunction required | Elevated | Removes Posts created for promotion only on ads.x.com. Example: `"mobile games" -is:nullcast` |
| has:hashtags | Conjunction required | Essential | Matches Posts that contain at least one hashtag. Example: `from:XDeveloeprs -has:hashtags` |
| has:cashtags | Conjunction required | Elevated | Matches Posts that contain a cashtag symbol (with a leading ‘$’ character). Example: `#stonks has:cashtags` |
| has:links | Conjunction required | Essential | Matches Posts that contain links and media in the Post body. Example: `from:XDeveloeprs announcement has:links` |
| has:mentions | Conjunction required | Essential | Matches Posts that mention another X user. Example: `#nowplaying has:mentions` |
| has:media | Conjunction required | Essential | Available alias: has:media_link Matches Posts that contain a media object. Example: `(kittens OR puppies) has:media` |
| has:images | Conjunction required | Essential | Matches Posts that contain a recognized URL to an image. Example: `#meme has:images` |
| has:video_link | Conjunction required | Essential | Available alias: has:videos Matches Posts that contain native X videos. Example: `#icebucketchallenge has:video_link` |
| has:geo | Conjunction required | Elevated | Matches Posts that contain location information in geo.place.geo.coordinates object. Example: `@API has:geo` |
| sample: | Standalone | Elevated | Matches a percentage sample from the universe of all published Posts that match your search rules. Example: `sample:10` |

The list below represents the currently supported languages and their corresponding BCP 47 language identifier:

- Amharic: am
- Arabic: ar
- Armenian: hy
- Basque: eu
- Bengali: bn
- Bosnian: bs
- Bulgarian: bg
- Catalan: ca
- Croatian: hr
- Czech: cs
- Danish: da
- Dutch: nl
- English: en
- Estonian: et
- Finnish: fi
- French: fr
- Georgian: ka
- German: de
- Greek: el
- Haitian Creole: ht
- Hebrew: iw
- Hindi: hi
- Hungarian: hu
- Icelandic: is
- Indonesian: in
- Italian: it
- Japanese: ja
- Kannada: kn
- Khmer: km
- Korean: ko
- Latvian: lv
- Lithuanian: lt
- Malay: ms
- Malayalam: ml
- Maltese: mt
- Marathi: mr
- Nepali: ne
- Norwegian: no
- Persian: fa
- Polish: pl
- Portuguese: pt
- Punjabi: pa
- Romanian: ro
- Russian: ru
- Serbian: sr
- Sinhala: si
- Slovak: sk
- Slovenian: sl
- Spanish: es
- Swedish: sv
- Tamil: ta
- Telugu: te
- Thai: th
- Turkish: tr
- Ukrainian: uk
- Urdu: ur
- Vietnamese: vi
- Welsh: cy
- Simplified Chinese: zh-CN
- Traditional Chinese: zh-TW
- Tibetan: bo
```

