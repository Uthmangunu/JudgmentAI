import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import { isValidEmail, isValidPassword } from '../../utils/validators';

export default function LoginForm({ onSubmit, isLoading, error }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (values) => {
    if (!isValidEmail(values.email) || !isValidPassword(values.password)) return;
    onSubmit(values);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        {...register('email', {
          validate: (value) => isValidEmail(value) || 'Enter a valid email',
        })}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Minimum 8 characters"
        required
        {...register('password', {
          validate: (value) => isValidPassword(value) || 'Password must be at least 8 characters',
        })}
        error={errors.password?.message}
      />
      {error && <ErrorMessage>{error.message || 'Unable to login'}</ErrorMessage>}
      <Button type="submit" loading={isLoading} fullWidth>
        Login
      </Button>
    </form>
  );
}
