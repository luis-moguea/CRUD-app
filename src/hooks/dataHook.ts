import { CanceledError } from "axios";
import apiClient from "../services/api-client"
import { useState, useEffect } from 'react';

export interface DataFetch {
  id?: number
  userId?: number
  title?: string
  body: string
}

const dataHook = () => {
  const [data, setData] = useState<DataFetch[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  useEffect(()=> {
    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get<DataFetch[]>("/posts", {signal: controller.signal})
        setData(res.data)
        setLoading(false)
      } catch (err) {
        if(err instanceof CanceledError) return
        setTimeout(() => {
          setError("");
        }, 2000)
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [])

  return {data, error, loading, setData, setError, setLoading}
}

export default dataHook
