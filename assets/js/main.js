// ================== Toast Notifications ==================
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast__container';
    document.body.appendChild(container);
    return container;
}

let toastCount = 0; // Biến đếm số lượng toast

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast__container') || createToastContainer();
    const iconClass = getIconClass(type);
    const headingText = getHeadingText(type);

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <i class="toast__icon ${iconClass}"></i>
        <div class="toast__content">
            <h3 class="toast__heading">${headingText}</h3>
            <p class="toast__message">${message}</p>
        </div>
        <button class="toast__close"><i class="fa-solid fa-xmark"></i></button>
    `;

    toast.querySelector('.toast__close').onclick = () => toast.remove();
    toastContainer.appendChild(toast);

    if (toastCount >= 3) {
        const firstToast = toastContainer.querySelector('.toast');
        if (firstToast) {
            firstToast.remove();
        }
    }

    toastCount++; // Tăng số lượng toast lên

    setTimeout(() => {
        toast.remove();
        toastCount--; // Giảm số lượng toast khi toast biến mất
    }, 3000);
}


function getIconClass(type) {
    return {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-xmark',
        warning: 'fa-solid fa-circle-exclamation',
        info: 'fa-solid fa-circle-info'
    }[type] || 'fa-solid fa-circle-info';
}

function getHeadingText(type) {
    return {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    }[type] || 'Information';
}