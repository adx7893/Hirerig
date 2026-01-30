
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly for initialization as per strict guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to optimize a user's professional bio.
 */
export const optimizeBio = async (currentBio: string, headline: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am a professional in ${headline}. My current bio is: "${currentBio}". Please rewrite this bio to be more engaging, professional, and impactful for a social hiring platform like LinkedIn. Keep it under 100 words.`,
      config: {
        temperature: 0.7,
      },
    });
    // Use .text property directly
    return response.text;
  } catch (error) {
    console.error("AI Bio Optimization Error:", error);
    return currentBio;
  }
};

/**
 * Uses Gemini to suggest a match score for a job application.
 */
export const analyzeJobMatch = async (candidateProfile: any, jobDetails: any) => {
  try {
    const prompt = `
      Candidate Profile:
      Headline: ${candidateProfile.headline}
      Skills: ${candidateProfile.skills?.join(", ")}
      
      Job Details:
      Title: ${jobDetails.title}
      Requirements: ${jobDetails.requirements.join(", ")}
      Description: ${jobDetails.description}
      
      Analyze the match between the candidate and the job. 
      Return a JSON object with:
      - score (0-100)
      - reasoning (short explanation)
      - gapAnalysis (what skills are missing)
    `;

    // Fix: Upgraded to gemini-3-pro-preview for complex reasoning tasks (job match analysis)
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            gapAnalysis: { type: Type.STRING },
          },
          required: ["score", "reasoning", "gapAnalysis"],
        },
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Job Analysis Error:", error);
    return null;
  }
};

/**
 * Generates AI-powered smart replies for messaging.
 */
export const generateSmartReplies = async (lastMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The following message was received on a professional networking platform: "${lastMessage}". Suggest 3 short, professional "Smart Replies" for the user. Return them as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Smart Reply Error:", error);
    return ["Thank you!", "Let's connect.", "Sounds great."];
  }
};

/**
 * Generates a tailored professional resume using Gemini.
 */
export const generateResume = async (user: any) => {
  try {
    const prompt = `
      Create a high-impact, professional resume based on this profile:
      Name: ${user.name}
      Headline: ${user.headline}
      About: ${user.bio || 'Not provided'}
      Skills: ${user.skills?.join(', ') || 'Not listed'}
      Experience: ${JSON.stringify(user.experience || [])}
      Education: ${JSON.stringify(user.education || [])}
      Projects: ${JSON.stringify(user.projects || [])}

      Format the output in clean Markdown. Include sections for:
      1. Contact Header (use placeholder for email/phone)
      2. Professional Summary
      3. Key Skills (categorized if possible)
      4. Professional Experience (Reverse chronological)
      5. Education
      6. Projects (if applicable)
      
      Make it ATS-friendly and professional in tone.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("AI Resume Generation Error:", error);
    return "Failed to generate resume. Please try again later.";
  }
};

/**
 * Generates detailed project structure from a prompt.
 */
export const generateProjectDetails = async (idea: string) => {
  try {
    const prompt = `
      Generate a realistic software project blueprint based on this idea: "${idea}".
      Return a JSON object with:
      - title (professional project name)
      - client (a fictional company name)
      - description (2 sentences technical summary)
      - techStack (array of 4-5 relevant technologies)
      - duration (estimated time e.g., "3 months")
      - estimatedBudget (e.g., "$50,000")
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            client: { type: Type.STRING },
            description: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            duration: { type: Type.STRING },
            estimatedBudget: { type: Type.STRING }
          }
        }
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Project Generation Error:", error);
    return null;
  }
};
