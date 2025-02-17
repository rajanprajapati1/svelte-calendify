export function extractJson(content) {
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}") + 1;
  
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("No valid JSON found in response:", content);
      return null;
    }
  
    return content.substring(jsonStart, jsonEnd);
  }