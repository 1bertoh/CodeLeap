import axios from "axios"

type TResPost = {
    count: number,
    next: any,
    previous: any,
    results: [
      {
        id: number,
        username: string,
        created_datetime: Date,
        title: string,
        content: string,
        author_ip: string
      }
    ]
  }
const getPosts = async () => {
    const res= await axios.get<TResPost>('https://dev.codeleap.co.uk/careers/')
    return res.data
}

type TForm = {
    id?: number,
    username: string,
    title: string,
    content: string
    created_datetime?: Date,
}

const postPost = async (form: TForm) => {
  const res = await axios.post('https://dev.codeleap.co.uk/careers/', form)
  return res
}

type TFormPut = {
    id: number,
    title: string,
    content: string
}

const putPost = async (form: TFormPut) => {
    const res = await axios.patch(`https://dev.codeleap.co.uk/careers/${form.id}`, form)
    return res
}

const deletePost = async (id: number) => {
    const res = await axios.delete(`https://dev.codeleap.co.uk/careers/${id}`)
    return res
}

export {getPosts, postPost, putPost, deletePost}