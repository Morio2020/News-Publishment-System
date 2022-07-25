import React, {useEffect, useState} from 'react'
import { Layout, Menu, } from 'antd';
import "./index.css"
import {useLocation, useNavigate,} from 'react-router-dom'
import {
  // UploadOutlined,
  UserOutlined,
  // VideoCameraOutlined,
  // AppstoreOutlined, MailOutlined, SettingOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { connect } from 'react-redux';
const { Sider, } = Layout;
const {SubMenu} = Menu;

// const menuLIst = [
//   {
//     key:"/home",
//     label:"首页",
//     icon:<UserOutlined/>,
//   },{
//     key:"/user-manage",
//     label:"用户管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/user-manage/list",
//         label:"用户列表",
//         icon:<UserOutlined/>,
//       }
//     ],
//   },{
//     key:"/right-manage",
//     label:"权限管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/right-manage/rightlist",
//         label:"权限列表",
//         icon:<UserOutlined/>,
//       },{
//         key:"/right-manage/rolelist",
//         label:"角色列表",
//         icon:<UserOutlined/>,
//       },
//     ],
//   }
// ]
function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children")
      .then(res=>{
        // console.log(res.data)
      setMenu(res.data)
      })
  },[])
  const navigate = useNavigate()
  const handleChangePage = (item)=>{
    // console.log(item.key)
    navigate(item.key)
  }
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item)=>{
    return item.pagepermisson && rights.includes(item.key)
  }
  const iconList = {
    "/home":<UserOutlined />,
    "/user-manage":<UserOutlined />,
    "/user-manage/list":<UserOutlined />,
    "/right-manage":<UserOutlined />,
    "/right-manage/role/list":<UserOutlined />,
    "/right-manage/right/list":<UserOutlined />
    //.......
  }
  const selectKeys = [useLocation().pathname]
  const openKeys = ["/"+useLocation().pathname.split("/")[1]]
  const renderMenu = (menuList)=>{
    return menuList.map(item=>{
      if(item.children?.length>0 && checkPagePermission(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          { renderMenu(item.children) }
        </SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]}  onClick={handleChangePage}>{item.title}</Menu.Item>
    })
  }
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display:"flex", height:"100%","flexDirection":"column"}}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
          <Menu
            theme="dark"
            mode="inline"
            onClick={handleChangePage}
            defaultSelectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
            // items={menu}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>({isCollapsed})
export default connect(mapStateToProps)(SideMenu)