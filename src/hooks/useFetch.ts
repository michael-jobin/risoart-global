import { useEffect, useState } from 'react'

interface FetchError {
 msg: string
 state: boolean
}

const useFetch = <T,>(endpoint: string) => {
 const [data, setData] = useState<T | null>(null)
 const [loading, setLoading] = useState<boolean>(true)
 const [error, setError] = useState<FetchError>({ msg: '', state: false })

 useEffect(() => {
  const fetchData = async () => {
   try {
    const response = await fetch(endpoint)
    if (!response.ok) throw new Error(`${response.status} Error, something went wrong`)
    const data = await response.json()
    setData(data)
   } catch (err: any) {
    setError({ msg: err.message, state: true })
   } finally {
    setLoading(false)
   }
  }

  fetchData()
 }, [endpoint])

 return { data, loading, error }
}

export default useFetch
