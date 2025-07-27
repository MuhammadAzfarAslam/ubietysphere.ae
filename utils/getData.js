import { notFound } from "next/navigation";

const BASEURL = process.env.NEXT_PUBLIC_API_URL;
export default async function getData(url, additional = {}) {
  const res = await fetch(`${BASEURL}${url}`, {
    next: { revalidate: 10 },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...additional,
  });
  if (!res.ok || res.status !== 200) {
    console.error("Api status code respond: " + res.status);
    console.error("Api did not respond: " + url);
    if (res.status === 404) {
      return notFound();
    }
    throw new Error("Failed to fetch data");
  }
  console.log("Api Success -----------: " + `${BASEURL}${url}`);
  return res.json();
}

export async function postData(url, body = {}) {
  try {
    const res = await fetch(`${BASEURL}${url}`, {
      method: "POST", // Corrected to 'method' instead of 'type'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (res?.status === 201 || res?.status === 200 || res?.ok) {
      return res.json();
    }

    if (!res.ok || res.status !== 200 || res.status !== 201) {
      console.error(`API status code response: ${res.status}`);
      console.error(`API did not respond: ${url}`);

      if (res.status === 404) {
        return notFound(); // Assuming notFound() is defined elsewhere
      }

      throw new Error(
        `Failed to fetch data from ${url} with status code ${res.status}`
      );
    }

    console.log(`API Success -----------: ${BASEURL}${url}`);
    return res.json();
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error to propagate it
  }
}
