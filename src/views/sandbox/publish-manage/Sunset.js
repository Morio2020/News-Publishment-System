import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish.js'
import usePublish from '../../../components/publish-manage/usePublish.js'

export default function Sunset() {
    const {dataSource, handleDelete} = usePublish(3)

  return (
    <div><NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleDelete(id)}>
      Delete
    </Button>} /></div>
  )
}
