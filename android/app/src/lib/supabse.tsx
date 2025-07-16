const SUPABASE_URL = 'https://abcc.supabase.co'; // add your url
const SUPABASE_ANON_KEY = ''  // add your key

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
