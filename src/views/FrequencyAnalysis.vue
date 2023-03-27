<template>
  <div>
    <a-row :gutter="[8,8]">
      <a-col :span="12">
        <a-card>
          <a-form-item label="Cipher Text: ">
            <a-textarea :rows="8" v-model:value="cipherText" @change="findFrequencies4CipherText"/>
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
            <a-textarea :rows="8" v-model:value="referenceText" @change="findFrequencies4ReferenceText" />
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
import {getLettersMap} from "@/utils/lettersMap";
import {isOnlyEnglishLetters} from "@/utils/stringUtils";

Chart.register(...registerables);

export default {
  name: "FrequencyAnalysis",

  components: {
    CardBarChart
  },

  created() {
    this.initCipherFreqAnalysis();
    this.initReferenceFreqAnalysis();
    this.prepareCipherFreqTable();
    this.prepareReferenceFreqTable();

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

    };
  },

  methods: {

    initCipherFreqAnalysis() {
      for (const property in getLettersMap()) {
        this.cipherFreqAnalysis[property] = 0
      }
    },

    initReferenceFreqAnalysis() {
      for (const property in getLettersMap()) {
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

      this.cipherFreqTableData = [{ key: Math.random()}];
      for (const item in this.cipherFreqAnalysis) {
        this.cipherFreqTableData[0][item] = this.cipherFreqAnalysis[item];
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

      this.referenceFreqTableData = [{ key: Math.random()}];
      for (const item in this.referenceFreqAnalysis) {
        this.referenceFreqTableData[0][item] = this.referenceFreqAnalysis[item];
      }
    },

    findFrequencies4CipherText() {
      this.initCipherFreqAnalysis();
      for (let c of this.cipherText) {
        if(!isOnlyEnglishLetters(c)) {
          continue;
        }

        c = c.toUpperCase();
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
        if(!isOnlyEnglishLetters(c)) {
          continue;
        }

        c = c.toUpperCase();
        if (c in this.referenceFreqAnalysis) {
          this.referenceFreqAnalysis[c]++;
        }
      }
      this.referenceFreqChartKey = Math.random();
      this.prepareReferenceFreqTable();
    },

    decrypt() {

    }


  },

}
</script>

<style scoped>
</style>