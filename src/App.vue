<template>
  <div class="wrapper">
    <p class="title">Internet Speed</p>
    <div v-if="isLoading" class="loader"></div>
    <div v-else class="speed-container">
      <div class="speed-label">Download: {{ downlink }}</div>
      <div class="speed-label">Upload: {{ uplink }}</div>
    </div>
  </div>
</template>

<script>
const { onMounted, ref } = require("vue");

export default {
  name: "App",
  setup() {
    const ipcRenderer = window.require("electron").ipcRenderer;

    const uplink = ref(0);
    const downlink = ref(0);

    const isLoading = ref(true);

    onMounted(() => {
      // Listen for messages from main process
      ipcRenderer.on("speed-update", (event, message) => {
        console.log("Speed update recieved:", message);

        const response = JSON.parse(message.toString());

        uplink.value = response.uplink;
        downlink.value = response.downlink;

        isLoading.value = false;
      });
    });
    return {
      uplink,
      downlink,
      isLoading,
    };
  },
};
</script>

<style>
body {
  margin: 0;

  background-color: #558888;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  font-size: 16px;

  width: 100%;
  height: 100%;

  border-radius: 10px;
}

.wrapper {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  flex-direction: column;

  .title {
    font-size: 20px;
  }
}

.loader {
  border: 5px solid #f3f3f3; /* Light grey */
  border-top: 5px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
