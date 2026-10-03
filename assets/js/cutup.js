// Burroughs Cut-Up Engine

document.addEventListener('DOMContentLoaded', () => {
  const textA = document.getElementById('textA');
  const textB = document.getElementById('textB');
  const methodSelect = document.getElementById('method');
  const cutBtn = document.getElementById('cutBtn');
  const sampleBtn = document.getElementById('sampleBtn');
  const copyBtn = document.getElementById('copyBtn');
  const output = document.getElementById('output');

  // Exempeltext inspirerad av Beat-eran
  const sampleTextA = `When you cut into the present the future leaks out. The tape recorder is a facility for reaching into the past and changing it. Words create reality, but who controls the word machine? The word is a virus from outer space.`;
  const sampleTextB = `Shift linguals. Free doorways into other dimensions. The reality studio is open for business. Break through the control grid with scissors and paste. Recombine syntax until reality fractures.`;

  // Ladda in exempeltext
  sampleBtn.addEventListener('click', () => {
    textA.value = sampleTextA;
    textB.value = sampleTextB;
  });

  // Huvudfunktion för Cut-Up
  cutBtn.addEventListener('click', () => {
    const rawA = textA.value.trim();
    const rawB = textB.value.trim();

    if (!rawA && !rawB) {
      output.textContent = "Klistra in eller skriv in text i åtminstone ett av fälten ovan...";
      return;
    }

    const method = methodSelect.value;
    let result = '';

    switch (method) {
      case 'foldin':
        result = foldInCutUp(rawA, rawB);
        break;
      case 'quadrant':
        result = quadrantCutUp(rawA || rawB);
        break;
      case 'lineInterleave':
        result = lineInterleave(rawA, rawB);
        break;
      case 'wordScramble':
        result = wordScramble((rawA + ' ' + rawB).trim());
        break;
      default:
        result = foldInCutUp(rawA, rawB);
    }

    output.textContent = result;
  });

  // Kopiera resultat
  copyBtn.addEventListener('click', () => {
    if (!output.textContent) return;
    navigator.clipboard.writeText(output.textContent).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Kopierat!';
      setTimeout(() => copyBtn.textContent = originalText, 1500);
    });
  });

  // 1. Klasisk Fold-In (Dela texten på mitten vertikalt och korsa halvorna)
  function foldInCutUp(a, b) {
    const wordsA = a.split(/\s+/).filter(Boolean);
    const wordsB = b.split(/\s+/).filter(Boolean);

    const halfA = Math.floor(wordsA.length / 2);
    const halfB = Math.floor(wordsB.length / 2);

    const leftA = wordsA.slice(0, halfA);
    const rightA = wordsA.slice(halfA);
    const leftB = wordsB.slice(0, halfB);
    const rightB = wordsB.slice(halfB);

    // Korsa: Vänster A + Höger B, Vänster B + Höger A
    const part1 = interleaveArrays(leftA, rightB);
    const part2 = interleaveArrays(leftB, rightA);

    return [...part1, "\n\n--- [FOLD CUT] ---\n\n", ...part2].join(' ');
  }

  // 2. 4-Kvadranters metod (Burroughs klassiska sida avdela i 4 delar)
  function quadrantCutUp(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) {
      const words = text.split(/\s+/);
      const q = Math.ceil(words.length / 4);
      const q1 = words.slice(0, q);
      const q2 = words.slice(q, q * 2);
      const q3 = words.slice(q * 2, q * 3);
      const q4 = words.slice(q * 3);
      
      // Slumpa ordningen på kvadranterna: 4 - 1 - 3 - 2
      return [...q4, ...q1, ...q3, ...q2].join(' ');
    }

    const mid = Math.floor(lines.length / 2);
    const top = lines.slice(0, mid);
    const bottom = lines.slice(mid);

    const q1 = top.map(l => l.slice(0, Math.floor(l.length / 2)));
    const q2 = top.map(l => l.slice(Math.floor(l.length / 2)));
    const q3 = bottom.map(l => l.slice(0, Math.floor(l.length / 2)));
    const q4 = bottom.map(l => l.slice(Math.floor(l.length / 2)));

    // Reorganisera kvadranterna diagonalist
    const resultLines = [];
    const maxLen = Math.max(q1.length, q3.length);

    for (let i = 0; i < maxLen; i++) {
      const lineLeft = (q4[i] || q3[i] || '');
      const lineRight = (q1[i] || q2[i] || '');
      resultLines.push((lineLeft + ' ' + lineRight).trim());
    }

    return resultLines.join('\n');
  }

  // 3. Rad-omflätning
  function lineInterleave(a, b) {
    const linesA = a.split('\n').filter(Boolean);
    const linesB = b.split('\n').filter(Boolean);
    const max = Math.max(linesA.length, linesB.length);
    const result = [];

    for (let i = 0; i < max; i++) {
      if (linesA[i]) result.push(linesA[i]);
      if (linesB[i]) result.push(linesB[i]);
    }

    return result.join('\n');
  }

  // 4. Slumpmässig ord-omrörning (N-Gram / Chunking)
  function wordScramble(text) {
    const words = text.split(/\s+/).filter(Boolean);
    const chunkSize = 3; // Gruppera i kluster om 3 ord
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }

    // Fisher-Yates shuffle
    for (let i = chunks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chunks[i], chunks[j]] = [chunks[j], chunks[i]];
    }

    return chunks.join(' ');
  }

  // Hjälpfunktion för att fläta samman två arrayer
  function interleaveArrays(arr1, arr2) {
    const res = [];
    const len = Math.max(arr1.length, arr2.length);
    for (let i = 0; i < len; i++) {
      if (i < arr1.length) res.push(arr1[i]);
      if (i < arr2.length) res.push(arr2[i]);
    }
    return res;
  }
});
