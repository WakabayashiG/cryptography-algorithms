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
              Find Frequencies
            </a-button>
          </a-form-item>
        </a-card>

        <CardBarChart :chartData="chartData" style="margin-top: 10px" :key="chartDataKey"></CardBarChart>

      </a-col>
      <a-col :span="12">


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

Chart.register(...registerables);

export default {
  name: "FrequencyAnalysis",

  components: {
    CardBarChart
  },

  created() {
    this.initData();
  },


  data() {
    return {
      cipherText: '',
      cipherTextFreq: {},
      chartDataKey: Math.random(),
      chartData: [],

      referenceText: '',
      referenceTextFreq: {},
    };
  },

  methods: {

    initData() {
      for (const property in getLettersMap()) {
        this.cipherTextFreq[property] = 0
      }

    },

    findFrequencies4CipherText() {
      this.initData();
      for (let c of this.cipherText) {
        if (c in this.cipherTextFreq) {
          this.cipherTextFreq[c]++;
        }
      }

      console.log(JSON.stringify(this.cipherTextFreq))
      this.chartData = Object.values(this.cipherTextFreq)
      this.chartDataKey = Math.random();
    }
  },
}
</script>

<style scoped>
</style>