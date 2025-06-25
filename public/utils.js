export function getPlayerCustomization() {
    const params = new URLSearchParams(window.location.search);
    return {
        prop: params.get('prop') || null,
        skin: params.get('skin') || 'f1c27d',
        clothes: params.get('clothes') || '0033cc',
        difficulty: params.get('difficulty') || 'EASY'
    };
}
