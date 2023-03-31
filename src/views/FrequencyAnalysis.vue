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

    <a-card>
      <a-row>
        <a-col>
          <a-row><span><b>Cipher Text&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </b></span>{{printResult(this.cipherFreqAnalysis)}}</a-row>
          <a-row><span><b>Reference Text&nbsp;&nbsp;: </b></span>{{printResult(this.referenceFreqAnalysis)}}</a-row>
        </a-col>
      </a-row>
    </a-card>

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
          <a-button type="dashed" @click="refreshUI" style="width: 100%; height: 55px;">
            RESET
          </a-button>
        </a-form-item>
      </a-col>
    </a-row>

    <br />
    <a-divider />
    <br />


    <a-row style="margin-top: 10px">
      <a-col :span="10">
        <a-card>
          <a-form-item label="Possible Plain Text: ">
            <a-textarea :rows="7" v-model:value="possiblePlainText" />
          </a-form-item>
        </a-card>
      </a-col>
      <a-col :span="4" type="flex" align="center" class="centered-element">
        <a-row style="margin-top: 100px" />
        <a-button style="background-color: #00b96b; color: white; border-color:#00b96b" @click="analyzeCommonWords">
          Common Words Analyze <a-icon type="arrow-right" /> <br> (BONUS)
        </a-button>
      </a-col>
      <a-col :span="10">
        <a-card>
          <a-form-item label="Analyzed-Possible Plain Text: ">
            <a-textarea :rows="7" :disabled="true" v-model:value="analyzedPlainText"   />
          </a-form-item>
        </a-card>
      </a-col>
    </a-row>

    <br />
    <a-divider />
    <br />

    <a-row style="margin-top: 10px">
      <a-col :span="10">
        <a-card>
          <a-form-item label="Original Plain Text: ">
            <a-textarea :rows="7"  v-model:value="originalPlainText" placeholder="Enter the original text to calculate accuracy.." />
          </a-form-item>
        </a-card>
      </a-col>
      <a-col :span="4" type="flex" align="center" class="centered-element">
        <a-row style="margin-top: 100px" />
        <a-button type="danger" @click="calculateAccuracyRates" :disabled="disabledAccuracyBtn">
          Calculate Accuracy <a-icon type="arrow-right" />
        </a-button>
      </a-col>
      <a-col :span="10">
        <h4 style="text-decoration: underline;">Accuracy:</h4>
        <h6>For possible plain text:</h6>
        <a-row><span><b>Correct Prediction Numbers:</b> {{this.correctPrediction4PossibleText}}</span></a-row>
        <a-row><span><b>Total Characters Numbers:</b> {{this.possiblePlainText.length}}</span></a-row>
        <a-row><span><b>Accuracy Rate:</b> {{this.accuracy4PossibleText}} %</span></a-row>
        <a-divider></a-divider>
        <h6>For analyzed possible plain text:</h6>
        <a-row><span><b>Correct Prediction Numbers:</b> {{this.correctPrediction4AnalyzedPossibleText}}</span></a-row>
        <a-row><span><b>Total Characters Numbers:</b> {{this.analyzedPlainText.length}}</span></a-row>
        <a-row><span><b>Accuracy Rate:</b> {{this.accuracy4AnalyzedPossibleText}} %</span></a-row>
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
import {extractWords, isOnlyEnglishLetters, isOnlyTurkishLetters, similarity} from "@/utils/stringUtils";
import {getEnglishCommonWords, getTurkishCommonWords} from "@/utils/commonWords";

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

      possiblePlainText: '',
      analyzedPlainText: '',
      originalPlainText: '',

      correctPrediction4PossibleText:0,
      correctPrediction4AnalyzedPossibleText:0,
      accuracy4PossibleText: 0.0,
      accuracy4AnalyzedPossibleText: 0.0,
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

      this.possiblePlainText = '';
      this.analyzedPlainText = '';
      this.originalPlainText = '';

      this.correctPrediction4PossibleText = 0;
      this.correctPrediction4AnalyzedPossibleText = 0;
      this.accuracy4PossibleText = 0.0;
      this.accuracy4AnalyzedPossibleText = 0.0;

      this.initCipherFreqAnalysis();
      this.initReferenceFreqAnalysis();
      this.prepareCipherFreqTable();
      this.prepareReferenceFreqTable();
    },

    decrypt() {
      this.possiblePlainText = '';
      const cipCharArr = Object.keys(this.sortObjectByVal(this.cipherFreqAnalysis));
      const refCharArr = Object.keys(this.sortObjectByVal(this.referenceFreqAnalysis));

      for (let x of this.cipherText) {
        if((this.selectedLang === 'en' && !isOnlyEnglishLetters(x)) || (this.selectedLang === 'tr' && !isOnlyTurkishLetters(x))) {
          this.possiblePlainText += x;
        } else {
          x = this.selectedLang === 'tr' ? x.toLocaleUpperCase('tr-TR') : x.toUpperCase();
          let xIdx = cipCharArr.indexOf(x);
          let y = refCharArr.at(xIdx);
          this.possiblePlainText += y;
        }
      }

      window.scrollTo(0,document.body.scrollHeight);
    },


    analyzeCommonWords() {
      let map = {};
      let text = this.possiblePlainText;
      //let text = "English texts fol beginners to practice reading and comprehension online and for free. Practicing your comprehension of written English will both improve your vocabulary and understanding of grammar and word order. The texts below are designed to help you develop while giving you an instant evaluation of your progress";
      let words = extractWords(text);
      let commonWords = this.selectedLang === 'en' ? getEnglishCommonWords() : getTurkishCommonWords();
      for (let word of words) {

        let editingWord = '';
        let maxSimilarityScore = 0.0;
        for(let commonWord of commonWords) {
          if (word.length <= 4 && word.length === commonWord.length) {
            let similarityScore = similarity(word, commonWord);
            if (similarityScore > maxSimilarityScore) {
              maxSimilarityScore = similarityScore;
              editingWord = commonWord;
            }
          }
        }
        if (maxSimilarityScore < 1.0 && maxSimilarityScore >= 0.51) {
          map[word] = editingWord;
        }
      }

      this.replaceWholeWord(map);
      console.log(map);
    },

    replaceWholeWord(map) {
      let replacingText = this.possiblePlainText;

      for (const property in map) {
        let rmPiece = property;
        let removeStr = `\\b${rmPiece}\\b`;
        const regex =  new RegExp(removeStr,'gi'); // correct way
        replacingText = replacingText.replace(regex,map[property]); // it works
      }

      this.analyzedPlainText = replacingText;
    },

    sortObjectByVal(unordered) {
      const ordered = Object.entries(unordered)
          .sort(([,a],[,b]) => b-a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      return ordered;
    },

    printResult(obj) {

      const tmpObj = this.sortObjectByVal(obj);
      let result = '';
      for (const item in tmpObj) {
        result += `${item} (${tmpObj[item]}) - `
      }

      return result;
    },


    calculateAccuracyRates() {

      this.correctPrediction4PossibleText = 0;
      this.correctPrediction4AnalyzedPossibleText = 0;

      for (let i = 0; i < this.originalPlainText.length; i++) {
        let originChar = this.originalPlainText.charAt(i)
        let posChar = this.possiblePlainText.charAt(i);
        let anPosChar = this.analyzedPlainText.charAt(i);

        originChar = this.selectedLang === 'tr' ? originChar.toLocaleUpperCase('tr-TR') : originChar.toUpperCase();
        posChar = this.selectedLang === 'tr' ? posChar.toLocaleUpperCase('tr-TR') : posChar.toUpperCase();
        anPosChar = this.selectedLang === 'tr' ? anPosChar.toLocaleUpperCase('tr-TR') : anPosChar.toUpperCase();

        if (originChar === posChar) {
          this.correctPrediction4PossibleText++;
        }

        if (originChar === anPosChar) {
          this.correctPrediction4AnalyzedPossibleText++;
        }
      }

      this.accuracy4PossibleText = this.possiblePlainText.length === 0 ? 0
          : (1.0 * this.correctPrediction4PossibleText / this.possiblePlainText.length) * 100;
      this.accuracy4AnalyzedPossibleText = this.analyzedPlainText.length === 0 ? 0
          : (1.0 * this.correctPrediction4AnalyzedPossibleText / this.analyzedPlainText.length) * 100;

    },


  },

}
</script>

<style scoped>
.centered-element {

}
</style>