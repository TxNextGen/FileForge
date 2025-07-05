class FileConverter {
    constructor() {
        this.selectedFiles = [];
        this.convertedFiles = [];
        this.supportedFormats = {
            images: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'heic', 'heif'],
            documents: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'html'],
            audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'],
            video: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', 'ogv']
        };
        
        this.backendUrl = 'https://your-app-name.onrender.com'; 
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupQualitySlider();
        this.loadSupportedFormats();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.querySelector('.browse-btn');
        const uploadZone = document.getElementById('uploadZone');

        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        const convertBtn = document.getElementById('convertBtn');
        convertBtn.addEventListener('click', () => this.startConversion());
        const clearBtn = document.getElementById('clearBtn');
        clearBtn.addEventListener('click', () => this.clearAllFiles());
        const formatSelect = document.getElementById('outputFormat');
        formatSelect.addEventListener('change', () => this.validateConversion());
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        downloadAllBtn.addEventListener('click', () => this.downloadAll());
        const batchConvertBtn = document.getElementById('batchConvertBtn');
        if (batchConvertBtn) {
            batchConvertBtn.addEventListener('click', () => this.startBatchConversion());
        }
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    setupDragAndDrop() {
        const uploadZone = document.getElementById('uploadZone');

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        uploadZone.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
    }

    setupQualitySlider() {
        const qualitySlider = document.getElementById('quality');
        const qualityValue = document.querySelector('.quality-value');

        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = `${e.target.value}%`;
        });
    }

    async loadSupportedFormats() {
        try {
            const response = await fetch(`${this.backendUrl}/api/formats`);
            if (response.ok) {
                const formats = await response.json();
                this.supportedFormats = formats;
            }
        } catch (error) {
            console.warn('Could not load supported formats from backend, using defaults');
        }
    }

    handleFiles(files) {
        const fileArray = Array.from(files);
        
        fileArray.forEach(file => {
            if (this.isValidFile(file)) {
                this.selectedFiles.push({
                    file: file,
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    extension: this.getFileExtension(file.name)
                });
            } else {
                this.showNotification(`File "${file.name}" is not supported`, 'error');
            }
        });

        this.updateFileList();
        this.showConversionOptions();
    }

    isValidFile(file) {
        const extension = this.getFileExtension(file.name).toLowerCase();
        const allFormats = [
            ...this.supportedFormats.images,
            ...this.supportedFormats.documents,
            ...this.supportedFormats.audio,
            ...this.supportedFormats.video
        ];
        
        return allFormats.includes(extension) && file.size <= 100 * 1024 * 1024; // 100MB limit
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    getFileType(extension) {
        for (const [type, formats] of Object.entries(this.supportedFormats)) {
            if (formats.includes(extension)) {
                return type;
            }
        }
        return 'unknown';
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        const filesContainer = document.getElementById('filesContainer');

        if (this.selectedFiles.length === 0) {
            fileList.style.display = 'none';
            return;
        }

        fileList.style.display = 'block';
        filesContainer.innerHTML = '';

        this.selectedFiles.forEach(fileData => {
            const fileItem = this.createFileItem(fileData);
            filesContainer.appendChild(fileItem);
        });
    }

    createFileItem(fileData) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    ${this.getFileIcon(fileData.extension)}
                </div>
                <div class="file-details">
                    <h4>${fileData.name}</h4>
                    <p>${this.formatFileSize(fileData.size)} • ${fileData.extension.toUpperCase()}</p>
                </div>
            </div>
            <button class="remove-file" data-file-id="${fileData.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        const removeBtn = fileItem.querySelector('.remove-file');
        removeBtn.addEventListener('click', () => this.removeFile(fileData.id));
        
        return fileItem;
    }

    getFileIcon(extension) {
        const type = this.getFileType(extension);
        const icons = {
            images: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
            </svg>`,
            documents: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14,2H6a2,2,0,0,0-2,2V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8Z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
            </svg>`,
            audio: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
            </svg>`,
            video: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>`
        };
        return icons[type] || icons.documents;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(fileId) {
        this.selectedFiles = this.selectedFiles.filter(file => file.id !== fileId);
        this.updateFileList();
        
        if (this.selectedFiles.length === 0) {
            this.hideConversionOptions();
        }
    }

    showConversionOptions() {
        const conversionOptions = document.getElementById('conversionOptions');
        conversionOptions.style.display = 'block';
        this.updateFormatOptions();
    }

    hideConversionOptions() {
        const conversionOptions = document.getElementById('conversionOptions');
        conversionOptions.style.display = 'none';
    }

    updateFormatOptions() {
        const formatSelect = document.getElementById('outputFormat');
        const selectedTypes = [...new Set(this.selectedFiles.map(file => this.getFileType(file.extension)))];
        formatSelect.innerHTML = '<option value="">Select output format</option>';
        const formatOptions = new Set();
        selectedTypes.forEach(type => {
            if (this.supportedFormats[type]) {
                this.supportedFormats[type].forEach(format => {
                    formatOptions.add(format);
                });
            }
        });
        
        [...formatOptions].sort().forEach(format => {
            const option = document.createElement('option');
            option.value = format;
            option.textContent = format.toUpperCase();
            formatSelect.appendChild(option);
        });
    }

    validateConversion() {
        const formatSelect = document.getElementById('outputFormat');
        const convertBtn = document.getElementById('convertBtn');
        
        if (formatSelect.value && this.selectedFiles.length > 0) {
            convertBtn.disabled = false;
            convertBtn.style.opacity = '1';
        } else {
            convertBtn.disabled = true;
            convertBtn.style.opacity = '0.5';
        }
    }

    async startConversion() {
        const outputFormat = document.getElementById('outputFormat').value;
        const quality = document.getElementById('quality').value;

        if (!outputFormat) {
            this.showNotification('Please select an output format', 'error');
            return;
        }

        this.showProgressSection();
        this.hideConversionOptions();

        try {
            this.convertedFiles = [];
            
            for (let i = 0; i < this.selectedFiles.length; i++) {
                const file = this.selectedFiles[i];
                await this.convertSingleFile(file, outputFormat, quality);
                const progress = ((i + 1) / this.selectedFiles.length) * 100;
                this.updateProgress(progress);
            }
            
            this.showDownloadSection();
            this.showNotification('All files converted successfully!', 'success');
            
        } catch (error) {
            console.error('Conversion failed:', error);
            this.showNotification('Conversion failed. Please try again.', 'error');
            this.hideProgressSection();
            this.showConversionOptions();
        }
    }

    async startBatchConversion() {
        const outputFormat = document.getElementById('outputFormat').value;
        const quality = document.getElementById('quality').value;

        if (!outputFormat) {
            this.showNotification('Please select an output format', 'error');
            return;
        }

        this.showProgressSection();
        this.hideConversionOptions();

        try {
            await this.convertBatchFiles(outputFormat, quality);
            this.showDownloadSection();
            this.showNotification('Batch conversion completed!', 'success');
            
        } catch (error) {
            console.error('Batch conversion failed:', error);
            this.showNotification('Batch conversion failed. Please try again.', 'error');
            this.hideProgressSection();
            this.showConversionOptions();
        }
    }

    async convertSingleFile(fileData, outputFormat, quality) {
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('format', outputFormat);
        formData.append('quality', quality);
        const resize = document.getElementById('resize')?.value;
        const resolution = document.getElementById('resolution')?.value;
        const fps = document.getElementById('fps')?.value;
        const bitrate = document.getElementById('bitrate')?.value;

        if (resize) formData.append('resize', resize);
        if (resolution) formData.append('resolution', resolution);
        if (fps) formData.append('fps', fps);
        if (bitrate) formData.append('bitrate', bitrate);

        const response = await fetch(`${this.backendUrl}/api/convert`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
        }

        const result = await response.json();
        
        const convertedFile = {
            originalName: fileData.name,
            convertedName: result.filename,
            size: result.file_size,
            format: outputFormat,
            quality: quality,
            downloadUrl: `${this.backendUrl}${result.download_url}`,
            conversionInfo: result.conversion_info
        };
        
        this.convertedFiles.push(convertedFile);
    }

    async convertBatchFiles(outputFormat, quality) {
        const formData = new FormData();
        
        this.selectedFiles.forEach(fileData => {
            formData.append('files', fileData.file);
        });
        
        formData.append('format', outputFormat);
        formData.append('quality', quality);

        const response = await fetch(`${this.backendUrl}/api/batch-convert`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Batch conversion failed');
        }

        const result = await response.json();
        
        this.convertedFiles = result.results.map(item => ({
            originalName: item.original_filename,
            convertedName: item.converted_filename,
            size: item.file_size,
            format: outputFormat,
            quality: quality,
            downloadUrl: `${this.backendUrl}${item.download_url}`,
            success: item.success,
            error: item.error
        }));
        this.updateProgress(100);
    }

    updateProgress(progress) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% Complete`;
    }

    showProgressSection() {
        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = 'block';
        this.updateProgress(0);
    }

    hideProgressSection() {
        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = 'none';
    }

    showDownloadSection() {
        this.hideProgressSection();
        const downloadSection = document.getElementById('downloadSection');
        const downloadList = document.getElementById('downloadList');
        
        downloadList.innerHTML = '';
        
        this.convertedFiles.forEach(file => {
            const downloadItem = this.createDownloadItem(file);
            downloadList.appendChild(downloadItem);
        });
        
        downloadSection.style.display = 'block';
    }

    createDownloadItem(file) {
        const downloadItem = document.createElement('div');
        downloadItem.className = 'download-item';
        
        const statusClass = file.success !== false ? 'success' : 'error';
        const statusText = file.success !== false ? 'Ready' : 'Failed';
        
        downloadItem.innerHTML = `
            <div class="download-info">
                <div class="file-icon">
                    ${this.getFileIcon(file.format)}
                </div>
                <div class="file-details">
                    <h4>${file.convertedName}</h4>
                    <p>${this.formatFileSize(file.size)} • ${file.format.toUpperCase()}</p>
                    <span class="status status-${statusClass}">${statusText}</span>
                    ${file.error ? `<p class="error-message">${file.error}</p>` : ''}
                </div>
            </div>
            ${file.success !== false ? `
                <button class="download-btn" data-url="${file.downloadUrl}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download
                </button>
            ` : ''}
        `;
        
        
        const downloadBtn = downloadItem.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const url = downloadBtn.getAttribute('data-url');
                this.downloadFile(file.convertedName, url);
            });
        }
        
        return downloadItem;
    }

    async downloadFile(filename, url) {
        try {
        
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification(`Downloaded: ${filename}`, 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification(`Download failed: ${filename}`, 'error');
        }
    }

    downloadAll() {
        const successfulFiles = this.convertedFiles.filter(file => file.success !== false);
        
        successfulFiles.forEach(file => {
            setTimeout(() => {
                this.downloadFile(file.convertedName, file.downloadUrl);
            }, 100); 
        });
        
        this.showNotification(`Downloading ${successfulFiles.length} files`, 'success');
    }

    clearAllFiles() {
        this.selectedFiles = [];
        this.convertedFiles = [];
        this.updateFileList();
        this.hideConversionOptions();
        this.hideProgressSection();
        const downloadSection = document.getElementById('downloadSection');
        downloadSection.style.display = 'none';
        document.getElementById('fileInput').value = '';
        
        this.showNotification('All files cleared', 'info');
    }

    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.backendUrl}/api/health`);
            if (response.ok) {
                const data = await response.json();
                console.log('Backend health check:', data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Backend health check failed:', error);
            return false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    min-width: 300px;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success { background: #10b981; color: white; }
                .notification-error { background: #ef4444; color: white; }
                .notification-info { background: #3b82f6; color: white; }
                .notification-warning { background: #f59e0b; color: white; }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 1rem;
                }
                .notification-close:hover {
                    opacity: 0.8;
                }
                .status {
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                .status-success { background: #10b981; color: white; }
                .status-error { background: #ef4444; color: white; }
                .error-message {
                    color: #ef4444;
                    font-size: 0.9rem;
                    margin-top: 4px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    window.fileConverter = new FileConverter();
    const isHealthy = await window.fileConverter.checkBackendHealth();
    if (!isHealthy) {
        window.fileConverter.showNotification('Backend connection failed. Please check your server.', 'warning');
    }
});

class FileValidation {
    static validateFileSize(file, maxSize = 100 * 1024 * 1024) {
        return file.size <= maxSize;
    }

    static validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    }

    static sanitizeFilename(filename) {
        return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    }
}

class ConversionPresets {
    static getPresets() {
        return {
            'web-optimized': {
                quality: 80,
                description: 'Optimized for web usage'
            },
            'high-quality': {
                quality: 95,
                description: 'Maximum quality retention'
            },
            'compressed': {
                quality: 60,
                description: 'Smaller file size'
            }
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FileConverter, FileValidation, ConversionPresets };
}