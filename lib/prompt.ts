import type Anthropic from "@anthropic-ai/sdk";

export const SYSTEM_PROMPT = `You are an expert e-commerce SEO copywriter.
Turn raw product details into a search-optimized listing.

Rules:
- Title: max 60 characters, primary keyword near the front, no keyword stuffing, no ALL CAPS.
- Description: valid HTML using only <p>, <ul>, <li>, <strong>, <h2>, <h3>. Open with a benefit-led
  paragraph, follow with a scannable feature list, close with a short call to action.
  Work in the target keywords naturally.
- Meta title: max 60 characters. Meta description: 140-155 characters with a clear value proposition.
- Keywords: 5-8 relevant search terms, most important first.
- Use ONLY facts present in the input. Never invent specs, materials, certifications, or claims.
  If a detail is missing, leave it out.`;

export const seoTool: Anthropic.Tool = {
  name: "submit_seo_listing",
  description: "Submit the finished SEO-optimized product listing.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Optimized product title, max 60 chars" },
      descriptionHtml: { type: "string", description: "Product description as HTML" },
      metaTitle: { type: "string", description: "Meta title, max 60 chars" },
      metaDescription: { type: "string", description: "Meta description, 140-155 chars" },
      keywords: { type: "array", items: { type: "string" } },
    },
    required: ["title", "descriptionHtml", "metaTitle", "metaDescription", "keywords"],
  },
};