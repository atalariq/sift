import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (fileUrl: string): Promise<string> => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const stripJsonFences = (text: string): string => {
  // Remove ```json and ``` markdown fences if present
  return text
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
};
