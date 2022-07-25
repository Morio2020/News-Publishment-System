import { Button, Table, notification, Tag, } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate } from "react-router-dom"



export default function AuditList() {
  const navigate = useNavigate()
  const {username} = JSON.parse(localStorage.getItem("token"))
  const [dataSource,setDataSource] = useState([])
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
      .then(res=>{
        const list = res.data
        setDataSource(list)
      })
  },[username])
  
  const columns = [
    {
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
      title: 'Audit State',
      dataIndex: 'auditState',
      render:(auditState)=>{
        const colorList = ["", 'orange', 'green', 'red']
        const auditList = ["未审核", '审核中', '已通过', '未通过']
        return<Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },{
      title: 'operation',
      render:(item)=>{
        return <div>
          {
            item.auditState===1 && <Button onClick={() => handleRevert(item)} >Cancel</Button>
          }
          {
            item.auditState===2 && <Button danger onClick={() => handlePublish(item)} >Publish</Button>
          }
          {
            item.auditState===3 && <Button type="primary" onClick={() => handleUpdate(item)} >Update</Button>
          }
        </div>
      }
    },
  ];
  const handleRevert = (item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      notification.info({
        message: `Notification`,
        description:
          `You may view your news at draftbox`,
        placement:"bottomRight",
      })
    })
  }
  const handleUpdate=(item)=>{
    navigate(`/news-manage/update/${item.id}`)
  }
  const handlePublish=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      publishState:2,
      "publishTime":Date.now()
    }).then(res=>{
      navigate('/publish-manage/published')
      notification.info({
        message: `Notification`,
        description:
          `You may view your news at "/publish-manage/Published"`,
        placement:"bottomRight",
      })
    })
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
