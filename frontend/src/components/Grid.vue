<template>
  <div class="grid">
    <div id="top-section">
      <div id="bias-input">
        <label>CHARACTER</label>
        <input
          type="text"
          v-model="lowercaseInput"
          @keydown="validateInput"
          @keyup="sendInput"
          :disabled="isSending"
          placeholder="Character"
        />
      </div>
      <button @click="toggleUpdate">GENERATE 2D GRID</button>
    </div>

    <div v-if="gridData.length > 0" class="grid-content">
      <div v-for="(row, indexRow) in gridData" :key="indexRow" class="grid-row">
        <div v-for="(col, indexCol) in row" :key="indexCol" class="grid-cell">
          <div v-html="col"></div>
        </div>
      </div>
    </div>

    <div id="bottom-section">
      <div class="center-elements" v-if="isLive">
        <div class="live-indicator">
          <div class="live-dot"></div>
          <span>LIVE</span>
        </div>
      </div>
      <div class="center-elements" v-else>
        <div class="live-indicator align-left">
          <div class="not-live-dot"></div>
          <span>NOT LIVE</span>
        </div>
      </div>

      <div id="code" class="center-elements">
        <label v-if="isLive">YOUR CODE:</label>
        <input type="text" readonly :value="codeData" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GridComponent',
  data() {
    return {
      gridData: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => '')),
      codeData: '',
      intervalId: null,
      turnOn: false,
      inputText: '',
      inputTextAlreadyWasFilled: false,
      isSending: true,
      isLive: false,
    };
  },
  computed: {
    lowercaseInput: {
      get() {
        return this.inputText.toLowerCase();
      },
      set(value) {
        this.inputText = value.toLowerCase();
      },
    },
  },
  methods: {
    async generateGrid() {
      try {
        const response = await axios.get('http://localhost:3000/grid');
        this.boldValues(response.data);
        this.gridData = response.data;
      } catch (error) {
        console.error('Error on generateGrid:', error);
      }
    },
    async generateCode() {
      try {
        const response = await axios.get('http://localhost:3000/code');
        this.codeData = response.data;
      } catch (error) {
        console.error('Error on generateCode:', error);
      }
    },
    toggleUpdate() {
      if (!this.turnOn) {
        this.turnOn = true;
        this.isSending = false;
        this.isLive = true;
        this.generateGrid().then(() => this.generateCode().then(() => this.startInterval()));
      }
    },
    startInterval() {
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          this.generateGrid().then(() => this.generateCode());
        }, 2000);
      }
    },
    stopInterval() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },

    async validateInput(event) {
      const charCode = event.keyCode;
      const isBackspace = this.checkIfIsBackspace(charCode);
      const isAlphabetical = this.checkIfIsAlphabetical(charCode);
      const inputLength = this.inputText.length;
      if (this.inputText.length > 0) {
        this.inputTextAlreadyWasFilled = true;
      } else {
        this.inputTextAlreadyWasFilled = false;
      }

      if ((!isAlphabetical && inputLength === 0) || (inputLength === 1 && !isBackspace)) {
        event.preventDefault();
      }
    },

    async sendInput(event) {
      const charCode = event.keyCode;
      const isAlphabetical = this.checkIfIsAlphabetical(charCode);
      const isBackspace = this.checkIfIsBackspace(charCode);
      if (!isAlphabetical && !isBackspace) {
        return;
      }

      if (!isBackspace && !this.inputTextAlreadyWasFilled) {
        this.isSending = true;
      }

      setTimeout(() => {
        this.isSending = false;
      }, 4000);
      this.sendBiasToBackend(this.inputText);
    },
    boldValues(matrix) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] === this.inputText) {
            matrix[i][j] = '<span id="bias-values">' + matrix[i][j].bold() + '</span> ';
          }
        }
      }
    },
    async sendBiasToBackend(bias) {
      try {
        await axios.post('http://localhost:3000/bias', {
          character: bias,
        });
      } catch (error) {
        console.error('Error sendInput:', error);
      }
    },
    checkIfIsAlphabetical(charCode) {
      return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
    },
    checkIfIsBackspace(charCode) {
      return charCode === 8;
    },
  },
  mounted() {
    this.sendBiasToBackend(this.inputText);
  },
  beforeUnmount() {
    this.stopInterval();
  },
};
</script>

<style>
.grid {
  margin: auto;
}

#top-section {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  #bias-input {
    display: flex;
    flex-direction: column;
    label {
      font-size: 11px;
      font-weight: bold;
      width: fit-content;
    }
    input {
      width: 90px;
      height: 30px;
      margin-top: 5px;
    }
  }
  button {
    width: 170px;
    height: 40px;
    background: #9d9c9c;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    border: unset;
  }
}

#bottom-section {
  #code {
    width: fit-content;
    margin: auto;
    border: 1px solid #000000;
    border-radius: 3px;
    width: 220px;
    height: 45px;
    flex-direction: row;
    input {
      border: unset;
      font-size: 16px;
      width: 20px;
    }
  }
  .live-indicator {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .live-dot,
  .not-live-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .live-dot {
    background-color: red; /* Color for live indicator */
  }

  .not-live-dot {
    background-color: gray; /* Color for not live indicator */
  }
}
.center-elements {
  display: flex;
  align-items: center;
  justify-content: center;
}
.grid-content {
  margin: 30px 0;
  .grid-row {
    display: flex;
    justify-content: center;
  }
  .grid-cell {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    #bias-values {
      font-weight: bold;
      color: #ff0000;
    }
  }
}

#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}
</style>
