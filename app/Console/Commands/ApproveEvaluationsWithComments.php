<?php

namespace App\Console\Commands;

use App\Models\Evaluation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ApproveEvaluationsWithComments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'evaluations:approve-with-comments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Approve all evaluations that have comments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Approving evaluations with comments...');

        $count = Evaluation::whereNotNull('commentaire')
            ->where('is_approved', false)
            ->update(['is_approved' => true]);

        $this->info("Approved {$count} evaluations with comments.");
        Log::info("Command evaluations:approve-with-comments approved {$count} evaluations.");

        return Command::SUCCESS;
    }
}
