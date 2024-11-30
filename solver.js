const rotationMatrix = Uint8Array.from([
    3, 6, 3, 1, 6, 7, 7, 7, 2, 6, 4, 3, 4, 6, 1, 7, 2, 1, 7, 7,
    5, 3, 3, 1, 2, 3, 1, 2, 1, 7, 4, 7, 6, 2, 4, 4, 1, 6, 1, 5,
    6, 6, 7, 5, 7, 7, 4, 3, 1, 1, 1, 6, 3, 2, 7, 3, 7, 3, 7, 3,
    5, 6, 4, 1, 1, 3, 6, 6, 1, 4, 3, 7, 6, 7, 5, 3, 6, 7, 6, 3,
    1, 3, 5, 7, 5, 6, 2, 2, 7, 5, 7, 1, 2, 3, 2, 1, 6, 4, 5, 3
]);

function byteRol(val, shift) {
    return ((val << shift) & 0xff) | (val >> (8 - shift));
}

function nonprintable(sym) {
    return sym >= 127 || sym < 32;
}

function samsung44HexKeygen(serial) {
    if (serial.length !== 44) {
        return undefined;
    }
    let hash = new Uint8Array(22);
    let password = "";
    for (let i = 21; i >= 0; i--) {
        const low = parseInt(serial[i * 2], 16);
        const high = parseInt(serial[i * 2 + 1], 16);
        hash[21 - i] = (high << 4) | low;
    }
    const pwdLength = hash[0] >> 3;
    if (pwdLength > 20) {
        return undefined;
    }
    const key = (hash[1] % 5) * 20;
    for (let i = 0; i < pwdLength; i++) {
        const shift = rotationMatrix[key + i];
        const sym = byteRol(byteRol(hash[i + 2], shift), 4);
        if (nonprintable(sym)) {
            return undefined;
        }
        password += String.fromCharCode(sym);
    }
    return password;
}

function submit() {
  const id = document.getElementById("serials").value
  document.getElementById("password").innerHTML = samsung44HexKeygen(id);
}
