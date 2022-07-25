import { Button, Table, notification, } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


export default function Audit() {
  const {roleId,region,username}  = JSON.parse(localStorage.getItem("token"))
  const [dataSource,setDataSource] = useState([])
  useEffect(()=>{
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
  }
    axios.get(`/news?auditState=1&_expand=category`)
    .then(res => {
      const list = res.data
      setDataSource(roleObj[roleId]==="superadmin"?list:[
          ...list.filter(item=>item.author===username),
          ...list.filter(item=>item.region===region&& roleObj[item.roleId]==="editor")
      ])
  })
  },[roleId,region,username,])
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
      title: 'operation',
      render:(item)=>{
        return <div>
            <Button type="primary" onClick={()=>handleAudit(item,2,1)}>Approval</Button>
            <Button danger onClick={()=>handleAudit(item,3,0)}>Reject</Button>
        </div>
      }
    },
  ];
  const handleAudit=(item,auditState,publishState)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState,
    }).then(res=>{
      notification.info({
        message: `Notification`,
        description:
          `You may view your news's auditstate at "/audit-manage/aditlist"`,
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
