const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const send = document.getElementById("send");

// PUT YOUR NEW GEMINI API KEY HERE FOR TESTING ONLY
const API_KEY = "AQ.Ab8RN6I-LML6y_UM6M-irdouCvhIdh16A_hJvihKUZhBImyIIg";

send.onclick = sendMessage;

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    add("YOU: " + message, "user");

    input.value = "";

    const thinking = add(
        "J.A.R.V.I.S: Processing...",
        "ai"
    );

    send.disabled = true;

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY
                },

                body: JSON.stringify({
                    system_instruction: {
                        parts: [
                            {
                                text:
                                "You are J.A.R.V.I.S, a helpful futuristic AI assistant. Speak clearly and concisely."
                            }
                        ]
                    },

                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Gemini API error"
            );
        }

        const answer =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
            throw new Error("No response received.");
        }

        thinking.innerText =
            "J.A.R.V.I.S: " + answer;

    } catch (error) {

        thinking.innerText =
            "J.A.R.V.I.S: ERROR - " + error.message;

    } finally {

        send.disabled = false;
        input.focus();
    }
}


function add(text, who) {

    const d = document.createElement("div");

    d.className = "msg " + who;

    d.innerText = text;

    chat.appendChild(d);

    chat.scrollTop = chat.scrollHeight;

    return d;
}
