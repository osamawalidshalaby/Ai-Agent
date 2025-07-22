// const API_KEY = "AIzaSyDl0wgOQEjPIfQpsOJFQkCKaZdnkbnb24g";
// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/*

useEffect(
    function () {
      async function Fetech() {
        setresult("");
        setisloading(true)
        const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        });
        const data = await res.json();
        setresult(data["candidates"][0]["content"]["parts"][0]["text"]);
        setisloading(false)
      }
      if (!prompt) return;
      Fetech();
    },
    [prompt]
*/
