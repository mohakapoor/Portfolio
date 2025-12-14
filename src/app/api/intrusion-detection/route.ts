import { NextResponse } from 'next/server';

const MODELS = ['logreg', 'lightgbm', 'ffnn'];
const BASE_URL = 'https://api.mohakapoor.in/intrusiondetection';

// Health Check (GET)
export async function GET() {
    try {
        const response = await fetch(`${BASE_URL}/health`, {
            headers: {
                'accept': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ status: 'unhealthy' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { status: 'unhealthy', error: 'Failed to fetch' },
            { status: 500 }
        );
    }
}

// Prediction (POST)
export async function POST(request: Request) {
    try {
        const { attackType } = await request.json();

        if (!attackType) {
            return NextResponse.json(
                { error: 'Attack type is required' },
                { status: 400 }
            );
        }

        const ATTACK_TYPES = ['BENIGN', 'Bot', 'Brute Force', 'DDoS', 'DoS', 'Port Scan', 'Web Attack'];
        const targetClassIndex = ATTACK_TYPES.indexOf(attackType);

        if (targetClassIndex === -1) {
            return NextResponse.json(
                { error: 'Invalid attack type' },
                { status: 400 }
            );
        }

        const token = process.env.TOKEN;
        if (!token) {
            console.error('Server Configuration Error: TOKEN is missing');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Prepare parallel requests for all models
        const promises = MODELS.map(async (model) => {
            try {
                const response = await fetch(`${BASE_URL}/predict/${model}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        target_class: targetClassIndex
                    }),
                });

                if (!response.ok) {
                    console.error(`Model ${model} failed: ${response.status}`);
                    return { model, error: `Status ${response.status}` };
                }

                const data = await response.json();
                return { model, data };
            } catch (error) {
                console.error(`Model ${model} error:`, error);
                return { model, error: 'Request failed' };
            }
        });

        const results = await Promise.all(promises);

        // Transform array into an object { logreg: ..., lightgbm: ..., ffnn: ... }
        const responseData = results.reduce((acc, result) => {
            acc[result.model] = result.data || { error: result.error };
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
