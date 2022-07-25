import { Button, Table, Modal, Tree } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
const {confirm} =Modal
export default function RoleList() {
  const [dataSource,setDataSource] = useState([])
  const [rightList,setRightList] = useState([])
  const [currentRights,setCurrentRights] = useState([])
  const [currentId,setCurrentId] = useState([])
  const [isModalVisible,setisModalVisible] = useState(false)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },{
      title: '角色名称',
      dataIndex: 'roleName',
    },{
      title: 'operation',
      render:(item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)}/>} />
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />}
            onClick={()=>{
              setisModalVisible(true)
              setCurrentRights(item.rights)
              setCurrentId(item.id)
            }}
          />
        </div>
      }
    },
  ]
  useEffect(()=>{
    axios.get("/roles").then(res=>{
      // console.log(res.data)
      setDataSource(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      // console.log(res.data)
      setRightList(res.data)
    })
  },[])
  const confirmMethod = (item)=>{
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
  
      onOk() {
        // console.log('OK');
        deleteMethod(item);
      },
  
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  const deleteMethod = (item)=>{
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`/roles/${item.id}`)
  }
  
  const handleOk = ()=>{
    // console.log(currentRights)
    setisModalVisible(false)
    setDataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }
  const handleCancel = ()=>{
    setisModalVisible(false)
  }
  const onCheck = (checkedKeys)=>{
    // console.log(checkedKeys)
    setCurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Tree
        checkable
        checkStrictly = {true}
        treeData={rightList}
        checkedKeys={currentRights}
        onCheck={onCheck}        
      />
      </Modal>
    </div>
  )
}
