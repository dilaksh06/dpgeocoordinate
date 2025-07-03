const SUPABASE_URL = 'https://gpauttseecilvbnwylhs.supabase.co';
const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYXV0dHNlZWNpbHZibnd5bGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTUzOTEsImV4cCI6MjA2Njc5MTM5MX0.l-rjXco63HqjZdV1DD3qG1JF4zxDrf5SCVe35Hnlgdc';

export async function insertLocation(loc: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    source: string;
    timestamp: string;
}) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                Prefer: 'return=representation',
            },
            body: JSON.stringify([loc]), // Supabase expects an array of records
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Upload failed:', data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (err: any) {
        console.error('🚨 Network upload error:', err.message || err);
        return { success: false, error: err };
    }
}
