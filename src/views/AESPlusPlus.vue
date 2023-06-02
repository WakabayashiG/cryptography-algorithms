<template>
  <div>
    <a-tabs type="card" default-active-key="1">
      <a-tab-pane key="1" tab="Encryption">
        <a-row>
          <a-col :span="12">
            <a-card>
              <a-form-item label="Encryption Key: ">
                <a-input placeholder="Enter encryption key" v-model:value="key" />
                <div v-if="hasError">
                  <a-alert type="error" message="Length of encryption key should be 16 for 128 bits key size" banner />
                </div>
              </a-form-item>

              <a-form-item label="Plain Text: ">
                <a-textarea :rows="7" v-model:value="plainText" placeholder="Enter plain text to be encrypted"/>
              </a-form-item>

              <a-form-item>
                <a-button type="primary" :style="{ width: '100%' }" @click="encrypt">
                  Encrypt
                </a-button>
              </a-form-item>
            </a-card>
            <a-divider />
            <a-card>
              <a-form-item label="Cipher Text: ">
                <a-textarea :rows="7" :disabled="true" v-model:value="cipherText" />
              </a-form-item>
            </a-card>

          </a-col>

          <a-col :span="11" :offset="1">
            <a-card>
              <a-form-item label="LOGS: ">
                <a-textarea :rows="31"  v-model:value="LOGS.join('\n')" />
              </a-form-item>
            </a-card>
          </a-col>
        </a-row>
        <a-row style="padding-top: 25px">
          <a-table bordered :data-source="asciiTableData" :columns="asciiTableColumns" :pagination="false" size="small" :rowKey="(record) => record.dec" style="width: 550px">
          </a-table>

        </a-row>

      </a-tab-pane>
      <a-tab-pane key="2" tab="Decryption">
        <a-row>
          <a-col :span="12">
            <a-card>
              <a-form-item label="Encryption Key: ">
                <a-input placeholder="Enter encryption key" v-model:value="key" />
                <div v-if="hasError">
                  <a-alert type="error" message="Length of encryption key should be 16 for 128 bits key size" banner />
                </div>
              </a-form-item>

              <a-form-item label="Cipher Text: ">
                <a-textarea :rows="7" v-model:value="cipherText" placeholder="Enter cipher text to be decrypted"/>
              </a-form-item>

              <a-form-item>
                <a-button type="primary" :style="{ width: '100%' }" @click="decrypt">
                  Decrypt
                </a-button>
              </a-form-item>
            </a-card>
            <a-divider />
            <a-card>
              <a-form-item label="Plain Text: ">
                <a-textarea :rows="7" :disabled="true" v-model:value="plainText" />
              </a-form-item>
            </a-card>

          </a-col>

          <a-col :span="11" :offset="1">
            <a-card>
              <a-form-item label="LOGS: ">
                <a-textarea :rows="31"  v-model:value="LOGS.join('\n')" />
              </a-form-item>
            </a-card>
          </a-col>
        </a-row>

      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>



// https://kb.iu.edu/d/afdl
// https://xor.pw

// Thats my Kung Fu
// Two One Nine Two Three

import {AES_INVERSE_SBOX, AES_SBOX} from "@/utils/aes.constants";

export default {
  name: "AESPlusPlus",

  data() {
    return {
      hasError: false,
      ROUND: 3,
      asciiTableData: this.getAsciiTableData(),
      asciiTableColumns: this.getAsciiTableColumns(),
      LOGS: [],
      plainText: '',
      cipherText: '',
      key: '',
      blockStates: [],
      keyState: []
    };
  },



  methods: {

    getAsciiTableData() {
      let table = [];
      for (let i = 0; i <= 255; i++) {
        let hex = i.toString(16);
        if (hex.length < 2) hex = '0' + hex;
        table.push({
          dec: i,
          hex: hex,
          char: String.fromCharCode(i),
        });
      }

      return table;
    },

    getAsciiTableColumns() {
      return [
        {
          title: 'Decimal',
          dataIndex: 'dec',
          key: 'dec',
          width: 10,
        },
        {
          title: 'Hexadecimal',
          dataIndex: 'hex',
          key: 'address',
          width: 10,
        },
        {
          title: 'Character',
          dataIndex: 'char',
          key: 'char',
          width: 100,
        },
      ];
    },


    createBlocks(message) {
      let blocks = [];
      for (let i = 0; i < message.length; i += 16) {
        let block = message.substr(i, 16);
        while (block.length < 16) block += '\0'; // Add padding
        blocks.push(block);
      }
      return blocks;
    },

     createMatrix(block) {
        let matrix = [];
        for (let i = 0; i < 4; i++) {
          let row = [];
          for (let j = 0; j < 4; j++) {
            let char = block[j * 4 + i];
            let hex = char.charCodeAt(0).toString(16);
            row.push(this.padStart(hex, 2, '0'));
          }
          matrix.push(row);
        }
        return matrix;
    },

    decrypt() {
      this.reset();
      this.createState(this.hexToText(this.cipherText));
      this.LOGS.push("================ DECRYPTING ================")

      let roundKeys = this.keyExpansion(this.key, this.ROUND);
      let plainTextBlocks = [];
      let cipherTextBlocks = this.blockStates;

      for(let i = cipherTextBlocks.length - 1; i >= 0; i--) {
        this.LOGS.push("=========== BLOCK[" + i + "] ===========")

        let block = cipherTextBlocks[i]
        for (let r = this.ROUND; r >= 1; r--) {
          this.LOGS.push("=========== BLOCK[" + i + "] ROUND[" + r + "] ===========")

          block = this.addRoundKey(block, roundKeys[r-1])
          block = this.swapRows(block)
          block = this.shiftRows(block, true);
          block = this.sBOX(block, true);
          block = this.adaptiveCaesarBOX(block, this.key, true)
          // block = this.mixColumns(block);
          // block = this.addRoundKey(block);
          this.LOGS.push("=========== /BLOCK[" + i + "] ROUND[" + r + "] ===========")
        }

        if(i === 0)
          block = this.xor(block, this.keyState)
        else
          block = this.xor(block, cipherTextBlocks[i-1])

        plainTextBlocks.unshift(block)
      }

      this.plainText = this.hexToText(this.mergeBlocks(plainTextBlocks))

    },

    encrypt () {
      this.reset();
      this.createState(this.plainText);


      this.LOGS.push("================ ENCRYPTING ================")

      let roundKeys = this.keyExpansion(this.key, this.ROUND);
      let cipherTextBlocks = [];

      for(let i = 0; i < this.blockStates.length; i++) {

        this.LOGS.push("=========== BLOCK[" + i + "] ===========")

        let block = this.blockStates[i]
        if(i === 0)
          block = this.xor(block, this.keyState)
        else
          block = this.xor(block, cipherTextBlocks[i-1])

        for (let r = 0; r < this.ROUND; r++) {
          this.LOGS.push("=========== BLOCK[" + i + "] ROUND[" + r + "] ===========")
          block = this.adaptiveCaesarBOX(block, this.key)
          block = this.sBOX(block)
          block = this.shiftRows(block);
          block = this.swapRows(block)
          block = this.addRoundKey(block, roundKeys[r])
          this.LOGS.push("=========== /BLOCK[" + i + "] ROUND[" + r + "] ===========")
        }

        cipherTextBlocks.push(block)
        this.LOGS.push("=========== /BLOCK[" + i + "] ===========")
      }

       this.cipherText = this.mergeBlocks(cipherTextBlocks)
    },

    xor(matrix1, matrix2) {
      this.LOGS.push("# xor")

      let resultMatrix = [];

      for(let i = 0; i < matrix1.length; i++) {
        let row = [];
        for(let j = 0; j < matrix1[i].length; j++) {
          let xorValue = parseInt(matrix1[i][j], 16) ^ parseInt(matrix2[i][j], 16);
          let xorValueAsStr = xorValue.toString(16).toLowerCase();
          row.push(this.padStart(xorValueAsStr, 2, '0'));
        }
        resultMatrix.push(row);
      }

      this.LOGS.push("M1:")
      this.LOGS.push(this.prettyPrintMatrix(matrix1))
      this.LOGS.push("---")
      this.LOGS.push("M2:")
      this.LOGS.push(this.prettyPrintMatrix(matrix2))
      this.LOGS.push("---")
      this.LOGS.push("M1 ^ M2:")
      this.LOGS.push(this.prettyPrintMatrix(resultMatrix))
      this.LOGS.push("----------------")
      return resultMatrix;
    },


    adaptiveCaesarBOX(block, encryptionKey, inverse = false) {
      this.LOGS.push("# adaptiveCaesarBOX LAYER")
      let shift = this.deriveCaesarShiftFromKey(encryptionKey)

      for (let i = 0; i < block.length; i++) {
        for (let j = 0; j < block[i].length; j++) {
          let decimal = parseInt(block[i][j], 16);
          decimal = inverse ? decimal - shift : decimal + shift;

          if (decimal < 0)
            decimal += 256;
          else if (decimal > 255)
            decimal -= 256;

          let hex = decimal.toString(16);
          if (hex.length < 2) hex = '0' + hex;
          block[i][j] = hex;
        }
      }

      this.LOGS.push("Caesar_Shift_Key:" + shift)
      this.LOGS.push(this.prettyPrintMatrix(block))
      this.LOGS.push("----------------")
      return block;
    },

    deriveCaesarShiftFromKey(key) {
      let shift = 0;
      for (let i = 0; i < key.length; i++) {
        shift += ( key.charCodeAt(i) * (i + 1) );
      }
      this.LOGS.push("SUM:" + shift)
      return shift % 26;
    },


    sBOX(block, inverse = false) {
      this.LOGS.push("#sBOX LAYER")
      block = this.applySBOX(block, inverse)
      this.LOGS.push(this.prettyPrintMatrix(block))
      this.LOGS.push("----------------")
      return block;
    },

    applySBOX(block, inverse) {
      for (let i = 0; i < block.length; i++) {
        for (let j = 0; j < block[i].length; j++) {
          let hexValue = block[i][j];
          let rowHex = hexValue[0];
          let colHex = hexValue[1];

          let rowIndex = parseInt(rowHex, 16);
          let colIndex = parseInt(colHex, 16);

          let newValue = inverse ? AES_INVERSE_SBOX[rowIndex][colIndex] : AES_SBOX[rowIndex][colIndex];
          block[i][j] = this.padStart(newValue.toString(16), 2, '0')
        }
      }

      return block;
    },

    shiftRows(block, inverse = false) {
      this.LOGS.push("# shiftRows LAYER")
      let shiftedBlock = [];
      for (let i = 0; i < 4; i++) {
        let row = block[i];
        let shiftedRow = inverse ? row.slice(4 - i).concat(row.slice(0, 4 - i)) // Saga kaydırma
            : row.slice(i).concat(row.slice(0, i)); // Sola kaydırma
        shiftedBlock.push(shiftedRow);
      }
      this.LOGS.push(this.prettyPrintMatrix(shiftedBlock))
      this.LOGS.push("----------------")
      return shiftedBlock;
    },

    swapRows(block) {
      this.LOGS.push("# swapRows LAYER")
      let temp = block[0];
      block[0] = block[3];
      block[3] = temp;

      temp = block[1];
      block[1] = block[2];
      block[2] = temp;
      this.LOGS.push(this.prettyPrintMatrix(block))
      return block;
    },


    addRoundKey(block, roundKey) {
      this.LOGS.push("# addRoundKey")
      block = this.xor(block, roundKey)
      this.LOGS.push("----------------")
      return block;
    },

    mergeBlocks(cipherTextBlocks) {
      let cipherText = [];
      cipherTextBlocks.forEach(matrix => {
        for(let j = 0; j < matrix[0].length; j++) {
          for(let i = 0; i < matrix.length; i++) {
            cipherText.push(matrix[i][j]);
          }
        }
      });
      return cipherText.join('');
    },

    padStart(str, targetLength, padString) {
      targetLength = targetLength >> 0; // convert to integer
      padString = String(padString || ' ');
      if (str.length >= targetLength) {
        return String(str);
      } else {
        targetLength = targetLength - str.length;
        if (targetLength > padString.length) {
          padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(str);
      }
    },

    keyExpansion(key, roundCount) {
      if (key.length != 16) {
        throw "Key must be 128 bits!";
      }

      this.LOGS.push("Key Schedule")

      let roundKeys = [];
      for (let round = 0; round < roundCount; round++) {
        let roundKey = []
        if (round > 0) {
          roundKey = roundKeys[round - 1].map(arr => [...arr]);
        } else {
          roundKey = this.createMatrix(key)
        }

        for (let j = round; j < round + 1; j++) {
          roundKey = this.applySBOX(roundKey);
        }

        this.LOGS.push(roundKey)
        roundKeys.push(roundKey);
      }
      this.LOGS.push("---------")
      return roundKeys;
    },


    textToHex(text, pretty = false) {
      let hex = '';
      for(let i=0;i<text.length;i++) {
        hex += text.charCodeAt(i).toString(16);
        hex += pretty ? ' ' : ''
      }
      return hex.trim();
    },


    hexToText(hexString) {
      let text = '';
      for (let i = 0; i < hexString.length; i += 2) {
        const hexChar = hexString.slice(i, i + 2);
        text += String.fromCharCode(parseInt(hexChar, 16));
      }
      return text;
    },

    reset() {
      this.blockStates = []
      this.LOGS = []
    },


    createState(message) {
      let blocks = this.createBlocks(message);
      for(let i=0; i<blocks.length; i++) {

        let blockState = this.createMatrix(blocks[i]);
        this.blockStates.push(blockState);

        this.LOGS.push(`BLOCK-${i}:${blocks[i]}`)
        this.LOGS.push(`BLOCK-${i}:${this.textToHex(blocks[i], true)}`)
        this.LOGS.push(`BLOCK-${i} Matrix:\n${this.prettyPrintMatrix(blockState)}`)
        this.LOGS.push("--------------")
      }

      this.keyState = this.createMatrix(this.key)

      this.LOGS.push("KEY:" + this.key)
      this.LOGS.push("KEY Hex:" + this.textToHex(this.key, true))
      this.LOGS.push("KEY Matrix:\n" + this.prettyPrintMatrix(this.keyState))
    },

    prettyPrintMatrix(matrix) {
      let prettyMatrix = '';
      for (let row of matrix) {
        prettyMatrix += row.join(' ') + '\n';
      }
      return prettyMatrix.trim(); // Remove trailing newline
    }







  },

  watch: {
    key(value) {
      if (value.length !== 16) {
        this.hasError = true
      } else {
        this.hasError = false
      }
    }
  }
}
</script>

<style scoped>

</style>