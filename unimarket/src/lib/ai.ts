import { Category, ProductCondition } from "./types";

export interface ProductSuggestion {
  name: string;
  description: string;
  category: Category;
  condition: ProductCondition;
  conditionDetail: string;
  price: number;
}

/**
 * Analyzes an image URL using AI and returns product suggestions.
 *
 * CYCLE 1 NOTE: This is a stub implementation that returns predetermined mock values
 * after a simulated loading delay. To implement with a real AI service:
 * 1. Replace the body of this function with an actual API call
 *    (e.g., OpenAI Vision API, Google Gemini Vision, AWS Rekognition)
 * 2. Send the imageUrl to the AI service
 * 3. Parse the response and map it to ProductSuggestion
 * 4. The function signature and return type should remain unchanged
 *
 * @param imageUrl - URL of the product image to analyze
 * @returns Promise resolving to ProductSuggestion with AI-generated data
 */
export async function analyzeImageWithAI(imageUrl: string): Promise<ProductSuggestion> {
  // TODO: Replace this stub with a real AI API call in Cycle 2+
  // Example future implementation:
  // const response = await fetch('/api/ai/analyze-image', {
  //   method: 'POST',
  //   body: JSON.stringify({ imageUrl }),
  // });
  // return response.json();

  console.log("Analyzing image:", imageUrl);

  // Simulate AI processing delay (1.5-2.5s)
  const delay = 1500 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Return predetermined mock suggestion for demonstration
  return {
    name: "Libro de Cálculo Diferencial",
    description:
      "Libro universitario en buen estado, ideal para cursos de matemáticas e ingeniería. Incluye ejercicios resueltos.",
    category: "Libros",
    condition: "Poco usado",
    conditionDetail:
      "Usado durante un semestre. Sin páginas rotas ni rasgadas. Algunas anotaciones menores en lápiz, fáciles de borrar.",
    price: 35000,
  };
}
