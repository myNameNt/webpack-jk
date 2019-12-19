'use strict'
import {showMyName} from './a'
function superShow() {
  console.log('i am superShow fn')
}
// const pso = new Promise((resolve,reject)=>{
//   setTimeout(() => {
//     resolve('我是魔鬼')
//   }, 1000)
// })
// async function asyncFn (){
//   console.log('async~')
//   const over = await pso.then((str) => {
//     showMyName()
//     superShow()
//     console.log('？？？')
//     return 'over'
//   })
//   console.log(over)
// }

// asyncFn()

// class Animal {
//   constructor(type){
//     this.type = type
//   }
//   move () {
//     console.log(this.type)
//   }
// }

// class Dog extends Animal {
//   constructor(type, name){
//     super(type)
//     this.name = name
//   }
//   cry(){
//     console.log('loudly cry')
//   }
// }

// const bigYellow = new Dog('中华田园犬','大黄')
// bigYellow.move()