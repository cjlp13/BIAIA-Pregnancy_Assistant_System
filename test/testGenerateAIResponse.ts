import axios from "axios";

// Copied from your component
async function generateAIResponse(message: string, profile: Profile | null): Promise<string> {

  if (profile) {
    const currentDate = new Date();
    const dueDate = new Date(profile.due_date);
    const pregnancyWeek = 40 - Math.floor((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

    const prompt = `
You name is Bembang, assisting a user who is currently ${pregnancyWeek} weeks pregnant. 
Their due date is ${dueDate} Their name is ${profile.name}.  
Their reported symptoms include: ${profile.symptoms ? profile.symptoms.join(", ") : "None reported."} 
and their allergies include: ${profile.allergies ? profile.allergies.join(", ") : "None reported."}

When responding:
- Offer clear, medically accurate advice in a calm, friendly, and empathetic tone.
- If the user’s question involves any symptoms or medical concerns, gently encourage them to reach out to a healthcare provider for personalized care, especially if the symptoms seem worrisome or severe. Always approach with kindness and concern for their well-being.
- Keep your advice direct but comforting. 
- Use emojis to make it more readable
- Give concise like somewhere around 30 words but complete answers. If you need to make it long, then do it. The user may adhd tendency so they might have low attention span. But don't tell them
- Make important answer bold! 
- If they speak tagalog, use tagalog as language. Otherwise, use english.
- Use bullet points and bold to break down information where it makes it easier for the user to follow. (Use "•" as bullet)
- Do not repeat the user’s pregnancy details, symptoms, or allergies unless it's necessary for context, but always make sure the response is relevant to their current question.

User's question: "${message}"
`;

    try {
      const response = await axios.post("http://localhost:3000/api/gemini", { prompt });
      if (response.data && response.data.reply) {
        return response.data.reply;
      } else {
        return "Sorry, I'm having trouble getting a response from the AI.";
      }
    } catch (error) {
      console.error("Error contacting Gemini AI:", error);
      return "Sorry, I'm having trouble connecting to my AI assistant. Please try again later.";
    }
  }

  return `I'm here to help with your pregnancy journey. You can ask me about your symptoms, diet recommendations, safe exercises, or general pregnancy information.`;
}

// Simulate Profile type
type Profile = {
  name: string;
  due_date: string;
  symptoms: string[];
  allergies: string[];
};

// Run tests
// Run tests
(async () => {
  console.log("== Manual Unit Tests for generateAIResponse ==\n");

  // ✅ Test 1: Happy path (no allergies triggered)
  const test1 = await generateAIResponse("i am craving for some mints and ", {
    name: "Viviene",
    due_date: "2025-07-01",
    symptoms: ["nausea", "fatigue"],
    allergies: ["nuts"]
  });
  const test1Result = test1.includes("mint") && !test1.includes("nuts") ? "PASS" : "FAIL";
  console.log(`✅ Test 1: Happy path\nResult: ${test1Result} \nResponse: ${test1}\n`);

  // ⚠️ Test 2: Allergy warning (peanut brittle)
  const test2 = await generateAIResponse("i want to eat peanut brittle", {
    name: "Viviene",
    due_date: "2025-07-01",
    symptoms: [],
    allergies: ["nuts"]
  });
  const test2Lower = test2.toLowerCase();

  const mentionsAllergy =
    test2Lower.includes("allergies") ||
    test2Lower.includes("allergy") ||
    test2Lower.includes("allergic") ||
    test2Lower.includes("reaction");
    
  const givesWarning =
    test2Lower.includes("not recommended") ||
    test2Lower.includes("not advised") ||
    test2Lower.includes("avoid") ||
    test2Lower.includes("risky") ||
    test2Lower.includes("dangerous") ||
    test2Lower.includes("may cause") ||
    test2Lower.includes("could trigger") ||
    test2Lower.includes("sensitive") ||
    test2Lower.includes("🚫") ||
    test2Lower.includes("⚠️") ||
    test2Lower.includes("shouldn't") ||
    test2Lower.includes("better to skip") ||
    test2Lower.includes("may be harmful") ||
    test2Lower.includes("consult your doctor") ||
    test2Lower.includes("talk to your provider");

  const test2Result = (mentionsAllergy && givesWarning) ? "PASS" : "FAIL";

  console.log(`⚠️ Test 2: Allergy warning\nResult: ${test2Result} \nResponse: ${test2}\n`);

  // ❌ Test 3: No input + no profile
  const test3 = await generateAIResponse("", null);
  const expectedTest3 = "I'm here to help with your pregnancy journey. You can ask me about your symptoms, diet recommendations, safe exercises, or general pregnancy information.";
  const test3Result = test3 === expectedTest3 ? "PASS" : "FAIL";
  console.log(`❌ Test 3: No input + no profile\nResult: ${test3Result} \nResponse: ${test3}\n`);
})();
