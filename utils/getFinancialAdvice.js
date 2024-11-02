import InvestmentTracking from "@/app/(routes)/dashboard/investments/page";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const geminikey=  process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminikey);

// Create a model for the Gemini AI API
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend);

  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} USD 
      - Expenses: ${totalSpend} USD
      - Total Income: ${totalIncome} USD
      
      
      Provide detailed financial advice in 3 sentences to help the user manage their finances more effectively.
    `;

    // Send the prompt to the Gemini AI model
    const result = await model.generateContent(userPrompt);

    // Process and return the response
    const advice = result.response.text(); // Extract the generated text

    console.log(advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;

