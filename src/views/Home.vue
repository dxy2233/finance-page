<template>
  <h1>113w分类excel处理</h1>
  <div class="form">
    <span> 收款人：<input type="text" v-model="state.payer" /></span>
    <span> 审核人：<input type="text" v-model="state.reviewer" /></span>
    <span> 默认税率：<input type="text" v-model="state.defaultRate" /></span>
    <span> 开票类型：<input type="text" v-model="state.insingType" /></span>
  </div>
  <div>
    <input
      type="file"
      ref="file"
      @change="processExcel($event.target.files)"
      @click="clearInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import XLSX, { WorkBook, WorkSheet } from 'xlsx'

export default defineComponent({
  name: 'Home',
  setup() {
    const file = ref(null)
    const state = reactive({
      payer: '刘雪辉',
      reviewer: '刘雪辉',
      defaultRate: '0.13',
      insingType: '专用发票',
    })
    function processExcel(files: FileList) {
      const reader = new FileReader()
      reader.onload = function (e) {
        const data = new Uint8Array(e.target?.result as ArrayBufferLike)
        const workbook: WorkBook = XLSX.read(data, { type: 'array' })
        const sheet: WorkSheet = XLSX.utils.sheet_to_json(
          workbook.Sheets['蓝票'],
          {
            header: 1,
            defval: '',
          }
        )
        // 筛选并组合需要的json,按公司分组
        const resSheet: Array<Array<Array<string | number>>> = []
        let currentAccount = ''
        for (let i = 0; i < sheet.length; i++) {
          if (sheet[i][0] === '客户名称:') {
            currentAccount = sheet[i][1]
            resSheet.push([])
          } else if (Number.isFinite(sheet[i][0]) && sheet[i][6] !== 0) {
            sheet[i].splice(1, 0, currentAccount)
            resSheet[resSheet.length - 1].push(sheet[i].slice(0, 8))
          }
        }
        // 拆分大于113w的行
        for (let i = 0; i < resSheet.length; i++) {
          for (let j = 0; j < resSheet[i].length; j++) {
            if (resSheet[i][j][7] >= 1130000) {
              // 计算最接近113w的数量
              const price = resSheet[i][j][6] as number
              const maximum =
                1130000 % price !== 0
                  ? Math.floor(1130000 / price)
                  : Math.floor(1130000 / price) - 1
              // 分行
              const total = resSheet[i][j][5] as number
              resSheet[i][j][5] = maximum
              resSheet[i][j][7] = price * maximum
              resSheet[i].splice(
                j + 1,
                0,
                JSON.parse(JSON.stringify(resSheet[i][j]))
              )
              resSheet[i][j + 1][5] = total - maximum
              resSheet[i][j + 1][7] = price * (total - maximum)
            }
          }
        }
        // 排群组号 && 添加表单数据
        const time = new Date()
        let start = 1
        let accumulation = 0
        function transformNum(num: number) {
          return `${time.getFullYear()}${(
            Array(2).join('0') +
            (time.getMonth() + 1)
          ).slice(-2)}${time.getDate()}${(Array(3).join('0') + num).slice(-3)}`
        }
        for (let i = 0; i < resSheet.length; i++) {
          for (let j = 0; j < resSheet[i].length; j++) {
            resSheet[i][j][16] = state.payer
            resSheet[i][j][17] = state.reviewer
            resSheet[i][j][18] = state.defaultRate
            resSheet[i][j][19] = state.insingType
            const sum = resSheet[i][j][7] as number
            if (accumulation + sum < 1130000) {
              accumulation = accumulation + sum
            } else {
              start++
              accumulation = sum
            }
            resSheet[i][j][0] = transformNum(start)
          }
          start++
          accumulation = 0
        }
        // 导出
        const header = [
          '群组',
          '客户',
          '发票明细',
          '单位',
          '规格型号',
          '数量',
          '单价',
          '金额',
          '备注',
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          '收款人',
          '审核人',
          '默认税率',
          '开票类型',
          '折扣金额',
        ]
        const wb: WorkBook = XLSX.utils.book_new()
        const downLoadSheet: WorkSheet = XLSX.utils.json_to_sheet(
          [...[header], ...resSheet.flat(1)],
          {
            skipHeader: true,
          }
        )
        XLSX.utils.book_append_sheet(wb, downLoadSheet, '模板')
        const currentDate =
          `${time.getMonth() + 1}-` +
          time.getDate() +
          '-' +
          time.getHours() +
          '-' +
          time.getMinutes()
        XLSX.writeFile(wb, `贵州开票模板${currentDate}.xlsx`)
      }
      reader.readAsArrayBuffer(files[0])
    }
    function clearInput() {
      file.value = null
    }
    return {
      file,
      state,
      processExcel,
      clearInput,
    }
  },
})
</script>

<style lang="scss" scoped>
.form {
  margin-bottom: 10px;
}
</style>
