import { useEffect } from 'react';
import EnhancedGuestLayout from '../../Layouts/EnhancedGuestLayout';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { t } from '../../lang/translationHelper';
import darkSouls from '../../images/dark-souls-iii-3840x2160-18750.jpg';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        language: 'fr',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onSuccess: () => {
                console.log('Registration successful');
            },
            onError: (errors) => {
                console.error('Registration errors:', errors);
            },
        });
    };

    return (
        <EnhancedGuestLayout
            backgroundImage={darkSouls}
            title={t('auth.join_community')}
            subtitle={t('auth.register_subtitle')}
        >
            <Head title={t('auth.register')} />

            <form onSubmit={submit} className="space-y-5">
                <input type="hidden" name="language" value={data.language} />

                <div className="space-y-2">
                    <InputLabel htmlFor="name" value={t('auth.name')} className="text-white" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder={t('auth.enter_name')}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="email" value={t('auth.email')} className="text-white" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder={t('auth.create_password')}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password_confirmation" value={t('auth.confirm_password')} className="text-white" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-white bg-opacity-20 border-gray-300 border-opacity-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-white placeholder-gray-300"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        placeholder={t('auth.confirm_password_placeholder')}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 border-opacity-20 gap-4">
                    <Link
                        href={route('login')}
                        className="text-sm sm:text-base text-gray-200 hover:text-white transition duration-150 ease-in-out mt-4 sm:mt-0"
                    >
                        {t('auth.have_account')} <span className="underline font-medium">{t('auth.sign_in')}</span>
                    </Link>

                    <PrimaryButton
                        className="w-full sm:w-1/3 justify-center bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                        disabled={processing}
                    >
                        {t('auth.register')}
                    </PrimaryButton>
                </div>
            </form>
        </EnhancedGuestLayout>
    );
}
