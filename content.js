// Save an array of shortcuts and full messages to storage
function saveToStorage(shortcuts) {
    chrome.storage.local.set({ 'shortcuts': shortcuts }, function() {
   
    });
 location.reload();
}
// Function to wipe the storage
function wipeStorage() {
    chrome.storage.local.clear(function() {
      
        location.reload();
    });

}
// Example usage
const shortcuts = [
    
    // Add more shortcuts here
];
// Function to console log the chrome storage local
function logStorage() {
    chrome.storage.local.get(null, function(result) {
    
    });
}
function addShortcut(shortcut, fullMessage) {
    chrome.storage.local.get(['shortcuts'], function(result) {
        const shortcuts = result.shortcuts || [];
        if (!shortcut || !fullMessage) {
            console.error('Shortcut and full message are required');
            return;
        }
        shortcuts.push({ shortcut, fullMessage });
        saveToStorage(shortcuts);
    });
}
console.log('Content script loaded');
chrome.storage.local.get(['shortcuts'], function(result) {
    const shortcuts = result.shortcuts || [];
    console.log('Shortcuts loaded:', shortcuts);

    function replaceText(event) {
        const input = event.target;
        let inputValue;

        if (input.isContentEditable) {
            inputValue = input.innerHTML;
        } else {
            inputValue = input.value;
        }

        shortcuts.forEach(({ shortcut, fullMessage }) => {
            const escapedShortcut = shortcut.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const reg = new RegExp(escapedShortcut, 'g');
            inputValue = inputValue.replace(reg, fullMessage);
        });

        if (input.isContentEditable) {
            input.innerHTML = inputValue;
        } else {
            input.value = inputValue;
        }
    }

    // Debounce function to limit the rate of input event handling
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    }

    const debouncedReplaceText = debounce(replaceText, 300);

    document.addEventListener('input', function(event) {
        if (event.target.matches('input, textarea, [contenteditable="true"]')) {
            debouncedReplaceText(event);
        }
    });
    // Handle iframes
    function handleIframes() {
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.addEventListener('focusin', function(event) {
                    const target = event.target;
                    
                    attachListeners(target);
                    if (target.shadowRoot) {
                        traverseAndAttachListeners(target.shadowRoot);
                    }
                });
                traverseAndAttachListeners(iframeDocument);
            } catch (e) {
                console.error('Error accessing iframe content:', e);
            }
        });
    }
    
    handleIframes();
    
    // Trigger handleIframes on click events
    document.addEventListener('click', handleIframes);
    
});


//OPTIONS.HTML RENDER FUNCTIONS
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

if(document.getElementById('ShortcutList-2888381927465823')){


document.getElementById('CreateButton').addEventListener('click', function() {
    const shortcut = document.getElementById('CreateShortcut').value;
    const fullMessage = document.getElementById('CreateFullMessage').value;
    console.log(shortcut, fullMessage);
    addShortcut(shortcut.toString(), fullMessage.toString());
});
document.getElementById('WipeButton').addEventListener('click', wipeStorage);

const render = document.getElementById('ShortcutList-2888381927465823');
chrome.storage.local.get(['shortcuts'], function(result) {
    const shortcuts = result.shortcuts || [];
    shortcuts.forEach(({ shortcut, fullMessage }) => {
        const li = document.createElement('li');
        li.textContent = `${shortcut} - ${fullMessage}`;
        render.appendChild(li);
        const button = document.createElement('button');
        button.textContent = 'Delete';
        button.addEventListener('click', function() {
            // Remove the shortcut from storage and update the UI
            const index = shortcuts.findIndex(item => item.shortcut === shortcut && item.fullMessage === fullMessage);
            if (index !== -1) {
                shortcuts.splice(index, 1);
                saveToStorage(shortcuts);
                render.removeChild(li);
            }
        });
        li.appendChild(button);
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            // Open a modal or navigate to a new page for editing the shortcut
            // You can pass the current shortcut and fullMessage values to the editing page/modal
            // for pre-filling the input fields
            const newShortcutInput = document.createElement('input');
            newShortcutInput.value = shortcut;
            const newFullMessageInput = document.createElement('textarea');
            newFullMessageInput.value = fullMessage;
            // Hide the original li value, edit button, and delete button
            li.textContent = '';
            editButton.style.display = 'none';
            button.style.display = 'none';

            // Create a save button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.addEventListener('click', function() {
                const newShortcut = newShortcutInput.value;
                const newFullMessage = newFullMessageInput.value;
                if (newShortcut && newFullMessage) {
                    const index = shortcuts.findIndex(item => item.shortcut === shortcut && item.fullMessage === fullMessage);
                    if (index !== -1) {
                        shortcuts[index].shortcut = newShortcut;
                        shortcuts[index].fullMessage = newFullMessage;
                        saveToStorage(shortcuts);
                        li.textContent = `${newShortcut} - ${newFullMessage}`;
                        // Create a span element to wrap the shortcut message
                        const shortcutMessageSpan = document.createElement('span');
                        shortcutMessageSpan.textContent = `${newShortcut} - ${newFullMessage}`;
                            
                        // Append the span element to the li element
                        li.appendChild(shortcutMessageSpan);
                        li.removeChild(newShortcutInput);
                        li.removeChild(newFullMessageInput);
                        li.removeChild(saveButton);
                    }
                }
            });

            // Create a cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', function() {
                li.textContent = `${shortcut} - ${fullMessage}`;
                saveToStorage(shortcuts);
                li.removeChild(newShortcutInput);
                li.removeChild(newFullMessageInput);
                li.removeChild(saveButton);
                li.removeChild(cancelButton);
                
             
            });
            // Add the edit button and delete button back after canceling or saving
            li.appendChild(editButton);
            li.appendChild(button);
            li.appendChild(newShortcutInput);
            li.appendChild(newFullMessageInput);
            li.appendChild(saveButton);
            li.appendChild(cancelButton);


        });
        li.appendChild(editButton);
 
    });
})};