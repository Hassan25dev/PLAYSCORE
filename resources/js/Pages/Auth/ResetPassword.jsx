import React, { useEffect } from 'react';
import EnhancedGuestLayout from '../../Layouts/EnhancedGuestLayout';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';
import { t } from '../../lang/translationHelper';
import halo from '../../images/halo-battlefield-3840x2160-18793.jpg';

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('password.store'));
  };

  return (
    <EnhancedGuestLayout
      backgroundImage={halo}
      title={t('auth.reset_password')}
      subtitle={t('auth.reset_password_subtitle')}
    >
      <Head title={t('auth.reset_password')} />

      <form onSubmit={submit} className="space-y-5">
        <input type="hidden" name="token" value={data.token} />

        <div className="space-y-2">
          <InputLabel htmlFor="email" value={t('auth.email')} className="text-white" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
            autoComplete="email"
            isFocused={true}
            onChange={(e) => setData('email', e.target.value)}
            placeholder={t('auth.email_address')}
            readOnly
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="space-y-2">
          <InputLabel htmlFor="password" value={t('auth.new_password')} className="text-white" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
            placeholder={t('auth.create_password')}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="space-y-2">
          <InputLabel htmlFor="password_confirmation" value={t('auth.confirm_new_password')} className="text-white" />

          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            placeholder={t('auth.confirm_password_placeholder')}
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 mt-6">
          <PrimaryButton
            disabled={processing}
            className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          >
            {t('auth.reset_password')}
          </PrimaryButton>

          <Link
            href={route('login')}
            className="text-sm sm:text-base text-gray-200 hover:text-white transition duration-150 ease-in-out mt-4"
          >
            {t('auth.back_to_login')}
          </Link>
        </div>
      </form>
    </EnhancedGuestLayout>
  );
}
