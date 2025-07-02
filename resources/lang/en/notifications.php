<?php

return [
    // Notification Center
    'center' => [
        'title' => 'Notifications',
        'mark_all_read' => 'Mark All as Read',
        'clear_all' => 'Clear All',
        'no_notifications' => 'You have no notifications.',
        'view_all' => 'View All Notifications',
    ],

    // Notification Actions
    'actions' => [
        'view' => 'View',
        'mark_read' => 'Mark as Read',
        'delete' => 'Delete',
    ],

    // Notification Types
    'types' => [
        'game_approved' => 'Game Approved',
        'game_rejected' => 'Game Rejected',
        'game_under_review' => 'Game Under Review',
        'new_game_submission' => 'New Game Submission',
        'comment_approved' => 'Comment Approved',
        'comment_rejected' => 'Comment Rejected',
        'comment_submission' => 'New Comment to Moderate',
        'evaluation_approved' => 'Review Approved',
        'evaluation_rejected' => 'Review Rejected',
        'new_evaluation_submission' => 'New Review Submission',
        'new_comment' => 'New Comment',
        'new_rating' => 'New Rating',
        'new_follower' => 'New Follower',
        'system_notification' => 'System Notification',
    ],

    // Notification Messages
    'messages' => [
        'game_approved' => 'Your game ":game" has been approved and is now live!',
        'game_rejected' => 'Your game ":game" has been rejected. Please check the feedback.',
        'game_under_review' => 'Your game ":game" is now being reviewed by our team.',
        'new_game_submission' => 'New game submission: ":game" by :developer',
        'game_feedback' => 'You have received feedback on your game ":game".',
        'comment_approved' => 'Your comment on ":game" has been approved.',
        'comment_rejected' => 'Your comment on ":game" has been rejected.',
        'comment_submission' => 'New comment submitted for ":game" by :user',
        'evaluation_approved' => 'Your review on ":game" has been approved.',
        'evaluation_rejected' => 'Your review on ":game" has been rejected.',
        'new_evaluation_submission' => 'New review submission for ":game" by :user',
        'new_comment' => ':user commented on your game ":game".',
        'comment_reply' => ':user replied to your comment on ":game".',
        'new_rating' => ':user rated your game ":game".',
        'wishlist_added' => ':user added your game ":game" to their wishlist.',
        'account_verified' => 'Your account has been verified successfully.',
        'password_changed' => 'Your password has been changed successfully.',
        'profile_updated' => 'Your profile has been updated successfully.',
    ],

    // Email Notifications
    'email' => [
        'subject' => [
            'game_approved' => 'Your game has been approved',
            'game_rejected' => 'Your game submission has been rejected',
            'game_feedback' => 'You have received feedback on your game',
            'comment_approved' => 'Your comment has been approved',
            'comment_rejected' => 'Your comment has been rejected',
            'comment_submission' => 'New comment submission requires moderation',
            'evaluation_approved' => 'Your review has been approved',
            'evaluation_rejected' => 'Your review has been rejected',
            'new_evaluation_submission' => 'New review submission requires moderation',
            'new_comment' => 'New comment on your game',
            'comment_reply' => 'New reply to your comment',
            'new_rating' => 'New rating on your game',
            'account_verified' => 'Your account has been verified',
            'password_changed' => 'Your password has been changed',
            'profile_updated' => 'Your profile has been updated',
        ],
        'greeting' => 'Hello :name,',
        'footer' => 'If you do not want to receive these emails, you can update your notification preferences in your profile settings.',
    ],

    // Notification Settings
    'settings' => [
        'title' => 'Notification Settings',
        'email_notifications' => 'Email Notifications',
        'push_notifications' => 'Push Notifications',
        'in_app_notifications' => 'In-App Notifications',
        'game_updates' => 'Game Updates',
        'comments' => 'Comments',
        'ratings' => 'Ratings',
        'followers' => 'Followers',
        'system' => 'System Notifications',
        'save_settings' => 'Save Settings',
        'settings_saved' => 'Notification settings saved successfully.',
    ],
];
