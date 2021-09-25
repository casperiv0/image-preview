const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

const CACHE_CONTROL_HEADER = "public, max-age=604800";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  const imageURL = new URL(request.url).searchParams.get("url");

  if (!imageURL) {
    const error = { error: "`url` is a required field." };
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: { "content-type": "application/json", ...CORS_HEADERS },
    });
  }

  const res = await fetch(imageURL)
    .then((v) => v)
    .catch((e) => {
      console.log(e);

      return null;
    });

  if (!res) {
    const error = { error: "Could not fetch image." };

    return new Response(JSON.stringify(error), {
      status: 404,
      headers: {
        "content-type": "application/json",
        ...CORS_HEADERS,
      },
    });
  }

  if (imageURL.endsWith(".svg")) {
    const data = await res.text();

    return new Response(data, {
      headers: {
        "content-type": "image/svg+xml",
        "cache-control": CACHE_CONTROL_HEADER,
        ...CORS_HEADERS,
      },
    });
  }

  const data = await res.blob();

  return new Response(data, {
    headers: { "content-type": data.type, "cache-control": CACHE_CONTROL_HEADER, ...CORS_HEADERS },
  });
}
