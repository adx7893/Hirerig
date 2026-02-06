
import { GoogleGenAI, Type } from "@google/genai";

// Helper to safely get the API Key in both Vite (local) and Node (production) environments
const getApiKey = (): string => {
  try {
    // Check for Vite environment variable
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // import.meta might not be defined in some environments
  }

  try {
    // Check for standard process.env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // process might not be defined
  }
  
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Converts a File object to a Base64 string for Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes an uploaded resume file using Gemini to provide career guidance.
 * Direct multimodal analysis without external tools.
 */
export const analyzeResumeWithGemini = async (file: File) => {
  try {
    const filePart = await fileToGenerativePart(file);

    const prompt = `
      You are an expert AI Career Coach and Recruiter. 
      Analyze the attached resume file word-for-word.
      
      Task:
      1. Analyze the candidate's skills, experience, and profile summary.
      2. Write a personalized, encouraging message addressing the candidate by name (if found) or "Candidate". Highlight their top 2-3 specific strengths found in the document.
      3. Recommend 3 specific professional learning modules or courses that would fill skill gaps or advance their career.
      4. Suggest 3 relevant job roles that fit their profile perfectly. Include a realistic salary range.
      
      IMPORTANT: For the 'applyLink' field in openPositions, generate a Google Search URL query for that specific Job Title and Company (e.g., https://www.google.com/search?q=Software+Engineer+Google+Jobs).

      Return the result in JSON format matching this schema:
      {
        "candidateAnalysis": "string (The personalized message)",
        "recommendedModules": [
          { "id": 1, "title": "string", "level": "Beginner/Intermediate/Advanced", "duration": "string" }
        ],
        "openPositions": [
          { "id": 101, "jobTitle": "string", "company": "string", "salaryRange": "string", "applyLink": "string" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-09-2025",
      contents: [
        {
          role: "user",
          parts: [
            filePart, // Pass the full part object { inlineData: ... }
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateAnalysis: { type: Type.STRING },
            recommendedModules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  level: { type: Type.STRING },
                  duration: { type: Type.STRING }
                }
              }
            },
            openPositions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  jobTitle: { type: Type.STRING },
                  company: { type: Type.STRING },
                  salaryRange: { type: Type.STRING },
                  applyLink: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Resume Analysis Error:", error);
    return null;
  }
};

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
      You are an expert professional resume writer.
      
      Action: Generate a modern, ATS-optimized, professional resume using the provided candidate profile data.
      
      Input Data:
      - Name: ${user.name}
      - Email: ${user.email}
      - Phone: ${user.phone || '(Phone not provided)'}
      - Location: ${user.location || '(Location not provided)'}
      - Professional Summary: ${user.bio || 'Not provided'}
      - Soft Skills: ${user.softSkills?.join(', ') || 'Not explicitly listed'}
      - Technical Skills: ${user.technicalSkills?.join(', ') || 'Not explicitly listed'}
      - Work Experience: ${JSON.stringify(user.experience || [])}
      - Educational Qualifications: ${JSON.stringify(user.education || [])}
      
      STRICT Output Format:
      - Provide ONLY the resume content in clean Markdown format.
      - DO NOT include any conversational text (e.g. "Here is your resume").
      - DO NOT include markdown code fences (e.g. \`\`\`markdown).
      
      Structure Requirements:
      1. Header (Name, Phone, Email, Location)
      2. Summary (Powerful, concise, 3-4 lines)
      3. Soft Skills (Bulleted list)
      4. Technical Skills (Bulleted list)
      5. Work Experience (Reverse chronological, achievement-driven bullets)
      6. Educational Qualifications (Degree, Institution, Dates)
      
      Tone: Professional, Impactful, Results-Oriented.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for more consistent formatting
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("AI Resume Generation Error:", error);
    return "Failed to generate resume. Please check your network connection.";
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

/**
 * Handles chat interactions with the Gemini bot.
 */
export const chatWithBot = async (currentMessage: string, history: { role: string, content: string }[], user: any) => {
  try {
    // Convert application history format to Gemini API format
    // Map 'bot' to 'model' and 'user' to 'user'
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: formattedHistory,
      config: {
        systemInstruction: `You are HireRig Assistant, a helpful AI assistant for a professional recruitment platform called HireRig. 
        The current user is ${user?.name || 'a guest'}. 
        Your role is to help candidates improve their profiles, find jobs, and prepare for interviews, 
        and to help recruiters find talent and manage applications.
        Keep responses concise, professional, and helpful.`,
      },
    });

    const response = await chat.sendMessage({ message: currentMessage });
    return response.text;
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};
