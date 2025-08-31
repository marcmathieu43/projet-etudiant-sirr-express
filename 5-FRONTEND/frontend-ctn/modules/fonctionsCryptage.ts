export async function genererCle(): Promise<{ cleBrute: Uint8Array; cleBase64: string }> {
  const cle = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, 
    ["encrypt", "decrypt"]
  );

  const formatBrute = await crypto.subtle.exportKey("raw", cle);
  const cleBrute = new Uint8Array(formatBrute);

  const cleBase64 = btoa(String.fromCharCode(...cleBrute));

  return {
    cleBrute,
    cleBase64,
  };
}

export function cleBruteVersBase64(cle: Uint8Array): string {
  const binaryString = String.fromCharCode(...cle);
  return btoa(binaryString);
}
export function base64VersCleBrute(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


export function genererNonce(): { nonceBrut: Uint8Array; nonceBase64: string } {
  const nonceBrut = crypto.getRandomValues(new Uint8Array(12)); // 12 octets = 96 bits

  const nonceBase64 = btoa(String.fromCharCode(...nonceBrut));

  return {
    nonceBrut,
    nonceBase64,
  };
}


export async function chiffrerTexte({
  texteClair,
  cleBrute,
  nonce,
}: {
  texteClair: string;
  cleBrute: Uint8Array;
  nonce: Uint8Array;
}): Promise<string> {
  const cleCrypto = await crypto.subtle.importKey(
    "raw",
    cleBrute,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const enc = new TextEncoder();
  const donnees = enc.encode(texteClair);

  const donneesChiffrees = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
    },
    cleCrypto,
    donnees
  );

  const buffer = new Uint8Array(donneesChiffrees);
  const base64 = btoa(String.fromCharCode(...buffer));

  return base64;
}


export async function dechiffrerTexte({
  texteChiffreBase64,
  cleBrute,
  nonce,
}: {
  texteChiffreBase64: string;
  cleBrute: Uint8Array;
  nonce: Uint8Array;
}): Promise<string> {
  const cleCrypto = await crypto.subtle.importKey(
    "raw",
    cleBrute,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  const donneesChiffrees = Uint8Array.from(
    atob(texteChiffreBase64),
    (c) => c.charCodeAt(0)
  );

  const donneesDechiffrees = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: nonce,
    },
    cleCrypto,
    donneesChiffrees
  );

  const dec = new TextDecoder();
  return dec.decode(donneesDechiffrees);
}

export function assembleTokenBase64(id: string, cleAes: string): string {
  const ligne = `${id}::${cleAes}`;
  return btoa(unescape(encodeURIComponent(ligne)));
}

export function desassembleTokenBase64(cleGlobale: string): { id: string; key: string } {
  const decoded = decodeURIComponent(escape(atob(cleGlobale)));
  const [id, cleAes] = decoded.split('::');
  return { id, key: cleAes };
}
