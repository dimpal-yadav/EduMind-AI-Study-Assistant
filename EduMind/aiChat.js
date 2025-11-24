// AI Chat functionality for dashboard and other pages
class AIChat {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.setupChat();
    }
    
    setupChat() {
        this.createChatInterface();
        this.bindEvents();
        this.loadConversationHistory();
    }
    
    createChatInterface() {
        // Create chat widget if it doesn't exist
        if (!document.getElementById('aiChatWidget')) {
            const chatHTML = `
                <div class="ai-chat-widget" id="aiChatWidget">
                    <div class="chat-header">
                        <div class="chat-title">
                            <i class="fas fa-robot"></i>
                            <span>AI Study Assistant</span>
                        </div>
                        <div class="chat-controls">
                            <button class="chat-btn" id="minimizeChat">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="chat-btn" id="closeChat">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        <div class="message ai-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>Hello! I'm your AI study assistant. I can help you with:</p>
                                <ul>
                                    <li>Explaining difficult concepts</li>
                                    <li>Summarizing your notes</li>
                                    <li>Creating study plans</li>
                                    <li>Answering subject-related questions</li>
                                </ul>
                                <p>What would you like to know today?</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chatInput" placeholder="Ask me anything about your studies...">
                        <button class="send-btn" id="sendMessage">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                <button class="chat-toggle-btn" id="chatToggle">
                    <i class="fas fa-robot"></i>
                </button>
            `;
            
            document.body.insertAdjacentHTML('beforeend', chatHTML);
        }
    }
    
    bindEvents() {
        // Toggle chat
        document.getElementById('chatToggle').addEventListener('click', () => this.toggleChat());
        
        // Close and minimize
        document.getElementById('closeChat').addEventListener('click', () => this.closeChat());
        document.getElementById('minimizeChat').addEventListener('click', () => this.minimizeChat());
        
        // Send message
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Quick action buttons
        this.setupQuickActions();
    }
    
    toggleChat() {
        const chatWidget = document.getElementById('aiChatWidget');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWidget.classList.add('active');
            document.getElementById('chatInput').focus();
        } else {
            chatWidget.classList.remove('active');
        }
    }
    
    minimizeChat() {
        document.getElementById('aiChatWidget').classList.toggle('minimized');
    }
    
    closeChat() {
        this.isOpen = false;
        document.getElementById('aiChatWidget').classList.remove('active');
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response after delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.addMessage(response, 'ai');
            this.saveToHistory(message, response);
        }, 1500 + Math.random() * 1000);
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        const avatarBg = sender === 'user' ? '#9c27b0' : '#00bcd4';
        
        messageDiv.innerHTML = `
            <div class="message-avatar" style="background: ${avatarBg}">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <p>${this.formatMessage(text)}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Subject-specific responses
        if (lowerMessage.includes('math') || lowerMessage.includes('calculus') || lowerMessage.includes('algebra')) {
            return this.getMathResponse(userMessage);
        } else if (lowerMessage.includes('biology') || lowerMessage.includes('cell') || lowerMessage.includes('science')) {
            return this.getBiologyResponse(userMessage);
        } else if (lowerMessage.includes('history') || lowerMessage.includes('war') || lowerMessage.includes('historical')) {
            return this.getHistoryResponse(userMessage);
        } else if (lowerMessage.includes('chemistry') || lowerMessage.includes('element') || lowerMessage.includes('compound')) {
            return this.getChemistryResponse(userMessage);
        } else if (lowerMessage.includes('physics') || lowerMessage.includes('force') || lowerMessage.includes('energy')) {
            return this.getPhysicsResponse(userMessage);
        } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('memorize')) {
            return this.getStudyTipsResponse(userMessage);
        } else if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
            return this.getSummaryResponse(userMessage);
        } else {
            return this.getGeneralResponse(userMessage);
        }
    }
    
    getMathResponse(question) {
        const responses = [
            "Mathematics is all about patterns and relationships. For the concept you're asking about, I'd recommend breaking it down into smaller steps and practicing with examples.",
            "That's a great math question! The key to understanding this is to visualize the problem and work through it step by step.",
            "In mathematics, this concept builds on fundamental principles. Let me explain it in simpler terms...",
            "For math problems, I suggest practicing with different variations. Would you like me to generate some practice problems for you?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getBiologyResponse(question) {
        const responses = [
            "Biology helps us understand living organisms. The concept you mentioned is fascinating because it shows how life functions at different levels.",
            "That's an interesting biology question! Living systems are complex but follow beautiful patterns. Let me break this down for you...",
            "In biology, this process is essential for life functions. It involves several interconnected systems working together.",
            "Biology concepts are often easier to understand with diagrams. Would you like me to suggest some visual learning resources?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getHistoryResponse(question) {
        const responses = [
            "History gives us context for the present. The event you're asking about was significant because it shaped many subsequent developments.",
            "That historical period was marked by important changes. Understanding the causes and effects helps us learn valuable lessons.",
            "Historical events often have multiple perspectives. It's important to consider different viewpoints when studying this topic.",
            "History comes alive when we connect it to people's stories. Would you like me to share some primary sources about this topic?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getChemistryResponse(question) {
        const responses = [
            "Chemistry explains the composition and properties of matter. The reaction you mentioned follows specific principles that govern molecular interactions.",
            "That's a fundamental chemistry concept! Understanding atomic structure and bonding will help you grasp this better.",
            "Chemical processes follow the laws of conservation and energy transfer. Let me explain how this works step by step...",
            "Chemistry often involves both theoretical concepts and practical applications. Would you like me to suggest some experiments or demonstrations?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getPhysicsResponse(question) {
        const responses = [
            "Physics describes the fundamental laws of the universe. The principle you're asking about applies to many natural phenomena.",
            "That physics concept is key to understanding how our world works. It involves mathematical relationships between different quantities.",
            "Physical laws help us predict and explain natural behavior. This particular concept has applications in various fields.",
            "Physics problems often benefit from diagrams and visual representations. Would you like me to help you visualize this concept?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getStudyTipsResponse(question) {
        const responses = [
            "Effective studying involves active recall and spaced repetition. I recommend breaking your study sessions into 25-30 minute blocks with short breaks.",
            "For better retention, try teaching the concept to someone else. This forces you to organize your understanding clearly.",
            "Creating mind maps or flashcards can help you see connections between ideas and improve long-term memory.",
            "Don't just reread material - test yourself regularly. Practice recalling information without looking at your notes."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getSummaryResponse(question) {
        const responses = [
            "I can help you create concise summaries! The key is to identify main ideas and supporting details while eliminating redundant information.",
            "For effective summarization, focus on the core concepts and their relationships. I can process your notes and extract the most important points.",
            "Summaries work best when they capture essential information in a structured way. Would you like me to analyze your study materials?",
            "A good summary should be about 20-30% of the original length while preserving the main ideas and key supporting points."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getGeneralResponse(question) {
        const responses = [
            "That's an interesting question! Based on your study patterns, I'd recommend focusing on active learning techniques for better retention.",
            "I understand you're looking for clarification. Let me check your study history and previous materials to give you the most relevant information.",
            "Great question! Learning is most effective when you connect new information to what you already know. How does this relate to other concepts you've studied?",
            "I notice you've been making good progress in your studies! Would you like me to suggest some additional resources or practice exercises?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    setupQuickActions() {
        // Add quick action buttons to chat
        const quickActions = [
            { text: "Explain this concept", icon: "fas fa-lightbulb" },
            { text: "Create study plan", icon: "fas fa-calendar" },
            { text: "Generate quiz", icon: "fas fa-question-circle" },
            { text: "Summarize notes", icon: "fas fa-file-contract" }
        ];
        
        const messagesContainer = document.getElementById('chatMessages');
        const quickActionsDiv = document.createElement('div');
        quickActionsDiv.className = 'quick-actions';
        
        quickActionsDiv.innerHTML = quickActions.map(action => `
            <button class="quick-action-btn" data-action="${action.text}">
                <i class="${action.icon}"></i>
                ${action.text}
            </button>
        `).join('');
        
        messagesContainer.appendChild(quickActionsDiv);
        
        // Bind quick action events
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.quick-action-btn').getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
    }
    
    handleQuickAction(action) {
        const responses = {
            "Explain this concept": "I'd be happy to explain this concept! Could you tell me which specific topic or idea you'd like me to break down?",
            "Create study plan": "Let me help you create an effective study plan. First, tell me about your upcoming deadlines and how much time you can dedicate to studying each day.",
            "Generate quiz": "Great idea! Quizzes help reinforce learning. Which subject would you like me to create a quiz for, and how many questions would you prefer?",
            "Summarize notes": "I can help you create concise summaries of your notes. You can upload your materials or paste the text you'd like me to summarize."
        };
        
        this.addMessage(action, 'user');
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage(responses[action] || "I'd be happy to help with that! Could you provide more details?", 'ai');
        }, 1000);
    }
    
    saveToHistory(userMessage, aiResponse) {
        this.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 messages
        if (this.conversationHistory.length > 50) {
            this.conversationHistory.shift();
        }
        
        localStorage.setItem('edumind_chat_history', JSON.stringify(this.conversationHistory));
    }
    
    loadConversationHistory() {
        const saved = localStorage.getItem('edumind_chat_history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.aiChat = new AIChat();
});

/* AI Chat Shortcuts logic - paste into aiChat.js or ai-shortcuts.js */

// Shortcut templates
const AI_SHORTCUTS = {
  summarize: {
    template: "Summarize the following text into 4-6 bullet points, short and clear:\n\n{content}",
  },
  explain: {
    template: "Explain the following concept in simple terms with an everyday analogy, keep it short:\n\n{content}",
  },
  quiz: {
    template: "Generate 5 multiple-choice questions (4 options each) and mark the correct answer for the following text:\n\n{content}",
  },
  rewrite: {
    template: "Rewrite the following text to be more concise and professional while keeping the meaning:\n\n{content}",
  }
};

// Get selected text inside aiInput or full content
function getSelectedOrInputText() {
  const input = document.getElementById('aiInput');
  if (!input) return '';
  // if selection exists inside textarea
  try {
    if (input.selectionStart !== undefined && input.selectionStart !== input.selectionEnd) {
      return input.value.substring(input.selectionStart, input.selectionEnd).trim();
    }
  } catch (e) { /* ignore */ }
  return input.value.trim();
}

function applyShortcut(key) {
  const shortcut = AI_SHORTCUTS[key];
  if (!shortcut) return;
  const input = document.getElementById('aiInput');
  if (!input) return;

  const selectedText = getSelectedOrInputText();
  const content = selectedText || input.value || '';
  const filled = shortcut.template.replace('{content}', content);

  input.value = filled;
  input.focus();
  // move cursor to end
  if (input.setSelectionRange) {
    input.setSelectionRange(input.value.length, input.value.length);
  }

  // send automatically if checkbox enabled
  const autoSend = document.getElementById('autoSendShortcut');
  if (autoSend && autoSend.checked) {
    sendMessageWrapper();
  }
}

// Hook toolbar buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.ai-shortcut');
  if (!btn) return;
  const key = btn.getAttribute('data-key');
  applyShortcut(key);
});

// Basic send function wrapper: if your project already has a send/submit function, it will call it.
// Replace or adapt window.realSendMessage if you have a different function.
function sendMessageWrapper() {
  const input = document.getElementById('aiInput');
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  // if you have a real send function, call it here. Example checks:
  if (typeof window.sendMessage === 'function') {
    // assume existing sendMessage reads from aiInput
    window.sendMessage();
    input.value = '';
    return;
  } else if (typeof sendMessage === 'function') {
    sendMessage();
    input.value = '';
    return;
  }

  // Fallback: append to local chatOutput (demo behaviour)
  const out = document.getElementById('chatOutput');
  if (out) {
    const div = document.createElement('div');
    div.className = 'chat-message user';
    div.textContent = message;
    out.appendChild(div);
    // pretend to call AI and show canned reply
    const bot = document.createElement('div');
    bot.className = 'chat-message bot';
    bot.textContent = 'Processing... (connect this to your AI handler)';
    out.appendChild(bot);
    out.scrollTop = out.scrollHeight;
    input.value = '';
  } else {
    console.log('AI message:', message);
  }
}

// Hook send button
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('#sendBtn');
  if (!btn) return;
  sendMessageWrapper();
});

// Enter to send (Shift+Enter for newline)
document.addEventListener('keydown', (e) => {
  const input = document.getElementById('aiInput');
  if (!input) return;
  if (e.key === 'Enter' && !e.shiftKey && document.activeElement === input) {
    e.preventDefault();
    sendMessageWrapper();
  }
});
