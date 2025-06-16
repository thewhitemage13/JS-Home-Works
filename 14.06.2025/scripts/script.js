function simulateAsyncTask(timeout, fail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const timeNow = new Date().toLocaleTimeString('uk-UA');
            if (fail) {
                reject(`${timeNow} — операція завершилася з помилкою`);
            } else {
                resolve(`${timeNow} — операція успішно завершена`);
            }
        }, timeout);
    });
}

function displayNotification(msg, isError = false) {
    const container = document.getElementById('resultDisplay');
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${isError ? 'alert-danger' : 'alert-success'} mt-3`;
    alertBox.textContent = msg;
    container.appendChild(alertBox);
}

document.getElementById('runThenBtn').addEventListener('click', () => {
    const timeoutValue = parseInt(document.getElementById('timeoutInput').value, 10) || 1000;
    const errorExpected = document.getElementById('resultFailure').checked;
    const callTime = new Date().toLocaleTimeString('uk-UA');
    displayNotification(`${callTime} — виклик через .then`);

    simulateAsyncTask(timeoutValue, errorExpected)
        .then(successMsg => displayNotification(successMsg))
        .catch(errorMsg => displayNotification(errorMsg, true));
});

document.getElementById('runAwaitBtn').addEventListener('click', async () => {
    const timeoutValue = parseInt(document.getElementById('timeoutInput').value, 10) || 1000;
    const errorExpected = document.getElementById('resultFailure').checked;
    const callTime = new Date().toLocaleTimeString('uk-UA');
    displayNotification(`${callTime} — виклик через await`);

    try {
        const successMsg = await simulateAsyncTask(timeoutValue, errorExpected);
        displayNotification(successMsg);
    } catch (errorMsg) {
        displayNotification(errorMsg, true);
    }
});
