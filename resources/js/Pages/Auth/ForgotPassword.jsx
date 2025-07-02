import React, { useEffect } from 'react';
import EnhancedGuestLayout from '../../Layouts/EnhancedGuestLayout';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';
import { t } from '../../lang/translationHelper';
import sekiro from '../../images/sekiro-shadows-die-3840x2160-14176.jpg';

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
  });

  useEffect(() => {
    return () => {
      reset('email');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <EnhancedGuestLayout
      backgroundImage={sekiro}
      title={t('auth.forgot_password_title')}
      subtitle={t('auth.forgot_password_subtitle')}
    >
      <Head title={t('auth.forgot_password')} />

      {status && (
        <div className="mb-6 font-medium text-sm bg-green-100 text-green-800 p-4 rounded-lg">
          {status}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
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
            placeholder={t('auth.enter_email')}
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 mt-6">
          <PrimaryButton
            disabled={processing}
            className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          >
            {t('auth.email_password_reset')}
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
