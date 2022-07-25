import { Button, Table, Modal, notification, } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate } from "react-router-dom"
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
const {confirm} =Modal


export default function NewsDraft() {
  const navigate = useNavigate()
  const {username} = JSON.parse(localStorage.getItem("token"))
  const [dataSource,setDataSource] = useState([])
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`)
      .then(res=>{
        const list = res.data
        setDataSource(list)
      })
  },[username])
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },{
      title: 'title',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`/news-manage/preview/${item.id}`} >{title}</a>
      }
    },{
      title: 'author',
      dataIndex: 'author',
    },{
      title: 'category',
      dataIndex: 'category',
      render:(category)=>{
        return category.title
      }
    },{
      title: 'operation',
      render:(item)=>{
        return <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
            
            <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
                navigate(`/news-manage/update/${item.id}`)
            }} />

            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)} />
        </div>
      }
    },
  ];
  const handleCheck=(id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res=>{
      navigate('/audit-manage/list')
      notification.info({
        message: `Notification`,
        description:
          `You may view your news at auditlist`,
        placement:"bottomRight",
      });
    })
  }
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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)     
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} 
      pagination={{
        pageSize:5,
      }}
      rowKey={item=>item.id}
      />
    </div>
  ) 
}
