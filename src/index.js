import str,{showMyName} from './a'
import React from 'react'
import ReactDom from 'react-dom'
import Hello from './components/Hello.js'

// class App extends React.Component {
//   constructor(){
//     super()
//   }
//   render () {
//     return (
//       <div>
//         <Hello><i>我是传过来的children</i></Hello>
//       </div>
//     )
//   }
// }
ReactDom.render(
  <Hello/>,
  document.querySelector('#app')
)
showMyName('开始学习webpack')
console.log(str)