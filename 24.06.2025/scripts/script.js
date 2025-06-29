const authContent = `<button id="exit-button" class="btn btn-danger">Вихід з системи</button>`;
const anonContent = `<button id="auth-button" class="btn btn-dark">Вхід до системи</button>`;

document.addEventListener('DOMContentLoaded', () => {
    updateAuthBlock();
});

function authenticate() {
    const payload = {
        user: "Мухаммед",
        timestamp: new Date().toISOString()
    };
    const token = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

    return new Promise((resolve) => {
        setTimeout(() => resolve(token), 600);
    });
}

function decodeToken(token) {
    try {
        const decoded = decodeURIComponent(escape(atob(token)));
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Помилка декодування токену:", e);
        return null;
    }
}

function isTokenValid(payload) {
    if (!payload || !payload.timestamp) return { isValid: false };

    try {
        const tokenDate = new Date(payload.timestamp);
        const now = new Date();
        const validUntil = new Date(tokenDate.getTime() + 24 * 60 * 60 * 1000);
        return {
            isValid: now < validUntil,
            validUntil,
            timeLeft: validUntil - now
        };
    } catch (e) {
        console.error("Помилка перевірки токену:", e);
        return { isValid: false };
    }
}

function formatTimeLeft(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours} год. ${minutes} хв.`;
    if (minutes > 0) return `${minutes} хв. ${seconds} сек.`;
    return `${seconds} сек.`;
}

function updateListeners() {
    const authBtn = document.getElementById("auth-button");
    if (authBtn) authBtn.onclick = authBtnClick;

    const exitBtn = document.getElementById("exit-button");
    if (exitBtn) exitBtn.onclick = exitBtnClick;
}

function authBtnClick() {
    authenticate()
        .then(token => {
            localStorage.setItem('token', token);
            updateAuthBlock();
        })
        .catch(() => {
            showErrorModal("Помилка входу в систему");
        });
}

function exitBtnClick() {
    localStorage.removeItem('token');
    updateAuthBlock();
    showInfoModal("Сесія завершена", "Ви успішно вийшли з системи");
}

function updateAuthBlock() {
    const authBlock = document.getElementById("auth-block");
    if (!authBlock) return;

    const token = localStorage.getItem('token');

    if (token) {
        const payload = decodeToken(token);
        const validity = isTokenValid(payload);

        if (!validity.isValid) {
            exitBtnClick();
            return;
        }

        authBlock.innerHTML = authContent;

        const userInfo = document.createElement("div");
        userInfo.className = "user-info mt-3 p-3 bg-light rounded";

        const name = document.createElement("h5");
        name.innerHTML = `<i class="bi bi-person-fill"></i> Користувач: <strong>${payload.user}</strong>`;

        const timestamp = document.createElement("div");
        const tokenDate = new Date(payload.timestamp);
        timestamp.innerHTML = `
            <div class="d-flex align-items-center mb-1">
                <i class="bi bi-clock-history me-2"></i>
                <span>Час авторизації: <strong>${tokenDate.toLocaleString('uk-UA')}</strong></span>
            </div>
            <div class="d-flex align-items-center">
                <i class="bi bi-calendar-check me-2"></i>
                <span>Дійсний до: <strong class="text-dark">${validity.validUntil.toLocaleString('uk-UA')}</strong></span>
            </div>
        `;

        userInfo.appendChild(name);
        userInfo.appendChild(timestamp);
        authBlock.appendChild(userInfo);

        if (!authBlock.dataset.authenticated) {
            showWelcomeModal(payload.user, validity);
            authBlock.dataset.authenticated = "true";
        }
    } else {
        authBlock.innerHTML = anonContent;
        authBlock.removeAttribute('data-authenticated');
    }

    updateListeners();
}

function showWelcomeModal(userName, validity) {
    const userNameElement = document.getElementById('userName');
    const timeLeftElement = document.getElementById('modal-time-left');
    const modalElement = document.getElementById('welcomeModal');

    if (userNameElement && timeLeftElement && modalElement) {
        userNameElement.textContent = userName;
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        const timerInterval = setInterval(() => {
            const timeLeft = validity.validUntil - new Date();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timeLeftElement.innerHTML = `<span class="text-danger">Термін дії закінчився</span>`;
                setTimeout(() => {
                    modal.hide();
                    exitBtnClick();
                }, 3000);
            } else {
                timeLeftElement.innerHTML = `
                    <span class="text-danger">${formatTimeLeft(timeLeft)}</span>
                    <small class="text-muted">(до ${validity.validUntil.toLocaleTimeString('uk-UA')})</small>
                `;
            }
        }, 1000);

        modalElement.addEventListener('hidden.bs.modal', () => {
            clearInterval(timerInterval);
        });
    }
}

function showInfoModal(title, message) {
    const modalHTML = `
        <div class="modal fade" id="infoModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <i class="bi bi-info-circle-fill" style="font-size: 3rem;"></i>
                        <p class="mt-3">${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = modalHTML;
    document.body.appendChild(container);
    const modal = new bootstrap.Modal(container.querySelector('#infoModal'));
    modal.show();
    container.querySelector('.modal').addEventListener('hidden.bs.modal', () => {
        container.remove();
    });
}

function showErrorModal(message) {
    const modalHTML = `
        <div class="modal fade" id="errorModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Помилка</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 3rem;"></i>
                        <p class="mt-3">${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Зрозуміло</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = modalHTML;
    document.body.appendChild(container);
    const modal = new bootstrap.Modal(container.querySelector('#errorModal'));
    modal.show();
    container.querySelector('.modal').addEventListener('hidden.bs.modal', () => {
        container.remove();
    });
}