<template>
  <div>
    <a-card>
      <a-form layout="vertical" :form="form" @submit="handleSubmit">
        <a-form-item label="Shift/Key Number: ">
          <a-input type="number" style="width: 300px" placeholder="Enter number..."
                   v-decorator="['shiftNumber', { initialValue: 0, rules: [{ required: true, message: 'Please input shift number!' }] }]" />
        </a-form-item>

        <a-form-item label="Plain Text: ">
          <a-textarea placeholder="Enter the plain text..." :rows="7"
                      v-decorator="['plainText', { rules: [{ required: true, message: 'Please input plain text!' }] }]" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%;">
            Encrypt
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <br />

    <a-card>
      <a-form-item label="Cipher Text: ">
        <a-textarea :rows="7" :disabled="true" v-model:value="cipherText" />
      </a-form-item>
    </a-card>



  </div>
</template>

<script>
import {isOnlyEnglishLetters} from "@/utils/stringUtils";

export default {
  name: "SubstitutionCipher",

  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      lettersIdxMap: {
        "A":0, 'B':1, 'C':2, 'D':3, 'E':4, 'F':5, 'G':6, 'H':7, 'I':8, 'J':9,
        'K':10, 'L':11, 'M':12, 'N':13, 'O':14, 'P':15, 'Q':16, 'R':17, 'S':18, 'T':19,
        'U':20, 'V':21, 'W':22, 'X':23, 'Y':24, 'Z':25
      },

      cipherText:''
    };
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.cipherText = '';
      this.form.validateFields((err, values) => {
        if (!err) {
          this.encodePlainText(values['plainText'], values['shiftNumber']);
        }
      });
    },

    encodePlainText(plainText, k) {
      for (let x of plainText) {
        if(!isOnlyEnglishLetters(x)) {
          this.cipherText += x;
        } else {
          // yIdx = (xIdx + k) mod 26
          x = x.toUpperCase();
          let xIdx = this.lettersIdxMap[x];
          let yIdx = (Number(xIdx) + Number(k)) % 26;
          let y = this.getKeyByValue(this.lettersIdxMap, yIdx);
          this.cipherText += y;
        }
      }
    },

    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }

  }
}
</script>

<style scoped>

</style>