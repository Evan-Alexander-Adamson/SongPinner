```markdown
# Introduction
In this article, I will show you how you can get started quickly with the new Twitter API v2. The new API provides exciting new features such as:

- Improvements to the response objects
- Support for getting Twitter polls data in the API
- Tweet annotations (that provide contextual information about a Tweet and named entities in a Tweet)
- Support for retrieving entire conversation thread using `conversation_id` parameter with the search Tweets and filtered stream endpoints

## Step 1: Sign up for access
In order to get started with the new Twitter API, you need a developer account. If you do not have one yet, you can sign up for one.

## Step 2: Create a Project and connect an App
Next, in the developer portal, create a new Project.

This image shows you the page where you will enter a name for your new project. Give it a name, select the appropriate use-case, provide a project description. Next, you can either create a new App or connect an existing App (an App is a container for your API Keys that you need in order to make an HTTP request to the Twitter API).

This image shows you the page that you are shown after you create a new App that displays your keys and tokens. Click ‘create a new App instead’ and give your App a name in order to create a new App.

This image shows the last stage of naming your app where you get your access keys, tokens, and set permissions.

Once you click complete, you will get your API Keys and the Bearer Token that you can then use to connect to the new endpoints in the Twitter API v2.

This image shows when you get your access keys, tokens.

Click the (+) next to API Key, API Secret Key and Bearer Token and copy it in a safe place on your local machine; you will need these to make the API calls in the next step.

**Please note:** The keys in the screenshot above are hidden, but in your own developer portal, you will be able to see the actual values for the API Key, API Secret Key, and Bearer Token.

## Step 3: Make an HTTP request to one of the new endpoints
Now that you have your API Keys and Bearer Token, you are ready to make your first API call to the new Twitter API v2. In this example, we will call the recent search endpoint in the new Twitter API v2. If you are familiar with the Twitter API v1.1, you may have used the `search/tweets` endpoint which let you search for Tweets from the last seven days. The recent search endpoint is the replacement in v2 of this `search/tweets` endpoint from v1.1.

We can call the recent search endpoint using one of the following approaches:

### Using cURL
The first approach is to make the request in your terminal using curl. The example below shows how you can get Tweets in the last seven days from the TwitterDev account using the recent search endpoint. Just replace the `$BEARER_TOKEN` in the request below with your own Bearer Token (obtained from step two above), and paste the snippet in your terminal. You will get the JSON response for this request.

```bash
curl --request GET 'https://api.x.com/2/tweets/search/recent?query=from:twitterdev' --header 'Authorization: Bearer $BEARER_TOKEN'
```

Once you are comfortable with making this API call, you can learn more advanced concepts such as modifying the query (in the request above) to get data using other keywords and operators, along with how to get additional information in your response (such as relevant user, place, polls, or Tweet objects) by exploring the documentation for the recent search endpoint and instructions on using fields and expansions to request specific data in your response.
```
