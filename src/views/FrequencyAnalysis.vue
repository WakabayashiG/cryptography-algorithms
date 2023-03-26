<template>
  <div>
    <a-row :gutter="[8,8]">
      <a-col :span="12">
        <a-card>
          <a-form-item label="Cipher Text: ">
            <a-textarea :rows="7" v-model:value="cipherText"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="findFrequencies4CipherText" style="width: 100%;">
              Analyze Cipher Text
            </a-button>
          </a-form-item>
        </a-card>

        <CardBarChart :chartData="cipherFreqChartData" style="margin-top: 10px" :key="cipherFreqChartKey"></CardBarChart>

        <a-card style="margin-top: 10px">
          <a-table :key="cipherFreqChartKey"
              :columns="cipherFreqTableColumns" :data-source="cipherFreqTableData" size="small" bordered :pagination="false">
            <template #title><b>Frequency Table of Cipher Text</b></template>
          </a-table>
        </a-card>


      </a-col>
      <a-col :span="12">

        <a-card>
          <a-form-item label="Reference Text: ">
            <a-textarea :rows="7" v-model:value="referenceText"/>
          </a-form-item>
          <a-form-item>
            <a-button type="danger" @click="findFrequencies4ReferenceText" style="width: 100%;">
              Analyze Reference Text
            </a-button>
          </a-form-item>
        </a-card>

        <CardBarChart :chartData="referenceFreqChartData" style="margin-top: 10px" :key="referenceFreqChartKey"></CardBarChart>

        <a-card style="margin-top: 10px">
          <a-table :key="referenceFreqChartKey"
                   :columns="referenceFreqTableColumns" :data-source="referenceFreqTableData" size="small" bordered :pagination="false" >
            <template #title><b>Frequency Table of Reference Text</b></template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>


    <br/>
    <a-divider/>


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
      cipherFreqChartData: [],
      cipherFreqTableColumns: [],
      cipherFreqTableData:[],

      referenceText: '',
      referenceFreqAnalysis: {},
      referenceFreqChartKey: Math.random(),
      referenceFreqChartData: [],
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
      this.cipherFreqChartData = Object.values(this.cipherFreqAnalysis)
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
      this.referenceFreqChartData = Object.values(this.referenceFreqAnalysis)
      this.referenceFreqChartKey = Math.random();
      this.prepareReferenceFreqTable();
    },



  },

}
</script>

<style scoped>
</style>