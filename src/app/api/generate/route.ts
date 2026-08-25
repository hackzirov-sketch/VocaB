import { NextRequest, NextResponse } from "next/server";

interface AIProvider {
  name: string;
  baseURL: string;
  apiKey: string;
  model: string;
  priority: number;
}

const providers: AIProvider[] = [
  {
    name: "Groq",
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY || "",
    model: "openai/gpt-oss-20b",
    priority: 1,
  },
  {
    name: "Gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey: process.env.GEMINI_API_KEY || "",
    model: "gemini-3.5-flash-lite",
    priority: 2,
  },
];

function getPrompt(topicName: string): string {
  return `Siz ingliz tilini o'rganayotgan o'quvchilar uchun English teachersiz.
"${topicName}" mavzusiga oid 20 ta so'z, phrasal verb va idiom yarating.

DARAJALAR ARALASHMASI:
- A2: 4-5 ta juda oddiy, oson so'zlar (masalan: like, want, need, go, have)
- B1: 5-6 ta o'rta darajadagi so'zlar (masalan: enjoy, prefer, suggest)
- B2: 6-8 ta asosiy so'zlar
- C1: 2-3 ta faqat juda oson va qulay bo'lsa

Talablar:
- Barcha darajadagi so'zlar OSON bo'lishi kerak
- Talaffuzi oson (qisqa, oddiy tovushlar)
- Eslab qolish qulay
- Kunda gapirishda ishlatiladigan
- Murakkab undosh tovushlar yo'q
- Oddiy va tabiiy so'zlar

Har bir so'z uchun:
1. word: Inglizcha so'z yoki ibora
2. type: "word", "phrasal_verb" yoki "idiom"
3. meaning_uz: O'zbekcha ma'no
4. example: 8-12 so'zdan iborat juda oddiy misol gap
5. example_uz: Misol gapning o'zbekcha tarjimasi
6. level: "A2", "B1", "B2" yoki "C1"
7. synonyms: 2-3 ta sinonim
8. pronunciation_tip: Qisqa talaffuz maslahati (o'zbekchada)

JSON formatda qaytaring:
{
  "words": [
    {
      "id": 1,
      "word": "example",
      "type": "word",
      "meaning_uz": "misol",
      "example": "This is an example sentence.",
      "example_uz": "Bu misol gap.",
      "level": "A2",
      "synonyms": ["instance", "sample"],
      "pronunciation_tip": "ig-zam-pil deb ayting"
    }
  ]
}

Faqat JSON qaytaring, boshqa matn yozmang!`;
}

async function callProvider(
  provider: AIProvider,
  prompt: string
): Promise<unknown[]> {
  const response = await fetch(`${provider.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        {
          role: "system",
          content:
            "Siz JSON formatda javob beradigan AI yordamchisiz. Faqat JSON qaytaring.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`${provider.name} error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "";

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("JSON topilmadi");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.words || [];
}

export async function POST(request: NextRequest) {
  try {
    const { topicName } = await request.json();

    if (!topicName) {
      return NextResponse.json(
        { error: "Topic name is required" },
        { status: 400 }
      );
    }

    const prompt = getPrompt(topicName);
    const sortedProviders = [...providers].sort(
      (a, b) => a.priority - b.priority
    );

    for (const provider of sortedProviders) {
      if (!provider.apiKey) continue;
      try {
        const words = await callProvider(provider, prompt);
        if (words.length > 0) {
          return NextResponse.json({ words });
        }
      } catch (error) {
        console.log(`${provider.name} failed:`, (error as Error).message);
      }
    }

    return NextResponse.json(
      { error: "All providers failed" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
