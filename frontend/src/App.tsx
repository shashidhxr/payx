import axios from "axios"
import { useEffect, useState } from "react"

function App() {
    const [branches, setBranches] = useState()

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/admin/branches')
            .then(response => {
                setBranches(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])
    
  return(
    <div>
        {branches}
    </div>
  )
}

export default App
