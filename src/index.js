import str,{showMyName} from './a'
import React from 'react'
import ReactDom from 'react-dom'

const HelloWorld = ()=>{
  return (
    <div>hello react</div>
  )
}

ReactDom.render(
  <HelloWorld/>,
  document.querySelector('#app')
)

showMyName('开始学习webpack')
console.log(str)