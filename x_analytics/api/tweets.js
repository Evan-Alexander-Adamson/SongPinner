export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }), 
        { status: 400, headers }
      );
    }

    const twitterResponse = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&tweet.fields=created_at`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
      }
    );

    if (!twitterResponse.ok) {
      const errorText = await twitterResponse.text();
      console.error('Twitter API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `Twitter API error: ${twitterResponse.status}`,
          details: errorText
        }), 
        { status: twitterResponse.status, headers }
      );
    }

    const data = await twitterResponse.json();
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), 
      { status: 500, headers }
    );
  }
} 