<template>
  <div class="home">
    <div class="upload-box">
      <input type="file" @change="upload($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  data() {
    return {
      test: '123',
    }
  },
  methods: {
    upload(e: Event) {
      const target = e.target as HTMLInputElement
      const files = target.files as FileList
      console.log(files[0])
    },
  },
})
export default class Home extends Vue {}
</script>
