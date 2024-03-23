export const Clan = {
    0: 'Assamite',
    1: 'Brujah',
    2: 'Cappadocian',
    3: 'Setite',
    4: 'Gangrel',
    5: 'Giovanni',
    6: 'Lasombra',
    7: 'Malkavian',
    8: 'Nosferatu',
    9: 'Ravnos',
    10: 'Salubrien',
    11: 'Toreador',
    12: 'Tremere',
    13: 'Tzimisce',
    14: 'Ventrue'
}

export const Predation = {
    0: 'Biberonneur',
    1: 'Chat de gouttière',
    2: 'Consensualiste',
    3: 'Fermier',
    4: 'Lamproie',
    5: 'Marchand de sable',
    6: 'Osiris',
    7: 'Parasite domestique',
    8: 'Reine de la nuit',
    9: 'Succube',
    10: 'Extortion'
}

export const Attributes = {
    'strength': 'Force',
    'charisma': 'Charisme',
    'intelligence': 'Intelligence',
    'dexterity': 'Dextérité',
    'manipulation': 'Manipulation',
    'cunning': 'Astuce',
    'stamina': 'Vigueur',
    'composure': 'Sang-Froid',
    'resolve': 'Résolution'
}

export const Skills = [
    {
        "id": 0,
        "name": "gun",
        "fullname": "Armes à feu"
    },
    {
        "id": 1,
        "name": "animals",
        "fullname": "Animaux"
    },
    {
        "id": 2,
        "name": "erudition",
        "fullname": "Érudition"
    },
    {
        "id": 3,
        "name": "craft",
        "fullname": "Artisanat"
    },
    {
        "id": 4,
        "name": "command",
        "fullname": "Commandement"
    },
    {
        "id": 5,
        "name": "finance",
        "fullname": "Finances"
    },
    {
        "id": 6,
        "name": "athletism",
        "fullname": "Athlétisme"
    },
    {
        "id": 7,
        "name": "empathy",
        "fullname": "Empathie"
    },
    {
        "id": 8,
        "name": "investigation",
        "fullname": "Investigation"
    },
    {
        "id": 9,
        "name": "brawl",
        "fullname": "Bagarre"
    },
    {
        "id": 10,
        "name": "etiquette",
        "fullname": "Étiquette"
    },
    {
        "id": 11,
        "name": "medicine",
        "fullname": "Médecine"
    },
    {
        "id": 12,
        "name": "drive",
        "fullname": "Conduite"
    },
    {
        "id": 13,
        "name": "night",
        "fullname": "Éxpérience de la rue"
    },
    {
        "id": 14,
        "name": "occult",
        "fullname": "Occultisme"
    },
    {
        "id": 15,
        "name": "stealth",
        "fullname": "Furtivité"
    },
    {
        "id": 16,
        "name": "intimidation",
        "fullname": "Intimidation"
    },
    {
        "id": 17,
        "name": "politic",
        "fullname": "Politique"
    },
    {
        "id": 18,
        "name": "sleight",
        "fullname": "Larcin"
    },
    {
        "id": 19,
        "name": "representation",
        "fullname": "Performance"
    },
    {
        "id": 20,
        "name": "science",
        "fullname": "Sciences"
    },
    {
        "id": 21,
        "name": "melee",
        "fullname": "Mêlée"
    },
    {
        "id": 22,
        "name": "persuasion",
        "fullname": "Persuasion"
    },
    {
        "id": 23,
        "name": "tech",
        "fullname": "Technologies"
    },
    {
        "id": 24,
        "name": "survival",
        "fullname": "Survie"
    },
    {
        "id": 25,
        "name": "subterfuge",
        "fullname": "Subterfuge"
    },
    {
        "id": 26,
        "name": "vigilance",
        "fullname": "Vigilance"
    }
]

export const Specializations = {
    'gun': ["Arbalètes", "Vente", "Fabrication", "Chargement manuel de munitions", "Dégainage rapide", "Snipers", "Tirs acrobatiques"],
    'animals': ["Entraînement à l'attaque", "Chats", "Chiens", "Fauconnerie", "Chevaux", "Apaisement", "Rats", "Serpents", "Entraînement aux tours", "Loups"],
    'erudition': ["Architecture", "Littérature anglaise", "Histoire de l'art", "Histoire", "Journalisme", "Philosophie", "Recherche", "Enseignement", "Théologie"],
    'craft': ["Menuiserie", "Gravure", "Design", "Peinture", "Sculpture", "Couture", "Forge d'armes"],
    'command': ["Ordres", "Inspiration", "Discours", "Praxis", "Dynamique d'équipe", "Meute de guerre"],
    'finance': ["Estimation", "Secteur bancaire", "Marchés noirs", "Manipulation des devises", "Oeuvres d'art", "Malversations", "Blanchiment d'argent", "Bourse"],
    'athletism': ["Acrobaties", "Tir à l'arc", "Escalade", "Endurance", "Saut", "Parkour", "Natation", "Lancer"],
    'empathy': ["Ambitions", "Désirs", "Détection des mensonges", "Émotions", "Réconfort", "Interrogatoire", "Motivations", "Phobies", "Vices"],
    'investigation': ["Criminologie", "Déduction", "Médecine légale", "Personnes disparues", "Meurtres", "Mystères paranormaux", "Analyse du trafic sur internet"],
    'brawl': ["Animaux", "Mortels armés", "Bagarres de bar", "Lutte", "Descendants", "Matchs de sport de combat", "Mortels désarmés", "Loup-Garous", "Sous forme de la Bête de Protéisme"],
    'etiquette': ["Anarchs", "Camarilla", "Célébrités", "Corporations", "Elysium", "Étiquette féodale", "Milliardaires", "Société secrète"],
    'medicine': ["Premiers soins", "Hématologie", "Pathologies infectieuses", "Pharmacopée", "Phlébotomie", "Chirurgie", "Traumatologie", "Médecine vétérinaire"],
    'drive': ["Véhicules tout-terrain", "Fuite", "Motos", "Courses de rue", "Cascades", "Filature", "Camions", "Voitures anciennes"],
    'night': ["Trafic d'armes", "Marché noir", "Corruption", "Drogues", "Recel", "Gangs", "Tags", "Réputation", "Prostitution", "Survie urbaine"],
    'occult': ["Alchimie", "Magie du sang", "Fées", "Fantômes", "Grimoires", "Infernalisme", "Mages", "Nécromancie", "Nodisme", "Parapsychologie", "Vaudou", "Loups-Garous"],
    'stealth': ["Embuscades", "Foules", "Déguisement", "Se cacher", "Filature", "Déplacement silencieux", "Ville", "Milieu sauvage"],
    'intimidation': ["Racket", "Insultes", "Interrogatoire", "Coercition physique", "Baston de regards", "Menaces voilées"],
    'politic': ["Anarchs", "Camarilla", "Gouvernement d'une ville", "Gouvernement d'un clan", "Diplomatie", "Médias", "Politique internationale", "Politique nationale", "Politique régionale"],
    'sleight': ["Alarmes", "Contrefaçon", "Grand Theft Auto", "Effraction", "Crochetage", "Pickpocket", "Coffres-forts", "Analyse des mesures de sécurité"],
    'representation': ["Comédie", "Danse", "Théâtre", "Batterie", "Guitare", "Claviers", "Poésie", "Allocutions publiques", "Rap", "Chant", "Violon", "Instruments à vent"],
    'science': ["Astronomie", "Biologie", "Chimie", "Démolition", "Ingénierie", "Génétique", "Géologie", "Mathématiques", "Physique"],
    'melee': ["Haches", "Chaînes", "Massue", "Escrime", "Désarmement", "Garrots", "Armes improvisées", "Couteux", "Pieux", "Épées"],
    'persuasion': ["Marchandage", "Baratin", "Interrogatoire", "Plaidoirie", "Négociation", "Rhétorique"],
    'tech': ["Artillerie", "Codage", "Assemblage d'ordinateur", "Extraction de données", "Piratage", "Réseaux", "Téléphones", "Système de surveillance"],
    'survival': ["Désert", "Chasse", "Jungle", "Pistage", "Pièges", "Abris", "Exploration urbaine", "Forêt"],
    'subterfuge': ["Bluff", "Apparence humaine", "Mensonges en béton", "Innocence", "Arnaque", "Séduction"],
    'vigilance': ["Embuscades", "Camouflage", "Objets cachées", "Ouïe", "Intuition", "Odorat", "Vue", "Pièges", "Milieu sauvage"],
}