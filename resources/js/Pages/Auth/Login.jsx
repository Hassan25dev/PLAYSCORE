import { useEffect } from 'react';
import Checkbox from '../../components/Checkbox';
import EnhancedGuestLayout from '../../Layouts/EnhancedGuestLayout';
import InputError from '../../components/InputError';
import InputLabel from '../../components/InputLabel';
import PrimaryButton from '../../components/PrimaryButton';
import TextInput from '../../components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { t } from '../../lang/translationHelper';
import bloodborne from '../../images/bloodborne-3840x2160-13121.jpg';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <EnhancedGuestLayout
            backgroundImage={bloodborne}
            title={t('auth.welcome_back')}
            subtitle={t('auth.login_subtitle')}
        >
            <Head title={t('auth.login')} />

            {status && <div className="mb-4 font-medium text-sm text-green-600 bg-green-100 p-3 rounded-lg">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value={t('auth.email')} className="text-white" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={t('auth.enter_email')}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password" value={t('auth.password')} className="text-white" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder={t('auth.enter_password')}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <span className="ms-2 text-sm text-gray-200">{t('auth.remember_me')}</span>
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-gray-200 hover:text-white underline transition duration-150 ease-in-out order-2 sm:order-1 text-center sm:text-left"
                        >
                            {t('auth.forgot_password')}
                        </Link>
                    )}

                    <PrimaryButton
                        className="w-full sm:w-1/2 justify-center order-1 sm:order-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                        disabled={processing}
                    >
                        {t('auth.login')}
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6 pt-4 border-t border-gray-200 border-opacity-10">
                    <Link
                        href={route('register')}
                        className="text-sm sm:text-base text-gray-200 hover:text-white transition duration-150 ease-in-out"
                    >
                        {t('auth.dont_have_account')} <span className="underline font-medium">{t('auth.register_now')}</span>
                    </Link>
                </div>
            </form>
        </EnhancedGuestLayout>
    );
}
