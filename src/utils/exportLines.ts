// Utility functions for exporting generated lines

export const exportToText = (lines: string[], category: string, tone: string): void => {
  const content = lines.map((line, index) => `${index + 1}. ${line}`).join('\n\n');
  const header = `Generated Lines\nCategory: ${category}\nTone: ${tone}\nDate: ${new Date().toLocaleString()}\n\n---\n\n`;
  const fullContent = header + content;
  
  downloadFile(fullContent, `lines-${category}-${tone}.txt`, 'text/plain');
};

export const exportToJSON = (lines: string[], category: string, tone: string, prompt?: string): void => {
  const data = {
    lines,
    metadata: {
      category,
      tone,
      prompt: prompt || null,
      generatedAt: new Date().toISOString(),
      count: lines.length
    }
  };
  
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, `lines-${category}-${tone}.json`, 'application/json');
};

export const exportToCSV = (lines: string[], category: string, tone: string): void => {
  const header = 'Number,Line,Category,Tone,Generated At\n';
  const rows = lines.map((line, index) => 
    `${index + 1},"${line.replace(/"/g, '""')}","${category}","${tone}","${new Date().toISOString()}"`
  ).join('\n');
  
  const content = header + rows;
  downloadFile(content, `lines-${category}-${tone}.csv`, 'text/csv');
};

export const copyAllToClipboard = async (lines: string[]): Promise<void> => {
  const content = lines.join('\n\n');
  await navigator.clipboard.writeText(content);
};

// Helper function to trigger download
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
