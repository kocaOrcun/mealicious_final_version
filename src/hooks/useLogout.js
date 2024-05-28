import { useEffect, useState } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import {useHistory} from "react-router-dom";
import toast , {Toaster} from "react-hot-toast";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const history = useHistory()

  
  const logout = async () => {
    setError(null)
    setIsPending(true)

    try {
      // update online statuss
      const { uid } = projectAuth.currentUser
      await projectFirestore.collection('admins').doc(uid).update({ online: false })
      
      // sign the user out
      await projectAuth.signOut()
      
      // dispatch logout action
      dispatch({ type: 'LOGOUT' })

      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
        toast.success("Logout Succesfull")

      } 
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
        
      }
    }
    history.push('/login');
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { logout, error, isPending }
}