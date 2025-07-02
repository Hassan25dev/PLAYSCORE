import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link } from '@inertiajs/react';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import DangerButton from '../../Components/DangerButton';
import { t } from '../../lang/translationHelper';
import massEffect from '../../images/mass-effect-3840x2160-15572.jpg';

const Profile = ({ user, errors }) => {
  const [values, setValues] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    delete_password: '',
  });

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setValues(values => ({
      ...values,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.patch('/profile', values);
  };

  const handleDeleteAccount = () => {
    if (!values.delete_password) {
      alert('Please enter your current password to delete your account.');
      return;
    }
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      Inertia.delete('/profile', { data: { password: values.delete_password } });
    }
  };

  return (
    <div className="min-h-screen relative">
      <Head title={t('auth.profile_title')} />

      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${massEffect})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-0"></div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">{t('auth.profile_title')}</h1>
          <p className="text-gray-300">{t('auth.profile_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-200 border-opacity-10">
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-500 border-opacity-30 drop-shadow-md">{t('auth.profile_information')}</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <InputLabel htmlFor="name" value={t('auth.name')} className="text-white" />
                <TextInput
                  id="name"
                  name="name"
                  value={values.name}
                  className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-30 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm text-white placeholder-gray-300"
                  onChange={handleChange}
                  placeholder={t('auth.enter_name')}
                  required
                />
                {errors.name && <InputError message={errors.name} className="mt-2" />}
              </div>

              <div className="space-y-2">
                <InputLabel htmlFor="email" value={t('auth.email')} className="text-white" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={values.email}
                  className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-30 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm text-white placeholder-gray-300"
                  onChange={handleChange}
                  required
                />
                {errors.email && <InputError message={errors.email} className="mt-2" />}
              </div>

              <div className="pt-4">
                <PrimaryButton type="submit" className="w-full justify-center">
                  {t('auth.update_profile')}
                </PrimaryButton>
              </div>
            </form>
          </div>

          {/* Password Update */}
          <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-200 border-opacity-10">
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-500 border-opacity-30 drop-shadow-md">{t('auth.update_password')}</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <InputLabel htmlFor="password" value={t('auth.new_password')} className="text-white" />
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={values.password}
                  className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-30 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm text-white placeholder-gray-300"
                  onChange={handleChange}
                />
                {errors.password && <InputError message={errors.password} className="mt-2" />}
              </div>

              <div className="space-y-2">
                <InputLabel htmlFor="password_confirmation" value={t('auth.confirm_new_password')} className="text-white" />
                <TextInput
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={values.password_confirmation}
                  className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-30 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm text-white placeholder-gray-300"
                  onChange={handleChange}
                />
                {errors.password_confirmation && <InputError message={errors.password_confirmation} className="mt-2" />}
              </div>

              <div className="pt-4">
                <PrimaryButton type="submit" className="w-full justify-center">
                  {t('auth.update_password')}
                </PrimaryButton>
              </div>
            </form>

            {/* Delete Account Section */}
            <div className="mt-10 pt-6 border-t border-gray-500 border-opacity-30">
              <h2 className="text-xl font-semibold text-red-400 mb-4">{t('auth.delete_account')}</h2>

              <p className="text-gray-300 mb-4 text-sm">
                {t('auth.delete_account_warning')}
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <InputLabel htmlFor="delete_password" value={t('auth.current_password')} className="text-white" />
                  <TextInput
                    id="delete_password"
                    type="password"
                    name="delete_password"
                    value={values.delete_password}
                    className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-30 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm text-white placeholder-gray-300"
                    onChange={handleChange}
                  />
                </div>

                <DangerButton
                  onClick={handleDeleteAccount}
                  className="w-full justify-center"
                >
                  {t('auth.delete_account')}
                </DangerButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition duration-150 ease-in-out"
          >
            ← {t('auth.back_to_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
