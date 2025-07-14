// Get all the HTML elements we need to work with
const darkModeToggle = document.getElementById('darkModeToggle');  // Dark mode button
const templateCards = document.querySelectorAll('.template-card');  // Email type cards (job, cold, reply)
const templateForms = document.querySelectorAll('.template-form');  // Forms for each email type
const generateBtn = document.getElementById('generateBtn');  // Generate email button
const previewPlaceholder = document.getElementById('previewPlaceholder');  // Initial preview message
const previewContent = document.getElementById('previewContent');  // Generated email display area
const loadingState = document.getElementById('loadingState');  // Loading spinner
const emailSubject = document.getElementById('emailSubject');  // Where subject line appears
const emailBody = document.getElementById('emailBody');  // Where email body appears
const copyBtn = document.getElementById('copyBtn');  // Copy to clipboard button
const regenerateBtn = document.getElementById('regenerateBtn');  // Generate new email button
const toast = document.getElementById('toast');  // Notification popup
const toastMessage = document.getElementById('toastMessage');  // Text inside notification

// Variables to track current state
let currentTemplate = 'job';  // Which email type is selected (job, cold, or reply)
let currentEmailData = null;  // Stores the generated email data


// DARK MODE FUNCTIONS
// Set up dark mode when page loads
function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme');  // Check if user saved a preference
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);  // Apply saved theme
        updateDarkModeIcon(savedTheme === 'dark');  // Update the icon
    }
}

// Switch between light and dark mode
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';  // Switch theme
    
    document.documentElement.setAttribute('data-theme', newTheme);  // Apply new theme
    localStorage.setItem('theme', newTheme);  // Save user's choice
    updateDarkModeIcon(newTheme === 'dark');  // Update the icon
}

// Change the icon based on current theme
function updateDarkModeIcon(isDark) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';  // Sun for dark mode, moon for light mode
}

// TEMPLATE SWITCHING FUNCTIONS
// Switch between different email types (job, cold, reply)
function switchTemplate(templateType) {
    currentTemplate = templateType;  // Remember which template is selected
    
    // Highlight the selected template card
    templateCards.forEach(card => {
        card.classList.remove('active');  // Remove highlight from all cards
        if (card.dataset.template === templateType) {
            card.classList.add('active');  // Highlight the clicked card
        }
    });
    
    // Show the correct form for the selected template
    templateForms.forEach(form => {
        form.classList.remove('active');  // Hide all forms
        if (form.id === `${templateType}Form`) {
            form.classList.add('active');  // Show the correct form
        }
    });
    
    // Reset the preview area
    showPreviewPlaceholder();
}

// PREVIEW AREA FUNCTIONS
// Show initial message (when no email is generated yet)
function showPreviewPlaceholder() {
    previewPlaceholder.style.display = 'block';     // Show placeholder message
    previewContent.style.display = 'none';         // Hide email content
    loadingState.style.display = 'none';           // Hide loading spinner
}

// Show loading animation while AI generates email
function showLoadingState() {
    previewPlaceholder.style.display = 'none';     // Hide placeholder
    previewContent.style.display = 'none';         // Hide email content
    loadingState.style.display = 'block';          // Show loading spinner
}

// Show generated email content
function showPreviewContent() {
    previewPlaceholder.style.display = 'none';     // Hide placeholder
    previewContent.style.display = 'block';        // Show email content
    loadingState.style.display = 'none';           // Hide loading spinner
}

// FORM VALIDATION
// Check if all required fields are filled before generating email
function validateForm(templateType) {
    // Define which fields are required for each email type
    const requiredFields = {
        job: ['jobName', 'jobEmail', 'jobCompany', 'jobPosition', 'jobSkills', 'jobWhy'],
        cold: ['coldSenderName', 'coldSenderEmail', 'coldRecipient', 'coldCompany', 'coldPurpose', 'coldBackground', 'coldCTA'],
        reply: ['replySenderName', 'replySenderEmail', 'replyRecipientName', 'replyContext', 'replyType', 'replyPoints']
    };
    
    // Check each required field for the selected template
    const fields = requiredFields[templateType];
    for (const fieldId of fields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {  // If field is empty
            showToast(`Please fill in the ${field.previousElementSibling.textContent} field.`, 'error');
            field.focus();  // Put cursor in the empty field
            return false;   // Stop validation - form is incomplete
        }
    }
    
    return true;  // All fields are filled
}

// FORM DATA COLLECTION
// Get all the information from the form fields
function getFormData(templateType) {
    const formData = {};  // Object to store all form data
    
    // Collect different data based on which email type is selected
    switch (templateType) {
        case 'job':
            formData.name = document.getElementById('jobName').value.trim();
            formData.email = document.getElementById('jobEmail').value.trim();
            formData.phone = document.getElementById('jobPhone').value.trim();
            formData.company = document.getElementById('jobCompany').value.trim();
            formData.position = document.getElementById('jobPosition').value.trim();
            formData.manager = document.getElementById('jobManager').value.trim();
            formData.experience = document.getElementById('jobExperience').value.trim();
            formData.skills = document.getElementById('jobSkills').value.trim();
            formData.education = document.getElementById('jobEducation').value.trim();
            formData.why = document.getElementById('jobWhy').value.trim();
            formData.achievements = document.getElementById('jobAchievements').value.trim();
            break;
            
        case 'cold':
            formData.senderName = document.getElementById('coldSenderName').value.trim();
            formData.senderEmail = document.getElementById('coldSenderEmail').value.trim();
            formData.senderCompany = document.getElementById('coldSenderCompany').value.trim();
            formData.senderTitle = document.getElementById('coldSenderTitle').value.trim();
            formData.recipient = document.getElementById('coldRecipient').value.trim();
            formData.recipientTitle = document.getElementById('coldRecipientTitle').value.trim();
            formData.company = document.getElementById('coldCompany').value.trim();
            formData.purpose = document.getElementById('coldPurpose').value.trim();
            formData.background = document.getElementById('coldBackground').value.trim();
            formData.valueProp = document.getElementById('coldValueProp').value.trim();
            formData.cta = document.getElementById('coldCTA').value.trim();
            break;
            
        case 'reply':
            formData.senderName = document.getElementById('replySenderName').value.trim();
            formData.senderEmail = document.getElementById('replySenderEmail').value.trim();
            formData.senderTitle = document.getElementById('replySenderTitle').value.trim();
            formData.recipientName = document.getElementById('replyRecipientName').value.trim();
            formData.context = document.getElementById('replyContext').value.trim();
            formData.type = document.getElementById('replyType').value;
            formData.points = document.getElementById('replyPoints').value.trim();
            formData.deadline = document.getElementById('replyDeadline').value.trim();
            formData.attachments = document.getElementById('replyAttachments').value.trim();
            break;
    }
    
    return formData;
}

// Generate email prompts
function generatePrompt(templateType, formData) {
    const prompts = {
        job: `Generate a complete, professional job application email with the following details:

APPLICANT INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
${formData.experience ? `Years of Experience: ${formData.experience}` : ''}

JOB DETAILS:
Company: ${formData.company}
Position: ${formData.position}
${formData.manager ? `Hiring Manager: ${formData.manager}` : ''}

QUALIFICATIONS:
Skills/Experience: ${formData.skills}
${formData.education ? `Education: ${formData.education}` : ''}
${formData.achievements ? `Notable Achievements: ${formData.achievements}` : ''}

MOTIVATION:
Why this company: ${formData.why}

Create a concise, professional email that includes:
- Compelling subject line
- Professional greeting
- Brief opening paragraph
- Key qualifications (2-3 main points)
- Clear interest in the company
- Professional closing with contact information

The email should be ready to send without any modifications. Keep it concise but impactful (maximum 150 words).

IMPORTANT: Generate the email in plain text format with proper line breaks and spacing for readability.

Format the response exactly like this:
SUBJECT: [Your subject line here]

BODY:
[Your complete email body here with proper formatting]`,

        cold: `Generate a complete, professional cold outreach email with the following details:

SENDER INFORMATION:
Name: ${formData.senderName}
Email: ${formData.senderEmail}
Company: ${formData.senderCompany}
Title: ${formData.senderTitle}

RECIPIENT INFORMATION:
Name: ${formData.recipient}
${formData.recipientTitle ? `Title: ${formData.recipientTitle}` : ''}
Company: ${formData.company}

EMAIL PURPOSE:
Purpose: ${formData.purpose}
Background/Credentials: ${formData.background}
${formData.valueProp ? `Value Proposition: ${formData.valueProp}` : ''}
Call to Action: ${formData.cta}

Create a concise, professional cold email that includes:
- Attention-grabbing subject line
- Personalized greeting
- Brief introduction (who you are)
- Clear value proposition (what you offer)
- Specific call to action
- Professional closing

The email should be ready to send without any modifications. Keep it short and impactful (maximum 100 words).

IMPORTANT: Generate the email in plain text format with proper line breaks and spacing for readability.

Format the response exactly like this:
SUBJECT: [Your subject line here]

BODY:
[Your complete email body here with proper formatting]`,

        reply: `Generate a complete, professional email reply with the following details:

SENDER INFORMATION:
Name: ${formData.senderName}
Email: ${formData.senderEmail}
Title: ${formData.senderTitle}

RECIPIENT INFORMATION:
Name: ${formData.recipientName}

EMAIL CONTEXT:
Original Email Context: ${formData.context}
Response Type: ${formData.type}
Key Points to Address: ${formData.points}
${formData.deadline ? `Deadlines/Dates: ${formData.deadline}` : ''}
${formData.attachments ? `Attachments/Documents: ${formData.attachments}` : ''}

Create a concise, professional email reply that includes:
- Appropriate subject line (Re: format if replying)
- Professional greeting
- Brief acknowledgment of original email
- Clear responses to key points
- Appropriate tone for ${formData.type} response
- Next steps (if needed)
- Professional closing

The email should be ready to send without any modifications. Keep it clear and concise (maximum 120 words).

IMPORTANT: Generate the email in plain text format with proper line breaks and spacing for readability.

Format the response exactly like this:
SUBJECT: [Your subject line here]

BODY:
[Your complete email body here with proper formatting]`
    };
    
    return prompts[templateType];
}

// // Call Gemini API directly from backend
async function callGeminiAPI(prompt) {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();

        return {
            subject: data.response?.match(/SUBJECT:\s*(.+)/i)?.[1] || "Generated Email",
            body: data.response?.match(/BODY:\s*([\s\S]*)/i)?.[1]?.trim() || data.response
        };
    } catch (error) {
        console.error("Secure API Call Error:", error);
        throw error;
    }
}







// MAIN EMAIL GENERATION FUNCTION
// This is the main function that creates the email using AI
async function generateEmail() {
    // First, check if all required fields are filled
    if (!validateForm(currentTemplate)) {
        return;  // Stop if form is incomplete
    }
    
    // Get all the form data and create AI prompt
    const formData = getFormData(currentTemplate);
    const prompt = generatePrompt(currentTemplate, formData);
    
    // Show loading animation and disable button
    showLoadingState();
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    try {
        // Send request to AI and get response
        const emailData = await callGeminiAPI(prompt);
        
        // Check if we got a valid response
        if (emailData && emailData.subject && emailData.body) {
            currentEmailData = emailData;  // Save the email data
            displayEmail(emailData);       // Show the email
            showPreviewContent();          // Switch to preview mode
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error generating email:', error);
        showToast('Failed to generate email. Please try again.', 'error');
        showPreviewPlaceholder();  // Go back to initial state
    } finally {
        // Re-enable the button regardless of success/failure
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Email with AI';
    }
}

// Display email in preview
function displayEmail(emailData) {
    emailSubject.textContent = emailData.subject;
    
    // Format the email body with proper line breaks and spacing
    const formattedBody = emailData.body
        .replace(/\n\n/g, '\n\n')  // Preserve double line breaks
        .replace(/\n/g, '\n')      // Preserve single line breaks
        .trim();
    
    emailBody.style.whiteSpace = 'pre-wrap';
    emailBody.textContent = formattedBody;
}

// Copy email to clipboard
async function copyEmail() {
    if (!currentEmailData) return;
    
    // Format the email properly for copying
    const emailText = `Subject: ${currentEmailData.subject}\n\n${currentEmailData.body}`;
    
    try {
        await navigator.clipboard.writeText(emailText);
        
        // Show success state
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Email';
        }, 2000);
        
        showToast('Email copied to clipboard successfully!', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showToast('Failed to copy email. Please try again.', 'error');
    }
}

// Show notification popup (only when needed)
function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    
    // Remove any existing color classes
    toast.classList.remove('error', 'success', 'info');
    
    // Set the right color based on message type
    if (type === 'error') {
        toast.classList.add('error');  // Red for errors
    } else if (type === 'success') {
        toast.classList.add('success');  // Green for success
    }
    // Default is blue for info messages
    
    // Show the notification
    toast.style.display = 'block';  // Make it visible
    toast.classList.add('show');    // Animate it in
    
    // Hide it after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Wait for animation to complete before hiding
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 3000);
}

// INITIALIZATION - This runs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set up dark mode based on user's saved preference
    initializeDarkMode();
    
    // Make sure notification is completely hidden initially
    toast.classList.remove('show');
    toast.style.display = 'none';
    
    // Set up click handlers for all interactive elements
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Template switching - when user clicks on email type cards
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            switchTemplate(card.dataset.template);
        });
    });
    
    // Button click handlers
    generateBtn.addEventListener('click', generateEmail);
    copyBtn.addEventListener('click', copyEmail);
    regenerateBtn.addEventListener('click', generateEmail);
    
    // Prevent form from submitting normally (we handle it with JavaScript)
    document.getElementById('emailForm').addEventListener('submit', (e) => {
        e.preventDefault();
        generateEmail();
    });
    
    // Visual feedback for form fields (green border when filled)
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => {
            if (field.value.trim()) {
                field.style.borderColor = 'var(--success-color)';
            } else {
                field.style.borderColor = 'var(--border-color)';
            }
        });
    });
});

// KEYBOARD SHORTCUTS - Make the app faster to use
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate email quickly
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateEmail();
    }
    
    // Ctrl/Cmd + C to copy email quickly (when email is visible)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && previewContent.style.display !== 'none') {
        e.preventDefault();
        copyEmail();
    }
    
    // Escape key to close notification
    if (e.key === 'Escape' && toast.classList.contains('show')) {
        toast.classList.remove('show');
    }
});

// Auto-resize textareas
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});

// Prevent form submission on Enter (except in textareas)
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateEmail();
        }
    });
});
