// Giriş yapmak isteyen bir kullanıcının verilerinin nasıl işleneceğini belirtir.

import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import {useHistory} from "react-router-dom";
import toast , {Toaster} from "react-hot-toast";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const history = useHistory()


  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    try {
      // login
      const res = await projectAuth.signInWithEmailAndPassword(email, password)

      // update online status
      const documentRef = projectFirestore.collection('admins').doc(res.user.uid)
      await documentRef.update({ online: true })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
        toast.success("Login successful")
        history.push('/orders');
      }
    }
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
        toast.error("Login Failed")
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}