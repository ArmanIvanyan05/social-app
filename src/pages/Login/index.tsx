import { useState } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { getErrorMessage, loginUser } from '../../helpers/api';
import type { LoginPayload } from '../../helpers/types';

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginHandler: SubmitHandler<LoginPayload> = async payload => {
    setError('');
    try {
      await loginUser(payload);
      navigate('/profile/posts', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol lg="8">
          <MDBCard className="my-5 rounded-3" style={{ maxWidth: '600px' }}>
            <MDBCardBody className="px-5">
              <h1 className="mb-4">Log in</h1>
              <p>
                Need an account? <Link to="/">Create one</Link>
              </p>
              <form onSubmit={handleSubmit(loginHandler)}>
                {error && <p role="alert" className="alert alert-danger">{error}</p>}
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p role="alert">{errors.email.message}</p>}
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <p role="alert">{errors.password.message}</p>}
                <button disabled={isSubmitting} type="submit" className="btn btn-outline-info">
                  {isSubmitting ? 'Logging in…' : 'Log in'}
                </button>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
