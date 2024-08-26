import axios from 'axios'
const baseurl = 'http://localhost:3003/api/blogs'

const getAll = () => {
    return axios.get(baseurl)
}

const create = (newblog) => {
    return axios.post(baseurl,newblog)
}

const remove =(id) => {
    return axios.delete(baseurl + '/' +id)
}

export default {getAll, create, remove}