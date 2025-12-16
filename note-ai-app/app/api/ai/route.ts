import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, noteContent } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey,
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a helpful AI assistant for a note-taking app. The user has the following note content:

---
${noteContent || '(empty note)'}
---

User request: ${prompt}

Please provide a helpful, concise response that addresses their request. If they ask you to expand ideas, generate content, summarize, or extract information, do so directly without meta-commentary.`,
        },
      ],
    });

    const response = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Unable to generate response';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
