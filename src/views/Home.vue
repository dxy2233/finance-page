<template>
  <div class="home">
    <div class="upload-box">
      <input type="file" ref="file" @change="upload($event)" />
      {{ fileName }}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { upload } from '@/api/files'

@Options({
  data() {
    return {
      fileName: '',
    }
  },
  methods: {
    upload(e: Event) {
      const target = e.target as HTMLInputElement
      const files = target.files as FileList
      const fileName = files[0].name
      let formData = new FormData()
      formData.append('file', files[0])
      upload(formData).then(() => {
        this.fileName = fileName
      })
      this.$refs.file.value = null
    },
  },
})
export default class Home extends Vue {}
</script>
