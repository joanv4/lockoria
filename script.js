var currentPage = 'home';

function showPage(pageId) {
    document.getElementById(currentPage).classList.remove('active');
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;
}

function getRandomInt(max) {
    let array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

function leetTransform(word, { allowSymbols = true, allowNumbers = true, level = "soft" } = {}) {
    const maps = {
        soft: {
            "a": allowSymbols ? "@" : "a",
            "e": allowNumbers ? "3" : "e",
            "i": allowNumbers ? "1" : "i",
            "o": allowNumbers ? "0" : "o",
            "s": allowSymbols ? "$" : "s",
            "t": allowNumbers ? "7" : "t"
        },
        hardcore: {
            "a": allowSymbols ? "@" : "a",
            "b": allowNumbers ? "8" : "b",
            "c": allowSymbols ? "(" : "c",
            "d": allowSymbols ? "|)" : "d",
            "e": allowNumbers ? "3" : "e",
            "g": allowNumbers ? "9" : "g",
            "h": allowSymbols ? "#" : "h",
            "i": allowNumbers ? "1" : "i",
            "l": allowSymbols ? "|" : "l",
            "o": allowNumbers ? "0" : "o",
            "s": allowSymbols ? "$" : "s",
            "t": allowNumbers ? "7" : "t",
            "z": allowNumbers ? "2" : "z"
        }
    };

    const map = maps[level] || maps.soft;

    return word
        .split("")
        .map(char => map[char.toLowerCase()] || char)
        .join("");
}

function getRandomChar(charset) {
    return charset[getRandomInt(charset.length)];
}

function generatePassphrase() {
    var phrase = document.getElementById('personalPhrase').value.trim();
    var numbers = document.getElementById('numbers').value;
    var yearInput = document.getElementById('yearInput').value;
    var includeSymbols = document.getElementById('symbols').value === 'yes';
    var allowNumbers = numbers !== 'none';

    if (!phrase) {
        alert('Por favor, ingresa una frase personal.');
        return;
    }

    var password = processPhrase(phrase, includeSymbols, allowNumbers);
    var explanation = 'Tu frase "' + phrase + '" se convirtió en: "' + password + '"';

    if (numbers === 'random') {
        let randomNums = "";
        for (let i = 0; i < 2; i++) randomNums += getRandomInt(10);
        password += randomNums;
        explanation += ' + números (' + randomNums + ')';
    } else if (numbers === 'year' && yearInput) {
        password += yearInput;
        explanation += ' + año (' + yearInput + ')';
    }

    if (includeSymbols) {
        let symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
        let chosenSymbol = getRandomChar(symbols);
        password += chosenSymbol;
        explanation += ' + símbolo (' + chosenSymbol + ')';
    }

    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (allowNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()-_=+[]{};:,.<>?";

    while (password.length < 12) {
        password += getRandomChar(charset);
    }

    displayResult(password, explanation);
}

function processPhrase(phrase, allowSymbols, allowNumbers) {
    return phrase.split(" ")
                 .map(word => {
                     let base = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                     return leetTransform(base, { allowSymbols, allowNumbers });
                 })
                 .join("");
}

function displayResult(password, explanation) {
    document.getElementById('generatedPassword').textContent = password;
    document.getElementById('result').style.display = 'flex';
    
    document.getElementById('explanationText').textContent = explanation;
    document.getElementById('explanation').style.display = 'block';

    var strength = calculateStrength(password);
    showStrengthMeter(strength);
}

function calculateStrength(password) {
    var score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
}

function showStrengthMeter(strength) {
    var strengthFill = document.getElementById('strengthFill');
    var strengthText = document.getElementById('strengthText');
    var strengthMeter = document.getElementById('strengthMeter');

    strengthMeter.style.display = 'block';

    var levels = [
        { class: 'strength-weak', text: '🔴 Débil - Mejora tu contraseña' },
        { class: 'strength-weak', text: '🟡 Regular - Añade más caracteres' },
        { class: 'strength-medium', text: '🟡 Buena - Casi perfecta' },
        { class: 'strength-good', text: '🟢 Muy buena - Excelente seguridad' },
        { class: 'strength-strong', text: '🔒 Excelente - Máxima seguridad' }
    ];

    var level = levels[strength] || levels[0];
    strengthFill.className = 'strength-fill ' + level.class;
    strengthText.textContent = level.text;
}

function copyPassword() {
    var password = document.getElementById('generatedPassword').textContent;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password).then(function() {
            var btn = document.querySelector('.copy-btn');
            var originalText = btn.textContent;
            btn.textContent = '✅ ¡Copiado!';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = 'linear-gradient(135deg, #56ab2f, #a8e6cf)';
            }, 2000);
        }).catch(function() {
            alert('No se pudo copiar. Selecciona y copia manualmente.');
        });
    } else {
        var textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Contraseña copiada al portapapeles');
        } catch (err) {
            alert('No se pudo copiar. Selecciona y copia manualmente.');
        }
        document.body.removeChild(textArea);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var personalPhraseInput = document.getElementById('personalPhrase');
    
    if (personalPhraseInput) {
        personalPhraseInput.addEventListener('input', function() {
            var inputElement = this;
            if (inputElement.value.trim().length > 3) {
                clearTimeout(inputElement.autoGenerateTimer);
                inputElement.autoGenerateTimer = setTimeout(function() {
                    if (inputElement.value.trim()) {
                        generatePassphrase();
                    }
                }, 1000);
            }
        });
    }
});