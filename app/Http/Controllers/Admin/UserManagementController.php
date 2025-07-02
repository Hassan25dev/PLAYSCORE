<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:admin']);
    }

    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        // Get filter parameters
        $role = $request->input('role');
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Build query
        $query = User::query();

        // Apply role filter if provided
        if ($role) {
            $query->where('role', $role);

            // Log the role filter for debugging
            \Illuminate\Support\Facades\Log::info("Filtering users by role: {$role}");
        }

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Get users with pagination
        $users = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Get counts for different roles
        $counts = [
            'total' => User::count(),
            'admin' => User::where('role', 'admin')->count(),
            'developer' => User::where('role', 'developer')->count(),
            'moderator' => User::where('role', 'moderator')->count(),
            'user' => User::where('role', 'user')->count(),
        ];

        // Get all roles for the filter dropdown
        $roles = Role::all();

        return Inertia::render('Admin/UserManagement/Index', [
            'users' => $users,
            'counts' => $counts,
            'roles' => $roles,
            'filters' => [
                'role' => $role,
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Admin/UserManagement/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|exists:roles,name',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', __('admin.user_management.user_created'));
    }

    /**
     * Display the specified user.
     */
    public function show(string $id)
    {
        $user = User::with(['roles.permissions'])
            ->findOrFail($id);

        return Inertia::render('Admin/UserManagement/Show', [
            'user' => $user,
            'userRoles' => $user->roles,
            'userPermissions' => $user->permissions,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(string $id)
    {
        $user = User::with('roles.permissions')->findOrFail($id);
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        // Get user's role IDs
        $userRoleIds = $user->roles->pluck('id')->toArray();

        return Inertia::render('Admin/UserManagement/Edit', [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
            'userRoleIds' => $userRoleIds,
            'userPermissions' => $user->permissions,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // Prevent changing own role if admin
        if (Auth::id() == $user->id && $request->input('role') != $user->role) {
            return redirect()->back()
                ->with('error', __('admin.user_management.cannot_change_own_role'));
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'role' => 'required|string|exists:roles,name',
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Sync roles if provided
        if ($request->has('roles')) {
            $user->roles()->sync($validated['roles']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', __('admin.user_management.user_updated'));
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting own account
        if (Auth::id() == $user->id) {
            return redirect()->back()
                ->with('error', __('admin.user_management.cannot_delete_self'));
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', __('admin.user_management.user_deleted'));
    }

    /**
     * Assign permissions to a user through roles.
     */
    public function assignPermissions(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->roles()->sync($validated['roles']);

        return redirect()->route('admin.users.edit', $user->id)
            ->with('success', __('admin.user_management.permissions_updated'));
    }

    /**
     * Change user status (active/inactive).
     */
    public function toggleStatus(string $id)
    {
        $user = User::findOrFail($id);

        // Prevent changing own status
        if (Auth::id() == $user->id) {
            return redirect()->back()
                ->with('error', __('admin.user_management.cannot_change_own_status'));
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'activated' : 'deactivated';

        return redirect()->back()
            ->with('success', __("admin.user_management.user_{$status}"));
    }
}
