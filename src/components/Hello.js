import React from 'react'
import './hello.less'
import img from '../assets/img/IMG_0004.jpg'
let Hello = (props)=>{
    // const [str, setStr] = useState('我是谁')
    return (
      <div className="hello">
        <p className="text">hello little pig</p>
        <img src={ img } alt="哈哈哈" />
      </div>
    );
}
export default Hello
