// Save an array of shortcuts and full messages to storage
function saveToStorage(shortcuts) {
    chrome.storage.local.set({ 'shortcuts': shortcuts }, function() {
        console.log('Shortcuts and full messages saved to storage');
    });
 location.reload(); 
}
// Function to wipe the storage
function wipeStorage() {
    chrome.storage.local.clear(function() {
        console.log('Storage wiped');
    });
   location.reload();
}
// Example usage
const shortcuts = [
    { shortcut: '8077541', fullMessage: 'Placeholder' },
    // Add more shortcuts here
];
// Function to console log the chrome storage local
function logStorage() {
    chrome.storage.local.get(null, function(result) {
        console.log(result);
    });
}

function addShortcut(shortcut, fullMessage) {
    chrome.storage.local.get(['shortcuts'], function(result) {
        const shortcuts = result.shortcuts || [];
        shortcuts.push({ shortcut, fullMessage });
        saveToStorage(shortcuts);
    });
}
// Retrieve shortcuts from storage
chrome.storage.local.get(['shortcuts'], function(result) {
    const shortcuts = result.shortcuts || [];

    function replaceText(event, shortcuts) {
        const input = event.target;
        let inputValue = input.value;

        shortcuts.forEach(({ shortcut, fullMessage }) => {
            const reg = new RegExp(String.raw`${shortcut}`, 'g');
            inputValue = inputValue.replace(reg, fullMessage);
        });

        input.value = inputValue;
    }

    // Debounce function to limit the rate of input event handling
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Event listener to detect typing in input fields
    document.addEventListener('input', debounce(function(event) {
        const focusedElement = document.activeElement;
        if (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
            replaceText(event, shortcuts);
        }
    }, 100)); // Adjust debounce delay as needed
});
if (document.getElementById('CreateButton')){
document.getElementById('CreateButton').addEventListener('click', function() {
    const shortcut = document.getElementById('CreateShortcut').value;
    const fullMessage = document.getElementById('CreateFullMessage').value;
    console.log(shortcut, fullMessage);
    addShortcut(shortcut, fullMessage);
})};
document.getElementById('WipeButton').addEventListener('click', wipeStorage);
if(document.getElementById('ShortcutList-2888381927465823')){
const render = document.getElementById('ShortcutList-2888381927465823');
chrome.storage.local.get(['shortcuts'], function(result) {
    const shortcuts = result.shortcuts || [];
    shortcuts.forEach(({ shortcut, fullMessage }) => {
        const li = document.createElement('li');
        li.textContent = `${shortcut} - ${fullMessage}`;
        render.appendChild(li);
    });
})};