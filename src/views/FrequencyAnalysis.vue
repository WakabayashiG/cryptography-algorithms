<template>
  <div>
    <a-row>
      <a-card>
        <a-form layout="inline">
          <a-form-item label="Select Language: ">
            <a-select default-value="en" style="width: 250px" @change="handleChangeLang">
              <a-select-option value="en">
                English
              </a-select-option>
              <a-select-option value="tr">
                Turkish
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-card>
    </a-row>

    <a-row :gutter="[8,8]" style="margin-top: 10px">
      <a-col :span="12">
        <a-card>
          <a-form-item label="Cipher Text: ">
            <a-textarea :rows="7" v-model:value="cipherText" @change="findFrequencies4CipherText"/>
          </a-form-item>
        </a-card>

        <CardBarChart :freqAnalysis="cipherFreqAnalysis" :chartType="'cipher'" style="margin-top: 10px" :key="cipherFreqChartKey"></CardBarChart>

        <a-card style="margin-top: 10px">
          <a-table :key="cipherFreqChartKey"
              :columns="cipherFreqTableColumns" :data-source="cipherFreqTableData" size="small" bordered :pagination="false" :scroll="{ x: 'max-content' }">
            <template #title><b>Frequency Table of Cipher Text</b></template>
          </a-table>
        </a-card>


      </a-col>
      <a-col :span="12">

        <a-card>
          <a-form-item label="Reference Text: ">
            <a-textarea :rows="7" v-model:value="referenceText" @change="findFrequencies4ReferenceText" />
          </a-form-item>
        </a-card>

        <CardBarChart :freqAnalysis="referenceFreqAnalysis" :chartType="'reference'" style="margin-top: 10px" :key="referenceFreqChartKey"></CardBarChart>

        <a-card style="margin-top: 10px">
          <a-table :key="referenceFreqChartKey"
                   :columns="referenceFreqTableColumns" :data-source="referenceFreqTableData" size="small" bordered :pagination="false" :scroll="{ x: 'max-content' }">
            <template #title><b>Frequency Table of Reference Text</b></template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <br />

    <a-row type="flex" justify="center">

      <a-col :span="6" style="margin-right: 10px">
        <a-form-item>
          <a-button type="primary" @click="decrypt" style="width: 100%; height: 55px;">
            DECRYPT
          </a-button>
        </a-form-item>
      </a-col>
      <a-col :span="6" style="margin-left: 10px">
        <a-form-item>
          <a-button type="dashed" @click="" style="width: 100%; height: 55px;">
            RESET
          </a-button>
        </a-form-item>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import {Chart, registerables} from 'chart.js';
import CardBarChart from "@/components/Cards/CardBarChart.vue";
import {
  getEnglishLettersMap,
  getSpanishLettersMap,
  getTurkishLettersMap
} from "@/utils/lettersMap";
import {isOnlyEnglishLetters, isOnlyTurkishLetters} from "@/utils/stringUtils";

Chart.register(...registerables);

export default {
  name: "FrequencyAnalysis",

  components: {
    CardBarChart
  },

  created() {
    this.refreshUI();
  },


  data() {
    return {
      cipherText: '',
      cipherFreqAnalysis: {},
      cipherFreqChartKey: Math.random(),
      cipherFreqChartSorted: false,
      cipherFreqTableColumns: [],
      cipherFreqTableData:[],

      referenceText: '',
      referenceFreqAnalysis: {},
      referenceFreqChartKey: Math.random(),
      referenceFreqChartSorted: false,
      referenceFreqTableColumns: [],
      referenceFreqTableData:[],

      selectedLang: 'en',
      lettersMap: getEnglishLettersMap(),
    };
  },

  methods: {

    initCipherFreqAnalysis() {
      for (const property in this.lettersMap) {
        this.cipherFreqAnalysis[property] = 0
      }
    },

    initReferenceFreqAnalysis() {
      for (const property in this.lettersMap) {
        this.referenceFreqAnalysis[property] = 0
      }
    },

    prepareCipherFreqTable() {
      this.cipherFreqTableColumns = [];
      for (const item in this.cipherFreqAnalysis) {
        this.cipherFreqTableColumns.push({
          title: item,
          dataIndex: item,
        })
      }

      this.cipherFreqTableData = [];
      this.cipherFreqTableData.push({ key: Math.random()});
      this.cipherFreqTableData.push({ key: Math.random()});
      let relatedLettersCount = 0;
      this.cipherText.split('').forEach(l => {
        if(this.selectedLang === 'en' && isOnlyEnglishLetters(l)) {
          return relatedLettersCount++;
        }

        if(this.selectedLang === 'tr' && isOnlyTurkishLetters(l)) {
          return relatedLettersCount++;
        }
      });

      for (const item in this.cipherFreqAnalysis) {
        this.cipherFreqTableData[0][item] = this.cipherFreqAnalysis[item];
        this.cipherFreqTableData[1][item] = relatedLettersCount !== 0
            ? ((1.0 * this.cipherFreqAnalysis[item] / relatedLettersCount) * 100).toFixed(2)
            : 0;

      }
    },

    prepareReferenceFreqTable() {
      this.referenceFreqTableColumns = [];
      for (const item in this.referenceFreqAnalysis) {
        this.referenceFreqTableColumns.push({
          title: item,
          dataIndex: item,
        })
      }

      this.referenceFreqTableData = [];
      this.referenceFreqTableData.push({ key: Math.random()});
      this.referenceFreqTableData.push({ key: Math.random()});
      let relatedLettersCount = 0;
      this.referenceText.split('').forEach(l => {
        if(this.selectedLang === 'en' && isOnlyEnglishLetters(l)) {
          return relatedLettersCount++;
        }

        if(this.selectedLang === 'tr' && isOnlyTurkishLetters(l)) {
          return relatedLettersCount++;
        }
      });

      for (const item in this.referenceFreqAnalysis) {
        this.referenceFreqTableData[0][item] = this.referenceFreqAnalysis[item];
        this.referenceFreqTableData[1][item] = relatedLettersCount !== 0
            ? ((1.0 * this.referenceFreqAnalysis[item] / relatedLettersCount) * 100).toFixed(2)
            : 0;
      }
    },

    findFrequencies4CipherText() {
      this.initCipherFreqAnalysis();
      for (let c of this.cipherText) {
        if(this.selectedLang === 'en' && !isOnlyEnglishLetters(c)) {
          continue;
        }

        if(this.selectedLang === 'tr' && !isOnlyTurkishLetters(c)) {
          continue;
        }

        c = this.selectedLang === 'tr' ? c.toLocaleUpperCase('tr-TR') : c.toUpperCase();
        if (c in this.cipherFreqAnalysis) {
          this.cipherFreqAnalysis[c]++;
        }
      }
      this.cipherFreqChartKey = Math.random();
      this.prepareCipherFreqTable();
    },

    findFrequencies4ReferenceText() {
      this.initReferenceFreqAnalysis();
      for (let c of this.referenceText) {
        if(this.selectedLang === 'en' && !isOnlyEnglishLetters(c)) {
          continue;
        }

        if(this.selectedLang === 'tr' && !isOnlyTurkishLetters(c)) {
          continue;
        }

        c = this.selectedLang === 'tr' ? c.toLocaleUpperCase('tr-TR') : c.toUpperCase();
        if (c in this.referenceFreqAnalysis) {
          this.referenceFreqAnalysis[c]++;
        }
      }
      this.referenceFreqChartKey = Math.random();
      this.prepareReferenceFreqTable();
    },

    handleChangeLang(value) {
      console.log(`selected ${value}`);
      this.selectedLang = value;
      this.lettersMap = {};
      if (value === 'tr') {
        this.lettersMap = getTurkishLettersMap();
      } else if (value === 'en') {
        this.lettersMap = getEnglishLettersMap();
      } else if (value === 'es') {
        this.lettersMap = getSpanishLettersMap();
      } else {
        this.lettersMap = getEnglishLettersMap();
      }

      this.refreshUI();
    },

    refreshUI() {
      this.cipherText = '';
      this.cipherFreqAnalysis = {};
      this.cipherFreqChartKey = Math.random();
      this.cipherFreqChartSorted = false;
      this.cipherFreqTableColumns = [];
      this.cipherFreqTableData = [];

      this.referenceText = '';
      this.referenceFreqAnalysis = {};
      this.referenceFreqChartKey = Math.random();
      this.referenceFreqChartSorted = false;
      this.referenceFreqTableColumns = [];
      this.referenceFreqTableData = [];

      this.initCipherFreqAnalysis();
      this.initReferenceFreqAnalysis();
      this.prepareCipherFreqTable();
      this.prepareReferenceFreqTable();
    },

    decrypt() {

    }


  },

}
</script>

<style scoped>
</style>