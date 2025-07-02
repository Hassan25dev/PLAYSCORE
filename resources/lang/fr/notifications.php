<?php

return [
    // Notification Center
    'center' => [
        'title' => 'Notifications',
        'mark_all_read' => 'Marquer tout comme lu',
        'clear_all' => 'Tout effacer',
        'no_notifications' => 'Vous n\'avez aucune notification.',
        'view_all' => 'Voir toutes les notifications',
    ],

    // Notification Actions
    'actions' => [
        'view' => 'Voir',
        'mark_read' => 'Marquer comme lu',
        'delete' => 'Supprimer',
    ],

    // Notification Types
    'types' => [
        'game_approved' => 'Jeu approuvé',
        'game_rejected' => 'Jeu rejeté',
        'game_under_review' => 'Jeu en cours d\'examen',
        'new_game_submission' => 'Nouvelle soumission de jeu',
        'comment_approved' => 'Commentaire approuvé',
        'comment_rejected' => 'Commentaire rejeté',
        'comment_submission' => 'Nouveau commentaire à modérer',
        'evaluation_approved' => 'Évaluation approuvée',
        'evaluation_rejected' => 'Évaluation rejetée',
        'new_evaluation_submission' => 'Nouvelle soumission d\'évaluation',
        'new_comment' => 'Nouveau commentaire',
        'new_rating' => 'Nouvelle évaluation',
        'new_follower' => 'Nouvel abonné',
        'system_notification' => 'Notification système',
    ],

    // Notification Messages
    'messages' => [
        'game_approved' => 'Votre jeu ":game" a été approuvé et est maintenant en ligne !',
        'game_rejected' => 'Votre jeu ":game" a été rejeté. Veuillez consulter les commentaires.',
        'game_under_review' => 'Votre jeu ":game" est en cours d\'examen par notre équipe.',
        'new_game_submission' => 'Nouvelle soumission de jeu : ":game" par :developer',
        'game_feedback' => 'Vous avez reçu des commentaires sur votre jeu ":game".',
        'comment_approved' => 'Votre commentaire sur ":game" a été approuvé.',
        'comment_rejected' => 'Votre commentaire sur ":game" a été rejeté.',
        'comment_submission' => 'Nouveau commentaire soumis pour ":game" par :user',
        'evaluation_approved' => 'Votre évaluation sur ":game" a été approuvée.',
        'evaluation_rejected' => 'Votre évaluation sur ":game" a été rejetée.',
        'new_evaluation_submission' => 'Nouvelle évaluation soumise pour ":game" par :user',
        'new_comment' => ':user a commenté votre jeu ":game".',
        'comment_reply' => ':user a répondu à votre commentaire sur ":game".',
        'new_rating' => ':user a évalué votre jeu ":game".',
        'wishlist_added' => ':user a ajouté votre jeu ":game" à sa liste de souhaits.',
        'account_verified' => 'Votre compte a été vérifié avec succès.',
        'password_changed' => 'Votre mot de passe a été changé avec succès.',
        'profile_updated' => 'Votre profil a été mis à jour avec succès.',
    ],

    // Email Notifications
    'email' => [
        'subject' => [
            'game_approved' => 'Votre jeu a été approuvé',
            'game_rejected' => 'Votre soumission de jeu a été rejetée',
            'game_feedback' => 'Vous avez reçu des commentaires sur votre jeu',
            'comment_approved' => 'Votre commentaire a été approuvé',
            'comment_rejected' => 'Votre commentaire a été rejeté',
            'comment_submission' => 'Nouveau commentaire nécessitant une modération',
            'evaluation_approved' => 'Votre évaluation a été approuvée',
            'evaluation_rejected' => 'Votre évaluation a été rejetée',
            'new_evaluation_submission' => 'Nouvelle évaluation nécessitant une modération',
            'new_comment' => 'Nouveau commentaire sur votre jeu',
            'comment_reply' => 'Nouvelle réponse à votre commentaire',
            'new_rating' => 'Nouvelle évaluation sur votre jeu',
            'account_verified' => 'Votre compte a été vérifié',
            'password_changed' => 'Votre mot de passe a été changé',
            'profile_updated' => 'Votre profil a été mis à jour',
        ],
        'greeting' => 'Bonjour :name,',
        'footer' => 'Si vous ne souhaitez pas recevoir ces emails, vous pouvez mettre à jour vos préférences de notification dans les paramètres de votre profil.',
    ],

    // Notification Settings
    'settings' => [
        'title' => 'Paramètres de notification',
        'email_notifications' => 'Notifications par email',
        'push_notifications' => 'Notifications push',
        'in_app_notifications' => 'Notifications dans l\'application',
        'game_updates' => 'Mises à jour de jeux',
        'comments' => 'Commentaires',
        'ratings' => 'Évaluations',
        'followers' => 'Abonnés',
        'system' => 'Notifications système',
        'save_settings' => 'Enregistrer les paramètres',
        'settings_saved' => 'Paramètres de notification enregistrés avec succès.',
    ],
];
