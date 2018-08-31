// import axios from 'axios'
// import qs from 'qs';

// /**
//  * 向服务器端发送get请求
//  * @param {string} url 请求的地址
//  * @param {object} payload 配置参数
//  * @param {boolean} [isLocal=true] 是否请求的是本地服务
//  * @returns Promise
//  */
// export function get(url, payload, isLocal = true) {
//     if (isLocal) {
//         url = server + url;
//     }
//     return axios.get(url, payload)
// }

// /**
//  * 发送post请求
//  * @param {string} url  请求的地址
//  * @param {object} data 传递的参数
//  * @param {boolean} [isLocal=true]  是否是本地服务器
//  * @returns Promise
//  */

// export function post(url, data, isLocal = true) {
//     if (isLocal) {
//         url = server + url
//     }
//     return axios.post(url, qs.stringify(data))
// }
import Vue from 'vue'
import QS from 'qs'
import Axios from 'axios'
import url from '@/utils/config'
import toaster from '@/utils/toaster'
import utils from '@/utils/utils'
const baseurl = url.apiurl

// http request 拦截器
Axios.interceptors.request.use(
    (config) => {
        config.baseURL = baseurl
        if (!config['params']) {
            config['params'] = {}
        }
        config.params['token'] = utils.getkey()
        config.headers['token'] = utils.getkey()
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

// 添加响应拦截器
Axios.interceptors.response.use(
    (res) => {
        // 对响应数据做点什么
        switch (res.data.code) {
            case 200:
                return res.data
                break
            case -100:
                Vue.prototype.loginout()
                toaster.error('未登录', res.data.msg, 1500)
                return Promise.reject(res.data)
                break
            default:
                toaster.error('', res.data.msg, 1500)
                return Promise.reject(res.data)
                break
        }
    },
    (error) => {
        // 对响应错误做点什么
        toaster.error('接口异常', '', 1500)
        return Promise.reject(error);
    }
)
export default {
    get: (option) => {
        var options = {
            url: option.url,
            timeout: 10000,
            method: option.method || 'get',
            params: option.data || {},
            success: option.succ || function(res) {},
            error: option.error || function(res) {},
        }
        return Axios.request(options)
    },
    post: (option) => {
        var options = {
            url: option.url,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            method: option.method || 'post',
            data: option.data,
            success: option.succ || function(res) {},
            error: option.error || function(res) {}
        }
        if (option.data && option.data.constructor == FormData) {
            options['onUploadProgress'] = option.progress || function(progressEvent) {}
            options.headers['Content-Type'] = 'multipart/form-data; charset=utf-8'
        } else {
            options.data = QS.stringify(options.data)
        }
        return Axios.request(options)
    },
}