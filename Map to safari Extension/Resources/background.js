// Counter for redirected links
let redirectedLinksCount = 0;

// Function to convert Google Maps URL to Apple Maps URL
function convertToAppleMaps(url) {
    try {
        console.log('Converting URL:', url);
        const googleUrl = new URL(url);
        
        // Handle navigation/directions URLs
        if (googleUrl.pathname.includes('/dir/') || googleUrl.searchParams.has('destination')) {
            console.log('Handling navigation URL');
            
            let origin = googleUrl.searchParams.get('origin') || '';
            let destination = googleUrl.searchParams.get('destination') || '';
            
            // Sometimes the direction info is in the pathname
            if (googleUrl.pathname.includes('/dir/')) {
                const dirParts = googleUrl.pathname.split('/dir/')[1].split('/');
                if (dirParts.length >= 2) {
                    origin = decodeURIComponent(dirParts[0]);
                    destination = decodeURIComponent(dirParts[1]);
                }
            }
            
            console.log('Origin:', origin);
            console.log('Destination:', destination);
            
            if (destination) {
                // Use directions mode for Apple Maps
                let appleMapsUrl = 'https://maps.apple.com/?dirflg=d';
                
                if (origin) {
                    // Handle coordinates or address for origin
                    const saddr = origin.includes(',') ?
                        origin.trim() : // Coordinates
                        encodeURIComponent(origin); // Address
                    appleMapsUrl += `&saddr=${saddr}`;
                }
                
                // Handle coordinates or address for destination
                const daddr = destination.includes(',') ?
                    destination.trim() : // Coordinates
                    encodeURIComponent(destination); // Address
                appleMapsUrl += `&daddr=${daddr}`;
                
                console.log('Generated Apple Maps URL:', appleMapsUrl);
                return appleMapsUrl;
            }
        }
        
        // Handle places
        if (googleUrl.pathname.includes('/place/')) {
            console.log('Handling place URL');
            const parts = googleUrl.pathname.split('/place/')[1].split('/');
            const locationName = parts[0];
            
            // If coordinates are available in the URL
            const atIndex = parts.findIndex(part => part.startsWith('@'));
            if (atIndex !== -1) {
                const coords = parts[atIndex].substring(1).split(',');
                const lat = coords[0];
                const lng = coords[1];
                return `https://maps.apple.com/?q=${encodeURIComponent(locationName)}&ll=${lat},${lng}`;
            }
            
            return `https://maps.apple.com/?q=${encodeURIComponent(locationName)}`;
        }
        
        // Handle searches
        if (googleUrl.searchParams.has('q')) {
            console.log('Handling search URL');
            const query = googleUrl.searchParams.get('q');
            return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
        }
        
        // Handle coordinate-based URLs
        if (googleUrl.pathname.includes('@')) {
            console.log('Handling coordinate URL');
            const coords = googleUrl.pathname.split('@')[1].split(',');
            const lat = coords[0];
            const lng = coords[1];
            return `https://maps.apple.com/?ll=${lat},${lng}`;
        }
        
        console.log('No matching URL pattern found');
    } catch (error) {
        console.error('Error converting URL:', error);
    }
    return null;
}

// Function to validate Apple Maps URL
function isValidAppleMapsUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname === 'maps.apple.com' &&
               (parsedUrl.searchParams.has('q') ||
                parsedUrl.searchParams.has('ll') ||
                parsedUrl.searchParams.has('daddr'));
    } catch (error) {
        console.error('URL validation error:', error);
        return false;
    }
}

// Listen for navigation events to Google Maps
browser.webNavigation.onBeforeNavigate.addListener((details) => {
    console.log('Navigation detected:', details.url);
    if (details.url.includes('google.com/maps')) {
        const appleMapsUrl = convertToAppleMaps(details.url);
        console.log('Converted URL:', appleMapsUrl);
        
        if (appleMapsUrl && isValidAppleMapsUrl(appleMapsUrl)) {
            console.log('Redirecting to:', appleMapsUrl);
            redirectedLinksCount++;
            browser.tabs.update(details.tabId, { url: appleMapsUrl });
        } else {
            console.error('Invalid Apple Maps URL generated');
        }
    }
});

// Handle messages from content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getStats') {
        return Promise.resolve({
            redirectCount: redirectedLinksCount,
            isEnabled: true
        });
    } else if (request.type === 'convertUrl') {
        const appleMapsUrl = convertToAppleMaps(request.url);
        return Promise.resolve({ url: appleMapsUrl });
    }
    if (request.type === 'navigate' && sender.tab) {
        const url = request.url;
        if (url && isValidAppleMapsUrl(url)) {
            console.log('Background script navigating to:', url);
            redirectedLinksCount++;
            browser.tabs.update(sender.tab.id, { url: url });
        }
    }
    return Promise.resolve(null);
});
