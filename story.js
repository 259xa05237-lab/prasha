/**
 * STORYTELLING & INTERACTIVE MOMENTS
 * - Chapter 02: Interactive Conversation Moment with Typing Simulator
 * - Chapter 04: Timeline Node Scroll Animations
 * - Chapter 07: Infinity Symbol Convergence Animation
 */

(function () {
  // 1. Chapter 02: Chat Simulation
  const chatStream = document.getElementById('chat-stream');
  const typingIndicator = document.getElementById('typing-indicator');
  const replayBtn = document.getElementById('replay-chat-btn');
  const chatMessages = document.querySelectorAll('.msg-item');

  let isChatAnimating = false;

  function runChatAnimation() {
    if (!chatMessages.length || isChatAnimating) return;
    isChatAnimating = true;

    // Hide all initially
    chatMessages.forEach(msg => {
      msg.style.display = 'none';
      msg.style.opacity = '0';
    });

    let currentIdx = 0;

    function showNextMessage() {
      if (currentIdx >= chatMessages.length) {
        if (typingIndicator) typingIndicator.style.display = 'none';
        isChatAnimating = false;
        return;
      }

      if (typingIndicator) {
        typingIndicator.style.display = 'flex';
      }

      setTimeout(() => {
        if (typingIndicator) typingIndicator.style.display = 'none';
        const msg = chatMessages[currentIdx];
        if (msg) {
          msg.style.display = 'block';
          setTimeout(() => {
            msg.style.opacity = '1';
          }, 50);
        }
        currentIdx++;
        setTimeout(showNextMessage, 1100);
      }, 700);
    }

    showNextMessage();
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      runChatAnimation();
    });
  }

  // Trigger chat animation once when user scrolls to Chapter 02
  const chatSection = document.getElementById('chapter-conversations');
  if (chatSection && 'IntersectionObserver' in window) {
    let chatTriggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !chatTriggered) {
          chatTriggered = true;
          runChatAnimation();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(chatSection);
  }

  // 2. Chapter 04: Timeline Fade-In Observer
  const timelineNodes = document.querySelectorAll('.timeline-node');
  if (timelineNodes.length && 'IntersectionObserver' in window) {
    const nodeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.2 });

    timelineNodes.forEach(node => {
      node.style.opacity = '0';
      node.style.transform = 'translateY(30px)';
      node.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      nodeObserver.observe(node);
    });
  }

  // 3. Step cards animation in Chapter 01
  const stepCards = document.querySelectorAll('.step-card');
  if (stepCards.length && 'IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 150);
        }
      });
    }, { threshold: 0.2 });

    stepCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      stepObserver.observe(card);
    });
  }
})();
