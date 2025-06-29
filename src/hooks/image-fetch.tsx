import { maxRetryError } from "@/constants/constants";
import { triggerError } from "@/error/error-trigger";

export type OpenverseImage = {
  id: string;
  url: string;
  title: string;
  creator: string;
  thumbnail: string;
  license: string;
};

export type OpenverseResponse = {
  results: OpenverseImage[];
  result_count: number;
  page_count: number;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const baseUrl = import.meta.env.VITE_OPENVERSE_API;

export async function fetchOpenverseImages(
  query: string,
  page: number = 1,
  attributionRequired?: boolean,
  extension?: string,
  retries: number = 3,
  retryDelay: number = 3000 // initial delay in ms,
): Promise<OpenverseResponse> {
  if (query === "triggerError") {
    triggerError(
      new Error("Max retries exceeded while fetching Openverse images.")
    );
  }
  const licenseParam = attributionRequired ? "cc0,by,by-sa" : "cc0";

  const defaultExtensions = "png,jpg,jpeg,gif,svg,webp,tiff,bmp";

  const extensionParam =
    extension && extension !== "all" ? extension : defaultExtensions;

  const pageSize = 20;

  const url = `${baseUrl}?q=${encodeURIComponent(
    query.trim()
  )}&page=${page}&page_size=${pageSize}&license=${licenseParam}&extension=${extensionParam}&mature=false`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);

      if (res.ok) {
        return res.json();
      }

      if (res.status === 429 || res.status === 401) {
        if (attempt < retries) {
          await delay(retryDelay);
          retryDelay *= 5;
          continue;
        }
      }
    } catch (error: any) {
      if (attempt === retries) throw error;
      await delay(retryDelay);
      retryDelay *= 2;
    }
  }
  triggerError(new Error(maxRetryError));

  throw new Error(maxRetryError);
}
