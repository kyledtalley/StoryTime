import { useState, useEffect } from "react"

const useAppwrite = (apiCall, deps = [], options = {}) => {
	const [data, setData] = useState(options.initialData || null)
	const [loading, setLoading] = useState(options.enabled !== false)
	const [error, setError] = useState(null)

	const fetchData = async () => {
		setLoading(true)
		setError(null)
		try {
			const result = await apiCall()
			setData(result)
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (options.enabled !== false) {
			fetchData()
		}
	}, deps)

	return { data, loading, error, refetch: fetchData }
}

export default useAppwrite
