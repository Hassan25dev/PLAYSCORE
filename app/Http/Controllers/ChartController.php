<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Jeu;
use App\Models\Comment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ChartController extends Controller
{
    // Statistiques d'évaluation pour un jeu
    public function stats(Jeu $jeu)
    {
        $ratings = Evaluation::where('jeu_id', $jeu->id)
            ->select('note', DB::raw('COUNT(*) as count'))
            ->groupBy('note')
            ->get();

        return view('jeux.stats', compact('ratings'));
    }

    /**
     * Get user activity data over time for charts
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function userActivityData(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Default to last 12 months if not specified
        $period = $request->input('period', '12months');

        // Determine start date based on period
        $startDate = null;
        switch ($period) {
            case '30days':
                $startDate = Carbon::now()->subDays(30);
                break;
            case '90days':
                $startDate = Carbon::now()->subDays(90);
                break;
            case '6months':
                $startDate = Carbon::now()->subMonths(6);
                break;
            case '12months':
            default:
                $startDate = Carbon::now()->subMonths(12);
                break;
        }

        // Get ratings data by month
        $ratings = Evaluation::where('utilisateur_id', $user->id)
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Get comments data by month
        $comments = Comment::where('user_id', $user->id)
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Format data for chart
        $months = [];
        $ratingCounts = [];
        $commentCounts = [];

        // Create a range of months from start date to now
        $currentDate = Carbon::now();
        $monthIterator = Carbon::instance($startDate)->startOfMonth();

        while ($monthIterator->lte($currentDate)) {
            $yearMonth = $monthIterator->format('Y-m');
            $months[] = $monthIterator->format('M Y'); // e.g., "Jan 2023"

            // Find rating count for this month
            $ratingData = $ratings->first(function ($item) use ($monthIterator) {
                return $item->year == $monthIterator->year && $item->month == $monthIterator->month;
            });
            $ratingCounts[] = $ratingData ? $ratingData->count : 0;

            // Find comment count for this month
            $commentData = $comments->first(function ($item) use ($monthIterator) {
                return $item->year == $monthIterator->year && $item->month == $monthIterator->month;
            });
            $commentCounts[] = $commentData ? $commentData->count : 0;

            $monthIterator->addMonth();
        }

        return response()->json([
            'labels' => $months,
            'datasets' => [
                [
                    'label' => 'Ratings Given',
                    'data' => $ratingCounts,
                ],
                [
                    'label' => 'Comments Posted',
                    'data' => $commentCounts,
                ],
            ],
        ]);
    }
}