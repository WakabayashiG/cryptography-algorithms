
function isOnlyEnglishLetters(str) {
    let regexExp = /^[a-zA-Z]+$/;
    return regexExp.test(str);
}

export { isOnlyEnglishLetters }
