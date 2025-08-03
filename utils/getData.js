import { notFound } from "next/navigation";
import { signOut } from "next-auth/react";

const BASEURL = process.env.NEXT_PUBLIC_API_URL;
export default async function getData(url, additional = {}) {
  try {
    const res = await fetch(`${BASEURL}${url}`, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...additional,
    });

    if (res?.status === 401) {
      console.log("====================== inside logout");

      signOut({ callbackUrl: "/login" });
    } else if (res?.status === 201 || res?.status === 200 || res?.ok) {
      return res.json();
    } else if (!res.ok || res.status !== 200 || res.status !== 201) {
      console.error(`API status code response: ${res.status}`);
      console.error(`API did not respond: ${url}`);

      if (res.status === 404) {
        return notFound(); // Assuming notFound() is defined elsewhere
      }

      throw new Error(
        `Failed to fetch data from ${url} with status code ${res.status}`
      );

      console.log("Api Success -----------: " + `${BASEURL}${url}`);
      return res.json();
    }
  } catch (error) {
    console.error("Error:", error);
    if (error.message.includes("401")) {
      signOut({ callbackUrl: "/login" });
    }
    throw error; // Re-throw the error to propagate it
  }
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

export async function putData(url, body = {}, additionalHeaders = {}) {
  try {
    const res = await fetch(`${BASEURL}${url}`, {
      method: "PUT", // Corrected to 'method' instead of 'type'
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...additionalHeaders,
      },
      body: JSON.stringify(body),
    });

    if (res?.status === 401) {
      signOut({ callbackUrl: "/login" });
    } else if (res?.status === 201 || res?.status === 200 || res?.ok) {
      return res.json();
    } else if (!res.ok || res.status !== 200 || res.status !== 201) {
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
