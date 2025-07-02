<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Drop the unique index on email
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_email_unique');
        });

        // Create a trigger to prevent inserting duplicate emails for non-deleted users
        DB::unprepared('
            CREATE TRIGGER prevent_duplicate_email_insert
            BEFORE INSERT ON users
            FOR EACH ROW
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM users
                    WHERE email = NEW.email
                    AND deleted_at IS NULL
                ) THEN
                    SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Duplicate email for active user is not allowed.";
                END IF;
            END
        ');

        // Create a trigger to prevent updating email to a duplicate for non-deleted users
        DB::unprepared('
            CREATE TRIGGER prevent_duplicate_email_update
            BEFORE UPDATE ON users
            FOR EACH ROW
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM users
                    WHERE email = NEW.email
                    AND deleted_at IS NULL
                    AND id != OLD.id
                ) THEN
                    SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Duplicate email for active user is not allowed.";
                END IF;
            END
        ');
    }

    public function down()
    {
        // Drop triggers
        DB::unprepared('DROP TRIGGER IF EXISTS prevent_duplicate_email_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS prevent_duplicate_email_update');

        // Recreate unique index on email
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });
    }
};
