   async function loadTypeScript() {
            try {
                const response = await fetch('contact.ts');
                const tsCode = await response.text();
                const jsCode = ts.transpile(tsCode, {
                    target: ts.ScriptTarget.ES2015,
                    module: ts.ModuleKind.ES2015
                });
                const blob = new Blob([jsCode], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                const module = await import(url);
                
                if (module.contactManager) {
                    module.contactManager.initializeContactPage();
                }
                
                
                URL.revokeObjectURL(url);
                
            } catch (error) {
                console.error('Error loading TypeScript:', error);
             
                document.querySelector('.contact-grid').innerHTML = `
                    <div class="contact-card">
                        <h3>Loading Error</h3>
                        <p>Unable to load contact information. Please make sure Contact.ts is in the js/ directory.</p>
                    </div>
                `;
            }
        }
        
        document.addEventListener('DOMContentLoaded', loadTypeScript);