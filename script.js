document.addEventListener('DOMContentLoaded', () => {
    const uploadImage = document.getElementById('uploadImage');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const formatSelect = document.getElementById('format');
    const downloadButton = document.getElementById('downloadImage');
    const removeButton = document.getElementById('removeImage');
    const imagePreview = document.getElementById('imagePreview');
    const alertBox = document.getElementById('alert');
    const progressBar = document.getElementById('progress-bar');
    const progressBarInner = progressBar.querySelector('div');

    let currentImage = null;

    uploadImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentImage = new Image();
                currentImage.src = event.target.result;
                currentImage.onload = () => {
                    widthInput.value = currentImage.width;
                    heightInput.value = currentImage.height;
                    imagePreview.src = currentImage.src;
                    imagePreview.style.display = 'block';
                    showAlert('Image uploaded successfully!', 'success');
                };
            };
            reader.readAsDataURL(file);
        }
    });

    downloadButton.addEventListener('click', () => {
        if (!currentImage) {
            showAlert('Please upload an image first.', 'error');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

        const format = formatSelect.value;
        const dataUrl = canvas.toDataURL(`image/${format}`);
        
        progressBar.style.display = 'block';
        progressBarInner.style.width = '0%';

        setTimeout(() => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `image.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            progressBar.style.display = 'none';
            showAlert('Image downloaded successfully!', 'success');
        }, 1000);

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            progressBarInner.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 100);
    });

    removeButton.addEventListener('click', () => {
        currentImage = null;
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        uploadImage.value = '';
        widthInput.value = '';
        heightInput.value = '';
        formatSelect.value = 'png';
        showAlert('Image removed successfully!', 'success');
    });

    document.addEventListener('paste', (e) => {
        const items = (e.clipboardData || window.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentImage = new Image();
                    currentImage.src = event.target.result;
                    currentImage.onload = () => {
                        widthInput.value = currentImage.width;
                        heightInput.value = currentImage.height;
                        imagePreview.src = currentImage.src;
                        imagePreview.style.display = 'block';
                        showAlert('Image pasted successfully!', 'success');
                    };
                };
                reader.readAsDataURL(file);
                break;
            }
        }
    });

    document.addEventListener('copy', (e) => {
        if (currentImage) {
            const canvas = document.createElement('canvas');
            canvas.width = parseInt(widthInput.value);
            canvas.height = parseInt(heightInput.value);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const item = new ClipboardItem({ [blob.type]: blob });
                navigator.clipboard.write([item]).then(() => {
                    showAlert('Image copied to clipboard!', 'success');
                }).catch((err) => {
                    showAlert('Failed to copy image to clipboard.', 'error');
                });
            });
        } else {
            showAlert('No image to copy.', 'error');
        }
    });

    function showAlert(message, type) {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    }
});
.
