import React, { useEffect, useState, useRef } from 'react'
import {useNavigate, }from 'react-router-dom'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification, } from 'antd';
import style from'./News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor.js'

const { Step } = Steps;
const { Option } = Select;



export default function NewsAdd() {
  const [current,setCurrent] = useState(0)
  const [categoryList,setCategoryList] = useState([])
  const [formInfo,setFormInfo] = useState({})
  const [content,setContent] = useState({})
  const User = JSON.parse(localStorage.getItem("token"))
  const handleNext= ()=>{
    if(current===0){
      NewsForm.current.validateFields().then(res=>{
        // console.log(res)
        setFormInfo(res)
        setCurrent(current+1)
      }).catch(error=>{
        // console.log(error)
      })
    }else{
      if(JSON.stringify(content) === "{}"||content===''||content===undefined||content.trim()==='<p></p>'){
        message.error("The news content should not be empty")
      }else{
        // console.log(formInfo,content)
        setCurrent(current+1)
      }      
    }
  }
  const handlePrevious= ()=>{
    setCurrent(current-1)
  }
  const NewsForm = useRef(null)

  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategoryList(res.data)
    })
  },[])
  const navigate = useNavigate()
  const handleSave=(auditState)=>{
    axios.post('/news',{
      ...formInfo,
      "content": content,
      "region": User.region?User.region:"Global",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0,
    }).then(res=>{
      navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')
      notification.info({
        message: `Notification`,
        description:
          `You may view your news at ${auditState===0?'draftbox':'auditlist'}`,
        placement:"bottomRight",
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="writing News"
      />
      <Steps current={current}>
        <Step title="Basic Information" description="Title & category" />
        <Step title="News Content" description="Body of news content" />
        <Step title="News Submit" description="Save draft or submit to audit" />
      </Steps>
      <div style={{marginTop:"50px"}}>
        <div className={current===0?'':style.active}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            ref={NewsForm}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input your title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: 'Please input your title!' }]}
            >
              <Select>
                {
                  categoryList.map(item=>
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>


        <div className={current===1?'':style.active}>
          <NewsEditor getContent={value=>{
            // console.log(value)
            setContent(value)
          }}/>
        </div>

        
        <div className={current===2?'':style.active}></div>
      </div>

      <div style={{marginTop:"50px",}}>
        {
          current===2 &&<span>
            <Button type="primary" onClick={()=>handleSave(0)}>Save at draftbox</Button>
            <Button type="danger"onClick={()=>handleSave(1)}>Submit to audit</Button>
            </span>
        }
        {
          current<2 && <Button type="primary" onClick={handleNext}>Next</Button>
        }
        {
          current>0 && <Button onClick={handlePrevious}>Previous</Button>
        }       
      </div>
    </div>
  )
}
