import { useEffect, useState } from "react";
import { useLocalStorage } from "./LocalStroage";
const API_KEY =
  "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";

export function useFeteching(mode, userInput, setuserInput, save) {
  const [displayMode , setdisplayMode] = useState(false);
  const [prompt, setprompt] = useState("");
  const [isloading, setisloading] = useState(false);
  const [result, setresult] = useState("");
  const [error, seterror] = useState("");
  const detectLanguage = (text) =>
    /[\u0600-\u06FF]/.test(text) ? "Arabic" : "English";

  const userLanguage = detectLanguage(userInput);

  const [chat, setchat] = useLocalStorage("data", []);

  useEffect(() => {
    async function saveChat() {
      if (save) {
        const data = {
          id: Date.now(),
          input: `${
            mode === "social"
              ? "Social Media Post"
              : mode === "summary"
              ? "summary"
              : "Write Article"
          }`,
          start: ` ${result?.split("").slice(0, 45).join("")}...`,
          result: result ? result : "",
        };

        setchat((prev) => {
          const arr = Array.isArray(prev) ? prev : [];
          // Check for duplicate by input and result
          const exists = arr.some(
            (item) => item.input === data.input && item.result === data.result
          );
          if (exists) return arr;
          return [...arr, data];
        });
        setresult("");
      }
    }
    saveChat()
  }, [save, mode, userInput, result, setchat]);

  function Handleprompt() {
    if (mode === "summary") {
      setprompt(
        `Answer in ${userLanguage}: 
Summarize the following content in a clear, concise, and engaging way. 
- Organize the summary into multiple short, easy-to-read lines or bullet points.
- Highlight the main ideas and key takeaways.
- Use a friendly, human-like tone.
- If possible, include a brief conclusion or actionable insight.
- Add relevant emojis to make the summary more engaging.

Content to summarize: ${userInput}
`
      );
    } else if (mode === "social") {
      setprompt(
        `Answer in ${userLanguage} Create a high-quality social media post about ${userInput}.
    The post Must be like:
    🤖 "AI: The Future of Technology or Cause for Concern?" 🤖
Pros:
✅ Efficiency and accuracy in tasks
✅ Personalized user experiences
✅ Innovation in various industries
Cons:
❌ Potential job displacement
❌ Privacy concerns
❌ Bias in algorithms
Join the conversation and share your thoughts on the impact of AI on society. Are you excited for the possibilities it brings or worried about the risks? Let's discuss! #AI #ArtificialIntelligence #FutureTech #EthicalAI #TechDebate 🚀🤖`
      );
    } else if (mode === "article") {
      setprompt(
        `Answer in ${userLanguage} : Write a high-quality, SEO-optimized article about ${userInput} for a general audience. The article should:
    ✅ Be at least 1500 words long.
    ✅ Start with an engaging introduction that hooks the reader.
    ✅ Include clear and descriptive headings (H1, H2, H3) to structure the content.
    ✅ Use short paragraphs, bullet points, and examples to make it easy to read.
    ✅ Provide actionable insights, tips, or step-by-step guidance where appropriate.
    ✅ End with a strong conclusion and a call-to-action that encourages readers to take the next step.
    ✅ Write in a natural, conversational tone that keeps readers engaged from start to finish.
    and add some emoji
    `
      );
    }
    setuserInput("");
  }

  useEffect(
    function () {
      async function Fetech() {
        try {
          setdisplayMode(true);
          setresult("");
          setisloading(true);
          const res = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // 🟣 غير الموديل لو حابب
                messages: [
                  {
                    role: "user",
                    content: prompt,
                  },
                ],
              }),
            }
          );

          if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          }

          const data = await res.json();
          setresult(data.choices[0].message.content);
          console.log(data); // 🖤 Debug in console
        } catch (err) {
          console.error(err);
          seterror(err.message);
        } finally {
          setisloading(false);
        }
      }
      if (!prompt) return;
      Fetech();
    },
    [prompt]
  );
  return { result, isloading, error, Handleprompt, chat, setresult , displayMode , setdisplayMode };
}
