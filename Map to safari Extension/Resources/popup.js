document.addEventListener('DOMContentLoaded', async () => {
    const statusElement = document.getElementById('extension-status');
    const countElement = document.getElementById('redirect-count');

    try {
        // Get stats from background script
        const stats = await browser.runtime.sendMessage({ type: 'getStats' });
        
        // Update status
        statusElement.textContent = stats.isEnabled ? 'Active' : 'Disabled';
        statusElement.classList.add(stats.isEnabled ? 'enabled' : 'disabled');
        
        // Update redirect count
        countElement.textContent = stats.redirectCount;
    } catch (error) {
        statusElement.textContent = 'Error';
        statusElement.classList.add('disabled');
        countElement.textContent = 'N/A';
        console.error('Error fetching stats:', error);
    }
});
