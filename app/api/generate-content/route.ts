import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try models in order of preference, focusing on available models
    const models = [
      "gemini-1.5-flash-8b",     // Lightweight flash model
      "gemini-1.5-flash",        // Standard flash model
      "gemini-1.5-pro",          // Pro model
      "gemini-pro"               // Legacy stable model
    ];
    
    let lastError;
    
    for (const modelName of models) {
      try {
        console.log(`[generate-content] Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });
        
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        
        const responseText = result.response.text();
        
        console.log(`[generate-content] Successfully generated content with model: ${modelName}`);
        return NextResponse.json({ 
          text: responseText ?? "",
          model: modelName,
          success: true 
        });
        
      } catch (error: any) {
        console.error(`[generate-content] Model ${modelName} failed:`, error.message);
        lastError = error;
        
        // If it's a quota error, try next model immediately
        if (error.message?.includes('quota') || error.message?.includes('429')) {
          console.log(`[generate-content] Quota exceeded for ${modelName}, trying next model...`);
          continue;
        }
        
        // If model not found, try next model
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          console.log(`[generate-content] Model ${modelName} not available, trying next model...`);
          continue;
        }
        
        // For other errors, also try next model
        continue;
      }
    }
    
    // If all models failed, provide helpful error message
    const errorMessage = lastError?.message || "All AI models are currently unavailable";
    
    if (errorMessage.includes('quota')) {
      return NextResponse.json(
        { 
          error: "AI service quota exceeded. Please try again later or check your API usage limits.",
          details: "The free tier limits have been reached. Consider upgrading your plan or waiting for the quota to reset.",
          success: false
        },
        { status: 429 }
      );
    }
    
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return NextResponse.json(
        { 
          error: "AI models are currently unavailable. Please check your API configuration.",
          details: "The requested AI models could not be accessed. Verify your API key and model permissions.",
          success: false
        },
        { status: 503 }
      );
    }
    
    throw lastError || new Error("All AI models failed to generate content");
    
  } catch (error: any) {
    console.error("Content generation failed:", error);
    
    return NextResponse.json(
      { 
        error: "Content generation service is temporarily unavailable",
        details: error.message || "Unknown error occurred",
        success: false
      },
      { status: 500 }
    );
  }
}
