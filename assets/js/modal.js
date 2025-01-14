document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.querySelector('.close-btn');
  
    // Define content for each modal
    const modalContent = {
      "modal-1": {
        title: "Fraud Detection",
        description: "This project focuses on detecting fraud in financial transactions using advanced machine learning algorithms.",
      },
      "modal-2": {
        title: "Multi-Cam Bird’s Eye",
        description: "A project that combines multiple camera feeds to create a bird’s-eye view for enhanced surveillance and monitoring.",
      },
      "modal-3": {
        title: "Quantum-Resistant Transaction Security",
        description: "A project that explores quantum-resistant cryptographic methods for use in online banking systems.",
      },
      // Add more entries for each project block
    };
  
    // Event listener for each project link
    document.querySelectorAll('.service-item .stretched-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
  
        const modalId = link.getAttribute('data-id'); // Get the data-id of the clicked link
        const content = modalContent[modalId]; // Retrieve content based on the data-id
  
        if (content) {
          modalTitle.textContent = content.title; // Update modal title
          modalDescription.textContent = content.description; // Update modal description
          modal.style.display = 'block'; // Show the modal
        }
      });
    });
  
    // Close the modal when clicking the close button
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  