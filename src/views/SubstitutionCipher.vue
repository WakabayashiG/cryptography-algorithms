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

        <a-row type="flex">
          <a-col :span="24" :md="12">
            <a-form-item>
              <a-button type="primary" html-type="submit" style="width: 100%;">
                Encrypt
              </a-button>
            </a-form-item>
          </a-col>
          <a-col :span="24" :md="12">
            <a-form-item>
              <a-button :style="{ marginLeft: '8px', width: '100%' }" @click="handleReset">
                Reset
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <br />

    <a-card>
      <a-form-item label="Cipher Text: ">
        <a-textarea :rows="7" :disabled="true" v-model:value="cipherText" />
      </a-form-item>

      <a-table
          :columns="getLetterTableColumns" :data-source="getLetterTableData" size="small" bordered :pagination="false">
        <template #title><b>Alph. Index</b></template>

      </a-table>
    </a-card>

  </div>
</template>

<script>
import {isOnlyEnglishLetters} from "@/utils/stringUtils";
import {getLettersMap} from "@/utils/lettersMap";

export default {
  name: "SubstitutionCipher",

  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      lettersIdxMap: getLettersMap(),
      cipherText:''
    };
  },

  methods: {

    handleReset() {
      this.form.resetFields();
      this.cipherText = '';
    },

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
    },

  },

  computed: {
    getLetterTableColumns() {
      let columns = [];
      for (const item in this.lettersIdxMap) {
        columns.push({
          title: item,
          dataIndex: item,
        })
      }

      return columns;
    },

    getLetterTableData() {
      let data = [{ key: '1'}];
      for (const item in this.lettersIdxMap) {
        data[0][item] = this.lettersIdxMap[item];
      }

      return data;
    }
  }
}
</script>

<style scoped>
</style>