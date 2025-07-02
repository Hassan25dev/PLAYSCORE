import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import InputError from '../../../Components/InputError';
import InputLabel from '../../../Components/InputLabel';
import PrimaryButton from '../../../Components/PrimaryButton';
import TextInput from '../../../Components/TextInput';
import SelectInput from '../../../Components/SelectInput';
import Checkbox from '../../../Components/Checkbox';

export default function UserEdit({ auth, user, roles, permissions }) {
    const { t } = useTranslation();
    
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '',
        password_confirmation: '',
        is_active: user.is_active,
        permissions: user.permissions ? user.permissions.map(p => p.id) : [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id));
    };

    const handlePermissionChange = (id) => {
        const currentPermissions = [...data.permissions];
        
        if (currentPermissions.includes(id)) {
            setData('permissions', currentPermissions.filter(p => p !== id));
        } else {
            setData('permissions', [...currentPermissions, id]);
        }
    };

    const handleAssignPermissions = (e) => {
        e.preventDefault();
        
        // Use a separate form submission for permissions
        const formData = {
            permissions: data.permissions,
        };
        
        // Call the assignPermissions endpoint
        post(route('admin.users.assign-permissions', user.id), formData);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.user_management.edit_user')}</h2>}
        >
            <Head title={t('admin.user_management.edit_user')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6">
                    <Link
                        href={route('admin.users.index')}
                        className="text-indigo-600 hover:text-indigo-900"
                    >
                        ← {t('admin.actions.back')}
                    </Link>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.user_management.edit_user')}</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <InputLabel htmlFor="name" value={t('auth.name')} />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <InputLabel htmlFor="email" value={t('auth.email')} />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <InputLabel htmlFor="role" value={t('admin.user_management.role')} />
                            <SelectInput
                                id="role"
                                className="mt-1 block w-full"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                required
                                disabled={user.id === auth.user.id}
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </SelectInput>
                            {user.id === auth.user.id && (
                                <p className="text-sm text-red-600 mt-2">
                                    {t('admin.user_management.cannot_change_own_role')}
                                </p>
                            )}
                            <InputError message={errors.role} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    disabled={user.id === auth.user.id}
                                />
                                <InputLabel htmlFor="is_active" value={t('admin.user_management.active')} className="ml-2" />
                            </div>
                            {user.id === auth.user.id && (
                                <p className="text-sm text-red-600 mt-2">
                                    {t('admin.user_management.cannot_change_own_status')}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <InputLabel htmlFor="password" value={t('auth.password')} />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                {t('admin.messages.leave_blank')}
                            </p>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <InputLabel htmlFor="password_confirmation" value={t('auth.confirm_password')} />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="ml-4" disabled={processing}>
                                {t('admin.actions.save')}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.user_management.assign_permissions')}</h3>
                    
                    <form onSubmit={handleAssignPermissions}>
                        <div className="mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={data.permissions.includes(permission.id)}
                                            onChange={() => handlePermissionChange(permission.id)}
                                        />
                                        <InputLabel htmlFor={`permission-${permission.id}`} value={permission.name} className="ml-2" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="ml-4" disabled={processing}>
                                {t('admin.user_management.assign_permissions')}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
