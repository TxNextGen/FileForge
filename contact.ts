export interface ContactInfo {
  discord: {
    username: string;
    displayName?: string;
    serverId?: string;
    inviteLink?: string;
  };
  github: {
    username: string;
    repository: string;
    repositoryUrl: string;
    profileUrl: string;
  };
  email: {
    support: string;
    general: string;
  };
  social: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export class ContactManager {
  private contactInfo: ContactInfo;

  constructor(contactInfo: ContactInfo) {
    this.contactInfo = contactInfo;
  }

 
  getDiscordInfo(): ContactInfo['discord'] {
    return this.contactInfo.discord;
  }


  getGithubInfo(): ContactInfo['github'] {
    return this.contactInfo.github;
  }

 
  getEmailInfo(): ContactInfo['email'] {
    return this.contactInfo.email;
  }


  getDiscordContactLink(): string {
    const { username, inviteLink } = this.contactInfo.discord;
    
    if (inviteLink) {
      return inviteLink;
    }
    return `https://discord.com/users/${username}`;
  }

  
  getGithubRepoLink(): string {
    return this.contactInfo.github.repositoryUrl;
  }

 
  getGithubProfileLink(): string {
    return this.contactInfo.github.profileUrl;
  }

 
  getSupportEmailLink(): string {
    return `mailto:${this.contactInfo.email.support}?subject=FileForge Support Request`;
  }

  
  generateDiscordCard(): string {
    const { username, displayName } = this.contactInfo.discord;
    const contactLink = this.getDiscordContactLink();
    
    return `
      <div class="contact-card discord-card">
        <div class="contact-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </div>
        <h3>Discord</h3>
        <p>Connect with me on Discord for quick support and community discussions</p>
        <p><strong>Username:</strong> ${displayName || username}</p>
        <a href="${contactLink}" class="contact-link" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Contact on Discord
        </a>
      </div>
    `;
  }


  generateGithubCard(): string {
    const { username } = this.contactInfo.github;
    const profileLink = this.getGithubProfileLink();
    
    return `
      <div class="contact-card github-card">
        <div class="contact-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <h3>GitHub</h3>
        <p>Check out the FileForge source code and contribute to the project</p>
        <p><strong>Username:</strong> ${username}</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="${profileLink}" class="contact-link" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            View Profile
          </a>
        </div>
      </div>
    `;
  }

 
  initializeContactPage(): void {

    const contactButtons = document.querySelectorAll('a[href="mailto:support@fileforge.com"]');
    contactButtons.forEach(button => {
      (button as HTMLAnchorElement).href = this.getSupportEmailLink();
    });


    const footerContactLinks = document.querySelectorAll('a[href=""]');
    footerContactLinks.forEach(link => {
      if (link.textContent?.toLowerCase().includes('contact')) {
        (link as HTMLAnchorElement).href = 'contact.html';
      }
    });


    this.renderContactCards();
  }


  private renderContactCards(): void {
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
      contactGrid.innerHTML = `
        ${this.generateDiscordCard()}
        ${this.generateGithubCard()}
        <div class="contact-card">
          <div class="contact-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3>Email Support</h3>
          <p>Get direct support for FileForge issues and feature requests</p>
          <a href="${this.getSupportEmailLink()}" class="contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Send Email
          </a>
        </div>
      `;
    }
  }

  
  updateContactInfo(newContactInfo: Partial<ContactInfo>): void {
    this.contactInfo = { ...this.contactInfo, ...newContactInfo };
  }

 
  getAllContactInfo(): ContactInfo {
    return this.contactInfo;
  }
}


export const defaultContactInfo: ContactInfo = {
  discord: {
    username: "txnextgen",
    displayName: "txnextgen", 
   
  },
  github: {
    username: "TxNextGen", 
    repository: "FileForge", 
    repositoryUrl: "https://github.com/TxNextGen/FileForge", 
    profileUrl: "https://github.com/TxNextGen/", 
  },
  email: {
    support: "glockbang123@gmail.com",
    general: "glockbang123@gmail.com",
  },
  social: {
    twitter: "https://twitter.com/your_username",
    linkedin: "https://linkedin.com/in/your_username", 
    website: "https://your-website.com", 
  },
};


export const contactManager = new ContactManager(defaultContactInfo);


if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    contactManager.initializeContactPage();
  });
}


export default ContactManager;