import React from 'react'
import style from'./Child.module.scss'
export default function Child(){
    return (
        <div>
            <ul>
            <li className={style.item}>11111</li>
            <li className={style.item}>22222</li>
            </ul>   
        </div>
    )
}