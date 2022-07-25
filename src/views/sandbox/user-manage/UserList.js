
import { Button, Table, Modal, Switch, } from 'antd'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
const {confirm} = Modal

export default function UserList() {
  const [dataSource,setDataSource] = useState([])
  const [isAddVisible,setisAddVisible] = useState(false)
  const [isUpdateVisible,setisUpdateVisible] = useState(false)
  const [roleList,setRoleList] = useState([])
  const [regionList,setRegionList] = useState([])
  const [isUpdateDisabled,setisUpdateDisabled] = useState(false)
  const [current,setCurrent] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const {roleId,region,username}  = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
      const roleObj = {
          "1":"superadmin",
          "2":"admin",
          "3":"editor"
      }
      axios.get("/users?_expand=role").then(res => {
          const list = res.data
          setDataSource(roleObj[roleId]==="superadmin"?list:[
              ...list.filter(item=>item.username===username),
              ...list.filter(item=>item.region===region&& roleObj[item.roleId]==="editor")
          ])
      })
  }, [roleId,region,username])
  
  useEffect(()=>{
    axios.get("/regions")
      .then(res=>{
        const list = res.data
        setRegionList(list)
      })
  },[])
  useEffect(()=>{
    axios.get("/roles")
      .then(res=>{
        const list = res.data
        setRoleList(list)
      })
  },[])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [       
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:"全球",
          value:"全球",
        }
      ],
      onFilter: (value, item) => {
        if(value==='全球'){
          return item.region===""
        }
        return item.region === value
      },
      render:(region)=>{
        return <b>{region===""?'全球':region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },{
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
      }
    },{
      title: 'operation',
      render:(item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)} />} disabled={item.default}/>
          <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.default} onClick={()=>handleUpdate(item)}/>
        </div>
      }
    },
  ]
  const handleUpdate = async (item) =>{
    // console.log(item)
    await setisUpdateVisible(true)
    if(item.roleId===1){
      setisUpdateDisabled(true)
    }else{
      setisUpdateDisabled(false)
    }
    updateForm.current.setFieldsValue(item)

    // setTimeout(()=>{
    //   setisUpdateVisible(true)
    //   updateForm.current.setFieldsValue(item)
    // },0)
    setCurrent(item)
    
  }
  const handleChange = (item)=>{
    // console.log(item)
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
  }
  const confirmMethod = (item)=>{
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
  
      onOk() {
        // console.log('OK')
        deleteMethod(item)
      },
  
      onCancel() {
        // console.log('Cancel')
      },
    })
  }
  const deleteMethod = (item)=>{
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`/users/${item.id}`)
  }
  const addFormOk =()=>{
    addForm.current.validateFields().then(value=>{
      // console.log(value)
      setisAddVisible(false)
      addForm.current.resetFields()
      
      axios.post(`/users`,{
        ...value,
        "roleState": true,
        "default": false,
      }).then(res=>{
        // console.log(res.data)
        setDataSource([...dataSource,{
          ...res.data,
          role:roleList.filter(item=>item.id===value.roleId)[0]
        }])
      })
      // setDataSource([...dataSourcek,{

      // }])
    }).catch(err=>{
      // console.log(err)
    })
  }
  const updateFormOk =()=>{
    updateForm.current.validateFields().then(value=>{
      // console.log(value)
      setisUpdateVisible(false)     
      setDataSource(dataSource.map(item=>{
        if(item.id===current.id){
          return {
            ...item,
            ...value,
            role:roleList.filter(item=>item.id===value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`,value)
    })
  }
  return (
    <div>
      <Button type="primary" onClick={()=>{
        setisAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} 
      pagination={{
        pageSize:5,
      }}
      rowKey={item=>item.id}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{setisAddVisible(false)}}
        onOk={() => {
          addFormOk()
          // // console.log('add',addForm)
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}/>
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={()=>{
          setisUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() =>
          updateFormOk()
          // // console.log('add',addForm)
        }
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
      </Modal>
    </div>
  ) 
}
