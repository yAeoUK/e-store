<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('make:admin {email : Email of an existing registered user to promote to admin}')]
#[Description('Promote an existing user to the admin role. Intended for bootstrapping the first admin account.')]
class MakeAdmin extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = (string) $this->argument('email');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email [{$email}].");

            return self::FAILURE;
        }

        $user->assignRole('admin');

        $this->info("{$user->name} ({$user->email}) is now an admin.");

        return self::SUCCESS;
    }
}
