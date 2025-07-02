<?php

return [
    // Comment statuses
    'status' => [
        'pending' => 'En attente d\'approbation',
        'approved' => 'Approuvé',
        'flagged' => 'Signalé',
        'deleted' => 'Supprimé',
    ],

    // Comment actions
    'actions' => [
        'add' => 'Ajouter un commentaire',
        'edit' => 'Modifier le commentaire',
        'delete' => 'Supprimer le commentaire',
        'approve' => 'Approuver le commentaire',
        'flag' => 'Signaler le commentaire',
        'reply' => 'Répondre',
    ],

    // Comment form
    'form' => [
        'content' => 'Commentaire',
        'submit' => 'Soumettre le commentaire',
        'update' => 'Mettre à jour le commentaire',
        'cancel' => 'Annuler',
        'flag_reason' => 'Raison du signalement',
    ],

    // Comment labels
    'comment' => 'Commentaire',

    // Comment messages
    'messages' => [
        'added' => 'Commentaire ajouté avec succès ! Il est en attente d\'approbation.',
        'updated' => 'Commentaire mis à jour avec succès !',
        'deleted' => 'Commentaire supprimé avec succès !',
        'approved' => 'Commentaire approuvé avec succès !',
        'flagged' => 'Commentaire signalé avec succès !',
    ],

    // Comment moderation
    'moderation' => [
        'title' => 'Modération des commentaires',
        'pending' => 'Commentaires en attente',
        'flagged' => 'Commentaires signalés',
        'no_comments' => 'Aucun commentaire à modérer.',
    ],
];
