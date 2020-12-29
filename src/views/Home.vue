<template>
  <h1>冷红利的excel</h1>
  <div class="home">
    <input type="file" ref="file" @change="upload" @click="clearInput" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { upload } from '@/api/excel'

export default defineComponent({
  name: 'Home',
  methods: {
    upload(e: Event) {
      const target = e.target as HTMLInputElement
      const files = target.files as FileList
      const formData = new FormData()
      formData.append('file', files[0])
      upload(formData)
    },
    clearInput() {
      const fileDom = this.$refs.file as HTMLFormElement
      fileDom.value = null
    },
  },
})
</script>
