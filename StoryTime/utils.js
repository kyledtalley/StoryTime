export const isValidDocumentId = (id) => {
	const validIdPattern = /^[a-zA-Z0-9_]{1,36}$/
	return validIdPattern.test(id)
}
