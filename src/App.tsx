

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import CreditApplicationPage from './components/CreditApplicationPage';
import SynthesePage from './components/SynthesePage';
import GarantiesPage from './components/GarantiesPage';
import EntrepreneursPage from './components/EntrepreneursPage';
import EntreprisePage from './components/EntreprisePage';
import ActiviteMarchePage from './components/ActiviteMarchePage';
import CompteDeResultatPage from './components/CompteDeResultatPage';
import BilanPage from './components/BilanPage';
import HistoriquePage from './components/HistoriquePage';
import TresoreriePage from './components/TresoreriePage';
import RatiosPage from './components/RatiosPage';
import EcheancierPage from './components/EcheancierPage';
import CalculsOptionnelsPage from './components/CalculsOptionnelsPage';
import AnalystDashboard from './components/AnalystDashboard';
import AnalystView from './components/AnalystView';
import { CreditApplicationData, Entrepreneur, EntrepriseData, ActiviteMarcheData, HistoriqueBancaireData, TresorerieData, TresorerieRowData, DynamicTresorerieRow, GarantiesData, RatiosData, EcheancierData, SyntheseData, CalculsOptionnelsData, CompteDeResultatData, BilanData, DossierStatus, AnalyseData, ScoringData } from './types';
import { analysisConfig } from './components/analyse/analysisConfig';

const initialEntrepreneur: Entrepreneur = {
  nom: '',
  prenom: '',
  telephone: '',
  genre: 'Homme',
  cni: '',
  dateNaissance: '',
  age: '',
  situationFamiliale: 'Célibataire',
  nbPersACharge: 0,
  adresse: '',
  habitation: 'Locataire',
  niveauEtudes: 'Aucun',
  autresEtudes: '',
  specialite: '',
  experienceProGlobale: '',
  experienceProSecteur: '',
  experienceProDetaillee: '',
  environnementFamilial: '',
  competencesManagement: '',
  relationsBancaires: Array(2).fill({
    id: '', banque: '', numeroCompte: '', ouvertureCompte: '', solde: 0, mouvementsN1: 0, mouvementsN: 0, incidents: 0
  }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
  totalSurfacePatrimoniale: 0,
};

const initialEntrepriseData: EntrepriseData = {
    denominationSociale: 'ABC',
    secteurActivite: '',
    siegeSocial: '0',
    ville: '',
    locauxExploitation: '',
    emailSite: '',
    telephone: '',
    dateCreation: '1900-01-01',
    dateDebutActivite: '',
    formeJuridique: 'SARL (Société à Responsabilité Limitée)',
    capitalSocial: 0,
    nPatente: '',
    nRegistreCommerce: '0',
    nifu: '',
    nAffiliationCNSS: '',
    evolutionCapital: Array(3).fill({ id: '', date: '', capital: 0, formeJuridique: '', entrepreneur1: '', k1: 0, entrepreneur2: '', k2: 0, entrepreneur3: '', k3: 0 }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    dirigeants: Array(4).fill({ id: '', nomPrenom: '', fonction: '', formationExperience: '', telephone: '' }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    autresAffaires: Array(3).fill({ id: '', denomination: '', capital: 0, k: 0, activite: '', caht: 0, banque: '' }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    moyensEconomiques: Array(10).fill({ id: '', bienUtilise: 'Terrain', quantiteConsistance: '', valeurCptle: 0, valeurEstimee: 0 }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    moyensHumains: {
        administratif: { nb: 0, cadre: 0, maitrise: 0, ouvrier: 0, total: 0 },
        production: { nb: 0, cadre: 0, maitrise: 0, ouvrier: 0, total: 0 },
        commercial: { nb: 0, cadre: 0, maitrise: 0, ouvrier: 0, total: 0 },
        total: { masseSalariale12Mois: 0, cotisationCNSS12Mois: 0, nbreSalariesDeclares: 0, dtNbSalariesClients: 0, previsionCreationEmploi: '' }
    },
    organisationManagement: {
        preparationReleve: '',
        organisationServices: '',
        comptabilite: '',
        gestionRH: '',
        utilisationInformatique: '',
    },
    syntheseEntreprise: '',
};

const initialActiviteMarcheData: ActiviteMarcheData = {
    produitsServices: Array(4).fill({ id: '', produitService: '', total: 0, negocePct: 0, productionPct: 0, localePct: 0, exportPct: 0, quantites: 0, unitesMesure: '' }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    clients: Array(5).fill({ id: '', denomination: '', rc: '', ville: '', ventesPct: 0 }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    fournisseurs: Array(5).fill({ id: '', denomination: '', ville: '', achatsPct: 0 }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    caracteristiquesMarche: {
        tailleConcurrence: '',
        sensibiliteClimat: '',
        positionnement: '',
    },
    politiqueVentes: {
        diversificationPTF: '',
        veilleConcurrentielle: '',
        determinationObjectifs: '',
    },
    gestionProduction: {
        organisation: '',
        gestionRisques: '',
        gestionStocks: '',
    },
    politiqueAchats: {
        diversificationFournisseurs: '',
        negociationPrix: '',
        gestionAleas: '',
    },
    synthese: '',
};

const initialGarantiesData: GarantiesData = {
  tauxCouvertureMinimum: 0,
  garanties: Array(1).fill(null).map((_, i) => ({
    id: (i+1).toString(),
    lignesCredit: 'Ligne 19',
    garantiesDetenues: '',
    rangOuPct: '',
    reference: '',
    consistance: '',
    valeurOrigine: 0,
    valeurActuelleEstimee: 0,
    encoursCredit: 0,
    valorisationBanque: 0,
  })),
  conditionsSpeciales: Array(3).fill(null).map((_, i) => ({ id: (i+1).toString(), condition: '' })),
  synthese: '',
};

const initialCompteDeResultatData: CompteDeResultatData = {
    dates: { exerciceN: '2014-12-31', exerciceN1: '2013-12-31' },
    nbMois: { exerciceN: 12, exerciceN1: 12 },
    values: {
        RA: { exerciceN: 0, exerciceN1: 0 }, RB: { exerciceN: 0, exerciceN1: 0 },
        RC: { exerciceN: 0, exerciceN1: 0 }, RD: { exerciceN: 0, exerciceN1: 0 },
        RE: { exerciceN: 0, exerciceN1: 0 }, RH: { exerciceN: 0, exerciceN1: 0 },
        RI: { exerciceN: 0, exerciceN1: 0 }, RJ: { exerciceN: 0, exerciceN1: 0 },
        RK: { exerciceN: 0, exerciceN1: 0 }, RL: { exerciceN: 0, exerciceN1: 0 },
        RP: { exerciceN: 0, exerciceN1: 0 }, RQ: { exerciceN: 0, exerciceN1: 0 },
        RS: { exerciceN: 0, exerciceN1: 0 }, SA: { exerciceN: 0, exerciceN1: 0 },
        SC: { exerciceN: 0, exerciceN1: 0 }, SD: { exerciceN: 0, exerciceN1: 0 },
        SK: { exerciceN: 0, exerciceN1: 0 }, SL: { exerciceN: 0, exerciceN1: 0 },
        SM: { exerciceN: 0, exerciceN1: 0 }, SQ: { exerciceN: 0, exerciceN1: 0 },
        SR: { exerciceN: 0, exerciceN1: 0 }, TA: { exerciceN: 0, exerciceN1: 0 },
        TC: { exerciceN: 0, exerciceN1: 0 }, TD: { exerciceN: 0, exerciceN1: 0 },
        TE: { exerciceN: 0, exerciceN1: 0 }, TF: { exerciceN: 0, exerciceN1: 0 },
        TH: { exerciceN: 0, exerciceN1: 0 }, TS: { exerciceN: 0, exerciceN1: 0 },
        TT: { exerciceN: 0, exerciceN1: 0 }, UA: { exerciceN: 0, exerciceN1: 0 },
        UC: { exerciceN: 0, exerciceN1: 0 }, UD: { exerciceN: 0, exerciceN1: 0 },
        UE: { exerciceN: 0, exerciceN1: 0 }, UK: { exerciceN: 0, exerciceN1: 0 },
        UL: { exerciceN: 0, exerciceN1: 0 }, UM: { exerciceN: 0, exerciceN1: 0 },
        UN: { exerciceN: 0, exerciceN1: 0 }, UJ: { exerciceN: 0, exerciceN1: 0 }
    }
};

const initialHistoriqueBancaireData: HistoriqueBancaireData = {
    dateEntreeRelation: '',
    comptesInternes: Array(1).fill({
        id: '', beneficiaireCompte: '', numeroCompte: '', dateOuverture: '',
        mvtsConfiesN1: 0, mvtsConfies12Mois: 0, soldeMoyenN1: 0, soldeMoyen12Mois: 0,
        joursDebiteursN1: 0, joursDebiteurs12Mois: 0, joursDepassementN1: 0,
        joursDepassement12Mois: 0, joursCrediteursN1: 0, joursCrediteurs12Mois: 0
    }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    comptesExternes: Array(1).fill({
        id: '', banque: '', nomBeneficiaire: '', dateEntreeRelation: '',
        mvtsConfiesN1: 0, mvtsConfies12Mois: 0, soldeMoyenN1: 0, soldeMoyen12Mois: 0,
        joursDebiteursN1: 0, joursDebiteurs12Mois: 0, joursDepassementN1: 0,
        joursDepassement12Mois: 0, joursCrediteursN1: 0, joursCrediteurs12Mois: 0
    }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
    cahtN: 0,
    cattcReel: 0,
    commentaires: ''
};

const createTresorerieRow = (): TresorerieRowData => ({
    values: Array(12).fill(0),
    moyenneRaisonnee: 0,
    commentaire: '',
});

const createDynamicTresorerieRow = (label: string): DynamicTresorerieRow => ({
    id: Date.now().toString() + Math.random().toString(),
    label,
    data: createTresorerieRow(),
});

const initialTresorerieData: TresorerieData = {
    soldeDate: '',
    soldeInitial: 0,
    rows: {
        ventesJustifiees: createTresorerieRow(),
        ventesAutreCompte: createTresorerieRow(),
        ventesCompteConfrere: createTresorerieRow(),
        ventesAutres: [createDynamicTresorerieRow('Autres ventes')],
        autresRecettes: [createDynamicTresorerieRow('Autres recettes')],
        achatsJustifies: createTresorerieRow(),
        achatsAutreCompte: createTresorerieRow(),
        achatsCompteConfrere: createTresorerieRow(),
        achatsAutres: [createDynamicTresorerieRow('Autres achats')],
        autresDepenses: [createDynamicTresorerieRow("Autres dépenses d'exploitation")],
        salaireDirigeant: createTresorerieRow(),
        salaires: createTresorerieRow(),
        autresSalaires: [createDynamicTresorerieRow('Autres salaires')],
        cnss: createTresorerieRow(),
        impotsRevenu: createTresorerieRow(),
        loyer: createTresorerieRow(),
        electricite: createTresorerieRow(),
        transport: createTresorerieRow(),
        deplacements: createTresorerieRow(),
        servicesExterieurs: createTresorerieRow(),
        telephone: createTresorerieRow(),
        autresCharges: [createDynamicTresorerieRow('Autres')],
        impotsTaxes: createTresorerieRow(),
        fraisDouanes: createTresorerieRow(),
        fraisFinanciers: createTresorerieRow(),
        tvaAPayer: createTresorerieRow(),
        emprunts: createTresorerieRow(),
        augmentationCapital: createTresorerieRow(),
        apportCC: createTresorerieRow(),
        autresRessources: [createDynamicTresorerieRow('Autres (recup créances, cessions actifs, rembt TVA, ...)')],
        rembEmprunts: createTresorerieRow(),
        dividendes: [createDynamicTresorerieRow('Dividendes / Remboursement CCA')],
        revenusMenage: createTresorerieRow(),
        depensesMenage: createTresorerieRow(),
    },
    justificationVentes: '',
    justificationAchats: '',
    justificationAutresFlux: '',
};

const initialRatiosData: RatiosData = {
    controles: {
        datesExercicesSaisis: { annee1: 'ok', annee2: 'ok' },
        equilibreBilan: { annee1: 'ok', annee2: 'ok' },
        nombreDeMois: { annee1: 12, annee2: 12 },
    },
    dates: { annee1: '2014-12-31', annee2: '2013-12-31' },
    structureSolvabilite: {
        fpTotalBilan: { annee1: '', annee2: '' },
        fpDettesFinancieres: { annee1: '', annee2: '' },
        empruntsCapitauxPermanents: { annee1: '', annee2: '' },
        actifNetComptable: { annee1: 0, annee2: 0 },
        fondsRoulementNetGlobal: { annee1: 0, annee2: 0 },
        besoinFondsRoulement: { annee1: 0, annee2: 0 },
        tresorerie: { annee1: 0, annee2: 0 },
    },
    delais: {
        clients: { annee1: '', annee2: '' },
        stocks: { annee1: '', annee2: '' },
        fournisseurs: { annee1: '', annee2: '' },
    },
    rentabilitePerformance: {
        chargesPersonnel: { annee1: '', annee2: '' },
        rentabiliteExploitation: { annee1: '', annee2: '' },
        chargesFinancieres: { annee1: '', annee2: '' },
        resultatNet: { annee1: '', annee2: '' },
    },
    syntheseFinanciere: '',
    commentaires: {
        structureTresorerie: '',
        performanceRentabilite: '',
    },
};

const initialEcheancierData: EcheancierData = {
  montantPrete: 250000,
  duree: 24,
  tauxAnnuel: 11,
  schedule: Array(84).fill(0).map((_, i) => ({
    mois: i + 1,
    capitalRestantDu: 0,
    rembtCapital: 0,
    rembtInteret: 0,
    echeance: 0,
  })),
};

const initialSyntheseData: SyntheseData = {
    dateImpression: new Date().toISOString().split('T')[0],
    chargeClientele: '',
    directeurAgence: '',
    responsableEngagements: '',
    comite: '',
};

const initialCalculsOptionnelsData: CalculsOptionnelsData = {
    ventes: Array(15).fill(null).map((_, i) => ({ id: (i+1).toString(), nomProduit: '', quantite: 0, prixVenteUnitaire: 0, tva: 18 })),
    achats: Array(15).fill(null).map((_, i) => ({ id: (i+1).toString(), nomProduit: '', quantite: 0, prixAchatUnitaire: 0, tva: 18, fournisseur: '' })),
    marges: Array(15).fill(null).map((_, i) => ({ id: (i+1).toString(), nomProduit: '', quantite: 0, prixAchatUnitaire: 0, prixVenteUnitaire: 0 })),
};

const initialBilanData: BilanData = {
  ok1: 'ok', ok2: 'ok',
  exerciceN: '2014-12-31', exerciceN1: '2013-12-31',
  actif: {
    AB: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AC: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    AE: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AF: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AG: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AH: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    AJ: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AK: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AL: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AM: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AN: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    AP: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AR: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AS: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, AW: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    BA: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    BC: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, BD: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, BE: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, BF: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    BH: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, BI: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, BJ: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    BQ: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, BR: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }, BS: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 },
    BU: { brut: 0, amortProv: 0, brutN1: 0, amortProvN1: 0 }
  },
  passif: {
    CA: { net: 0, netN1: 0 }, CB: { net: 0, netN1: 0 }, CC: { net: 0, netN1: 0 }, CD: { net: 0, netN1: 0 }, CE: { net: 0, netN1: 0 }, CF: { net: 0, netN1: 0 }, CG: { net: 0, netN1: 0 }, CH: { net: 0, netN1: 0 },
    CK: { net: 0, netN1: 0 }, CL: { net: 0, netN1: 0 }, CM: { net: 0, netN1: 0 },
    DA: { net: 0, netN1: 0 }, DB: { net: 0, netN1: 0 }, DC: { net: 0, netN1: 0 }, DD: { net: 0, netN1: 0 }, DE: { net: 0, netN1: 0 },
    DH: { net: 0, netN1: 0 }, DI: { net: 0, netN1: 0 }, DJ: { net: 0, netN1: 0 }, DK: { net: 0, netN1: 0 }, DL: { net: 0, netN1: 0 }, DM: { net: 0, netN1: 0 }, DN: { net: 0, netN1: 0 },
    DQ: { net: 0, netN1: 0 }, DR: { net: 0, netN1: 0 }, DS: { net: 0, netN1: 0 },
    DU: { net: 0, netN1: 0 },
  }
};

const initialAnalyseData: AnalyseData = {
    entrepreneur: Object.keys(analysisConfig.entrepreneur.factors).reduce((acc, key) => {
        acc[key] = { selection: -1, score: 0 };
        return acc;
    }, {} as any),
    entreprise: Object.keys(analysisConfig.entreprise.factors).reduce((acc, key) => {
        acc[key] = { selection: -1, score: 0 };
        return acc;
    }, {} as any),
    activite: Object.keys(analysisConfig.activite.factors).reduce((acc, key) => {
        acc[key] = { selection: -1, score: 0 };
        return acc;
    }, {} as any),
    cashFlow: Object.keys(analysisConfig.cashFlow.factors).reduce((acc, key) => {
        acc[key] = { selection: -1, score: 0 };
        return acc;
    }, {} as any),
    historique: Object.keys(analysisConfig.historique.factors).reduce((acc, key) => {
        acc[key] = { selection: -1, score: 0 };
        return acc;
    }, {} as any),
};

const initialScoringData: ScoringData = {
    scores: {
        entrepreneur: 0,
        entreprise: 0,
        activite: 0,
        historique: 0,
        cashFlow: 0,
    },
    weightedScores: {
        entrepreneur: 0,
        entreprise: 0,
        activite: 0,
        historique: 0,
        cashFlow: 0,
    },
    totalScore: 0,
    decision: 'ACCORD',
    motifs: '',
};


const initialData: Omit<CreditApplicationData, 'id' | 'status' | 'history'> = {
  affaire: 'ABC',
  dossier: '1234567-001-1',
  dateDepot: '2015-02-25',
  sequenceDossier: '1',
  datePremiereVisite: '',
  dateValidationPreComite: '',
  dateDerniereVisite: '',
  dossierCorrect: '1234567',
  numeroClient: '',
  codeAgence: 'AG001',
  denominationSociale: 'ABC',
  agentBancaireNom: '',
  profil: '',
  matricule: '',
  nomDirigeant: '',
  numeroCompte: '',
  formeJuridique: '',
  homme: false,
  femme: false,
  capitalSocial: 'KFCFA',
  dateEntreeRelation: '',
  activiteDescription: '',
  registreCommerce: '',
  secteurActivite: '',
  siegeSocial: '',
  activitePrincipale: '',
  localite: '',
  dateCreationEntreprise: '',
  syntheseDemande: '',
  creditsEnCours: [],
  nouveauxCredits: [{
      id: '1', nature: 'EXP-Cautions douanières: Obligation cautio', montantDemande: 100, montantPropose: 100, dureeMois: 0, dateFin: '',
      echeanceFrequence: '0', echeancePeriode: 'mensuelle', tauxGrille: '', tauxAccorde: '0', commentaires: '', col1: 0, col2: 0
  }],
  decisionNouveauxCredits: [
    {id: '1', natureProposee: 'EXP-Cautions douanières : Obl', decision: '', natureAccordee: '', montant: 100, commentaires: ''},
    ...Array(5).fill({id: '', natureProposee: '', decision: '', natureAccordee: '', montant: 0, commentaires: ''}).map((_, i) => ({..._, id: (i+2).toString()}))
  ],
  notationInterneDate: '',
  notationInterneAffaire: '',
  notationInterneGroupe: '',
  notationInterneRetenue: '',
  rentabiliteDate: '',
  rentabilitePnb: '',
  rentabiliteCommentaire: '',
  cipIncidentsRegularisesMontant: '',
  cipIncidentsRegularisesNombre: '',
  cipIncidentsNonRegularisesMontant: '',
  cipIncidentsNonRegularisesNombre: '',
  creditBureauDateConsultation: '',
  creditBureauAutresEtab: '',
  creditBureauEngagementsSains: '',
  creditBureauEngagementsDefaut: '',
  creditBureauImpayes: '',
  creditBureauContentieux: '',
  creditBureauCommentaire: '',
  indicateursDateN: '2014-12-31',
  indicateursDateN1: '2013-12-31',
  indicateursCAHTN: '0',
  indicateursCAHTN1: '0',
  indicateursResultatNetN: '0',
  indicateursResultatNetN1: '0',
  indicateursMvtConfieN1: '0',
  indicateursMvtConfie12Mois: '0',
  
  ratiosFpDettesN: '0',
  ratiosFpDettesN1: '0',
  ratiosActifNetN: '0',
  ratiosActifNetN1: '0',
  ratiosResultatNetCAN: '0',
  ratiosResultatNetCAN1: '0',

  cashFlowTotalCalculee: '0',
  cashFlowTotalRaisonnee: '0',
  cashFlowEcheancesCalculee: '0',
  cashFlowEcheancesRaisonnee: '0',
  cashFlowEngagementsCalculee: '0',
  cashFlowEngagementsRaisonnee: '0',

  creditMaximumDuree: 18,
  creditMaximumPlafond: 0,
  ratingCommercial: 0.0,
  progressiviteCredit1: 60,
  progressiviteCredit2: 75,
  progressiviteCredit3: 85,
  progressiviteCredit4: 100,
  progressivitePlafond1: 0,
  progressivitePlafond2: 0,
  progressivitePlafond3: 0,
  progressivitePlafond4: 0,


  // Entrepreneur data
  dateOuvertureDossier: '2015-02-25',
  entrepreneurs: [
    { ...initialEntrepreneur, nbPersACharge: 3 },
    { ...initialEntrepreneur }
  ],
  historiqueCredits: Array(4).fill({
    id: '', nomEntrepreneur: '', banque: '', dateOctroi: '', objetType: '', montant: 0, dureeMois: 0, mtEcheance: 0, encours: 0, impayes: 0, renseignements: ''
  }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
  autresAffaires: Array(2).fill({
    id: '', denomination: '', capital: 0, partEntrepreneur: 0, nomPrenom: '', activite: '', chiffreAffaires: 0, banque: ''
  }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
  surfacePatrimoniale: Array(7).fill({
    id: '', entrepreneur: '', part: 0, bien: 'Appartement', reference: '', consistance: '', valVenale: 0, capitalRestantDu: 0
  }).map((item, i) => ({ ...item, id: (i + 1).toString() })),
  syntheseEntrepreneur: '',
  
  // Entreprise data
  entreprise: initialEntrepriseData,

  // Activité et marché data
  activiteMarche: initialActiviteMarcheData,
  
  // Garanties data
  garanties: initialGarantiesData,

  // Compte de résultat data
  compteDeResultat: initialCompteDeResultatData,
  
  // Bilan data
  bilan: initialBilanData,
  bilanDateN: '2014-12-31',
  bilanDateN1: '2013-12-31',

  // Historique bancaire data
  historiqueBancaire: initialHistoriqueBancaireData,

  // Trésorerie data
  tresorerie: initialTresorerieData,
  
  // Ratios data
  ratios: initialRatiosData,

  // Echeancier data
  echeancier: initialEcheancierData,

  // Synthese data
  synthese: initialSyntheseData,

  // Calculs Optionnels data
  calculsOptionnels: initialCalculsOptionnelsData,

  // Analysis data
  analysis: initialAnalyseData,
  scoring: initialScoringData,
};


type Tab = 'garde' | 'synthese' | 'garanties' | 'entrepreneurs' | 'entreprise' | 'activite' | 'compteDeResultat' | 'bilan' | 'historique' | 'tresorerie' | 'ratios' | 'echeancier' | 'calculs';
const TABS_ORDER: Tab[] = ['garde', 'synthese', 'garanties', 'entrepreneurs', 'entreprise', 'activite', 'compteDeResultat', 'bilan', 'historique', 'tresorerie', 'ratios', 'echeancier', 'calculs'];
type Role = 'COLLECTEUR' | 'ANALYSTE' | 'DIRECTEUR' | 'COMITE';

const STORAGE_KEY = 'creditFlowAppState';

const CreditApplication: React.FC = () => {
    const getInitialState = () => {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                if (Array.isArray(parsed.dossiers)) {
                    return {
                        dossiers: parsed.dossiers,
                        activeDossierId: parsed.activeDossierId || null,
                        activeRole: parsed.activeRole || 'COLLECTEUR',
                        showLanding: false,
                    };
                }
            }
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
        }
        return {
            dossiers: [],
            activeDossierId: null,
            activeRole: 'COLLECTEUR',
            showLanding: true,
        };
    };

    const initialState = getInitialState();
    const [showLanding, setShowLanding] = useState(initialState.showLanding);
    const [activeTab, setActiveTab] = useState<Tab>('garde');
    const [dossiers, setDossiers] = useState<CreditApplicationData[]>(initialState.dossiers);
    const [activeDossierId, setActiveDossierId] = useState<string | null>(initialState.activeDossierId);
    const [activeRole, setActiveRole] = useState<Role>(initialState.activeRole);

    useEffect(() => {
        try {
            const stateToSave = {
                dossiers,
                activeDossierId,
                activeRole,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [dossiers, activeDossierId, activeRole]);

  const currentUser = useMemo(() => {
    const names: Record<Role, string> = {
        COLLECTEUR: "Agent de Collecte",
        ANALYSTE: "Analyste de Crédit",
        DIRECTEUR: "Directeur des Risques",
        COMITE: "Membre du Comité",
    };
    return names[activeRole];
  }, [activeRole]);

  const activeDossier = useMemo(() => {
    return dossiers.find(d => d.id === activeDossierId) ?? null;
  }, [dossiers, activeDossierId]);

  const setDossierData = (data: CreditApplicationData | ((prev: CreditApplicationData) => CreditApplicationData)) => {
    if (!activeDossierId) return;
    setDossiers(prevDossiers => prevDossiers.map(d => {
        if (d.id === activeDossierId) {
            return typeof data === 'function' ? data(d) : data;
        }
        return d;
    }));
  };
  
  const updateDossierStatus = (dossierId: string, newStatus: DossierStatus, action: string) => {
    setDossiers(prev => prev.map(d => {
        if (d.id === dossierId) {
            return {
                ...d,
                status: newStatus,
                history: [...d.history, { date: new Date().toISOString(), user: currentUser, action }],
            };
        }
        return d;
    }));
  };

  const handleNewDossier = () => {
    const generateDossierNumber = () => {
      const part1 = Math.floor(100 + Math.random() * 900);
      const part2 = Math.floor(100 + Math.random() * 900);
      const part3 = Math.floor(100 + Math.random() * 900);
      return `${part1}-${part2}-${part3}`;
    };
    const newId = generateDossierNumber();
    const newDossier: CreditApplicationData = {
      ...initialData,
      id: newId,
      dossier: newId,
      status: 'NOUVEAU',
      history: [{ date: new Date().toISOString(), user: currentUser, action: 'Création du dossier' }],
    };
    setDossiers((prev) => [...prev, newDossier]);
    setActiveDossierId(newId);
    setActiveTab('garde');
  };
  
  const handleSubmitForAnalysis = () => {
    if (!activeDossierId) return;
    updateDossierStatus(activeDossierId, 'EN_ANALYSE', 'Soumission à l\'analyste');
    setActiveDossierId(null);
    alert("Dossier soumis à l'analyse avec succès!");
  };
  
  const handleNext = useCallback(() => {
    const currentIndex = TABS_ORDER.indexOf(activeTab);
    if (currentIndex < TABS_ORDER.length - 1) { 
      setActiveTab(TABS_ORDER[currentIndex + 1]);
    }
  }, [activeTab]);


  const CollectorView = () => {
    const collectorDossiers = dossiers.filter(d => d.status === 'NOUVEAU' || d.status === 'RETOUR_COLLECTE');
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Tableau de Bord - Collecteur</h2>
            <button onClick={handleNewDossier} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 mb-4">
                + Nouveau Dossier
            </button>
            <div className="bg-white shadow rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {collectorDossiers.map(d => (
                        <li key={d.id} onClick={() => setActiveDossierId(d.id)} className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                            <div>
                               <p className="font-semibold text-blue-600">{d.affaire}</p>
                               <p className="text-sm text-gray-500">{d.id}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${d.status === 'RETOUR_COLLECTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                {d.status === 'RETOUR_COLLECTE' ? 'Retourné pour modification' : 'En cours'}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
  };
  
  const renderCollectorForm = () => {
    if (!activeDossier) return null;
    
    return (
        <>
        <nav className="flex border-b border-gray-300 hide-on-print overflow-x-auto">
          {TABS_ORDER.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ease-in-out ${activeTab === tab ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </button>
          ))}
        </nav>
        <main className="mt-1 bg-white shadow-lg rounded-b-lg">
          {activeTab === 'garde' && <CreditApplicationPage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'synthese' && <SynthesePage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'garanties' && <GarantiesPage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'entrepreneurs' && <EntrepreneursPage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'entreprise' && <EntreprisePage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'activite' && <ActiviteMarchePage formData={activeDossier} setFormData={setDossierData} onNext={() => setActiveTab('compteDeResultat')} />}
          {activeTab === 'compteDeResultat' && <CompteDeResultatPage formData={activeDossier} setFormData={setDossierData} onNext={() => setActiveTab('bilan')} />}
          {activeTab === 'bilan' && <BilanPage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'historique' && <HistoriquePage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'tresorerie' && <TresoreriePage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'ratios' && <RatiosPage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'echeancier' && <EcheancierPage formData={activeDossier} setFormData={setDossierData} onNext={handleNext} />}
          {activeTab === 'calculs' && <CalculsOptionnelsPage formData={activeDossier} setFormData={setDossierData} onSubmit={handleSubmitForAnalysis} />}
        </main>
        </>
    );
  };
  
  const renderAnalystView = () => {
    const analystDossiers = dossiers.filter(d => d.status === 'EN_ANALYSE' || d.status === 'RETOUR_ANALYSE');
    if (activeDossier && (activeDossier.status === 'EN_ANALYSE' || activeDossier.status === 'RETOUR_ANALYSE')) {
        return <AnalystView dossier={activeDossier} setDossierData={setDossierData} updateDossierStatus={updateDossierStatus} onBack={() => setActiveDossierId(null)} />;
    }
    return <AnalystDashboard dossiers={analystDossiers} onSelectDossier={(id) => setActiveDossierId(id)} />;
  };

  if (showLanding) {
    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900">Application de Scoring de Risque</h2>
                <p className="text-lg text-gray-600">Suite Intégrée d'analyse et de scoring de risque crédit</p>
            </div>
            <main className="flex-grow flex flex-col items-center justify-center text-center -mt-16">
                <h1 className="text-8xl font-bold text-gray-900 mb-4">CréditFlow</h1>
                <p className="text-2xl text-gray-700">Conçu pour la Microfinance, au cœur de vos décisions de crédit...</p>
                <button 
                    onClick={() => setShowLanding(false)} 
                    className="mt-12 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 duration-300 ease-in-out text-xl"
                >
                    Commencer
                </button>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 lg:p-8 print-container">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-4 hide-on-print flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CréditFlow</h1>
              <p className="text-md text-gray-600 mt-1">Application de Scoring de Risque</p>
            </div>
            <div className="flex items-center space-x-4">
                <span className="font-semibold">Vue:</span>
                <select value={activeRole} onChange={e => { setActiveRole(e.target.value as Role); setActiveDossierId(null);}} className="p-2 rounded-md border border-gray-300 bg-white text-black">
                    <option value="COLLECTEUR">Collecteur</option>
                    <option value="ANALYSTE">Analyste</option>
                    <option value="DIRECTEUR" disabled>Directeur</option>
                    <option value="COMITE" disabled>Comité</option>
                </select>
            </div>
        </header>
        
        {activeRole === 'COLLECTEUR' && (activeDossierId ? renderCollectorForm() : <CollectorView />)}
        {activeRole === 'ANALYSTE' && renderAnalystView()}

      </div>
    </div>
  );
};

export default CreditApplication;
