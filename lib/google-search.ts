const GOOGLE_API_KEY = `AIzaSyA8hf9yYat66W5c3g6bEo7qVM3yABTOiQ0`
const SEARCH_ENGINE_ID = `3167a05625dd044eb`
const baseURL = "https://www.googleapis.com/customsearch/v1"

import axios from "axios"

export const searchGoogle = async (query: string, numResults: number) => {
  try {
    const allResults = []
    // Hacer múltiples llamadas de 10 en 10
    for (let start = 1; start < numResults && start <= 100; start += 10) {
      const response = await axios.get(`${baseURL}`, {
        params: {
          key: GOOGLE_API_KEY,
          cx: SEARCH_ENGINE_ID,
          q: query,
          num: Math.min(10, numResults - start + 1),
          start: start,
        },
      })

      allResults.push(
        ...response.data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
        }))
      )
    }
    return allResults
  } catch (error) {
    console.error("Error during Google Search API call:", error)
    return []
  }
}
