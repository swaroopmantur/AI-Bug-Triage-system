require("dotenv").config();

const { analyzeBug } = require("./geminiService");

async function main() {
  try {
    const result = await analyzeBug(
      "Login button not working",
      "When I click the login button, nothing happens."
    );

    console.log("Gemini analysis result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Gemini test failed:", error.message);
  }
}

main();