const readline = require('readline');

function test() {
  console.log('test');
}

function inputConfig() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // 1. 激活 keypress 事件的监听[1,2](@ref)
  readline.emitKeypressEvents(process.stdin);

  // 2. 关键步骤：将输入流设置为原始模式 (raw mode)[1,2](@ref)
  // 在此模式下，输入字符会被立即分发，而无需等待回车键按下
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  return rl;
}

function centerText(text) {
  // 获取终端的列数（宽度）
  const terminalWidth = process.stdout.columns || 80;
  // 计算文本长度（一个中文字符算两个英文字符宽度会更准确）
  const textLength = Buffer.byteLength(text, 'utf8');
  // 计算左边需要填充的空格数
  const leftPadding = Math.max(0, Math.floor((terminalWidth - textLength) / 2));
  // 用空格填充并返回结果
  return ' '.repeat(leftPadding) + text;
}

function getRandomInt(min, max) {
  //随机函数
  // 参数校验，确保 min <= max
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min > max) {
    throw new Error('最小值不能大于最大值');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stopKeypressListener(handleKeypress) {
  // 停止本keypress事件的触发
  // 1. 移除特定的事件监听器
  process.stdin.removeListener('keypress', handleKeypress);
  // 2. 暂停输入流
  //process.stdin.pause();
  // 3. 恢复原始模式
  //process.stdin.setRawMode(false);
  //console.log('Keypress 事件监听已终止。');
}

function pick(obj, keysArray) {
    //pick函数，将obj中keysArray中的key挑出来
    const result = {};
    keysArray.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

module.exports = { test, inputConfig, centerText, getRandomInt, stopKeypressListener, pick }; // 导出一个对象