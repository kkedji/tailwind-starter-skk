
const options = [
    { label: "Très Faible", value: 0 },
    { label: "Faible", value: 50 },
    { label: "Moyen", value: 75 },
    { label: "Elevé", value: 100 },
];

export const analysisConfig = {
    entrepreneur: {
        title: "Risques liés à l'entrepreneur",
        totalPonderation: 100,
        factors: {
            situationFamiliale: { id: "1", label: "Situation familiale", ponderation: 2, analyse: "Si elle est stable, elle ne constitue pas un facteur de risque. Le contraire est un facteur qui provoque l'impayé", options },
            niveauEtude: { id: "2", label: "Niveau d'étude, spécialité, diplôme et autres", ponderation: 3, analyse: "Plus il est faible, il constitue un facteur de risque surtout lorsque l'activité exige un certain niveau d'instruction", options },
            typeHabitation: { id: "3", label: "Type d'habitation", ponderation: 5, analyse: "Selon que le demandeur soit propriétaire ou locataire avec ou sans crédit, le type d'habitation a un impact direct sur sa surface patrimoniale dont la faiblesse est un facteur de risque en fonction du montant sollicité. (Locataire ou propriétaire avec crédit, est un facteur de risques).", options },
            nbEnfants: { id: "4", label: "Nombre d'enfants à charge", ponderation: 5, analyse: "Plus il est important, il est un facteur de risque. Mais, il n'est pas suspensif et doit être pris en compte dans le cash-flow du ménage.", options },
            succession: { id: "5", label: "Succession", ponderation: 10, analyse: "L'entrepreneur doit désigner un successeur. La non désignation est un facteur de risque suspensif. (Acte de succession à obtenir, personne à contacter en cas de danger)", options },
            expGlobale: { id: "6", label: "Expérience globale dans le secteur", ponderation: 10, analyse: "En termes d'expérience global, un minimum de 12 mois est requis et un minimum de 3 mois est exigé au sein du secteur de l'activité présentée. Sinon, le dossier présente un facteur de risque suspensif. (Globalement dans le secteur, 12 mois et au moins 3 mois dans le métier).", options },
            expPro: { id: "7", label: "Expérience professionnelle", ponderation: 5, analyse: "L'expérience professionnelle en termes de postes occupés, d'activités exercées et de la nature de l'organisme a un impact direct sur la capacité personnelle du demandeur. Plus elle est faible, elle constitue un facteur de risque et source d'impayé lorsque le secteur d'activité exige une certaine expérience. Un tel facteur est traité en termes de conseils.", options },
            envFamilial: { id: "8", label: "Environnement familial", ponderation: 5, analyse: "Il s'agit particulièrement de l'évaluation de la surface patrimoniale personnelle du demandeur en connexion avec les soutiens de sa famille et de ses propres biens. Sa faiblesse est un facteur de risque lorsque le montant sollicité exige une certaine surface. Un tel facteur de risque est traité par un redimensionnement du besoin en fonction du montant sollicité.(En connexion avec la surface patrimoniale. Plus il est faible plus le risque est présent si montant sollicité est élevé).", options },
            compManagement: { id: "9", label: "Compétence en Management", ponderation: 5, analyse: "Lorsque le secteur de l'activité présentée exige de la part du demandeur une certaine compétence en gestion, une faiblesse est source de facteur de risque et est traité sous forme de conseils.", options },
            histBancaire: { id: "10", label: "Historique bancaire", ponderation: 10, analyse: "Dans la mesure de la disponibilité de l'information, l'historique bancaire, sert de signal sur la solvabilité à court terme du demandeur de crédit.", options },
            histCredit: { id: "11", label: "Historique de crédit", ponderation: 15, analyse: "Dans la mesure de la disponibilité de l'information, l'historique de crédit, lorsqu'elle mauvaise et confirmée est un réel facteur endémique de risque qui peut être suspensif.", options },
            autresAffaires: { id: "12", label: "Autres affaires détenues par le demandeur", ponderation: 5, analyse: "Les autres affaires détenues par l'entrepreneur ont un directe sur le cash-flow du ménage et sur le cash-flow total. Elles constituent un facteur de risque lorsqu'elles influencent négativement le cash-flow total moyen raisonné. Ce facteur de risque peut être traité en termes de conseils.", options },
            surfacePatrimoniale: { id: "13", label: "Surface patrimoniale totale", ponderation: 20, analyse: "Plus elle est faible, elle est un facteur de risque qui conduit au redimensionnement du besoin de crédit", options },
        }
    },
    entreprise: {
        title: "Risques liés à l'entreprise",
        totalPonderation: 100,
        factors: {
            locaux: { id: "1", label: "Locaux d'exploitation", ponderation: 15, analyse: "Il s'agit d'énumérer les actifs de production et de commercialisation qui sont exploités par l'entreprise (ateliers de production, magasins de stockage, les points de vente). Ces actifs sont-ils la propriété de l'entreprise ou de l'entrepreneur ? Sont – ils loués ou non? Le risque réside dans l'amalgame qui en résulte et qui met à mal l'estimation de la situation patrimoniale de l'entreprise.", options },
            repartitionCapital: { id: "2", label: "Evolution de la répartition du capital", ponderation: 10, analyse: "Il s'agit d'examiner l'évolution de l'actionnariat et de la structure du capital depuis la création jusqu'à ce jour (les principaux actionnaires, et la part de capital détenue par chacun dans le temps et dans l'espace). Le risque constitue l'utilisation d'actionnaires apparents qui met à mal l'évaluation de la robustesse de la gouvernance de l'entreprise.", options },
            dirigeants: { id: "3", label: "Dirigeants de l'entreprise", ponderation: 10, analyse: "Il s'agit d'énumérer les principaux responsables qui supervisent les opérations dans l'entreprise (niveau de compétence, formation et expérience) et (s'assurer que l'entreprise ne se repose pas sur le seul propriétaire). Le risque est le fait d'avoir des dirigeants non compétents en cas d'absence du promoteur.", options },
            autresAffaires: { id: "4", label: "Autres affaires détenues par l'entreprise", ponderation: 10, analyse: "Il s'agit d'identifier les autres entreprises détenues par la société, les prises de participation et leur importance. Le risque de minorer la surface financière de l'entreprise.", options },
            biensUtilises: { id: "5", label: "Biens utilisés par l'entreprise", ponderation: 20, analyse: "Il s'agit d'identifier tous les moyens économiques utilisés par l'entreprise dans son exploitation (équipements, machines, outillage, matériels informatiques, mobiliers de bureau, matériels roulants), (propriété, location, ou crédit bail, vétusté, investissement à prévoir). Le risque est de faire l'amalgame entre ce qui est réellement engagé dans l'exploitation et ce qui ne l'est pas.", options },
            moyensHumains: { id: "6", label: "Moyens humains", ponderation: 20, analyse: "Il s'agit d'indiquer l'effectif du personnel cadre, agents de maîtrise et ouvriers aux trois niveaux administratif, production et commercial. Il faut déterminer la masse salariale, le volume de cotisations sociales, le personnel déclaré et la prévision d'embauche. (grève, mouvements sociaux, âge moyen du personnel, stabilité du personnel, turnover). Le risque de ne pas prendre en compte les charges liées à la régularisation des déclarations du personnel devant modifier le Cashflow?", options },
            organisation: { id: "7", label: "Organisation et management", ponderation: 25, analyse: "- de s'assurer que la succession de l'entrepreneur est bien définie dans le cas d'entreprise individuelle et des actionnaires majoritaires dans le cas des sociétés, (qui? comment ? depuis quand...)\n-d'analyser comment les services et les opérations sont organisés, supervisés et contrôlés. S'assurer de l'existence de procédures appropriées.\n-d'examiner la tenue de la comptabilité (internalisée ou externalisée), de s'assurer que les déclarations fiscales et administratives sont régulièrement effectuées.", options },
        }
    },
    activite: {
        title: "Risques liés à l'activité",
        totalPonderation: 100,
        factors: {
            description: { id: "1", label: "Description de l'activité", ponderation: 10, analyse: "Il s'agit d'analyser la pertinence de l'activité (interdite ou surveillée), le secteur concerné, la tendance (développement, stagnation, déclin, saisonnalité). Le risque est une méconnaissance du secteur qui peut affecter dangereusement le dossier de crédit.(Confère loi des finances de l'année, activité interdite, surfiscalisée, défiscalisée...).", options },
            produitsServices: { id: "2", label: "Produits / Services", ponderation: 10, analyse: "Chiffre d'Affaires : ... Le risque est qu'une mauvaise déclinaison analytique du chiffre d'affaires cache les caractéristiques du risque cédé.", options },
            clients: { id: "3", label: "Clients", ponderation: 20, analyse: "Il s'agit d'identifier les principaux clients... Il s'agit de l'évaluation du risque cédé. Les clients qui paient au comptant ne pèse pas sur le Fonds de roulement, mais facilement non maîtrisable car facilement camouflable. Les ventes au comptant sont risqués (compte de confrères, avances aux fournisseurs, ...).", options },
            fournisseurs: { id: "4", label: "Fournisseurs", ponderation: 10, analyse: "Principaux fournisseurs... Il s'agit de l'évaluation du risque cédant. La concentration des fournisseurs en termes d'affaires, le % des fournisseurs à l'étranger versus locaux sont des risques.", options },
            caracteristiquesMarche: { id: "5", label: "Caractéristiques du marché et positionnement", ponderation: 20, analyse: "Taille du marché... Concurrents... Demande... Sensibilité au climat... Réglementation...", options },
            politiqueVentes: { id: "6", label: "Politique des ventes", ponderation: 10, analyse: "Diversification, Fidélisation, Veille, Action marketing... Le risque est que l'absence d'une véritable politique de vente hypothèque l'évolution normale du chiffre d'affaire qui peut mettre à mal le remboursement du crédit.", options },
            gestionProduction: { id: "7", label: "Gestion de production et des stocks", ponderation: 10, analyse: "Organisation, Répartition des tâches, Optimisation, Gestion des risques... Le risque est qu'une mauvaise organisation hypothèque l'évolution normale de la production.", options },
            politiqueAchats: { id: "8", label: "Politique des achats", ponderation: 10, analyse: "Gestion de stock, Diversification fournisseurs, Planification... Le risque est qu'une mauvaise politique des achats peut causer des contres performances dans la production en augmentant ainsi les risques cédants et cédés.", options },
        }
    },
    cashFlow: {
        title: "Risques liés au cash-flow",
        totalPonderation: 100,
        factors: {
            calendrier: { id: "1", label: "Calendrier (3 à 12 mois glissant)", ponderation: 0, analyse: "Il s'agit de définir un calendrier... Le risque est la mauvaise manipulation du calendrier.", options },
            soldeInitial: { id: "2", label: "Solde initial", ponderation: 5, analyse: "Il s'agit du solde correspondant à la situation de trésorerie du mois de démarrage de calendrier. Un mauvais choix de ce solde biaise le cash-flow. Risque est de se tromper sur le solde de départ.", options },
            nbMois: { id: "3", label: "Nombre de mois à renseigner", ponderation: 0, analyse: "Il dépend du calendrier défini par rapport à la période retenue pour la reconstitution du cash flow qui ne saurait dépasser 12 mois", options },
            recettes: { id: "4", label: "Recettes d'exploitation", ponderation: 25, analyse: "Ventes, Autres recettes... Le risque est qu'une mauvaise estimation biaise le cash-flow moyen.", options },
            depenses: { id: "5", label: "Dépenses d'exploitation", ponderation: 20, analyse: "Achats, Frais de personnel, Charges externes... Le risque est qu'une mauvaise estimation biaise le cash-flow moyen.", options },
            autresDepenses: { id: "6", label: "Autres dépenses d'exploitation", ponderation: 20, analyse: "CNSS, Impôt sur le revenu, Loyers, Electricité, Transport...", options },
            cashFlowExploitation: { id: "7", label: "CASH FLOW D'EXPLOITATION (A) - (B)", ponderation: 0, analyse: "Il s'agit de générer la différence mois par mois entre les recettes d'exploitation et les dépenses d'exploitation", options },
            cashFlowRisonne: { id: "8", label: "CASH FLOW D'EXPLOITATION (A) - (B) raisonné", ponderation: 15, analyse: "Le risque est qu'une mauvaise estimation biaise le cash-flow moyen", options },
            cashFlowHorsExploitation: { id: "9", label: "CASH-FLOW HORS EXPLOITATION", ponderation: 5, analyse: "Le risque est qu'une mauvaise estimation biaise le cash-flow moyen", options },
            cashFlowMenage: { id: "10", label: "CASH-FLOW du Ménage", ponderation: 5, analyse: "Le risque est qu'une mauvaise estimation biaise le cash-flow moyen", options },
            cashFlowTotal: { id: "11", label: "CASH-FLOW TOTAL", ponderation: 0, analyse: "C'est la somme algébrique du cash-flow d'exploitation, hors exploitation et du cash-flow du ménage", options },
            soldeCumule: { id: "12", label: "SOLDE DU CASH-FLOW TOTAL CUMULE", ponderation: 0, analyse: "C'est la somme cumulé des soldes du cash-flow total mensuel", options },
        }
    },
    historique: {
        title: "Risques liés à l'historique bancaire",
        totalPonderation: 100,
        factors: {
            nosLivres: { id: "1", label: "Historique des comptes dans nos livres (à réaliser par compte)", ponderation: 60, analyse: "-Durée de la relation\n-Nombre de comptes\n-Montant des mouvements\n-Solde moyen\n-Nombre de jours débiteurs\n-Nombre de jours dépassement\n-Nombre de jours créditeurs", options },
            autresInstitutions: { id: "2", label: "Historique des comptes dans les autres institutions (à réaliser par institution)", ponderation: 40, analyse: "Analyser les mêmes points que pour nos livres pour évaluer le risque de surendettement.", options },
        }
    }
};

export const institutionalWeights = {
    entrepreneur: 15,
    entreprise: 10,
    activite: 30,
    historique: 15,
    cashFlow: 30,
};
