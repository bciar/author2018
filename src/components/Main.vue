<template>
  <div>
    <Taxon></Taxon>
  </div>
</template>

<script>

import Taxon from '@/components/Taxon'

export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {Taxon},
  methods: {
    
  }
}

</script>
