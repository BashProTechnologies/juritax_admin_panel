// src/api.ts
export async function fetchServices() {
    try {
        const response = await fetch('https://juritax.az/api/api.php?action=get_services');
        if (!response.ok) throw new Error('Şəbəkə xətası!');
        return await response.json();
    } catch (error) {
        console.error("Məlumat gətirilərkən xəta:", error);
        return [];
    }
}
