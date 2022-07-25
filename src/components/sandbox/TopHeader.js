import React from 'react'
import { Layout, Dropdown, Menu, Avatar} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined, 
  } from '@ant-design/icons';
import {useNavigate,} from 'react-router-dom'
import { connect } from 'react-redux';
const { Header,} = Layout;

function TopHeader(props) {
  // console.log(props)
  // const [collapsed, setCollapsed] = useState(false)
  // const changeCollapsed =()=>{
  //   setCollapsed(!collapsed)
  // }
  const changeCollapsed =()=>{
    // setCollapsed(!collapsed)
    // console.log(props)
    props.changeCollapsed()
  }
  const navigate = useNavigate()
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  const menu = (
    <Menu
    //   items={[
    //     {
    //       key: '1',
    //       label: (
    //         <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
    //           超级管理员
    //         </a>
    //       ),
    //     },
    //     {
    //       key: '4',
    //       danger: true,
    //       label: '退出',
    //     },
    //   ]}
    // />
    >
      <Menu.Item key="1">
        {roleName}
      </Menu.Item>
      <Menu.Item key="4" danger onClick={()=>{
        localStorage.removeItem("token")
        navigate("/login")
      }}>退出</Menu.Item>
    </Menu>
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      {
        props.isCollapsed
        ?<MenuUnfoldOutlined onClick={changeCollapsed}/>
        :<MenuFoldOutlined onClick={changeCollapsed}/>
      }
      <div style={{float:"right"}}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
  // console.log(state)
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type: "change_collapsed"
      // payload
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)