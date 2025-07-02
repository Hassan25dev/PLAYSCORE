import React, { useEffect } from 'react';
import EnhancedGuestLayout from '../../Layouts/EnhancedGuestLayout';
import PrimaryButton from '../../Components/PrimaryButton';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { t } from '../../lang/translationHelper';
import ghostrunner from '../../images/ghostrunner-video-3840x2160-15242.jpg';

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm();

  const submit = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  // We don't need to check if email is already verified here
  // The controller already handles this by redirecting verified users

  return (
    <EnhancedGuestLayout
      backgroundImage={ghostrunner}
      title={t('auth.verify_email')}
      subtitle={t('auth.verify_email_subtitle')}
    >
      <Head title={t('auth.verify_email')} />

      <div className="p-5 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm border border-gray-200 border-opacity-20 mb-6">
        <div className="mb-4 text-base text-white leading-relaxed">
          {t('auth.verify_email_text')}
        </div>

        {status === 'verification-link-sent' && (
          <div className="mb-4 font-medium text-sm bg-green-100 text-green-800 p-3 rounded-lg">
            {t('auth.verification_sent')}
          </div>
        )}

        <form onSubmit={submit} className="mt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <PrimaryButton
              disabled={processing}
              className="w-full sm:w-2/3 justify-center py-3 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            >
              {t('auth.resend_verification')}
            </PrimaryButton>

            <Link
              href={route('login')}
              className="text-sm text-gray-200 hover:text-white transition duration-150 ease-in-out mt-4"
            >
              {t('auth.return_to_login')}
            </Link>
          </div>
        </form>
      </div>
    </EnhancedGuestLayout>
  );
}
