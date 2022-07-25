import React from 'react'
import { 
    useNavigate,    //获取跳转
    useParams,      //获取路由参数
    useLocation,    //获取当前路由信息   
    } from 'react-router-dom'
export default function withRouter(Component) {
  return  function(props){
      const navigate = useNavigate()
      const param = useParams()
      const location =useLocation()
    return <Component {...props} history={{navigate, param, location}}/>
  }
}
