<template>
  <div>
    <a-tabs type="card" default-active-key="1">
      <a-tab-pane key="1" tab="Hide Data">
        <a-row>
          <a-col :span="12">
            <a-card>
              <a-form-item label="Cover File: ">
                <a-upload
                    :before-upload="beforeUpload"
                    :on-change="handleChange">

                  <a-button> <a-icon type="upload" /> Upload your cover image </a-button>
                </a-upload>
              </a-form-item>

              <a-form-item label="Message: ">
                <a-input placeholder="Enter your secret message" v-model="message"></a-input>
              </a-form-item>

              <a-form-item>
                <a-button type="primary" :style="{ width: '100%' }" @click="hideData">
                  Hide Data
                </a-button>
              </a-form-item>
            </a-card>
            <a-divider />

          </a-col>

          <a-col :span="11" :offset="1">
            <a-card>

              <a :href="stegoImageUrl" download="stego-image.png" v-if="stegoImageUrl">
                <a-icon type="download" /> Download Stego Image
              </a>
              <a-form-item label="Stego Image: ">
                <img v-if="stegoImageUrl" :src="stegoImageUrl" />
              </a-form-item>
            </a-card>

          </a-col>
        </a-row>

      </a-tab-pane>
      <a-tab-pane key="2" tab="Extract Data">
      </a-tab-pane>
    </a-tabs>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: "Steganography",

  data() {
    return {
      message: '',
      coverImageFile: null,
      stegoImageUrl: null,
      LOGS: []
    }
  },

  methods: {
    async hideData() {
      if (!this.coverImageFile || !this.message) {
        alert('Please select a file and write a message!');
        return;
      }

      const formData = new FormData();
      formData.append('coverImage', this.coverImageFile);
      formData.append('message', this.message);

      try {
        const response = await axios.post(
            'http://localhost:8080/api/hideData',
            formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob',
        }).then((response) => {
          const blob = new Blob([response.data], { type: response.data.type });
          this.stegoImageUrl = URL.createObjectURL(blob);
        });
      } catch (error) {
        console.error(error);
      }

    },

    beforeUpload(file) {
      this.coverImageFile = file;
      return false; // prevent upload
    },
    handleChange(info) {
      if (info.file.status === 'done') {
        // handle server response
      }
    },

  }
}
</script>

<style scoped>

</style>