import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { useResetPassword } from '../../hooks/useResetPassword'
import toast from 'react-hot-toast'
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isPending } = useLogin()
    const { resetPassword, isPending: isResetPending, error: resetError } = useResetPassword()

    const handleSubmit = async (e) => {
        e.preventDefault()
        login(email, password)
    }

    const handleResetPassword = async () => {
        if (email) {
            resetPassword(email)
        } else {
            toast.error("Please enter your email address")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>login</h2>
            <label>
                <span>email:</span>
                <input
                    required
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
            <label>
                <span>password:</span>
                <input
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            {!isPending && <button className="btn">Log in</button>}
            {isPending && <button className="btn" disabled>loading</button>}
            {error && <div className="error">{error}</div>}
            <div className="forgot-password">
                <button type="button" className="btn-link" onClick={handleResetPassword}>
                    Forgot Password?
                </button>
                {isResetPending && <span>Sending reset email...</span>}
                {resetError && <div className="error">{resetError}</div>}
            </div>
        </form>
    )
}
