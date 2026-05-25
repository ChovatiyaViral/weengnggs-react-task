import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useAuthStore from '../store/authStore'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(5, 'Password must be at least 5 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[@#$^&]/, 'Password must contain at least one special character (@#$^&)')
    .required('Password is required'),
})

export default function Login() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      login(values)
      navigate('/')
    },
  })

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🚀 Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="field-error">{formik.errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="admin123"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="field-error">{formik.errors.password}</span>
            )}
            <p className="password-hint">
              Password must be at least 5 characters, contain one uppercase letter and one special character (@#$^&)
            </p>
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Sign In
          </button>
        </form>


      </div>
    </div>
  )
}
