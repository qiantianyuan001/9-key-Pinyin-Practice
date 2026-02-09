const readline = require('readline');
const rl = readline.createInterface({
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

var map = {
  "a": 8,
  "b": 8,
  "c": 8,
  "d": 9,
  "e": 9,
  "f": 9,
  "g": 4,
  "h": 4,
  "i": 4,
  "j": 5,
  "k": 5,
  "l": 5,
  "m": 6,
  "n": 6,
  "o": 6,
  "p": 1,
  "q": 1,
  "r": 1,
  "s": 1,
  "t": 2,
  "u": 2,
  "v": 2,
  "w": 3,
  "x": 3,
  "y": 3,
  "z": 3,
}
var keysArray = "abcdefghijklmnopqrstuvwxyz".split(""); // 声母数组
var c = undefined;  //代表map中的键，代表correct，即正确的答案
var countCorrect = 0;
var countWrong = 0;

function isCorrect(c, n) {
  //console.log("正确的是" + c + "核对的数字" + n);
  return map[c] == n;
}

function question() {
  //随机一个字母，转成字符
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
  var n = getRandomInt(0, keysArray.length-1);
  c = keysArray[n];
  console.log(centerText("question:  " + c));
}

(function main() {
  console.log("九宫格键盘输入法训练开始,看见屏幕中间的字母，输入对应的数字，按回车键重新出题");
  console.log("1.全部声母");
  console.log("2.部分声母");

  rl.question('请输入你的选择：', (answer) => {
    switch (answer) {
      case '1':
        console.log('进入模式1');
        select1();
        break;
      case '2':
        console.log('进入模式2');
        select2();
        break;
      default:
        console.log('无效的选择');
        main();
    }
  })

})();

function select1() {
  question();
  //按键事件
  process.stdin.on('keypress', (str, key) => {
    // key 是一个对象，包含按键的详细信息[2](@ref)
    //console.log('当前按键信息：', key);

    // 判断是否是回车键 (回车键在 keypress 事件中的名称为 'return')[4](@ref)
    if (key.name === 'return') {
      //console.log('>>> 你按下了回车键 (\\n)');
      // 你可以在这里执行需要响应回车键的代码
      // 例如，rl.close(); 来关闭接口
      // 刷新c，即重新生成一个问题
      question();
      return;
    }

    // 判断是否是 Ctrl+C (退出信号)
    // 在 raw 模式下，必须手动监听并处理退出信号[1](@ref)
    if (key.ctrl && key.name === 'c' || key.ctrl && key.name === 'z') {
      console.log('再见！');
      process.exit();
    }
    // 退格键，去掉控制台默认的字符
    rl.write('', { ctrl: true, name: 'h' })
    //console.log("你按下了键：" + key.name);
    //console.log("你按下了键：" + key.name + "，对应的数字是：" + (key.name.charCodeAt(0) - 48));
    if (isCorrect(c, key.name.charCodeAt(0) - 48)) {
      countCorrect++;
      var percent = Math.round(countCorrect / (countCorrect + countWrong) * 100);
      //console.log(centerText("输入正确"+ "   正确率：" + percent + "%" + "   正确：" + countCorrect + "   错误：" + countWrong));
      console.log(centerText("输入正确" + "   正确率：" + percent + "%"));
      question();
    } else {
      //console.log("输入错误");
      countWrong++;
    }
  });
}

function select2() {
  rl.question('请列出你想要练习的声母：', (string) => {
    keysArray = string.split('');
    //console.log(keysArray);
    callback();
  })
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
  function callback() {
    //callback函数，回调，输入字母后触发
    map = pick(map, keysArray);
    //console.log(map);
    select1();
  }

}