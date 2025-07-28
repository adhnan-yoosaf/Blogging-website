import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'

const useToastAndNavigate = () => {
    const navigate = useNavigate();

    const showToastAndNavigate = (success, message, path) => {
        if (!success) {
            return toast.error(message)
        }

        toast.success(message)

        if (path) {
            navigate(path)
        }
    }

    return showToastAndNavigate;
}

export default useToastAndNavigate;