console.log('Map to Safari content script loaded');

// Function to check if a URL is a Google Maps URL
function isGoogleMapsUrl(url) {
    return url && (
        url.includes('google.com/maps') ||
        url.includes('maps.google.com') ||
        url.includes('goo.gl/maps')
    );
}

// Handle clicks on Google Maps links
document.addEventListener('click', async (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const url = link.href;
    console.log('Clicked link:', url);

    if (isGoogleMapsUrl(url)) {
        console.log('Google Maps link detected:', url);
        event.preventDefault();
        event.stopPropagation();
        
        try {
            // Ask background script to convert the URL
            const response = await browser.runtime.sendMessage({
                type: 'convertUrl',
                url: url
            });
            
            console.log('Received response:', response);
            
            if (response && response.url) {
                console.log('Requesting navigation to Apple Maps:', response.url);
                await browser.runtime.sendMessage({
                    type: 'navigate',
                    url: response.url
                });
            } else {
                console.error('No valid Apple Maps URL received');
            }
        } catch (error) {
            console.error('Error converting URL:', error);
        }
    }
}, true); // Added capture phase to ensure we catch the event first
