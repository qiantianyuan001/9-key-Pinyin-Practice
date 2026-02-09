const util = require('./util.js');

rl = util.inputConfig();
centerText = util.centerText;
getRandomInt = util.getRandomInt;
stopKeypressListener = util.stopKeypressListener;
pick = util.pick;

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
  var n = getRandomInt(0, keysArray.length - 1);
  c = keysArray[n];
  console.log(centerText("question:  " + c));
}

function main() {
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
      case 'exit':
        console.log('再见！');
        process.exit();
      default:
        console.log('无效的选择');
        main();
    }
  })
}
main();

function practice() {
  question();
  //按键事件
  process.stdin.on('keypress', handleKeypress);
  
  function handleKeypress(str, key) {
    // key 是一个对象，包含按键的详细信息
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

    if (key.name === 'escape') {
      //console.log('>>> 你按下了退出键 (\\e)');
      // 你可以在这里执行需要响应退出键的代码
      stopKeypressListener(handleKeypress); //停止keypress事件监听
      main(); //重新开始
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
  }
}

function select1() {
  //console.log("进入模式1");
  practice();
}

function select2() {
  rl.question('请列出你想要练习的声母：', (string) => {
    keysArray = string.split('');
    //console.log(keysArray);
    callback();
  })
  
  function callback() {
    //callback函数，回调，输入字母后触发
    map = pick(map, keysArray); //pick函数，根据keysArray，从map中挑选出对应的键值对
    //console.log(map);
    practice();
  }

}