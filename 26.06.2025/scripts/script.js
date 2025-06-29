window.encoderUtil = new TextCoderUtil();

document.addEventListener('DOMContentLoaded', () => {
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');

    if (!encodeBtn) throw new Error("Кнопка кодування не знайдена (#encodeBtn)");
    if (!decodeBtn) throw new Error("Кнопка декодування не знайдена (#decodeBtn)");

    encodeBtn.addEventListener('click', handleEncode);
    decodeBtn.addEventListener('click', handleDecode);
});

function handleEncode() {
    const input = document.getElementById('inputText');
    const output = document.getElementById('outputText');

    if (!input || !output) return;

    output.value = window.encoderUtil.encodeText(input.value.trim());
}

function handleDecode() {
    const input = document.getElementById('inputText');
    const output = document.getElementById('outputText');

    if (!input || !output) return;

    try {
        output.value = window.encoderUtil.decodeText(input.value.trim());
    } catch (e) {
        output.value = 'Помилка декодування: ' + e.message;
    }
}
