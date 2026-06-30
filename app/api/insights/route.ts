import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

interface InsightsRequest {
  calculatorId: string
  calculatorName: string
  results: Record<string, number | string>
  userInput?: Record<string, number | string>
  location?: string
  role?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: InsightsRequest = await request.json()
    const { calculatorId, calculatorName, results, userInput, location, role } = body

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const prompt = generatePrompt(calculatorId, calculatorName, results, userInput, location, role)

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate insights' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const insights = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate insights'

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Insights API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generatePrompt(
  calculatorId: string,
  calculatorName: string,
  results: Record<string, number | string>,
  userInput?: Record<string, number | string>,
  location?: string,
  role?: string
): string {
  const resultsSummary = Object.entries(results)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')

  const locationContext = location ? `The user is located in ${location}.` : ''
  const roleContext = role ? `The user is a ${role}.` : ''

  return `You are a financial advisor AI assistant. A user has just used the ${calculatorName} and received the following results: ${resultsSummary}.
${locationContext}
${roleContext}

Provide a helpful, personalized insight in 3-4 sentences that:
1. Explains what the key numbers mean in practical terms
2. Suggests one actionable step the user could take based on these results
3. Mentions any potential red flags or opportunities

Keep the tone friendly, clear, and jargon-free. Focus on value for the user.`
}
