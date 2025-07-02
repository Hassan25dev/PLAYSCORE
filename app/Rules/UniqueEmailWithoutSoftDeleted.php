<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\User;

class UniqueEmailWithoutSoftDeleted implements Rule
{
    protected $userId;

    public function __construct($userId = null)
    {
        $this->userId = $userId;
    }

    public function passes($attribute, $value)
    {
        $query = User::withTrashed()
            ->where('email', $value)
            ->whereNull('deleted_at');

        if ($this->userId) {
            $query->where('id', '!=', $this->userId);
        }

        return !$query->exists();
    }

    public function message()
    {
        return 'The :attribute has already been taken.';
    }
}
