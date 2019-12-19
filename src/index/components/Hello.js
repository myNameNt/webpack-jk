import React from 'react'
import './hello.less'
import img from '../assets/img/IMG_0004.jpg'
import {a} from './tree-shaking'
let Hello = (props)=>{
    // const [str, setStr] = useState('我是谁')
    const strA = a()
    return (
      <div className="hello">
        <p className="text">hello little pig {strA}</p>
        <img src={ img } alt="哈哈哈" />
      </div>
    );
}
export default Hello
