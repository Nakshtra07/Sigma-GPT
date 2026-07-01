import 'dotenv/config';

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        })
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content;
        }
        throw new Error("Invalid response format from OpenAI API");
    } catch (err) {
        console.error("Error in getOpenAIAPIResponse:", err);
        throw err;
    }
};

export default getOpenAIAPIResponse;