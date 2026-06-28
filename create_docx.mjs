import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat } from 'docx';

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, font: 'Arial' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial' }, paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, children: [new TextRun('AI Agents')]}),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'An overview of autonomous software systems that perceive, plan, use tools, and act toward goals.', italics: true })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('What is an AI agent?')] }),
      new Paragraph('An AI agent is a system that can take a goal, decide what to do next, use tools or APIs, and iterate until the task is complete.'),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Core capabilities')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Perception: reads inputs, context, and environment signals')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Planning: breaks a goal into steps')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Tool use: searches, calls functions, writes code, or queries systems')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Memory: stores useful context across steps or sessions')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Execution: carries out actions and checks results')] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Common examples')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Customer support assistants')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Research copilots')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Coding agents')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Workflow automation agents')] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Benefits and risks')] }),
      new Paragraph({ children: [new TextRun({ text: 'Benefits: ', bold: true }), new TextRun('speed, scale, personalization, and 24/7 operation.') ] }),
      new Paragraph({ children: [new TextRun({ text: 'Risks: ', bold: true }), new TextRun('hallucinations, tool misuse, data leakage, and cost.') ] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Best practices')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Keep humans in the loop for high-stakes decisions')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Limit tool permissions')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Log actions and monitor outputs')] }),
      new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun('Test with realistic scenarios before deployment')] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Future direction')] }),
      new Paragraph('The future of AI agents includes multi-agent systems, stronger orchestration, and deeper integration with enterprise tools and data.')
    ]
  }]
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('ai_agents_overview.docx', buffer);
console.log('Wrote ai_agents_overview.docx');
