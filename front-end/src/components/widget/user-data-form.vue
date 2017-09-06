<!--
  @Author: wuzitao
  @Date:   2017-08-11 20:46:26
  @Last Modified time: 2017-08-18 20:22:29
-->
<template>
  <form class="form-horizontal">
    <div class="form-group" v-for="control,index of formData">
      <label class="col-sm-3 control-label no-padding-right"
        :for="'data-ff-' + control.label">
        {{ control.label }}
      </label>

      <div class="col-xs-12 col-sm-9">
        <div class="clearfix">

          <!-- input -->
          <div class="input-group" v-if="getInput(control).is">
            <span class="input-group-addon">
              <i class="ace-icon fa"
                :class="[ 'fa-'+control.ico ]"></i>
            </span>
            <input class="col-xs-12 col-sm-6"
              :type="getInput(control).type"
              :id="'data-ff-' + control.label"
              :placeholder="control.holder"
              :disabled="control.disabled"
              :value="getInput(control).value || ''"
              @input="control[getInput(control).fullType] = $event.target.value.replace(/(^\s*)|(\s*$)/g, '')">
          </div>

          <!-- radio -->
          <div class="input-group radio" v-if="control.radio !== undefined">
            <label class="line-height-1 blue" v-for="opt,index of control.radio">
              <input name="gender" type="radio" class="ace"
                :id="'data-ff-' + control.label + index"
                :checked="index === getCheckPosition(control)"
                :disabled="control.disabled"
                @change="control.value = opt">
              <span class="lbl">
                {{ opt }}
              </span>
            </label>
          </div>

          <!-- two inputs -->
          <div class="input-group" v-if="control.input instanceof Array&amp;&amp;control.input.length === 2">
            <span class="input-group-addon">
              <i class="ace-icon fa"
                :class="[ 'fa-'+control.ico ]"></i>
            </span>
            <input class="col-xs-6 col-sm-3" type="text"
              :id="'data-ff-' + control.label"
              :value="control.input[0]"
              :placeholder="control.holder[0]"
              :disabled="control.disabled">
            <input class="col-xs-6 col-sm-3" type="text"
              :id="'data-ff-' + control.label + 1"
              :value="control.input[1]"
              :placeholder="control.holder[1]"
              :disabled="control.disabled">
          </div>

          <!-- select -->
          <div class="input-group" v-if="control.select !== undefined">
            <span class="input-group-addon">
              <i class="ace-icon fa"
                :class="[ 'fa-'+control.ico ]"></i>
            </span>
            <select class="input-medium" v-if="control.select !== undefined"
              :id="'data-ff-' + control.label"
              :disabled="control.disabled"
              @change="control.value = $event.target.value">
              <option v-if="control.default !== undefined"
                :value="control.default">{{ control.default }}</option>
              <option v-for="option of getOptions(control)"
                :value="option">{{ option }}</option>
            </select>
          </div>
          <!-- end if input -->
        </div>
        <div class="help-block">
          {{ control.error }}
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  import $ from 'jquery'
  
  export default {
    name: 'user-data-form',
    props: {
      formData: Array
    },
    methods: {
      getInput (control) {
        for (let key in control) {
          if (/^(input)\.?/.test(key) && typeof control[key] === 'string') {
            return {
              fullType: key,
              type: key.split('.')[1] || 'text',
              value: control[key],
              is: true
            }
          }
        }
        return { is: false }
      },
      getCheckPosition (control) {
        if (typeof control.value === 'string') {
          return control.radio.indexOf(control.value)
        }
        return control.value
      },
      getOptions (control) {
        return control.select instanceof Array ? control.select : [control.select]
      }
    },
    data () {
      return {

      }
    }
  }
</script>
  
<style scoped>
  .help-block {
    display: none;
  }
  .has-error .help-block {
    display: block;
  }
</style>