import React from 'react'
import './hello.less'
import img from '../assets/img/IMG_0004.jpg'
import {a} from './tree-shaking'
import { splitString } from '../../common/util'
// let Hello = (props)=>{
//     // const [str, setStr] = useState('我是谁')
//     const strA = a()
//     const arr = splitString('哈哈，嘻嘻')
//     return (
//       <div className="hello">
//         <p className="text">hello little pig {strA}</p>
//         <img src={ img } alt="哈哈哈" />
//         <h1>
//           {
//             arr.map((item)=>{
//               return (
//               <span>{item}</span>
//               )
//             })
//           }
//         </h1>
//       </div>
//     );
// }
class Hello extends React.Component{
  constructor(props){
    super()
    this.state = {
      Text: null
    }
  }
  async showText () {
    import(/* webpackChunkName: 'subPageA'*/ "./text").then((subPageA) => {
      this.setState({
        Text: subPageA.default
      })
    })
  }
  render(){
    const { Text } = this.state
    return (
      <div onClick={()=>this.showText()}>
        <p>构架</p>
        <div>
            {
            Text ? <Text/> : null
            }
        </div>
      </div>
    )
  }
}
export default Hello
 