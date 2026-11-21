class QRGenerator {
  constructor(options = {}) {
    this.defaultOptions = {
      size: options.size || 200,
      colorDark: options.colorDark || "#000000",
      colorLight: options.colorLight || "#ffffff",
      margin: options.margin !== undefined ? options.margin : 4
    };

    // Galois Field Tables (Reed-Solomon Error Correction के लिए)
    this.EXP = new Array(256);
    this.LOG = new Array(256);
    for (let i = 0; i < 8; i++) this.EXP[i] = 1 << i;
    for (let i = 8; i < 256; i++) {
      this.EXP[i] = this.EXP[i - 4] ^ this.EXP[i - 5] ^ this.EXP[i - 6] ^ this.EXP[i - 8];
    }
    for (let i = 0; i < 255; i++) this.LOG[this.EXP[i]] = i;

    // [totalCodewords, dataCodewords, ecCodewordsPerBlock, numBlocks] (Level L)
    this.VERSIONS = [
      null,
      [26, 19, 7, 1],
      [44, 34, 10, 1],
      [70, 55, 15, 1],
      [100, 80, 20, 1],
      [134, 108, 26, 1],
      [172, 136, 18, 2],
      [196, 156, 20, 2],
      [242, 194, 24, 2],
      [292, 232, 30, 2],
      [346, 274, 18, 4]
    ];

    this.ALIGN_POS = [
      [],
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50]
    ];
  }

  _gexp(n) {
    while (n < 0) n += 255;
    while (n >= 256) n -= 255;
    return this.EXP[n];
  }

  _glog(n) {
    return this.LOG[n];
  }

  _polyMul(p1, p2) {
    const res = new Array(p1.length + p2.length - 1).fill(0);
    for (let i = 0; i < p1.length; i++) {
      for (let j = 0; j < p2.length; j++) {
        res[i + j] ^= this._gexp(this._glog(p1[i]) + this._glog(p2[j]));
      }
    }
    return res;
  }

  _polyMod(p1, p2) {
    if (p1.length - p2.length < 0) return p1;
    const ratio = this._glog(p1[0]) - this._glog(p2[0]);
    const res = p1.slice();
    for (let i = 0; i < p2.length; i++) {
      res[i] ^= this._gexp(this._glog(p2[i]) + ratio);
    }
    while (res.length > 0 && res[0] === 0) res.shift();
    return this._polyMod(res, p2);
  }

  _getECPoly(ecLen) {
    let a = [1];
    for (let i = 0; i < ecLen; i++) {
      a = this._polyMul(a, [1, this._gexp(i)]);
    }
    return a;
  }

  _createMatrix(text) {
    const bytes = Array.from(new TextEncoder().encode(String(text)));
    let ver = 1;
    while (ver <= 10 && bytes.length + 2 > this.VERSIONS[ver][1]) ver++;
    if (ver > 10) {
      throw new Error("टेक्स्ट बहुत लंबा है! कृपया छोटा लिंक या टेक्स्ट डालें।");
    }

    const [, dataCW, ecCW, blocks] = this.VERSIONS[ver];
    const bits = [];
    const pushBits = (val, len) => {
      for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    };

    pushBits(4, 4); // Byte mode
    pushBits(bytes.length, ver < 10 ? 8 : 16);
    bytes.forEach(b => pushBits(b, 8));
    pushBits(0, Math.min(4, dataCW * 8 - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);

    const data = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      data.push(b);
    }

    const pads = [0xEC, 0x11];
    let padIdx = 0;
    while (data.length < dataCW) data.push(pads[padIdx++ % 2]);

    const blockSize = Math.floor(dataCW / blocks);
    const extraBlocks = dataCW % blocks;
    const dataBlocks = [];
    const ecBlocks = [];
    let offset = 0;
    const rsPoly = this._getECPoly(ecCW);

    for (let b = 0; b < blocks; b++) {
      const len = blockSize + (b >= blocks - extraBlocks ? 1 : 0);
      const slice = data.slice(offset, offset + len);
      offset += len;
      dataBlocks.push(slice);
      const padded = slice.concat(new Array(ecCW).fill(0));
      const rem = this._polyMod(padded, rsPoly);
      const ec = new Array(ecCW - rem.length).fill(0).concat(rem);
      ecBlocks.push(ec);
    }

    const finalCodewords = [];
    const maxDataLen = Math.max(...dataBlocks.map(b => b.length));
    for (let i = 0; i < maxDataLen; i++) {
      for (let b = 0; b < blocks; b++) {
        if (i < dataBlocks[b].length) finalCodewords.push(dataBlocks[b][i]);
      }
    }
    for (let i = 0; i < ecCW; i++) {
      for (let b = 0; b < blocks; b++) {
        finalCodewords.push(ecBlocks[b][i]);
      }
    }

    const size = ver * 4 + 17;
    const mat = Array.from({ length: size }, () => new Array(size).fill(0));
    const isFunc = Array.from({ length: size }, () => new Array(size).fill(false));

    const setMod = (r, c, val, func = true) => {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        mat[r][c] = val ? 1 : 0;
        if (func) isFunc[r][c] = true;
      }
    };

    const drawFinder = (r, c) => {
      for (let dr = -1; dr <= 7; dr++) {
        for (let dc = -1; dc <= 7; dc++) {
          const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
          const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          setMod(r + dr, c + dc, inOuter && (onBorder || inInner));
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    const ap = this.ALIGN_POS[ver];
    for (let i = 0; i < ap.length; i++) {
      for (let j = 0; j < ap.length; j++) {
        const r = ap[i], c = ap[j];
        if (isFunc[r][c]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            setMod(r + dr, c + dc, Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0));
          }
        }
      }
    }

    for (let i = 8; i < size - 8; i++) {
      setMod(6, i, i % 2 === 0);
      setMod(i, 6, i % 2 === 0);
    }

    // Format Info रिजर्व एरिया
    for (let i = 0; i < 9; i++) {
      if (i !== 6) {
        setMod(8, i, 0);
        setMod(i, 8, 0);
      }
    }
    for (let i = 0; i < 8; i++) {
      setMod(8, size - 1 - i, 0);
      setMod(size - 1 - i, 8, 0);
    }
    setMod(size - 8, 8, 1);

    // Version Info रिजर्व एरिया
    if (ver >= 7) {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
          setMod(i, size - 11 + j, 0);
          setMod(size - 11 + j, i, 0);
        }
      }
    }

    // Data Bits भरना
    const allBits = [];
    finalCodewords.forEach(cw => {
      for (let i = 7; i >= 0; i--) allBits.push((cw >>> i) & 1);
    });

    let bitIdx = 0, up = true;
    for (let c = size - 1; c > 0; c -= 2) {
      if (c === 6) c--;
      for (let i = 0; i < size; i++) {
        const r = up ? size - 1 - i : i;
        for (let dc = 0; dc < 2; dc++) {
          const cc = c - dc;
          if (!isFunc[r][cc]) {
            const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
            const masked = ((r + cc) % 2 === 0) ? (bit ^ 1) : bit;
            mat[r][cc] = masked;
          }
        }
      }
      up = !up;
    }

    // Format Information (Level L, Mask 0 -> 0x77C4)
    const fmt = 0x77C4;
    for (let i = 0; i < 15; i++) {
      const bit = (fmt >>> i) & 1;

      if (i < 6) mat[i][8] = bit;
      else if (i < 8) mat[i + 1][8] = bit;
      else mat[size - 15 + i][8] = bit;

      if (i < 8) mat[8][size - 1 - i] = bit;
      else if (i < 9) mat[8][15 - i] = bit;
      else mat[8][14 - i] = bit;
    }

    // Version Information (ver >= 7)
    if (ver >= 7) {
      const VER_BITS = [0, 0, 0, 0, 0, 0, 0, 0x07C94, 0x085BC, 0x09A99, 0x0A4D3];
      const vb = VER_BITS[ver];
      for (let i = 0; i < 18; i++) {
        const bit = (vb >>> i) & 1;
        const r = Math.floor(i / 3);
        const c = size - 11 + (i % 3);
        mat[r][c] = bit;
        mat[c][r] = bit;
      }
    }

    return mat;
  }

  // 1. Canvas बनाना
  createCanvas(text, customOpts = {}) {
    const opts = { ...this.defaultOptions, ...customOpts };
    const mat = this._createMatrix(text);
    const count = mat.length;
    const total = count + opts.margin * 2;
    const scale = Math.max(4, Math.floor(opts.size / total));
    const dim = total * scale;

    const canvas = document.createElement("canvas");
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = opts.colorLight;
    ctx.fillRect(0, 0, dim, dim);

    ctx.fillStyle = opts.colorDark;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (mat[r][c] === 1) {
          ctx.fillRect((c + opts.margin) * scale, (r + opts.margin) * scale, scale, scale);
        }
      }
    }
    return canvas;
  }

  // 2. Base64 PNG URL पाना
  toDataURL(text, customOpts = {}) {
    return this.createCanvas(text, customOpts).toDataURL("image/png");
  }

  // 3. किसी भी HTML टैग या सेलेक्टर में QR रेंडर करना
  render(target, text, customOpts = {}) {
    const elements = typeof target === "string"
      ? document.querySelectorAll(target)
      : target instanceof NodeList || Array.isArray(target)
        ? target
        : [target];

    if (!elements || elements.length === 0) {
      throw new Error("टारगेट HTML एलिमेंट नहीं मिला!");
    }

    elements.forEach(el => {
      if (!el) return;
      const tag = el.tagName.toLowerCase();

      if (tag === "img") {
        el.src = this.toDataURL(text, customOpts);
      } else if (tag === "canvas") {
        const tempCanvas = this.createCanvas(text, customOpts);
        el.width = tempCanvas.width;
        el.height = tempCanvas.height;
        el.getContext("2d").drawImage(tempCanvas, 0, 0);
      } else {
        el.innerHTML = "";
        el.appendChild(this.createCanvas(text, customOpts));
      }
    });
  }

  // 4. सीधे PNG डाउनलोड कराना
  download(text, filename = "qrcode.png", customOpts = {}) {
    const link = document.createElement("a");
    link.href = this.toDataURL(text, customOpts);
    link.download = filename;
    link.click();
  }
}
